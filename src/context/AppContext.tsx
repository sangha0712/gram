import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, CURRENT_USER_ID } from '../data';

interface AppContextType {
  users: User[];
  posts: Post[];
  currentUser: User;
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes'>) => void;
  toggleLike: (postId: string) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  addComment: (postId: string, text: string, parentId?: string) => void;
  toggleFollow: (userId: string) => void;
  getUser: (userId: string) => User | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('insta_users_v16');
    const storedPosts = localStorage.getItem('insta_posts_v16');
    
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
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('insta_users_v16', JSON.stringify(users));
      
      // Filter out Object URLs (videos) from being stored in localStorage to prevent errors
      // and keep size manageable for the prototype
      const storablePosts = posts.filter(p => !p.mediaUrl.startsWith('blob:'));
      
      try {
        localStorage.setItem('insta_posts_v16', JSON.stringify(storablePosts));
      } catch (e) {
        console.warn('Failed to save posts to localStorage (quota exceeded?).');
      }
    }
  }, [users, posts, isLoaded]);

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

  return (
    <AppContext.Provider value={{ users, posts, currentUser, addPost, toggleLike, toggleCommentLike, addComment, toggleFollow, getUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
