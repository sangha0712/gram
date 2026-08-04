import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import PostCard from './PostCard';
import { Post } from '../types';
import { AlertTriangle } from 'lucide-react';

export default function Feed({ onUserClick }: { onUserClick: (userId: string) => void }) {
  const { posts, currentUser, users, toggleFollow, triggerDisasterDMs } = useAppContext();
  const [randomPosts, setRandomPosts] = useState<Post[]>([]);
  const observerTarget = useRef(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'error'>('idle');
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showAlarm, setShowAlarm] = useState(false);
  const [errorTriggeredAt, setErrorTriggeredAt] = useState<number | null>(null);
  const alarmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (loadingState === 'error' && !errorTriggeredAt) {
      setErrorTriggeredAt(Date.now());
    }
  }, [loadingState, errorTriggeredAt]);

  useEffect(() => {
    if (errorTriggeredAt) {
      alarmTimerRef.current = setTimeout(() => {
        setShowAlarm(true);
        triggerDisasterDMs();
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const audioCtx = audioCtxRef.current;
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }

          const playKoreanAlert = () => {
            if (audioCtx.state === 'closed') return;
            const time = audioCtx.currentTime;
            const duration = 2.0;
            
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc1.type = 'square';
            osc2.type = 'square';
            
            // Standard cell broadcast frequencies for emergency alert
            osc1.frequency.setValueAtTime(853, time);
            osc2.frequency.setValueAtTime(960, time);
            
            // Set volume and cut off abruptly
            gainNode.gain.setValueAtTime(0.015, time);
            gainNode.gain.setValueAtTime(0.015, time + duration - 0.01);
            gainNode.gain.setValueAtTime(0, time + duration);
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc1.start(time);
            osc2.start(time);
            osc1.stop(time + duration);
            osc2.stop(time + duration);
          };
          
          playKoreanAlert();
          audioIntervalRef.current = setInterval(playKoreanAlert, 2500);
        } catch (e) {
          console.error(e);
        }
      }, 7000);
    }
    return () => {
      if (alarmTimerRef.current) clearTimeout(alarmTimerRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [errorTriggeredAt]);

  // Show posts from following and own posts
  const feedPosts = posts.filter(
    post => currentUser.following.includes(post.userId) || post.userId === currentUser.id
  ).sort((a, b) => b.timestamp - a.timestamp);

  const allPosts = [...feedPosts, ...randomPosts];

  const sinEHPostIndex = allPosts.findIndex(p => p.userId === 'user_sin_e_h' || p.id === 'post_sin_e_h');
  const visiblePosts = sinEHPostIndex !== -1 ? allPosts.slice(0, sinEHPostIndex + 1) : allPosts;
  const showConnectionError = sinEHPostIndex !== -1;

  const generateRandomPost = useCallback(() => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomImageId = Math.floor(Math.random() * 1000);
    
    const postTypes = [
      {
        caption: 'ㅋㅋㅋ 아 이거 완전 내 친구 이야기 아니냐구 😂 @태그해서 보여주자!',
        overlayText: '학교에 무조건 있는\n친구 유형 BEST 5',
        overlaySubText: '너는 몇 번이야?',
        tags: ['#공감', '#유머', '#학교생활']
      },
      {
        caption: '이거 보면 무조건 저장! ✨ 키 170대 남자 코디법 총정리 👖👕',
        overlayText: '키 170대 남자는\n제발 이렇게 입어줘',
        overlaySubText: '비율 좋아보이는 코디 모음.zip',
        tags: ['#패션', '#코디', '#남자코디']
      },
      {
        caption: '안정형 남친이랑 연애하면 좋은 점 💖 진짜 힐링 그 자체임 ㅠㅠ',
        overlayText: '불안형 여친과\n안정형 남친의 실체',
        overlaySubText: '이런 연애 하고 싶다',
        tags: ['#연애', '#럽스타그램']
      },
      {
        caption: '아닠ㅋㅋ 군대에서 생긴 레전드 썰 푼다 💣 배꼽 빠짐 주의 ㅋㅋㅋ',
        overlayText: '뜻밖의 팀킬\n레전드 썰 ㅋㅋㅋ',
        overlaySubText: '야 너가 쐈냐?',
        tags: ['#군대', '#유머', '#썰']
      },
      {
        caption: '연하남 만나는 언니한테 보냈다가 차단당할 뻔 ㅋㅋㅋㅋ ㅠㅠ 미안해 언니..',
        overlayText: '연하랑 사귀는 언니한테\n이거 보냈다가 손절당할뻔함.',
        overlaySubText: 'ㅋㅋㅋㅋㅋㅋ',
        tags: ['#유머', '#밈', '#일상']
      },
      {
        caption: '이번 주말에 데이트 어디 갈지 고민이라면 무조건 여기! 분위기 미쳤음 🍷',
        overlayText: '나만 알고 싶은\n숨겨진 감성 카페 BEST 3',
        overlaySubText: '저장해두고 이번 주말 고고',
        tags: ['#데이트코스', '#카페추천', '#감성카페']
      },
      {
        caption: '요즘 핫하다는 그 성격 테스트 ㅋㅋㅋㅋ 난 ENFP 나왔는데 완전 소름',
        overlayText: 'MBTI별\n플러팅 하는 방법',
        overlaySubText: '다들 공감하시나요?',
        tags: ['#MBTI', '#테스트', '#공감']
      },
      {
        caption: '다이어트 1일차... 오늘부터 진짜 열심히 한다 아자아자 화이팅! 💪',
        overlayText: '다이어트 자극 짤\n보기만 해도 살 빠짐',
        overlaySubText: '오늘부터 1일',
        tags: ['#다이어트', '#운동', '#오운완']
      }
    ];

    const selectedPostType = postTypes[Math.floor(Math.random() * postTypes.length)];
    
    const commentTexts = [
      'ㅋㅋㅋ 아 진짜 너무 웃겨',
      '완전 공감 💯',
      '저장해두고 나중에 봐야지',
      '오 꿀팁 감사합니다',
      '내 남친도 저런데 ㅠㅠ',
      '이거 완전 @너잖아 ㅋㅋㅋ',
      '대박이네 진짜',
      '이번 주말에 당장 가봐야겠다',
      '오늘부터 다이어트 진짜 시작...',
      '패션 센스 부럽네요',
    ];

    const newPost: Post = {
      id: `random_post_${Date.now()}_${Math.random()}`,
      userId: randomUser.id,
      type: 'image',
      mediaUrl: `https://picsum.photos/seed/${randomImageId}/800/800`,
      caption: selectedPostType.caption,
      overlayText: selectedPostType.overlayText,
      overlaySubText: selectedPostType.overlaySubText,
      overlayTags: selectedPostType.tags,
      likes: Array.from({length: Math.floor(Math.random() * 500)}).map((_, i) => `user_${i+1}`),
      timestamp: Date.now() - Math.floor(Math.random() * 10000000),
      comments: Array.from({length: Math.floor(Math.random() * 3) + 1}).map(() => {
        const commentUser = users[Math.floor(Math.random() * users.length)];
        return {
          id: `c_${Date.now()}_${Math.random()}`,
          userId: commentUser ? commentUser.id : 'user_1',
          text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          timestamp: Date.now() - Math.floor(Math.random() * 1000000),
          likes: []
        };
      })
    };
    return newPost;
  }, [users]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (showConnectionError) {
            setLoadingState('loading');
            if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = setTimeout(() => {
              setLoadingState('error');
            }, 1500);
          } else {
            // Append 3 random posts
            setRandomPosts(prev => [...prev, generateRandomPost(), generateRandomPost(), generateRandomPost()]);
          }
        } else {
          if (showConnectionError) {
            if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
            setLoadingState('idle');
          }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [generateRandomPost, showConnectionError]);

  // Suggestions (users not followed)
  const suggestions = users.filter(u => u.id !== currentUser.id && !currentUser.following.includes(u.id)).slice(0, 5);

  return (
    <div className="flex justify-center max-w-5xl mx-auto pt-4 sm:pt-8 px-0 sm:px-4 gap-12">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-[470px]">
        {visiblePosts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-black mb-2">Gram에 오신 것을 환영합니다!</h3>
            <p className="mb-6">사람들을 팔로우하여 사진과 동영상을 확인해보세요.</p>
          </div>
        ) : (
          visiblePosts.map(post => <PostCard key={post.id} post={post} onUserClick={onUserClick} />)
        )}
        
        {showConnectionError ? (
          <div ref={observerTarget} className="h-40 w-full flex flex-col items-center justify-center my-4 text-gray-500">
             {loadingState === 'loading' ? (
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
             ) : loadingState === 'error' ? (
                 <>
                   <div className="text-4xl mb-4">⚠️</div>
                   <div className="font-semibold text-black mb-1">인터넷 연결 오류</div>
                   <div className="text-sm">피드를 새로고침할 수 없습니다.</div>
                 </>
             ) : null}
          </div>
        ) : (
          <div ref={observerTarget} className="h-10 w-full flex items-center justify-center my-4">
             {visiblePosts.length > 0 && <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>}
          </div>
        )}
      </div>

      {/* Sidebar Suggestions Column */}
      <div className="hidden lg:block w-[320px] pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onUserClick(currentUser.id)}>
            <img referrerPolicy="no-referrer" src={currentUser.avatar} alt={currentUser.username} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
            <div>
              <div className="font-semibold text-sm group-hover:text-gray-600 transition-colors">{currentUser.username}</div>
              <div className="text-gray-500 text-sm">{currentUser.fullName}</div>
            </div>
          </div>
          <button className="text-blue-500 text-xs font-semibold hover:text-blue-700">전환</button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 font-semibold text-sm">회원님을 위한 추천</span>
          <button className="text-xs font-semibold text-black hover:text-gray-500">모두 보기</button>
        </div>

        <div className="flex flex-col gap-4">
          {suggestions.map(user => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onUserClick(user.id)}>
                <img referrerPolicy="no-referrer" src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <div className="font-semibold text-sm group-hover:text-gray-600 transition-colors">{user.username}</div>
                  <div className="text-gray-500 text-xs">회원님을 위한 추천</div>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className="text-blue-500 text-xs font-semibold hover:text-blue-700"
              >
                팔로우
              </button>
            </div>
          ))}
          {suggestions.length === 0 && (
            <div className="text-sm text-gray-400">현재 추천이 없습니다.</div>
          )}
        </div>
        
        <div className="mt-8 text-xs text-gray-400 leading-relaxed">
          <p>© 2026 GRAM FROM AI STUDIO</p>
          <p className="mt-2 text-[10px]">참고: 데이터는 브라우저에 로컬로 저장됩니다.</p>
        </div>
      </div>

      {showAlarm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#f0f0f0] w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4 text-white">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-black">위급재난문자</h2>
              <p className="text-sm text-gray-800 font-medium whitespace-pre-line text-left w-full border-t border-gray-300 pt-3">
                [위급재난문자]{'\n'}
                서울 전역에 에이저 출몰. 절대 눈을 마주치지 말고 시선을 피하십시오. 섣불리 이동하지 않으며, 현재 위치에서 문과 창문을 잠근 뒤 구조대의 추가 안내를 기다리십시오.
              </p>
            </div>
            <button 
              className="w-full py-4 border-t border-gray-300 text-blue-600 font-bold text-lg active:bg-gray-200"
              onClick={() => {
                setShowAlarm(false);
                if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
                if (audioCtxRef.current) audioCtxRef.current.suspend();
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
