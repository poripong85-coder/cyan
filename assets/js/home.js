/* CYAN — 첫 화면: 지금 전시 · 새 시리즈 (data.js 에서 자동) */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, d = C.data;

  /* 지금 전시 (없으면 다음 전시) --------------------------------- */
  var showEl = document.getElementById('homeShow');
  var list = d.exhibitions.slice();
  var ex = list.filter(function (e) { return u.showState(e) === 'now'; })[0] ||
    list.filter(function (e) { return u.showState(e) === 'next'; })
      .sort(function (a, b) { return a.start < b.start ? -1 : 1; })[0];

  if (showEl && ex) {
    var upcoming = u.showState(ex) === 'next';
    showEl.innerHTML =
      '<article class="show reveal">' +
        '<div class="show-visual">' + u.frame(ex.image, ex.title, 'tall') + '</div>' +
        '<div class="show-body">' +
          '<p class="show-meta">' + (upcoming ? '예정 · ' : '') + u.rangeLabel(ex.start, ex.end) + '</p>' +
          '<h3 class="show-title">' + u.esc(ex.title) + '</h3>' +
          '<p class="show-artist">' + u.esc(ex.artist) + '</p>' +
          '<p class="show-text">' + u.esc(ex.text || ex.summary) + '</p>' +
          '<div class="show-actions">' +
            '<a class="btn" href="gallery.html">전시 보기</a>' +
            '<a class="btn btn--ghost" href="gallery.html#archive">지난 전시</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  } else if (showEl) {
    showEl.innerHTML = '<p class="empty reveal">다음 전시를 준비하고 있습니다.</p>';
  }

  /* 새 시리즈: 판매 중인 첫 시리즈의 제품 세 개 ----------------- */
  var shopEl = document.getElementById('homeShop');
  var series = d.series.filter(function (s) { return s.status !== 'archive'; })[0];

  if (shopEl && series) {
    var items = d.products.filter(function (p) { return p.series === series.id; }).slice(0, 3);
    shopEl.innerHTML =
      '<div class="series-head reveal">' +
        '<p class="series-no">No.' + u.esc(series.no) + ' · ' + u.esc(series.year) + '</p>' +
        '<h3 class="series-name">' + u.esc(series.name) + ' <em>' + u.esc(series.en) + '</em></h3>' +
        '<p class="series-text">' + u.esc(series.summary) + '</p>' +
      '</div>' +
      '<ul class="products">' + items.map(function (p) {
        return '<li class="product reveal"><a href="shop.html#' + u.esc(p.id) + '">' +
          u.frame(p.image, p.name) +
          '<p class="product-name">' + u.esc(p.name) + '</p>' +
          '<p class="product-price">' + (p.soldOut ? '<s>' + u.won(p.price) + '</s> 품절' : u.won(p.price)) + '</p>' +
        '</a></li>';
      }).join('') + '</ul>' +
      '<div class="show-actions reveal"><a class="btn btn--ghost" href="shop.html">전체 시리즈 보기</a></div>';
  }
})();
