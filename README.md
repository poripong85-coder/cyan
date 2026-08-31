# CYAN — gallery house

일러스트(로고)를 중심에 둔 심플한 갤러리 홈페이지. 빌드 도구 없이 HTML·CSS·JS 파일만으로 동작합니다.

```
index.html              페이지 전체 (내용은 여기서 수정)
assets/css/style.css    디자인 (색·글자 크기 등)
assets/js/main.js       헤더 / 모바일 메뉴 / 스크롤 등장
assets/img/logo-mark.svg  로고 심볼
assets/img/favicon.svg    브라우저 탭 아이콘
```

## 미리보기

`index.html`을 브라우저로 열면 그대로 보입니다. 또는

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 내용 채우기

`index.html`에서 `✏️` 표시가 붙은 주석만 찾아 고치면 됩니다.

| 위치 | 내용 |
| --- | --- |
| `✏️ 로고 교체 지점` | 보유한 일러스트 파일로 교체 (아래 참고) |
| `✏️ 한 줄 소개` | 히어로 아래 한 줄 문구 |
| `✏️ 현재 전시` | 진행 중인 전시 제목·작가·기간·소개 |
| `✏️ 지난 / 예정 전시` | 목록에 `<li>` 추가·삭제 |
| `✏️ 소개 글` | 갤러리 소개 문단 |
| `✏️ 사진 교체` | 공간 사진 |
| `✏️ 주소 · 시간 · 오시는 길` | 주소, 관람 시간, 관람료, 문의 |
| `✏️ 링크트리에 있던 항목` | 예약·인스타그램·아카이브 등 바로가기 |

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
