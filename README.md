# CYAN — craft · stay · gallery

공간 ‘시안’의 홈페이지. 공방·북스테이·갤러리를 한 페이지에 담았습니다.
빌드 도구 없이 HTML·CSS·JS 파일만으로 동작합니다.

| # | 섹션 | 내용 |
| --- | --- | --- |
| 01 | 브랜드 (`#brand`) | 시안 소개 + 세 공간으로 가는 카드 |
| 02 | 공방 (`#craft`) | 제품 목록 · 분류 필터 · 구매(외부 결제 링크) |
| 03 | 북스테이 (`#stay`) | 객실 소개 · 날짜별 요금 계산 · 예약·결제(외부 예약 링크) |
| 04 | 갤러리 (`#gallery`) | 현재 전시 · 제휴 유형 · 제휴 문의 폼 |

```
index.html              페이지 전체 (내용은 여기서 수정)
assets/css/style.css    디자인 (색·글자 크기 등)
assets/js/main.js       메뉴 / 제품 필터 / 예약 요금 계산 / 문의 폼
assets/img/             로고 심볼, 파비콘
```

## 미리보기

`index.html`을 브라우저로 열거나 `python3 -m http.server 8000` 후 http://localhost:8000

## 내용 채우기

`index.html`에서 `✏️` 표시가 붙은 주석만 찾아 고치면 됩니다.

### 결제 · 예약 연결

정적 사이트라 결제는 외부 서비스로 넘깁니다.

- **공방 제품**: 각 제품의 `구매하기` 버튼 `href`에 스마트스토어 상품 링크나 토스·카카오 결제 링크를 넣습니다.
  품절이면 `<li class="product is-soldout">`으로 바꾸고 버튼을 `<span class="btn btn--sm is-disabled">품절</span>`로 바꿉니다.
  새 분류가 필요하면 필터 버튼(`data-filter`)과 제품(`data-category`)의 값을 똑같이 맞춥니다.
- **북스테이 객실**: `<article class="room">`의 `data-price`는 1박 요금(숫자만), `data-book`은 네이버 예약·에어비앤비 같은 예약·결제 링크입니다.
  객실을 추가하면 예약 폼의 `<select id="bkRoom">`에도 같은 `data-room` 값으로 `<option>`을 추가합니다.
- **제휴 문의**: `<form id="inquiry">`의 `data-mail`로 방문자 메일 앱이 열립니다.
  [Formspree](https://formspree.io) 같은 폼 서비스 주소를 `data-endpoint`에 넣으면 페이지 안에서 바로 접수됩니다.

> 온라인 판매를 하면 푸터에 상호·대표자·사업자등록번호·통신판매업 신고번호를 표시해야 합니다.

### 로고 교체

히어로의 `<div class="hero-mark">` 안 `<svg>`를 통째로 지우고 파일을 넣으면 됩니다.

```html
<img class="hero-mark" src="assets/img/logo.png" alt="CYAN">
```

SVG 파일이면 코드를 그대로 붙여 넣는 편이 좋습니다. 선이 그려지는 애니메이션을 유지하려면
각 `<path>`에 `pathLength="1"`을 넣고 `<g class="draw">`로 감싸주세요.
헤더·푸터의 작은 심볼도 같은 모양이므로 함께 바꿔주면 통일됩니다.

### 사진 넣기

빈 액자(`.frame`)는 사진 자리입니다. 안에 이미지를 넣으면 알아서 채워집니다.

```html
<div class="frame frame--wide"><img src="assets/img/space-01.jpg" alt="1층 전시실"></div>
```

비율은 `frame`(4:5), `frame--wide`(16:10), `frame--tall`(3:4) 중에 고르면 됩니다.

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
