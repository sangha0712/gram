import { User, Post, Comment } from './types';

export const CURRENT_USER_ID = 'user_1';

const generateDummyData = () => {
  const u: User[] = [];
  const c: Comment[] = [];
  const styles = ['adventurer', 'bottts', 'fun-emoji', 'lorelei', 'micah', 'miniavs', 'notionists', 'open-peeps', 'personas', 'pixel-art'];
  const bgColors = ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9', 'c1f4c5', 'ffdfdf'];
  
  const firstNames = ['kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon', 'jang', 'lim', 'han', 'oh', 'seo', 'shin', 'kwon', 'hwang', 'ahn', 'song', 'jeon', 'hong', 'chaha', 'imharin', 'jiwon', 'minji', 'jihoon', 'seoyeon', 'minsu', 'subin', 'donghyun', 'yujin', 'jimin', 'taehyung', 'jungkook', 'suga', 'jin', 'rm', 'jhope', 'jisoo', 'jennie', 'rose', 'lisa', 'iu', 'suzy', 'yoona', 'taeyeon', 'hyuna', 'sunmi', 'chungha', 'hwasa'];
  const suffixes = ['0707', '_official', '_daily', '_01', '123', '99', 'xx', '._.', '_', '.com', 'log', 'gram', '11', '22', '00', '77', '999'];
  const koreanLastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
  const koreanFirstNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '주원', '지훈', '건우', '서연', '서윤', '지우', '서현', '하은', '하윤', '민서', '지유', '윤서', '채원'];

  for (let i = 7; i <= 306; i++) {
    const userId = `user_${i}`;
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const generatedUsername = `${randomFirstName}${randomSuffix}${Math.floor(Math.random() * 100)}`;
    
    const randomKoreanLastName = koreanLastNames[Math.floor(Math.random() * koreanLastNames.length)];
    const randomKoreanFirstName = koreanFirstNames[Math.floor(Math.random() * koreanFirstNames.length)];
    const generatedFullName = `${randomKoreanLastName}${randomKoreanFirstName}`;

    u.push({
      id: userId,
      username: generatedUsername,
      avatar: `https://picsum.photos/seed/${userId}/150/150`,
      fullName: generatedFullName,
      bio: '',
      followers: [],
      following: []
    });
    
    // Vary the comment text
    const subjects = ['아이스크림', '제복', '경찰', '사진', '날씨', '오늘', '근무', '하린님', '눈나', '언니', '순찰', '당충전', '미모', '제복핏'];
    const verbs = ['맛있겠네요', '잘어울리세요', '화이팅입니다', '멋지십니다', '고생하시네요', '대박이네요', '최고에요', '예뻐요', '귀여우세요', '힘내세요', '미쳤다', '폼미쳤다', '폼미쳤네', '사랑해요', '응원합니다'];
    const emojis = ['ㅎㅎ', 'ㅋㅋ', '👍', '❤️', '🔥', '👏', '😍', '😊', '!!', '~~', 'ㅋㅋㅋ', '대박', '🥰', '👮‍♀️'];
    
    const longPhrases = [
      '항상 국민을 위해 애써주셔서 감사합니다!',
      '더운 날씨에 순찰 도시느라 고생이 많으십니다 ㅠㅠ',
      '저도 나중에 커서 멋진 경찰이 되고 싶어요!',
      '아이스크림 어떤 맛 드시는지 궁금하네요 ㅋㅋ',
      '와 핏이 진짜 장난 아니시네요 모델인줄 알았습니다',
      '항상 몸 조심하시고 안전 근무 하세요!!',
      '우와 인스타 추천 떠서 들어왔는데 팬 될 것 같아요',
      '경찰관님 덕분에 저희 동네가 안전합니다 감사합니다',
      '진짜 너무 멋있어요 응원합니다',
      '오늘도 평화로운 하루 되시길 바랍니다 화이팅!',
      'ㅋㅋㅋㅋ 근무중에 아이스크림 커엽 ㅋㅋㅋㅋ',
      '경찰제복 이렇게 잘어울리는 사람 처음봄...',
      '헉 인스타 릴스 보고 넘어왔어요 너무 예쁘세요!!',
      '와 실물 한번 보고싶다 진짜 여신이실듯',
      '언니 혹시 피부관리 어떻게 하시나요? 꿀피부 ㅠㅠ',
      '당충전 빵빵하게 하시고 오늘 하루도 무사히!',
      '나쁜 사람들 다 때려잡아주세요!!',
      '와 저도 이 동네 사는데 길가다 마주치면 인사할게요!',
      '경찰분들이 이렇게 친근하게 다가와주니 참 좋네요'
    ];

    const generateText = () => {
      const rand = Math.random();
      if (rand < 0.4) {
        return longPhrases[Math.floor(Math.random() * longPhrases.length)];
      } else {
         const subject = subjects[Math.floor(Math.random() * subjects.length)];
         const verb = verbs[Math.floor(Math.random() * verbs.length)];
         const emoji = emojis[Math.floor(Math.random() * emojis.length)];
         return `${subject} ${verb} ${emoji}`;
      }
    };
    
    const text = generateText();
    
    const isCritical = Math.random() < 0.1;
    const criticalTexts = [
      '세금으로 꿀빠네',
      '근무중에 폰하고 아이스크림 먹고.. 나라 잘 돌아간다',
      '이러니까 치안이 안좋지',
      '경찰이 장난인가',
      '순찰이나 똑바로 도세요'
    ];

    let commentText = text;
    if (isCritical) {
      commentText = criticalTexts[Math.floor(Math.random() * criticalTexts.length)];
    }

    const replies: Comment[] = [];
    if (isCritical && Math.random() < 0.7) {
      // Add defending replies
      const numReplies = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numReplies; j++) {
        const replyUserId = `user_${Math.floor(Math.random() * 200) + 10}`;
        const defendTexts = [
          '님은 평생 일하면서 물도 마시지 마셈 ㅋㅋㅋ',
          '경찰은 사람 아님? 잠깐 쉴 수도 있지 억까 ㄴㄴ',
          '방구석에서 악플이나 다는 인생 레전드네',
          '꼭 이런 애들이 사고치면 제일 먼저 경찰 찾더라',
          '아니 휴식시간에 먹는걸수도 있는데 왜케 꼬임?',
          '오지랖도 넓다 진짜 ㅋㅋ',
          '세금 쥐꼬리만큼 내면서 생색은 ㅉㅉ'
        ];
        replies.push({
          id: `c${i}_r${j}`,
          userId: replyUserId,
          text: defendTexts[Math.floor(Math.random() * defendTexts.length)],
          timestamp: Date.now() - Math.floor(Math.random() * 500000),
          likes: []
        });
      }
    } else if (Math.random() < 0.05) {
      // General replies
      replies.push({
        id: `c${i}_r0`,
        userId: `user_${Math.floor(Math.random() * 200) + 10}`,
        text: '완전 공감합니다!!',
        timestamp: Date.now() - Math.floor(Math.random() * 500000),
        likes: []
      });
    }

    c.push({
      id: `c${i + 14}`,
      userId: userId,
      text: commentText,
      timestamp: Date.now() - Math.floor(Math.random() * 10000000),
      likes: [],
      replies: replies.length > 0 ? replies : undefined
    });
  }
  return { u, c };
};

