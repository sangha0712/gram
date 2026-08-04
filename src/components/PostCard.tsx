import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Post } from '../types';
import { useAppContext } from '../context/AppContext';
import { timeAgo } from '../utils';
import CommentsModal from './CommentsModal';

const OptionsModal = ({ onClose, onAction }: { onClose: () => void, onAction: (action: string) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#262626] w-full max-w-sm rounded-xl overflow-hidden text-sm flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
        <button className="w-full py-3.5 border-b border-white/10 text-red-500 font-bold hover:bg-white/5 active:bg-white/10" onClick={() => onAction('report')}>신고</button>
        <button className="w-full py-3.5 border-b border-white/10 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('not_interested')}>관심 없음</button>
        <button className="w-full py-3.5 border-b border-white/10 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('go_to_post')}>게시물로 이동</button>
        <button className="w-full py-3.5 border-b border-white/10 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('share')}>공유 대상...</button>
        <button className="w-full py-3.5 border-b border-white/10 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('copy_link')}>링크 복사</button>
        <button className="w-full py-3.5 border-b border-white/10 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('embed')}>퍼가기</button>
        <button className="w-full py-3.5 border-b border-white/10 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('about_account')}>이 계정 정보</button>
        <button className="w-full py-3.5 text-white hover:bg-white/5 active:bg-white/10" onClick={() => onAction('cancel')}>취소</button>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post, onUserClick: (userId: string) => void }> = ({ post, onUserClick }) => {
  const { getUser, currentUser, toggleLike } = useAppContext();
  const author = getUser(post.userId);
  const isLiked = post.likes.includes(currentUser.id);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!author || isHidden) return null;

  const handleDoubleTap = () => {
    if (!isLiked) toggleLike(post.id);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1000);
  };

  const medias = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls : [post.mediaUrl];
  const hasMultipleMedia = medias.length > 1;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      setCurrentMediaIndex(Math.round(scrollPosition / width));
    }
  };

  const scrollToMedia = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  const handleOptionAction = async (action: string) => {
    setShowOptions(false);
    switch (action) {
      case 'report':
        alert('신고가 접수되었습니다.');
        break;
      case 'not_interested':
        setIsHidden(true);
        break;
      case 'go_to_post':
        alert('게시물로 이동합니다.');
        break;
      case 'share':
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Gram Post',
              text: post.caption,
              url: window.location.href,
            });
          } catch (err) {
            console.error('Share failed', err);
          }
        } else {
          alert('공유 기능을 지원하지 않는 브라우저입니다.');
        }
        break;
      case 'copy_link':
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('링크가 클립보드에 복사되었습니다.');
        } catch (err) {
          alert('링크 복사에 실패했습니다.');
        }
        break;
      case 'embed':
        alert('퍼가기 코드가 복사되었습니다.');
        break;
      case 'about_account':
        onUserClick(author.id);
        break;
      case 'cancel':
        break;
    }
  };

  const totalCommentsCount = (post.comments || []).reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="bg-white border-b sm:border border-gray-200 sm:rounded-lg mb-6 max-w-[470px] w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onUserClick(author.id)}
        >
          <img referrerPolicy="no-referrer" src={author.avatar} alt={author.username} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
          <span className="font-semibold text-sm group-hover:text-gray-500 transition-colors">{author.username}</span>
        </div>
        <button className="text-gray-500 hover:text-black" onClick={() => setShowOptions(true)}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      <div className="relative bg-gray-50 flex items-center justify-center overflow-hidden border-y border-gray-100 group" onDoubleClick={handleDoubleTap}>
        <div 
          ref={scrollRef}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {medias.map((url, i) => (
            <div key={i} className="flex-none w-full snap-center flex items-center justify-center relative">
              {post.type === 'video' ? (
                <video src={url} controls className="w-full max-h-[580px] object-contain" loop />
              ) : (
                <div className="relative w-full h-full flex justify-center items-center">
                  <img referrerPolicy="no-referrer" src={url} alt={`Post content ${i}`} className="w-full max-h-[580px] object-cover pointer-events-none" />
                  {post.overlayText && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  )}
                  {post.overlayText && (
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 z-10 flex flex-col items-start w-full">
                      {post.overlayTags && post.overlayTags.length > 0 && (
                        <div className="flex flex-col gap-0.5 mb-2">
                          {post.overlayTags.map((tag, idx) => (
                            <span key={idx} className="text-white font-medium text-xs sm:text-sm drop-shadow-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-white font-black text-3xl sm:text-4xl text-left leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-pre-line w-full">
                        {post.overlayText}
                      </div>
                      {post.overlaySubText && (
                        <div className="w-full text-right mt-2">
                          <span className="text-white font-bold italic text-xs sm:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            {post.overlaySubText}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows for Carousel */}
        {hasMultipleMedia && currentMediaIndex > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); scrollToMedia(currentMediaIndex - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {hasMultipleMedia && currentMediaIndex < medias.length - 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); scrollToMedia(currentMediaIndex + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Heart Animation overlay */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Heart className="w-24 h-24 text-white fill-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)]" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 pb-4">
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-4">
            <button onClick={() => toggleLike(post.id)} className="hover:opacity-60 transition-opacity">
              <Heart className={`w-[26px] h-[26px] ${isLiked ? 'text-red-500 fill-red-500' : 'text-black'}`} />
            </button>
            <button onClick={() => setShowComments(true)} className="hover:opacity-60 transition-opacity">
              <MessageCircle className="w-[26px] h-[26px] text-black" />
            </button>
            <button className="hover:opacity-60 transition-opacity">
              <Send className="w-[26px] h-[26px] text-black" />
            </button>
          </div>
          
          {/* Carousel dots */}
          {hasMultipleMedia && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
              {medias.map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-full transition-colors ${i === currentMediaIndex ? 'w-1.5 h-1.5 bg-blue-500' : 'w-1.5 h-1.5 bg-gray-300'}`}
                />
              ))}
            </div>
          )}

          <button className="hover:opacity-60 transition-opacity">
            <Bookmark className="w-[26px] h-[26px] text-black" />
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-sm mb-1">
          좋아요 {post.likes.length}개
        </div>

        {/* Caption */}
        <div className="text-sm mb-2 leading-relaxed">
          <span
            className="font-semibold mr-2 cursor-pointer hover:text-gray-500 transition-colors"
            onClick={() => onUserClick(author.id)}
          >
            {author.username}
          </span>
          <span>{post.caption}</span>
        </div>

        {/* Comments */}
        {totalCommentsCount > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            <button 
              className="text-gray-500 text-sm text-left font-medium hover:text-gray-700 mb-1"
              onClick={() => setShowComments(true)}
            >
              댓글 {totalCommentsCount}개 모두 보기
            </button>
            {/* Show only first comment as preview */}
            {(post.comments || []).slice(0, 1).map(comment => {
              const commentUser = getUser(comment.userId);
              if (!commentUser) return null;
              return (
                <div key={comment.id} className="text-sm leading-relaxed truncate">
                  <span 
                    className="font-semibold mr-2 cursor-pointer hover:text-gray-500 transition-colors"
                    onClick={() => onUserClick(commentUser.id)}
                  >
                    {commentUser.username}
                  </span>
                  <span>{comment.text}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Time */}
        <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-2">
          {timeAgo(post.timestamp)} 전
        </div>
      </div>
      
      {showComments && (
        <CommentsModal 
          post={post} 
          onClose={() => setShowComments(false)} 
          onUserClick={(id) => {
            setShowComments(false);
            onUserClick(id);
          }} 
        />
      )}

      {showOptions && (
        <OptionsModal 
          onClose={() => setShowOptions(false)} 
          onAction={handleOptionAction} 
        />
      )}
    </div>
  );
};

export default PostCard;
