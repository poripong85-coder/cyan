/* ============================================================
   CYAN — 사이트 내용 데이터
   ------------------------------------------------------------
   객실·클래스·전시·제품 정보는 모두 이 파일에서 고칩니다.
   ✏️ 표시가 붙은 곳만 바꾸면 각 페이지에 자동으로 반영됩니다.

   · 날짜는 'YYYY-MM-DD' 형식으로 적습니다.
   · 가격은 숫자만 적습니다 (원 단위, 쉼표 없이).
   · 사진은 assets/img/ 에 넣고 경로를 적습니다. 비워두면 빈 액자가 보입니다.
   ============================================================ */

window.CYAN = window.CYAN || {};

window.CYAN.data = {

  /* ✏️ 기본 정보 ------------------------------------------------ */
  site: {
    name: 'CYAN',
    email: 'cyan.gallery.house@gmail.com',
    phone: '',            // 전화번호를 적으면 문의란에 보입니다
    instagram: 'cyan_gallery.house',
    address: '충남 천안시 동남구 광덕면 만복골3길 10',
    postcode: '31220',
    mapUrl: 'https://map.naver.com/p/search/%EC%B6%A9%EB%82%A8%20%EC%B2%9C%EC%95%88%EC%8B%9C%20%EB%8F%99%EB%82%A8%EA%B5%AC%20%EA%B4%91%EB%8D%95%EB%A9%B4%20%EB%A7%8C%EB%B3%B5%EA%B3%A83%EA%B8%B8%2010',

    /* 예약·주문 신청서를 받을 주소.
       Formspree(https://formspree.io) 등에서 만든 주소를 넣으면 신청 내용이 메일로 옵니다.
       비워두면 방문자의 메일 앱이 열리고 위 email 로 신청 내용이 채워집니다. */
    formEndpoint: '',

    /* 숍 주문 · 북스테이 예약금 입금 계좌 */
    bankAccount: '○○은행 000-000000-00000 (예금주: 시안)'
  },

  /* ✏️ 시안북스테이 ---------------------------------------------- */
  stay: {
    checkIn: '15:00',
    checkOut: '11:00',
    maxNights: 7,          // 한 번에 예약할 수 있는 최대 박수
    openMonths: 3,         // 오늘부터 몇 달 뒤까지 예약을 받을지
    weekendDays: [5, 6],   // 주말 요금 적용 (0=일 1=월 … 5=금 6=토 의 '밤')

    rooms: [
      {
        id: 'yellow',
        name: '노랑 방',
        en: 'Yellow Room',
        image: '',
        capacity: 2,       // 기준 인원
        maxCapacity: 3,    // 최대 인원
        extraPerson: 20000,// 기준 인원 초과 1인당 1박 추가 요금
        weekday: 140000,
        weekend: 180000,
        summary: '문을 열면 온통 노랑으로 가득한 방. 붉은 벽돌집의 아치 창으로 산이 보입니다.',
        features: ['퀸 침대 1', '아치 창 책상', '큐레이션 서가', '개별 욕실']
      },
      {
        id: 'attic',
        name: '다락 방',
        en: 'Attic Room',
        image: '',
        capacity: 2,
        maxCapacity: 4,
        extraPerson: 20000,
        weekday: 160000,
        weekend: 200000,
        summary: '뾰족 지붕 아래 다락이 있는 방. 아이와 함께 오는 가족에게 좋습니다.',
        features: ['퀸 침대 1 + 다락 토퍼', '마당 쪽 창', '찻자리 세트', '개별 욕실']
      }
    ],

    /* 이미 예약된 밤 (체크인 날짜 기준). 이 날짜에는 해당 방이 '마감'으로 보입니다. */
    booked: {
      yellow: ['2026-11-21', '2026-11-28', '2026-12-05', '2026-12-12'],
      attic:   ['2026-11-28', '2026-11-29', '2026-12-19']
    },

    /* 쉬는 날 (모든 방) */
    closed: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'],

    included: ['간단한 조식', '갤러리 관람', '2층 테라스', '체험 프로그램 할인', '수건 · 기본 어메니티'],

    notice: [
      '예약 신청 후 안내 문자를 받으시면 24시간 안에 숙박 요금을 입금해 주세요. 입금 확인 후 예약이 확정됩니다.',
      '체크인 7일 전까지 취소 시 전액, 3일 전까지 50% 환불되며 이후에는 환불이 어렵습니다.',
      '조용한 독서 공간이라 반려동물 동반과 실내 취사는 어렵습니다.'
    ]
  },

  /* ✏️ 시안 공방 클래스 ------------------------------------------ */
  workshop: {
    weeksAhead: 6,         // 몇 주 뒤 일정까지 보여줄지

    classes: [
      {
        id: 'ceramic',
        name: '생활 도자기',
        en: 'Ceramics',
        image: '',
        duration: '2시간',
        price: 55000,
        capacity: 6,
        level: '처음이어도 괜찮아요',
        summary: '손으로 빚는 컵과 접시. 굽고 나면 3주 뒤 택배 또는 방문 수령합니다.',
        includes: ['흙 · 유약 · 소성비', '완성품 2점', '차 한 잔'],
        /* 반복 일정: days(0=일 … 6=토) 요일마다 times 시간에 열립니다. */
        schedule: { days: [6], times: ['11:00', '15:00'] },
        extra: [],         // 반복 일정 외에 추가로 여는 회차 'YYYY-MM-DD HH:MM'
        soldOut: ['2026-11-21 11:00'],  // 마감된 회차
        off: []            // 쉬는 회차
      },
      {
        id: 'drawing',
        name: '숲 그림',
        en: 'Drawing',
        image: '',
        duration: '2시간 30분',
        price: 68000,
        capacity: 4,
        level: '처음이어도 괜찮아요',
        summary: '테라스에 앉아 호두마을의 숲을 크레용과 물감으로 그립니다. 그림을 못 그려도 괜찮아요.',
        includes: ['재료 일체', '액자 1개', '차 한 잔'],
        schedule: { days: [0], times: ['14:00'] },
        extra: [],
        soldOut: [],
        off: []
      },
      {
        id: 'sewing',
        name: '소창 소잉',
        en: 'Sewing',
        image: '',
        duration: '1시간 30분',
        price: 42000,
        capacity: 8,
        level: '누구나',
        summary: '부드러운 소창 천으로 손수건과 작은 파우치를 손바느질로 만듭니다.',
        includes: ['소창 원단', '실 · 바늘', '완성품 2점'],
        schedule: { days: [3, 5], times: ['19:30'] },
        extra: [],
        soldOut: [],
        off: []
      }
    ],

    notice: [
      '수업 시작 10분 전까지 도착해 주세요.',
      '수업 3일 전까지 취소 시 전액 환불, 이후에는 다른 회차로 한 번 옮길 수 있습니다.',
      '단체 체험, 스몰웨딩, 파티 등 이벤트는 따로 문의해 주세요.'
    ]
  },

  /* ✏️ 시안 갤러리 전시 ------------------------------------------
     날짜에 따라 '진행 중 · 예정 · 지난 전시'가 자동으로 나뉩니다.
     새 전시는 맨 위에 추가하세요. */
  exhibitions: [
    {
      id: '2026-winter',
      title: '겨울의 책상',
      artist: '작가 이름',
      start: '2026-12-05',
      end: '2027-01-24',
      image: '',
      summary: '다음 전시 소개를 한두 문장으로 적어주세요.',
      text: ''
    },
    {
      id: '2026-autumn',
      title: '종이가 접히는 자리',
      artist: '작가 이름',
      start: '2026-10-10',
      end: '2026-11-29',
      image: '',
      summary: '접고 펼친 종이의 흔적을 따라가는 드로잉과 설치.',
      text: '전시를 한 문단으로 소개해 주세요. 어떤 작업인지, 어떤 마음으로 보면 좋은지 정도만 적어도 충분합니다. 갤러리 사이트에서 글은 짧을수록 작품이 잘 보입니다.'
    },
    {
      id: '2026-summer',
      title: '여름 창가',
      artist: '작가 이름',
      start: '2026-07-04',
      end: '2026-08-30',
      image: '',
      summary: '지난 전시 소개.',
      text: '지난 전시의 소개 글을 남겨두면 아카이브에서 다시 읽을 수 있습니다.'
    },
    {
      id: '2026-spring',
      title: '봄의 목록',
      artist: '작가 이름',
      start: '2026-04-11',
      end: '2026-06-07',
      image: '',
      summary: '지난 전시 소개.',
      text: ''
    },
    {
      id: '2025-winter',
      title: '흰 벽 앞에서',
      artist: '작가 이름',
      start: '2025-12-06',
      end: '2026-02-22',
      image: '',
      summary: '지난 전시 소개.',
      text: ''
    },
    {
      id: '2025-autumn',
      title: '오래 보는 연습',
      artist: '작가 이름',
      start: '2025-09-20',
      end: '2025-11-16',
      image: '',
      summary: 'CYAN의 첫 전시.',
      text: ''
    }
  ],

  /* ✏️ 시안 제품 ------------------------------------------------
     series: 제작 시리즈. status 가 'archive' 면 '지난 시리즈'로 묶입니다.
     products: 각 제품은 series 에 시리즈 id 를 적습니다.
     soldOut: true 면 품절, link 를 적으면 '구매' 버튼이 외부 스토어로 연결됩니다. */
  series: [
    {
      id: 's03',
      no: '03',
      name: '소창',
      en: 'Socheong',
      year: '2026',
      status: 'current',
      summary: '빨수록 부드러워지는 무명 소창으로 만든 생활 소품. 시안 공방에서 하나씩 바느질합니다.'
    },
    {
      id: 's02',
      no: '02',
      name: '생활 도자기',
      en: 'Everyday Ceramics',
      year: '2026',
      status: 'current',
      summary: '북스테이에서 쓰는 컵과 접시를 그대로 만들었습니다. 소량 수작업이라 모양이 조금씩 다릅니다.'
    },
    {
      id: 's01',
      no: '01',
      name: '첫 번째 집',
      en: 'First House',
      year: '2025',
      status: 'archive',
      summary: '붉은 벽돌집과 갤러리 그림에서 출발한 첫 소잉 시리즈. 모두 판매가 끝났습니다.'
    }
  ],

  products: [
    { id: 'p301', series: 's03', name: '소창 손수건 2장',  price: 14000, image: '', summary: '40 × 40cm · 4겹 소창', soldOut: false, link: '' },
    { id: 'p302', series: 's03', name: '소창 행주 3장',   price: 12000, image: '', summary: '30 × 30cm · 삶아 써도 괜찮아요',            soldOut: false, link: '' },
    { id: 'p303', series: 's03', name: '소창 목욕 타월',   price: 32000, image: '', summary: '70 × 140cm',                     soldOut: false, link: '' },
    { id: 'p201', series: 's02', name: '숲 앞접시',        price: 28000, image: '', summary: '지름 15cm · 초록 유약', soldOut: false, link: '' },
    { id: 'p202', series: 's02', name: '파랑 머그',         price: 26000, image: '', summary: '180ml',                          soldOut: true,  link: '' },
    { id: 'p101', series: 's01', name: '벽돌집 파우치',     price: 24000, image: '', summary: '소창 · 손바느질',               soldOut: true,  link: '' },
    { id: 'p102', series: 's01', name: 'CYAN 에코백',      price: 22000, image: '', summary: '코튼 캔버스',                     soldOut: true,  link: '' }
  ],

  shipping: {
    fee: 3500,
    freeOver: 50000        // 이 금액 이상이면 무료 배송
  }
};
