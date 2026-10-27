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
    email: 'hello@example.com',
    phone: '010-0000-0000',
    instagram: 'cyan.gallery.house',
    address: '서울 ○○구 ○○로 00',
    mapUrl: 'https://map.naver.com/',

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
        id: 'reading',
        name: '읽는 방',
        en: 'Reading Room',
        image: '',
        capacity: 2,       // 기준 인원
        maxCapacity: 3,    // 최대 인원
        extraPerson: 20000,// 기준 인원 초과 1인당 1박 추가 요금
        weekday: 140000,
        weekend: 180000,
        summary: '책장으로 둘러싸인 2층 다락방. 창가 책상에서 하루 종일 읽고 쓰기 좋은 방입니다.',
        features: ['퀸 침대 1', '창가 책상', '큐레이션 서가 200권', '개별 욕실']
      },
      {
        id: 'garden',
        name: '정원 방',
        en: 'Garden Room',
        image: '',
        capacity: 2,
        maxCapacity: 4,
        extraPerson: 20000,
        weekday: 160000,
        weekend: 200000,
        summary: '작은 정원으로 바로 이어지는 1층 방. 아침에는 마루에 앉아 차를 마실 수 있습니다.',
        features: ['퀸 침대 1 + 토퍼 1', '정원 마루', '찻자리 세트', '개별 욕실']
      }
    ],

    /* 이미 예약된 밤 (체크인 날짜 기준). 이 날짜에는 해당 방이 '마감'으로 보입니다. */
    booked: {
      reading: ['2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28'],
      garden:  ['2026-11-07', '2026-11-08', '2026-11-28']
    },

    /* 쉬는 날 (모든 방) */
    closed: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'],

    included: ['조식 (빵 · 커피 · 과일)', '갤러리 관람', '공방 클래스 10% 할인', '수건 · 기본 어메니티'],

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
        id: 'binding',
        name: '실 제본 노트 만들기',
        en: 'Book Binding',
        image: '',
        duration: '2시간',
        price: 55000,
        capacity: 6,
        level: '처음이어도 괜찮아요',
        summary: '종이를 접고 실로 꿰매 나만의 노트 한 권을 완성합니다. 표지 천과 실 색을 직접 고릅니다.',
        includes: ['재료 일체', '완성 노트 1권', '차 한 잔'],
        /* 반복 일정: days(0=일 … 6=토) 요일마다 times 시간에 열립니다. */
        schedule: { days: [6], times: ['11:00', '15:00'] },
        extra: [],         // 반복 일정 외에 추가로 여는 회차 'YYYY-MM-DD HH:MM'
        soldOut: ['2026-10-31 11:00'],  // 마감된 회차
        off: []            // 쉬는 회차
      },
      {
        id: 'ceramic',
        name: '작은 백자 접시',
        en: 'Ceramic Plate',
        image: '',
        duration: '2시간 30분',
        price: 68000,
        capacity: 4,
        level: '처음이어도 괜찮아요',
        summary: '손으로 빚는 작은 접시 두 점. 소성 후 3주 뒤 택배 또는 방문 수령합니다.',
        includes: ['재료 · 소성비', '접시 2점', '포장'],
        schedule: { days: [0], times: ['14:00'] },
        extra: [],
        soldOut: [],
        off: []
      },
      {
        id: 'print',
        name: '리소 프린트 엽서',
        en: 'Riso Print',
        image: '',
        duration: '1시간 30분',
        price: 42000,
        capacity: 8,
        level: '누구나',
        summary: '두 가지 색으로 찍어내는 엽서 세트. 전시 작가의 드로잉을 함께 활용합니다.',
        includes: ['엽서 10장', '봉투', '도안'],
        schedule: { days: [3, 5], times: ['19:30'] },
        extra: [],
        soldOut: [],
        off: []
      }
    ],

    notice: [
      '수업 시작 10분 전까지 도착해 주세요.',
      '수업 3일 전까지 취소 시 전액 환불, 이후에는 다른 회차로 한 번 옮길 수 있습니다.',
      '단체 · 기업 클래스는 따로 문의해 주세요.'
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
      name: '접힌 종이',
      en: 'Folded Paper',
      year: '2026',
      status: 'current',
      summary: '가을 전시와 함께 만든 문구 시리즈. 전시 작가의 드로잉을 종이 위에 옮겼습니다.'
    },
    {
      id: 's02',
      no: '02',
      name: '정원의 그릇',
      en: 'Garden Ware',
      year: '2026',
      status: 'current',
      summary: '북스테이 정원 방에서 쓰는 그릇을 그대로 만들었습니다. 소량 수작업.'
    },
    {
      id: 's01',
      no: '01',
      name: '첫 번째 집',
      en: 'First House',
      year: '2025',
      status: 'archive',
      summary: 'CYAN 로고의 집 모양에서 출발한 첫 시리즈. 모두 판매가 끝났습니다.'
    }
  ],

  products: [
    { id: 'p301', series: 's03', name: '실 제본 노트 A5',  price: 24000, image: '', summary: '무선 줄 없는 120쪽 · 수제 실 제본', soldOut: false, link: '' },
    { id: 'p302', series: 's03', name: '드로잉 엽서 세트', price: 12000, image: '', summary: '엽서 6종 · 리소 프린트',            soldOut: false, link: '' },
    { id: 'p303', series: 's03', name: '종이 책갈피',      price: 6000,  image: '', summary: '2종 중 랜덤',                     soldOut: false, link: '' },
    { id: 'p201', series: 's02', name: '백자 앞접시',      price: 32000, image: '', summary: '지름 15cm · 수작업이라 모양이 조금씩 다릅니다', soldOut: false, link: '' },
    { id: 'p202', series: 's02', name: '찻잔',            price: 28000, image: '', summary: '180ml',                          soldOut: true,  link: '' },
    { id: 'p101', series: 's01', name: '집 모양 오브제',    price: 38000, image: '', summary: '세라믹 · 높이 9cm',               soldOut: true,  link: '' },
    { id: 'p102', series: 's01', name: '로고 에코백',       price: 22000, image: '', summary: '코튼 캔버스',                     soldOut: true,  link: '' }
  ],

  shipping: {
    fee: 3500,
    freeOver: 50000        // 이 금액 이상이면 무료 배송
  }
};