const { u: dummyUsers, c: dummyComments } = generateDummyData();

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1mknow',
    username: '1mknow',
    avatar: 'https://picsum.photos/seed/1mknow/150/150',
    fullName: '1분지식',
    bio: '알아두면 쓸데있는 1분지식',
    followers: ['user_1', 'user_2'],
    following: [],
  },
  {
    id: 'user_1',
    username: 'tkdgk018',
    avatar: 'https://picsum.photos/seed/tkdgk018/150/150',
    fullName: 'TK',
    bio: 'Just setting up my profile!\n\nPassionate about coding & design ✨',
    followers: ['user_2'],
    following: ['user_1mknow', 'user_md_gd', 'user_sin_e_h', 'user_ally_all', 'user_joo', 'user_2', 'user_3'],
  },
  {
    id: 'user_md_gd',
    username: 'md__gd',
    avatar: 'https://picsum.photos/seed/md_gd/150/150',
    fullName: '무뎌지다',
    bio: '광고',
    followers: ['user_1'],
    following: [],
  },
  {
    id: 'user_sin_e_h',
    username: 'sin.e.h',
    avatar: 'https://picsum.photos/seed/sin_e_h/150/150',
    fullName: 'sin.e.h',
    bio: '광고',
    followers: ['user_1'],
    following: [],
  },
  {
    id: 'user_ally_all',
    username: 'ally_all.daily_',
    avatar: 'https://picsum.photos/seed/ally/150/150',
    fullName: 'ALLY.',
    bio: 'ALLY.',
    followers: ['user_1'],
    following: [],
  },
  {
    id: 'user_joo',
    username: 'joo._.joo_sw',
    avatar: 'https://picsum.photos/seed/joo/150/150',
    fullName: 'joo._.joo_sw',
    bio: 'Francis Lai, Christian Gaubert • La leçon particulière',
    followers: ['user_1'],
    following: [],
  },
  {
    id: 'user_2',
    username: 'imharin',
    avatar: 'https://picsum.photos/seed/imharin/150/150',
    fullName: '임하린',
    bio: '경찰 👮‍♀️ | 일상 기록장 📝\n운동 & 먹방 🍽️',
    followers: ['user_1', 'user_3', 'user_4', 'user_5', 'user_6'],
    following: ['user_1', 'user_3'],
  },
  {
    id: 'user_3',
    username: 'foodie_delight',
    avatar: 'https://picsum.photos/seed/food/150/150',
    fullName: 'Foodie',
    bio: 'Eating my way through life 🍔🍟🍣\nAll recipes in highlights!',
    followers: ['user_1', 'user_2'],
    following: [],
  },
  {
    id: 'user_4',
    username: 'gym_bro99',
    avatar: 'https://picsum.photos/seed/gym/150/150',
    fullName: '김근육',
    bio: '오운완',
    followers: [],
    following: ['user_2'],
  },
  {
    id: 'user_5',
    username: 'doge_coin_to_moon',
    avatar: 'https://picsum.photos/seed/doge/150/150',
    fullName: '가즈아',
    bio: '코인/주식/선물',
    followers: [],
    following: ['user_2'],
  },
  {
    id: 'user_6',
    username: 'daily_cat_123',
    avatar: 'https://picsum.photos/seed/cat/150/150',
    fullName: '야옹이',
    bio: '고양이 좋아',
    followers: [],
    following: ['user_2'],
  },
  ...dummyUsers
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_md_gd',
    userId: 'user_md_gd',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    caption: '평범남에서 매력남으로 거듭나는 특급 비법 대공개!! 놓치면 후회합니다 🤫...',
    overlayText: '매력남 되는 방법!!',
    overlayTags: [],
    likes: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5', 'user_6', 'user_7', 'user_8', 'user_9', 'user_10', 'user_11', 'user_12'],
    timestamp: Date.now() - 3600000 * 3,
    comments: [
      { id: 'c_md_1', userId: 'user_4', text: '오 꿀팁이네요 내일부터 당장 해봅니다', timestamp: Date.now() - 3400000 * 3, likes: ['user_1'] },
      { id: 'c_md_2', userId: 'user_5', text: '저도 한번 따라해볼게요', timestamp: Date.now() - 3500000 * 3, likes: [] },
      // ... 20 more dummy comments
      ...Array.from({length: 20}).map((_, i) => ({ id: `c_md_d_${i}`, userId: `user_${i+10}`, text: '저장해두고 봐야겠어요', timestamp: Date.now() - 3400000 * 3 - i * 1000, likes: [] }))
    ]
  },
  {
    id: 'post_sin_e_h',
    userId: 'user_sin_e_h',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    caption: '🎁 가을맞이 1+1 기획전 진행 중!\n\n센스있는 커플 시밀러룩엔 오버핏 체크가 진리..♡',
    overlayText: '센스있는 코디엔\n체크셔츠가 진리..♡',
    overlaySubText: '1+1 특가 진행중인데 안 사면 바보',
    likes: Array.from({length: 65}).map((_, i) => `user_${i+1}`),
    timestamp: Date.now() - 3600000 * 24 * 7,
    comments: [
      { id: 'c_sin_1', userId: 'user_6', text: '커플룩으로 딱이네요 ㅎㅎ', timestamp: Date.now() - 3500000 * 24 * 7, likes: [] },
    ]
  },
  {
    id: 'post_ally_all',
    userId: 'user_ally_all',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=800&q=80',
    caption: '과도한 집착을 보이는 남자와 애정결핍 성향의 여자가 만나면 예상치 못한 시너지를 발휘합니다. 한쪽은 끊임없이 관심을 요구하고, 다른 한쪽은 그 관심에 안도감을 느끼며...',
    overlayTags: ['ALLY.'],
    overlayText: '과집착남과\n애정결핍녀의\n치명적인 만남',
    likes: Array.from({length: 120}).map((_, i) => `user_${i+1}`),
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    comments: [
      { id: 'c_ally_1', userId: 'user_4', text: '오히려 저런 조합이 잘 맞나보네 ㅋㅋㅋ', timestamp: Date.now() - 3500000 * 24, likes: [] },
      { id: 'c_ally_2', userId: 'user_5', text: '천생연분이네 ㄷㄷ', timestamp: Date.now() - 3400000 * 24, likes: [] },
      ...Array.from({length: 99}).map((_, i) => ({ id: `c_ally_d_${i}`, userId: `user_${i+10}`, text: '완전 공감', timestamp: Date.now() - 3400000 * 24 - i * 1000, likes: [] }))
    ]
  },
  {
    id: 'post_joo',
    userId: 'user_joo',
    type: 'image', // keeping image for simplicity
    mediaUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80',
    caption: '오늘도 쇠질로 하루를 마무리합니다...',
    overlayText: '여친 생길때까지\n턱걸이하기 300일차',
    likes: Array.from({length: 250}).map((_, i) => `user_${i+1}`),
    timestamp: Date.now() - 3600000 * 24 * 6, // 6 days ago
    comments: [
      { id: 'c_joo_1', userId: 'user_7', text: '리스펙합니다 화이팅!', timestamp: Date.now() - 3500000 * 24 * 6, likes: [] },
      { id: 'c_joo_2', userId: 'user_8', text: '곧 좋은 소식 있을거에요!!', timestamp: Date.now() - 3400000 * 24 * 6, likes: [] },
      ...Array.from({length: 809}).map((_, i) => ({ id: `c_joo_d_${i}`, userId: `user_${(i%300)+10}`, text: '대단하시네요', timestamp: Date.now() - 3400000 * 24 * 6 - i * 1000, likes: [] }))
    ]
  },
  {
    id: 'post_0',
    userId: 'user_1mknow',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    caption: '히어로 조직 PACTUM 임직원 대다수 LADER로 이적, 최근 히어로 조직 운영 방침을 변경한 PACTUM에 소속된 임직원들 대다수가 LADER로 직장을 이직하고있습니다. 해당 현상에 대해 PACTUM은 개의치 않고 변경된 방침을 이어간다는 입장을 하고있습니다.',
    overlayTags: ['@1mknow - 1분지식', '@1mintrend - 1분트렌드', '@selectionmgz - 셀렉션매거진'],
    overlayText: '히어로 조직 PACTUM,\n임직원 대다수 LADER로 이적',
    overlaySubText: '*자세한 내용 본문 참고*',
    likes: ['user_1', 'user_3', 'user_4', 'user_5'],
    timestamp: Date.now() - 3600000 * 1, // 1 hour ago
    comments: [
      { id: 'c0_2', userId: 'user_5', text: 'LADER가 복지가 더 좋긴 하지...', timestamp: Date.now() - 3400000, likes: ['user_4'] },
      { id: 'c0_3', userId: 'user_3', text: '조직 방침이 어떻게 바뀌었길래 대다수가 이탈하나요? 심각하네요.', timestamp: Date.now() - 3300000, likes: ['user_1'] },
      { id: 'c0_4', userId: 'user_4', text: 'PACTUM 이제 끝물이네 ㅋㅋㅋ', timestamp: Date.now() - 3200000, likes: [] },
      { id: 'c0_5', userId: 'user_6', text: '요즘 히어로들도 결국 직장인이라는게 확 와닿네...', timestamp: Date.now() - 3100000, likes: ['user_3', 'user_5'] },
      { id: 'c0_6', userId: 'user_7', text: 'LADER 주식 사야겠다 떡상각', timestamp: Date.now() - 3000000, likes: [] },
      { id: 'c0_7', userId: 'user_8', text: 'PACTUM 예전부터 말 많더니 결국 터질게 터진건가', timestamp: Date.now() - 2900000, likes: ['user_4'] },
      { id: 'c0_8', userId: 'user_9', text: '그래도 PACTUM 네임밸류가 있는데 금방 회복하겠지', timestamp: Date.now() - 2800000, likes: [] },
      { id: 'c0_9', userId: 'user_10', text: 'LADER로 이직한 분들 대우는 잘 받고 계시려나 궁금하네요', timestamp: Date.now() - 2700000, likes: ['user_1'] },
      { id: 'c0_10', userId: 'user_11', text: 'LADER 대표가 엄청 유능하다던데', timestamp: Date.now() - 2600000, likes: [] },
      { id: 'c0_11', userId: 'user_12', text: 'PACTUM 남은 사람들은 어쩌냐', timestamp: Date.now() - 2500000, likes: ['user_5'] },
      { id: 'c0_12', userId: 'user_13', text: '경영진이 문제다 경영진이', timestamp: Date.now() - 2400000, likes: ['user_6', 'user_8'] },
      { id: 'c0_13', userId: 'user_14', text: '헐 내 최애 히어로도 LADER로 갔나?? 확인해봐야지', timestamp: Date.now() - 2300000, likes: [] },
      { id: 'c0_14', userId: 'user_15', text: '이직은 능력이니까 ㅋㅋㅋ 능력있는 사람들은 다 나가는듯', timestamp: Date.now() - 2200000, likes: ['user_9'] },
      { id: 'c0_15', userId: 'user_16', text: 'PACTUM 어릴때부터 좋아했는데 아쉽네요', timestamp: Date.now() - 2100000, likes: ['user_1'] },
      { id: 'c0_16', userId: 'user_17', text: '히어로판도 이직이 이렇게 자유로운줄 몰랐네 신기하다', timestamp: Date.now() - 2000000, likes: ['user_3', 'user_7'] },
      { id: 'c0_17', userId: 'user_18', text: '방침을 어떻게 바꿨길래 저러는걸까? 진짜 궁금하네', timestamp: Date.now() - 1900000, likes: [] },
      { id: 'c0_18', userId: 'user_19', text: '망하는 조직의 전형적인 테크트리네 ㅋㅋ', timestamp: Date.now() - 1800000, likes: ['user_4', 'user_5'] },
      { id: 'c0_19', userId: 'user_20', text: 'LADER 요즘 폼 미쳤다 싶더니 영입을 엄청 하는구나', timestamp: Date.now() - 1700000, likes: ['user_11'] },
      { id: 'c0_20', userId: 'user_21', text: '남아있는 히어로들 멘붕이겠다 ㅠㅠ', timestamp: Date.now() - 1600000, likes: [] },
      { id: 'c0_21', userId: 'user_22', text: '빨리 PACTUM 해명해라', timestamp: Date.now() - 1500000, likes: ['user_12'] },
      { id: 'c0_22', userId: 'user_23', text: '이직 시장에 큰 파장이 오겠네요', timestamp: Date.now() - 1400000, likes: [] },
      { id: 'c0_23', userId: 'user_24', text: '어차피 히어로도 직업인데 대우 좋은데 가는게 당연하지', timestamp: Date.now() - 1300000, likes: ['user_14', 'user_16'] },
      { id: 'c0_24', userId: 'user_25', text: 'PACTUM이 저렇게 무너지다니 충격적입니다.', timestamp: Date.now() - 1200000, likes: [] },
      { id: 'c0_25', userId: 'user_26', text: '이거 완전 LADER의 빅픽처 아니냐? ㄷㄷ', timestamp: Date.now() - 1100000, likes: ['user_20'] },
    ]
  },
  {
    id: 'post_1',
    userId: 'user_2',
    type: 'image',
    mediaUrl: 'https://igx.kr/r/t8/0/0',
    mediaUrls: ['https://igx.kr/r/t8/0/0', 'https://igx.kr/r/t8/0/1'],
    caption: '순찰 중에 아이스크림 먹기! (지원선배한테는 비밀)',
    likes: ['user_1', 'user_3', 'user_4', 'user_5', 'user_6'],
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    comments: [
      { id: 'c1', userId: 'user_4', text: '와 경찰이 순찰중에 땡땡이 치고 아이스크림 먹네 ㅋㅋㅋ 세금 살살 녹는다~', timestamp: Date.now() - 3500000 * 2, likes: ['user_2', 'user_5'] },
      { id: 'c2', userId: 'user_5', text: '아니 경찰분들 고생하시는데 당충전 좀 할수있지 윗댓 왜저럼? 방구석 찐따들 또 심술났네 ㅉㅉ', timestamp: Date.now() - 3400000 * 2, likes: ['user_4', 'user_6', 'user_1', 'user_3'] },
      { id: 'c3', userId: 'user_1', text: '하린님 평소에는 각잡혀있으시더니 이런 커여운 일상이... 반전 매력 미쳤다 폼 미쳤다 ㄷㄷ', timestamp: Date.now() - 3300000 * 2, likes: ['user_2', 'user_3'] },
      { id: 'c4', userId: 'user_6', text: '아이스크림 어디꺼에요? 정보좀요 ㅠㅠ 하린언니 넘 예뻐요❤️', timestamp: Date.now() - 3200000 * 2, likes: ['user_1', 'user_5'] },
      { id: 'c5', userId: 'user_3', text: '지원선배님한테 태그해드릴게요^^ @jiwon_police', timestamp: Date.now() - 3100000 * 2, likes: ['user_2', 'user_4', 'user_5', 'user_6'] },
      { id: 'c6', userId: 'user_4', text: '경찰 제복 핏 지리네 ㄷㄷ 누나 나죽어', timestamp: Date.now() - 3000000 * 2, likes: [] },
      { id: 'c7', userId: 'user_5', text: '세금으로 아이스크림 사먹나요? 해명부탁드립니다', timestamp: Date.now() - 2900000 * 2, likes: [], replies: [
        { id: 'c8', userId: 'user_1', text: '@doge_coin_to_moon 아니 아이스크림 하나 내돈내산 하는걸로 ㅈㄹ이네 진짜 ㅋㅋㅋ 님은 평생 일하면서 물도 마시지 마셈', timestamp: Date.now() - 2800000 * 2, likes: ['user_2', 'user_6'] },
        { id: 'c18', userId: 'user_1', text: '@doge_coin_to_moon 진짜 이런 애들은 일상생활 가능함? ㅋㅋㅋ', timestamp: Date.now() - 1800000 * 2, likes: ['user_3', 'user_6'] }
      ] },
      { id: 'c9', userId: 'user_6', text: '이게 나라다', timestamp: Date.now() - 2700000 * 2, likes: ['user_1'] },
      { id: 'c10', userId: 'user_4', text: '근무중에 폰 만지는것도 징계사유 아닌가요? 민원 넣겠습니다.', timestamp: Date.now() - 2600000 * 2, likes: [] },
      { id: 'c11', userId: 'user_3', text: '아니 순찰차 세워놓고 잠깐 쉴수도 있지 ㅋㅋㅋㅋ 쿨찐 개많네', timestamp: Date.now() - 2500000 * 2, likes: ['user_1', 'user_2'] },
      { id: 'c12', userId: 'user_5', text: '하린이 누나 폼 미쳤다 ㄷㄷ 나도 경찰할래', timestamp: Date.now() - 2400000 * 2, likes: ['user_6'] },
      { id: 'c13', userId: 'user_6', text: '언니 립 정보좀요!! 웜톤이신가요 쿨톤이신가요??', timestamp: Date.now() - 2300000 * 2, likes: ['user_2'] },
      { id: 'c14', userId: 'user_1', text: '선배님 여기서 이러시면 안됩니다.', timestamp: Date.now() - 2200000 * 2, likes: ['user_3', 'user_4'] },
      { id: 'c15', userId: 'user_4', text: '경찰 눈나 나쁜사람 잡지 말고 내 마음이나 잡아줘', timestamp: Date.now() - 2100000 * 2, likes: [] },
      { id: 'c16', userId: 'user_3', text: '이분 인스타 보니까 평소에 운동 개열심히 하시던데.. 경찰체력 1등급이실듯', timestamp: Date.now() - 2000000 * 2, likes: ['user_1', 'user_2'] },
      { id: 'c17', userId: 'user_5', text: '근무태만 ㄷㄷ 신문고 드개자~', timestamp: Date.now() - 1900000 * 2, likes: [] },
      { id: 'c19', userId: 'user_6', text: '아이스크림 무슨 맛인가요? 민초면 실망할듯', timestamp: Date.now() - 1700000 * 2, likes: [] },
      { id: 'c20', userId: 'user_4', text: '저희 동네도 순찰 와주세요 ㅠㅠ', timestamp: Date.now() - 1600000 * 2, likes: ['user_2'] },
      ...dummyComments
    ]
  },
  {
    id: 'post_2',
    userId: 'user_3',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
    caption: 'Best ice cream in town 🍦 Literally melting in my hands but so worth it.',
    likes: [],
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
  },
  {
    id: 'post_3',
    userId: 'user_1',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    caption: 'Late night coding session. 💻☕ Powered by espresso and good lo-fi beats.',
    likes: ['user_2', 'user_3'],
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
  }
];
