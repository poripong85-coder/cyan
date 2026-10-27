# CYAN — bookstay · workshop · gallery · shop

시안 홈페이지. 빌드 도구 없이 HTML·CSS·JS 파일만으로 동작합니다 (GitHub Pages에 그대로 올라갑니다).

```
index.html       홈 — 네 공간 소개 · 지금 전시 · 새 시리즈 · 방문 안내
about.html       브랜드 소개 — 이야기 · 가치 · 층별 구성 · 연혁 · 문의
stay.html        시안북스테이 — 객실 소개 · 달력에서 날짜 선택 · 요금 계산 · 예약 신청
workshop.html    시안 공방 — 클래스 소개 · 회차 선택 · 인원 · 예약 신청
gallery.html     시안 갤러리 — 지금 전시 · 예정 전시 · 지난 전시 아카이브(연도별)
shop.html        시안 숍 — 제작 시리즈별 아카이브 · 장바구니 · 주문 신청

assets/js/data.js       ✏️ 객실·클래스·전시·시리즈·제품 내용 (대부분 여기만 고치면 됩니다)
assets/js/main.js       공통 (헤더, 모바일 메뉴, 장바구니 저장, 신청서 보내기)
assets/js/home.js / stay.js / workshop.js / gallery.js / shop.js   페이지별 동작
assets/css/style.css    디자인
```

## 미리보기

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 내용 고치기

### 1. `assets/js/data.js` — 자주 바뀌는 내용

| 항목 | 내용 |
| --- | --- |
| `site` | 메일·전화·주소·인스타그램·입금 계좌, 신청서 받을 주소(`formEndpoint`) |
| `stay.rooms` | 객실 이름·사진·인원·평일/주말 요금·추가 인원 요금 |
| `stay.booked` | **이미 예약된 밤** (방별 체크인 날짜). 여기 적은 날은 달력에서 마감으로 보입니다 |
| `stay.closed` | 모든 방이 쉬는 날 |
| `workshop.classes` | 클래스 정보와 반복 일정(`schedule`: 요일·시간). `soldOut`에 마감 회차, `extra`에 추가 회차, `off`에 쉬는 회차 |
| `exhibitions` | 전시 목록. 날짜에 따라 **지금 / 예정 / 지난 전시가 자동으로** 나뉘고 지난 전시는 연도별 아카이브로 쌓입니다 |
| `series` | 제작 시리즈. `status: 'archive'`면 지난 시리즈(판매 종료)로 표시 |
| `products` | 시리즈별 제품. `soldOut: true`면 품절, `link`를 적으면 외부 스토어(스마트스토어 등)로 연결 |
| `shipping` | 배송비, 무료 배송 기준 금액 |

사진은 `assets/img/`에 넣고 `image: 'assets/img/room-01.jpg'`처럼 경로를 적으면 빈 액자 대신 보입니다.

### 2. HTML의 `✏️` 주석 — 소개 문장

각 페이지 맨 위 한 줄 소개, 브랜드 이야기·가치·연혁, 공간 사진 등은 HTML에서 `✏️` 표시를 찾아 고칩니다.
헤더·푸터는 모든 페이지에 똑같이 들어 있으니 메뉴를 바꿀 땐 여섯 파일을 함께 고쳐주세요.

## 예약 · 주문은 어떻게 받나요?

서버가 없는 정적 사이트라 **결제는 하지 않고 '신청서'를 받는 방식**입니다.

1. 방문자가 날짜·인원·상품을 고르면 금액이 자동 계산됩니다.
2. 신청하기를 누르면 신청 내용이 운영자에게 전달됩니다.
   - `site.formEndpoint`를 비워두면 → 방문자의 **메일 앱**이 열리고 `site.email`로 신청 내용이 채워집니다.
   - [Formspree](https://formspree.io) 같은 폼 서비스에서 받은 주소를 넣으면 → 메일 앱 없이 **바로 전송**되고 운영자 메일함으로 옵니다. (권장)
3. 운영자가 확인 문자를 보내고, 방문자가 `site.bankAccount`로 입금하면 확정.
4. 확정된 날짜는 `stay.booked` / `soldOut`에 추가해 두면 홈페이지에도 마감으로 보입니다.

나중에 네이버 예약·스마트스토어 등으로 옮기고 싶다면 제품은 `link`만 적으면 되고,
객실·클래스는 각 페이지의 `#book` 섹션을 외부 링크 버튼으로 바꾸면 됩니다.

장바구니는 방문자의 브라우저에 저장됩니다(다른 기기와 공유되지 않음).

## 색 바꾸기

`assets/css/style.css` 맨 위 `:root`의 값만 고치면 전체에 반영됩니다.

| 토큰 | 기본값 | 쓰임 |
| --- | --- | --- |
| `--paper` | `#F7F5F1` | 바탕 (따뜻한 화이트) |
| `--paper-tint` | `#EFECE5` | 한 톤 낮은 섹션 바탕 |
| `--ink` | `#16181A` | 본문 |
| `--accent` | `#1E858D` | 포인트 컬러 (cyan) |

## 배포 — GitHub Pages

Settings → Pages → Source를 `Deploy from a branch`, 브랜치를 `main` / `/ (root)`로 두면
`https://poripong85-coder.github.io/cyan/` 에 바로 올라갑니다.
개인 도메인은 저장소 루트에 도메인만 적은 `CNAME` 파일을 추가하면 됩니다.

## 참고

- 글꼴은 Google Fonts(Cormorant Garamond, Noto Sans KR)를 불러옵니다.
- 별도 빌드·의존성 없음. 모바일 대응, 키보드 접근성, `prefers-reduced-motion` 반영.
