/* CYAN — 공통 스크립트 (헤더 · 메뉴 · 등장 효과 · 공용 도구) */
(function () {
  'use strict';

  var CYAN = window.CYAN = window.CYAN || {};
  var data = CYAN.data || {};
  var site = data.site || {};

  /* 공용 도구 ----------------------------------------------------- */
  var util = CYAN.util = {};

  util.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  util.won = function (n) {
    return Number(n || 0).toLocaleString('ko-KR') + '원';
  };

  util.pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* Date ↔ 'YYYY-MM-DD' (현지 시간 기준) */
  util.iso = function (d) {
    return d.getFullYear() + '-' + util.pad(d.getMonth() + 1) + '-' + util.pad(d.getDate());
  };
  util.parse = function (s) {
    var p = String(s).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  };
  util.today = function () {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  util.addDays = function (d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  };

  var WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  util.week = WEEK;

  /* '2026. 11. 07 (토)' */
  util.dateLabel = function (d, withDay) {
    if (typeof d === 'string') d = util.parse(d);
    var s = d.getFullYear() + '. ' + util.pad(d.getMonth() + 1) + '. ' + util.pad(d.getDate());
    return withDay === false ? s : s + ' (' + WEEK[d.getDay()] + ')';
  };

  /* '2026. 10. 10 — 11. 29' */
  util.rangeLabel = function (a, b) {
    var s = util.parse(a), e = util.parse(b);
    var left = s.getFullYear() + '. ' + util.pad(s.getMonth() + 1) + '. ' + util.pad(s.getDate());
    var right = (e.getFullYear() !== s.getFullYear() ? e.getFullYear() + '. ' : '') +
      util.pad(e.getMonth() + 1) + '. ' + util.pad(e.getDate());
    return left + ' — ' + right;
  };

  /* 전시 상태: 'now' | 'next' | 'past' */
  util.showState = function (ex) {
    var t = util.iso(util.today());
    if (ex.end < t) return 'past';
    if (ex.start > t) return 'next';
    return 'now';
  };

  /* 사진 자리 (이미지가 없으면 빈 액자) */
  util.frame = function (src, alt, mod) {
    return '<div class="frame' + (mod ? ' frame--' + mod : '') + '">' +
      (src ? '<img src="' + util.esc(src) + '" alt="' + util.esc(alt || '') + '" loading="lazy">' : '') +
      '</div>';
  };

  /* 예약 · 주문 신청 보내기
     site.formEndpoint 가 있으면 그 주소로 전송, 없으면 메일 앱을 엽니다.
     반환값: Promise<'sent' | 'mail'> */
  util.submit = function (subject, fields) {
    var lines = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; });

    if (site.formEndpoint) {
      var body = { _subject: subject };
      Object.keys(fields).forEach(function (k) { body[k] = fields[k]; });
      return fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (!res.ok) throw new Error('전송 실패 (' + res.status + ')');
        return 'sent';
      });
    }

    var href = 'mailto:' + encodeURIComponent(site.email || '') +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n') + '\n');
    window.location.href = href;
    return Promise.resolve('mail');
  };

  /* 폼 값 확인: 비어 있는 필수 항목에 표시하고 첫 칸으로 이동 */
  util.validate = function (form) {
    var bad = null;
    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (el) {
      var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '' && el.checkValidity();
      el.closest('.field') && el.closest('.field').classList.toggle('is-bad', !ok);
      if (!ok && !bad) bad = el;
    });
    if (bad) bad.focus();
    return !bad;
  };

  /* 숫자 입력 (− n +) */
  util.stepper = function (root, min, max, onChange) {
    var out = root.querySelector('output');
    var dec = root.querySelector('[data-step="-1"]');
    var inc = root.querySelector('[data-step="1"]');
    var api = {
      value: Math.max(min, +out.textContent || min),
      set: function (v, lo, hi, silent) {
        if (lo != null) min = lo;
        if (hi != null) max = hi;
        api.value = Math.min(max, Math.max(min, v));
        out.textContent = api.value;
        dec.disabled = api.value <= min;
        inc.disabled = api.value >= max;
        if (onChange && !silent) onChange(api.value);
      }
    };
    dec.addEventListener('click', function () { api.set(api.value - 1); });
    inc.addEventListener('click', function () { api.set(api.value + 1); });
    api.set(api.value, null, null, true);
    return api;
  };

  /* 대화상자 (<dialog>) — 닫기 버튼 · 바깥 클릭 */
  util.dialog = function (el) {
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.closest('[data-close]')) el.close();
    });
    el.addEventListener('close', function () { document.body.style.overflow = ''; });
    return {
      open: function () {
        if (typeof el.showModal === 'function') el.showModal(); else el.setAttribute('open', '');
        document.body.style.overflow = 'hidden';
      },
      close: function () { el.close(); }
    };
  };

  /* 장바구니 (브라우저에 저장) ----------------------------------- */
  var CART_KEY = 'cyan-cart';
  var cart = CYAN.cart = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
    },
    write: function (items) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* 저장 불가 */ }
      cart.badge();
    },
    count: function () {
      return cart.read().reduce(function (n, it) { return n + it.qty; }, 0);
    },
    badge: function () {
      var n = cart.count();
      document.querySelectorAll('[data-cart-count]').forEach(function (el) {
        el.textContent = n;
        el.hidden = n === 0;
      });
    }
  };

  /* 헤더: 스크롤하면 배경이 생김 --------------------------------- */
  var head = document.getElementById('siteHead');
  var onScroll = function () {
    head.classList.toggle('is-stuck', window.scrollY > 24 || document.body.classList.contains('page'));
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 모바일 메뉴 --------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mobileNav');

  var setNav = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      nav.hidden = false;
      requestAnimationFrame(function () { nav.classList.add('is-open'); });
    } else {
      nav.classList.remove('is-open');
      setTimeout(function () {
        if (!nav.classList.contains('is-open')) nav.hidden = true;
      }, 350);
    }
  };

  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setNav(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && toggle.getAttribute('aria-expanded') === 'true') setNav(false);
  });

  /* 스크롤 등장 --------------------------------------------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }) : null;

  /* 새로 그려진 요소에도 쓸 수 있도록 공개 */
  util.reveal = function (root) {
    var items = (root || document).querySelectorAll('.reveal:not(.is-in)');
    items.forEach(function (el, i) {
      if (!io) { el.classList.add('is-in'); return; }
      el.style.transitionDelay = (Math.min(i % 4, 3) * 90) + 'ms';
      io.observe(el);
    });
  };

  /* 공통 정보 채우기 (data-site="email" 등) ---------------------- */
  document.querySelectorAll('[data-site]').forEach(function (el) {
    var key = el.getAttribute('data-site');
    var v = site[key];
    if (!v) return;
    if (key === 'email') { el.textContent = v; el.href = 'mailto:' + v; }
    else if (key === 'phone') { el.textContent = v; el.href = 'tel:' + v.replace(/[^0-9+]/g, ''); }
    else if (key === 'instagram') { el.textContent = '@' + v + ' ↗'; el.href = 'https://instagram.com/' + v; }
    else if (key === 'mapUrl') { el.href = v; }
    else el.textContent = v;
  });

  /* 푸터 연도 ----------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  cart.badge();
  window.addEventListener('storage', function (e) { if (e.key === CART_KEY) cart.badge(); });

  /* 페이지 스크립트가 그린 뒤에도 한 번 더 */
  document.addEventListener('DOMContentLoaded', function () { util.reveal(); });
  util.reveal();
})();
