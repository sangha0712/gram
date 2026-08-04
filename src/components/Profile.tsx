import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Grid, Bookmark, UserSquare, Heart, MessageCircle } from 'lucide-react';

export default function Profile({ userId }: { userId: string }) {
  const { getUser, currentUser, toggleFollow, posts } = useAppContext();
  const profileUser = getUser(userId);

  if (!profileUser) return <div className="text-center p-10 font-semibold">사용자를 찾을 수 없습니다</div>;

  const isMe = currentUser.id === profileUser.id;
  const isFollowing = currentUser.following.includes(profileUser.id);
  const userPosts = posts.filter(p => p.userId === profileUser.id).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-[935px] mx-auto pt-6 sm:pt-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-24 mb-10 border-b border-gray-200 pb-10">
        <div className="flex-shrink-0 sm:pl-10">
          <img referrerPolicy="no-referrer" src={profileUser.avatar} alt={profileUser.username} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border border-gray-200" />
        </div>
        <div className="flex-1 flex flex-col items-center sm:items-start">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-5">
            <h1 className="text-xl sm:text-2xl font-normal">{profileUser.username}</h1>
            <div className="flex gap-2">
              {isMe ? (
                <>
                  <button className="bg-gray-100 hover:bg-gray-200 text-black font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
                    프로필 편집
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-black font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
                    보관함 보기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => toggleFollow(profileUser.id)}
                  className={`font-semibold text-sm px-6 py-1.5 rounded-lg transition-colors ${
                    isFollowing
                      ? 'bg-gray-100 hover:bg-gray-200 text-black'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-8 mb-5">
            <div>게시물 <span className="font-semibold">{userPosts.length}</span></div>
            <div className="cursor-pointer">팔로워 <span className="font-semibold">{profileUser.followers.length}</span></div>
            <div className="cursor-pointer">팔로우 <span className="font-semibold">{profileUser.following.length}</span></div>
          </div>

          <div className="text-center sm:text-left">
            <div className="font-semibold text-sm mb-1">{profileUser.fullName}</div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">{profileUser.bio}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-12 text-[13px] font-semibold text-gray-500 tracking-widest border-t -mt-10 mb-4">
        <button className="flex items-center gap-2 border-t border-black text-black pt-4">
          <Grid className="w-4 h-4" /> 게시물
        </button>
        {isMe && (
          <button className="flex items-center gap-2 pt-4 hover:text-black transition-colors">
            <Bookmark className="w-4 h-4" /> 저장됨
          </button>
        )}
        <button className="flex items-center gap-2 pt-4 hover:text-black transition-colors">
          <UserSquare className="w-4 h-4" /> 태그됨
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4 pb-20">
        {userPosts.map(post => (
          <div key={post.id} className="relative aspect-square bg-gray-100 cursor-pointer group overflow-hidden">
            {post.type === 'video' ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" />
            ) : (
              <img referrerPolicy="no-referrer" src={post.mediaUrl} alt="Post" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                <span>{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>0</span>
              </div>
            </div>
          </div>
        ))}
        {userPosts.length === 0 && (
          <div className="col-span-3 text-center py-20 text-gray-500">
            <div className="border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Grid className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">게시물 없음</h2>
          </div>
        )}
      </div>
    </div>
  );
}
