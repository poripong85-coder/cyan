/* CYAN — 표지 · 차례: 지금 걸린 전시와 새 시리즈를 차례에 적어 넣음 (data.js 에서 자동) */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, d = C.data;

  /* 4장: 지금 걸린 전시 (없으면 다음 전시) */
  var gal = document.getElementById('tocGallery');
  var now = d.exhibitions.filter(function (e) { return u.showState(e) === 'now'; })[0];
  var next = d.exhibitions.filter(function (e) { return u.showState(e) === 'next'; })
    .sort(function (a, b) { return a.start < b.start ? -1 : 1; })[0];
  if (gal && now) gal.textContent = '지금 걸린 전시 〈' + now.title + '〉 · 지난 전시';
  else if (gal && next) gal.textContent = '다음 전시 〈' + next.title + '〉 · 지난 전시';

  /* 5장: 판매 중인 시리즈 이름 */
  var shop = document.getElementById('tocShop');
  var open = d.series.filter(function (s) { return s.status !== 'archive'; })
    .map(function (s) { return s.name; });
  if (shop && open.length) shop.textContent = open.join(' · ') + ' · 지난 시리즈';
})();
