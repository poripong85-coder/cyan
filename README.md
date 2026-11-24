# CYAN — 예술적으로 쉬다.

시안 홈페이지. **한 권의 책처럼** 읽히도록 만들었습니다.
표지 → 서문 → 차례 → 1–5장 → 부록 → 판권 순서이고, 각 장 끝의 "다음 장"으로 책장을 넘기듯 이어 읽습니다.
그림은 HOUSE · GALLERY 펜 드로잉 한 장만 씁니다. 빌드 도구 없이 HTML·CSS·JS 파일만으로 동작합니다.

```
index.html       홈 — 스케치의 그림만 살리고 칸은 반듯한 펜 선 (메뉴 · 집 · 갤러리 · 자전거를 누르면 이동, 방명록 · 계절 사진 칸)
about.html       1장 시안에 대하여 — 이름 · 두 채의 집 · 하는 일 · 이 집이 실린 곳 · 부록 오시는 길
stay.html        2장 시안북스테이 — 방 · 머무는 법 · 예약 신청(달력, 요금 계산)
workshop.html    3장 시안 공방 — 수업 · 수업 신청(회차, 인원)
gallery.html     4장 시안 갤러리 — 지금 걸린 전시 · 다음 전시 · 지난 전시(연도별)
shop.html        5장 시안 숍 — 제작 시리즈 목록 · 장바구니 · 주문 신청

assets/js/data.js       ✏️ 방·수업·전시·시리즈·제품 내용 (대부분 여기만 고치면 됩니다)
assets/js/main.js       공통 (머리말, 차례 펼치기, 장바구니 저장, 신청서 보내기)
assets/js/home.js / stay.js / workshop.js / gallery.js / shop.js   페이지별 동작
assets/css/style.css    디자인
assets/img/book/        펜 드로잉 (drawing 전체 · house · gallery · favicon)
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
| `guestbook` | 홈 방명록에 보일 글. 홈에서 남긴 글은 메일로 오고, 실을 글만 여기에 옮겨 적습니다 |
| `seasons` | 계절별 사진 — 오늘 날짜의 계절 사진이 홈에 자동으로 보입니다 |

사진은 비워두면 아무것도 보이지 않고, `assets/img/`에 넣고 `image: 'assets/img/room-01.jpg'`처럼 경로를 적으면 그때만 나타납니다.

### 2. HTML의 `✏️` 주석 — 소개 문장

서문, 소개된 곳(방송 · 책), 각 장의 첫 문장, 1장 본문, 부록(오시는 길), 판권은 HTML에서 `✏️` 표시를 찾아 고칩니다.
머리말과 차례는 모든 페이지에 똑같이 들어 있으니 차례를 바꿀 땐 여섯 파일을 함께 고쳐주세요.

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

## 그림 (`assets/img/book/`)

| 파일 | 쓰는 곳 |
| --- | --- |
| `drawing.png` | 표지 — HOUSE와 GALLERY가 함께 있는 원본 그림 |
| `house.png` | 2장 첫 페이지, 1장 그림 2 |
| `gallery.png` | 4장 첫 페이지, 1장 그림 1 |
| `icon-house.png`, `icon-gallery.png` | 표지의 바로 가기 아이콘 (원본 그림에서 글씨 없이 오린 것) |
| `icon-workshop.svg` | 표지 · 3장의 공방 아이콘 (같은 펜 느낌으로 새로 그린 항아리와 그릇) |
| `logo-house.svg` | 다른 페이지 맨 위 로고 "시안." 옆 작은 집 |
| `home-logo.png`, `menu-*.png`, `map-*.png` | 홈 손그림 — 스케치에서 오려낸 로고 집 · 메뉴 아이콘 · 강 · 집 · 갤러리 · 자전거. 자리는 `index.html`의 `left/top/width`(큰 네모 기준 %)로 맞춥니다 |
| `favicon.png` | 브라우저 탭 아이콘 |

원본을 더 선명한 파일로 바꾸고 싶으면 같은 이름의 투명 배경 PNG로 덮어쓰면 됩니다.

## 색과 글꼴

`assets/css/style.css` 맨 위 `:root`의 값만 고치면 전체에 반영됩니다.

| 토큰 | 기본값 | 쓰임 |
| --- | --- | --- |
| `--desk` | `#E9E5DC` | 책 바깥 (넓은 화면에서 종이 둘레) |
| `--paper` | `#FBF9F4` | 종이 |
| `--tint` | `#F2EEE5` | 부록 · 판권 페이지 |
| `--ink` | `#1E1E1C` | 글자 |
| `--blue` | `#2B4D8F` | 시안 파랑 — 링크에만 조금 |
| `--sheet`, `--measure` | `860px`, `34em` | 종이 폭, 한 줄 길이 |

글꼴은 Google Fonts에서 두 가지를 씁니다: 본문은 책 느낌의 고운바탕, 제목 · 장 번호 · 숫자는 연필 손글씨 하이멜로디(Hi Melody).
`--serif`(본문)와 `--pen`(손글씨) 값만 바꾸면 전체 글꼴이 바뀝니다.

## 배포 — GitHub Pages

Settings → Pages → Source를 `Deploy from a branch`, 브랜치를 `main` / `/ (root)`로 두면
`https://poripong85-coder.github.io/cyan/` 에 바로 올라갑니다.
개인 도메인은 저장소 루트에 도메인만 적은 `CNAME` 파일을 추가하면 됩니다.

## 참고

- 별도 빌드 · 의존성 없음. 모바일 대응, 키보드 접근성, `prefers-reduced-motion` 반영.
