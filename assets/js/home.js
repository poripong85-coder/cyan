/* 시안 — 홈 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ───────── 지도 : 범례와 장소 서로 하이라이트 ───────── */
  var all = $$('[data-place]');
  var light = function (name) {
    all.forEach(function (el) { el.classList.toggle('is-on', el.getAttribute('data-place') === name); });
  };
  all.forEach(function (el) {
    var name = el.getAttribute('data-place');
    ['mouseenter', 'focus'].forEach(function (ev) { el.addEventListener(ev, function () { light(name); }); });
    ['mouseleave', 'blur'].forEach(function (ev) { el.addEventListener(ev, function () { light(null); }); });
    // 아직 페이지가 없는 곳(href="#")은 이동하지 않고 지도에서만 표시
    el.addEventListener('click', function (e) {
      var href = el.getAttribute('href');
      if (!href || href === '#') { e.preventDefault(); light(name); }
    });
  });

  // 모바일에서는 범례가 지도 위로 올라가므로, 그림 부분만 잘라서 크게 보여줌
  var art = $('.map-art');
  var mq = window.matchMedia('(max-width:720px)');
  var fit = function () { art.setAttribute('viewBox', mq.matches ? '320 140 380 420' : '0 0 900 600'); };
  fit();
  (mq.addEventListener ? mq.addEventListener('change', fit) : mq.addListener(fit));

  /* ───────── 방명록 ─────────
     지금은 방문자 브라우저에만 저장됩니다(다른 사람에게는 보이지 않음).
     여러 사람이 함께 보는 방명록으로 바꾸려면 README 를 참고하세요. */
  var KEY = 'sian-guestbook';
  var list = $('#guestList');
  var form = $('#guestForm');

  var load = function () {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  };
  var save = function (items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* 저장 불가 환경 */ }
  };
  var fmt = function (t) {
    var d = new Date(t);
    return d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate();
  };
  var render = function () {
    var items = load();
    list.textContent = '';
    if (!items.length) {
      var empty = document.createElement('li');
      empty.className = 'guest-empty';
      empty.textContent = '첫 번째 이야기를 남겨주세요.';
      list.appendChild(empty);
      return;
    }
    items.forEach(function (it) {
      var li = document.createElement('li');
      var who = document.createElement('span'); who.className = 'who'; who.textContent = it.name;
      var when = document.createElement('span'); when.className = 'when'; when.textContent = fmt(it.t);
      var p = document.createElement('p'); p.textContent = it.msg;
      li.append(who, when, p);
      list.appendChild(li);
    });
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var msg = form.msg.value.trim();
    if (!name || !msg) return;
    var items = load();
    items.unshift({ name: name, msg: msg, t: Date.now() });
    save(items.slice(0, 100));
    form.reset();
    render();
  });
  render();

  /* ───────── 계절별 사진 ───────── */
  var doodles = {
    spring: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="4"/><path d="M24 20c-4-8 4-12 0-14-4 2 4 6 0 14M28 24c8-4 12 4 14 0-2-4-6 4-14 0M24 28c4 8-4 12 0 14 4-2-4-6 0-14M20 24c-8 4-12-4-14 0 2 4 6-4 14 0"/></svg>',
    summer: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="8"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"/></svg>',
    autumn: '<svg viewBox="0 0 48 48"><path d="M12 38C10 22 22 8 40 8c0 18-12 30-28 30Z"/><path d="M8 42l26-26M20 30h8M24 24v-6"/></svg>',
    winter: '<svg viewBox="0 0 48 48"><path d="M24 4v40M7 14l34 20M41 14L7 34M19 8l5 5 5-5M19 40l5-5 5 5M8 21l7-1-2-7M40 27l-7 1 2 7M40 21l-7-1 2-7M8 27l7 1-2 7"/></svg>'
  };
  var names = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' };
  var frame = $('.season-frame');
  var img = $('#seasonImg');
  var tabs = $$('.season-tabs button');

  var show = function (s) {
    tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-season') === s)); });
    $('#seasonDoodle').innerHTML = doodles[s];
    frame.classList.remove('has-photo');
    img.alt = '시안의 ' + names[s];
    img.onload = function () { frame.classList.add('has-photo'); };
    img.onerror = function () { frame.classList.remove('has-photo'); };
    img.src = 'assets/img/seasons/' + s + '.jpg';
  };
  tabs.forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-season')); });
  });
  var m = new Date().getMonth() + 1;
  show(m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter');

  $('#year').textContent = new Date().getFullYear();
})();
