import React, { useState } from 'react';
import { X, Heart, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Post, Comment } from '../types';
import { useAppContext } from '../context/AppContext';
import { timeAgo } from '../utils';

export default function CommentsModal({ post, onClose, onUserClick }: { post: Post, onClose: () => void, onUserClick: (userId: string) => void }) {
  const { getUser, currentUser, toggleCommentLike, addComment } = useAppContext();
  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  const author = getUser(post.userId);
  if (!author) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText, replyingTo?.id);
    setCommentText('');
    setReplyingTo(null);
  };

  const sortedComments = [...(post.comments || [])].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.likes || []).length - (a.likes || []).length || b.timestamp - a.timestamp;
    }
    return b.timestamp - a.timestamp;
  });

  const totalCommentsCount = (post.comments || []).reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity">
        <X className="w-8 h-8" />
      </button>

      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="border-b px-4 py-3 flex items-center justify-between font-semibold text-[15px]">
          <div className="w-8"></div>
          <div>댓글</div>
          <button onClick={onClose} className="w-8 flex justify-end">
             <X className="w-6 h-6 text-gray-600 md:hidden" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Caption as a comment */}
          <div className="flex gap-3 mb-2">
             <img referrerPolicy="no-referrer" src={author.avatar} alt={author.username} className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => { onClose(); onUserClick(author.id); }} />
             <div className="flex-1">
               <div className="text-sm leading-relaxed">
                 <span className="font-semibold mr-2 cursor-pointer hover:text-gray-500" onClick={() => { onClose(); onUserClick(author.id); }}>{author.username}</span>
                 {post.caption}
               </div>
               <div className="text-[11px] text-gray-500 mt-1">{timeAgo(post.timestamp)} 전</div>
             </div>
          </div>

          <hr className="border-gray-100" />

          {/* Sort Control */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-800">댓글 {totalCommentsCount}개</span>
            <div className="relative group cursor-pointer flex items-center gap-1 text-gray-600 font-semibold hover:text-gray-900 pb-2 -mb-2 z-10">
              {sortBy === 'popular' ? '인기순' : '최신순'}
              <ChevronDown className="w-4 h-4" />
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block w-28">
                <div className="bg-white shadow-lg rounded-lg border border-gray-100 py-1 overflow-hidden">
                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-800" onClick={() => setSortBy('popular')}>인기순</div>
                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-800" onClick={() => setSortBy('newest')}>최신순</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4 mt-2 pb-4">
            {sortedComments.map(comment => {
              const renderComment = (c: Comment, isReply: boolean = false, parentId?: string) => {
                const cUser = getUser(c.userId);
                if (!cUser) return null;
                const isLiked = (c.likes || []).includes(currentUser.id);
  
                return (
                  <div key={c.id} className={`flex gap-3 group/comment ${isReply ? 'ml-11 mt-3' : ''}`}>
                    <img referrerPolicy="no-referrer" src={cUser.avatar} alt={cUser.username} className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => { onClose(); onUserClick(cUser.id); }} />
                    <div className="flex-1 text-sm leading-relaxed">
                      <span className="font-semibold mr-2 cursor-pointer hover:text-gray-500" onClick={() => { onClose(); onUserClick(cUser.id); }}>{cUser.username}</span>
                      {c.text}
                      <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-1 font-semibold">
                        <span>{timeAgo(c.timestamp)} 전</span>
                        {(c.likes || []).length > 0 && <span>좋아요 {(c.likes || []).length}개</span>}
                        <span className="cursor-pointer hover:text-gray-700" onClick={() => {
                          setReplyingTo({ id: parentId || c.id, username: cUser.username });
                          setCommentText(`@${cUser.username} `);
                        }}>답글 달기</span>
                        <MoreHorizontal className="w-4 h-4 opacity-0 group-hover/comment:opacity-100 cursor-pointer" />
                      </div>
                    </div>
                    <button onClick={() => toggleCommentLike(post.id, c.id)} className="pt-1 self-start hover:opacity-60 transition-opacity">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                );
              };

              return (
                <div key={comment.id} className="flex flex-col">
                  {renderComment(comment)}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="flex flex-col">
                      {comment.replies.map(reply => renderComment(reply, true, comment.id))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment Input */}
        <div className="border-t border-gray-200 flex flex-col">
          {replyingTo && (
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-xs text-gray-500 border-b border-gray-200">
              <span>{replyingTo.username}님에게 답글 남기는 중...</span>
              <button onClick={() => { setReplyingTo(null); setCommentText(commentText.replace(`@${replyingTo.username} `, '')); }} className="p-1 hover:text-gray-800"><X className="w-3 h-3" /></button>
            </div>
          )}
          <div className="p-4 flex gap-3 items-center">
            <img referrerPolicy="no-referrer" src={currentUser.avatar} alt={currentUser.username} className="w-8 h-8 rounded-full object-cover" />
            <form onSubmit={handleAddComment} className="flex-1 flex items-center relative">
              <input
                type="text"
                placeholder={`${currentUser.username}(으)로 댓글 달기...`}
                className="w-full text-sm outline-none bg-transparent"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              {commentText.trim() && (
                <button type="submit" className="text-blue-500 font-semibold text-sm hover:text-blue-700 ml-2 transition-colors">
                  게시
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
