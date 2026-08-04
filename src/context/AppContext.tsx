import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Chat, Message, Comment } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_CHATS, CURRENT_USER_ID } from '../data';

interface AppContextType {
  users: User[];
  posts: Post[];
  currentUser: User;
  chats: Chat[];
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes'>) => void;
  toggleLike: (postId: string) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  addComment: (postId: string, text: string, parentId?: string) => void;
  toggleFollow: (userId: string) => void;
  getUser: (userId: string) => User | undefined;
  sendMessage: (userId: string, text: string) => void;
  markChatAsRead: (userId: string) => void;
  triggerDisasterDMs: () => void;
  updateCurrentUser: (username: string, fullName: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('insta_users_v17');
    const storedPosts = localStorage.getItem('insta_posts_v17');
    const storedChats = localStorage.getItem('insta_chats_v5');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(INITIAL_USERS);
    }
    
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(INITIAL_POSTS);
    }

    if (storedChats) {
      setChats(JSON.parse(storedChats));
    } else {
      setChats(INITIAL_CHATS);
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('insta_users_v17', JSON.stringify(users));
      localStorage.setItem('insta_chats_v5', JSON.stringify(chats));
      
      // Filter out Object URLs (videos) from being stored in localStorage to prevent errors
      // and keep size manageable for the prototype
      const storablePosts = posts.filter(p => !p.mediaUrl.startsWith('blob:'));
      
      try {
        localStorage.setItem('insta_posts_v17', JSON.stringify(storablePosts));
      } catch (e) {
        console.warn('Failed to save posts to localStorage (quota exceeded?).');
      }
    }
  }, [users, posts, chats, isLoaded]);

  if (!isLoaded) return null;

  const currentUser = users.find(u => u.id === CURRENT_USER_ID)!;

  const addPost = (postData: Omit<Post, 'id' | 'timestamp' | 'likes'>) => {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      timestamp: Date.now(),
      likes: [],
    };
    setPosts([newPost, ...posts]);
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const isLiked = p.likes.includes(currentUser.id);
      return {
        ...p,
        likes: isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id]
      };
    }));
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      
      const toggleLikeInComments = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            const commentLikes = c.likes || [];
            const isLiked = commentLikes.includes(currentUser.id);
            return {
              ...c,
              likes: isLiked ? commentLikes.filter(id => id !== currentUser.id) : [...commentLikes, currentUser.id]
            };
          }
          if (c.replies) {
            return { ...c, replies: toggleLikeInComments(c.replies) };
          }
          return c;
        });
      };
      
      return { ...p, comments: toggleLikeInComments(p.comments || []) };
    }));
  };

  const addComment = (postId: string, text: string, parentId?: string) => {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const newComment = {
        id: `comment_${Date.now()}`,
        userId: currentUser.id,
        text,
        timestamp: Date.now(),
        likes: [],
      };
      
      if (parentId) {
        const addReplyToComments = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            if (c.replies) {
              return { ...c, replies: addReplyToComments(c.replies) };
            }
            return c;
          });
        };
        return { ...p, comments: addReplyToComments(p.comments || []) };
      }

      return {
        ...p,
        comments: [...(p.comments || []), newComment]
      };
    }));
  };

  const toggleFollow = (targetUserId: string) => {
    setUsers(users.map(u => {
      if (u.id === currentUser.id) {
        const isFollowing = u.following.includes(targetUserId);
        return {
          ...u,
          following: isFollowing ? u.following.filter(id => id !== targetUserId) : [...u.following, targetUserId]
        };
      }
      if (u.id === targetUserId) {
        const isFollowedByMe = u.followers.includes(currentUser.id);
        return {
          ...u,
          followers: isFollowedByMe ? u.followers.filter(id => id !== currentUser.id) : [...u.followers, currentUser.id]
        };
      }
      return u;
    }));
  };

  const getUser = (userId: string) => users.find(u => u.id === userId);

  const sendMessage = (userId: string, text: string) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(c => c.userId === userId);
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        text,
        timestamp: Date.now(),
        read: false
      };
      
      if (chatIndex !== -1) {
        const newChats = [...prevChats];
        newChats[chatIndex] = {
          ...newChats[chatIndex],
          messages: [...newChats[chatIndex].messages, newMessage],
        };
        return newChats;
      } else {
        return [...prevChats, {
          userId,
          messages: [newMessage],
          unreadCount: 0
        }];
      }
    });

    // Simulate reading it after 1 second
    setTimeout(() => {
      setChats(currentChats => {
        const cIdx = currentChats.findIndex(c => c.userId === userId);
        if (cIdx !== -1) {
          const updatedChats = [...currentChats];
          const msgs = [...updatedChats[cIdx].messages];
          if (msgs.length > 0 && msgs[msgs.length - 1].senderId === currentUser.id) {
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], read: true };
          }
          updatedChats[cIdx] = { ...updatedChats[cIdx], messages: msgs };
          return updatedChats;
        }
        return currentChats;
      });
    }, 1000);
  };

  const markChatAsRead = (userId: string) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(c => c.userId === userId);
      if (chatIndex === -1) return prevChats;
      if (prevChats[chatIndex].unreadCount === 0) return prevChats;
      
      const newChats = [...prevChats];
      newChats[chatIndex] = {
        ...newChats[chatIndex],
        unreadCount: 0
      };
      return newChats;
    });
  };

  const triggerDisasterDMs = () => {
    // Staggered incoming DMs from existing contacts when disaster alert sounds
    // Phase 1: Normal safety checks -> Phase 2: Corrupted/attacked messages
    const disasterMessages = [
      // Phase 1: Initial panic and safety checks
      { userId: 'user_4', delay: 2500, text: '야 지금 어디임?? 밖이면 빨리 들어와 문 잠그고!!' },
      { userId: 'user_3', delay: 4000, text: '미친 에이저 출몰이 뭐냐... 너 집 문이랑 창문 다 잠갔어??' },
      { userId: 'user_joo', delay: 5500, text: '야 너 무사함?? 연락 좀 줘라 안부 확인되면 ㅠㅠ' },
      { userId: 'user_6', delay: 7000, text: '창문 밖에서 무슨 이상한 소리 나는데... 헐 잠시만' },

      // Phase 2: Attacked / corrupted messages (glitch & scream)
      { userId: 'user_4', delay: 9500, text: '야 문 두드ㄹㅕㄴㄷㅏ ㅂㅈㄷㅁㄴㅇㄻㄴㅇ#$%' },
      { userId: 'user_6', delay: 11500, text: 'ㄴㅜㄴ을ㅁㅏㅈㅊㅜㅈㅣㅁㅏ@#$%^&*ㅇㅗㅁㄴㅜ#' }
    ];

    disasterMessages.forEach(({ userId, delay, text }, index) => {
      setTimeout(() => {
        setChats(prevChats => {
          const chatIndex = prevChats.findIndex(c => c.userId === userId);
          const newMessage: Message = {
            id: `disaster_msg_${Date.now()}_${index}`,
            senderId: userId,
            text: text,
            timestamp: Date.now(),
            read: false
          };

          if (chatIndex !== -1) {
            const updated = [...prevChats];
            updated[chatIndex] = {
              ...updated[chatIndex],
              messages: [...updated[chatIndex].messages, newMessage],
              unreadCount: updated[chatIndex].unreadCount + 1
            };
            return updated;
          } else {
            return [
              ...prevChats,
              {
                userId: userId,
                messages: [newMessage],
                unreadCount: 1
              }
            ];
          }
        });
      }, delay);
    });
  };

  const updateCurrentUser = (username: string, fullName: string) => {
    setUsers(prevUsers => prevUsers.map(u => 
      u.id === CURRENT_USER_ID ? { ...u, username, fullName } : u
    ));
  };

  return (
    <AppContext.Provider value={{ users, posts, currentUser, chats, addPost, toggleLike, toggleCommentLike, addComment, toggleFollow, getUser, sendMessage, markChatAsRead, triggerDisasterDMs, updateCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
