/* CYAN — 시안 갤러리: 지금 전시 · 예정 전시 · 지난 전시 아카이브 */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util;
  var $ = function (id) { return document.getElementById(id); };

  var all = C.data.exhibitions.slice().sort(function (a, b) { return a.start < b.start ? 1 : -1; });
  var by = { now: [], next: [], past: [] };
  all.forEach(function (ex) { by[u.showState(ex)].push(ex); });
  by.next.reverse(); // 가까운 순서

  /* 지금 전시 ------------------------------------------------------ */
  $('galNow').innerHTML = by.now.length ? by.now.map(function (ex) {
    return '<article class="show reveal">' +
      '<div class="show-visual">' + u.frame(ex.image, ex.title, 'tall') + '</div>' +
      '<div class="show-body">' +
        '<p class="show-meta">' + u.rangeLabel(ex.start, ex.end) + '</p>' +
        '<h3 class="show-title">' + u.esc(ex.title) + '</h3>' +
        '<p class="show-artist">' + u.esc(ex.artist) + '</p>' +
        '<p class="show-text">' + u.esc(ex.text || ex.summary) + '</p>' +
        '<div class="show-actions">' +
          '<a class="btn" href="about.html#visit">관람 안내</a>' +
          '<a class="btn btn--ghost" href="shop.html">전시 연계 제품</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('') : '<p class="empty reveal">지금은 다음 전시를 준비하고 있습니다.</p>';

  /* 예정 전시 ------------------------------------------------------ */
  if (by.next.length) {
    $('next').hidden = false;
    $('galNext').innerHTML = by.next.map(function (ex) {
      return '<li>' +
        '<span class="showlist-date">' + ex.start.slice(0, 7).replace('-', '. ') + '</span>' +
        '<span class="showlist-title">' + u.esc(ex.title) + '</span>' +
        '<span class="showlist-artist">' + u.esc(ex.artist) + '</span>' +
        '<span class="showlist-state">예정</span>' +
      '</li>';
    }).join('');
  }

  /* 지난 전시 아카이브 --------------------------------------------- */
  var years = [];
  by.past.forEach(function (ex) {
    var y = ex.start.slice(0, 4);
    if (years.indexOf(y) === -1) years.push(y);
  });

  var tabs = $('galYears');
  tabs.innerHTML = ['all'].concat(years).map(function (y, i) {
    return '<button type="button" role="tab" data-year="' + y + '" aria-selected="' + (i === 0) + '">' +
      (y === 'all' ? '전체' : y) + '</button>';
  }).join('');

  var archive = function (year) {
    var list = by.past.filter(function (ex) { return year === 'all' || ex.start.slice(0, 4) === year; });
    $('galArchive').innerHTML = list.length ? list.map(function (ex) {
      return '<li class="archive-item reveal">' +
        '<button type="button" data-show="' + u.esc(ex.id) + '">' +
          u.frame(ex.image, ex.title) +
          '<span class="archive-date">' + u.rangeLabel(ex.start, ex.end) + '</span>' +
          '<span class="archive-title">' + u.esc(ex.title) + '</span>' +
          '<span class="archive-artist">' + u.esc(ex.artist) + '</span>' +
        '</button>' +
      '</li>';
    }).join('') : '<li class="empty">아직 지난 전시가 없습니다.</li>';
    u.reveal($('galArchive'));
  };

  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-year]');
    if (!b) return;
    tabs.querySelectorAll('[data-year]').forEach(function (t) { t.setAttribute('aria-selected', String(t === b)); });
    archive(b.getAttribute('data-year'));
  });

  archive('all');

  /* 전시 자세히 ---------------------------------------------------- */
  var modal = u.dialog($('galModal'));

  var openShow = function (id) {
    var ex = all.filter(function (x) { return x.id === id; })[0];
    if (!ex) return;
    $('galModalBody').innerHTML =
      u.frame(ex.image, ex.title, 'wide') +
      '<p class="show-meta">' + u.rangeLabel(ex.start, ex.end) + '</p>' +
      '<h2 class="modal-title" id="galModalTitle">' + u.esc(ex.title) + '</h2>' +
      '<p class="show-artist">' + u.esc(ex.artist) + '</p>' +
      '<p class="show-text">' + u.esc(ex.text || ex.summary) + '</p>';
    modal.open();
  };

  $('galArchive').addEventListener('click', function (e) {
    var b = e.target.closest('[data-show]');
    if (b) openShow(b.getAttribute('data-show'));
  });

  if (location.hash.length > 1) openShow(decodeURIComponent(location.hash.slice(1)));
})();
