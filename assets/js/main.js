/* CYAN — craft · stay · gallery */
(function () {
  'use strict';

  /* 헤더: 스크롤하면 배경이 생김 --------------------------------- */
  var head = document.getElementById('siteHead');
  var onScroll = function () {
    head.classList.toggle('is-stuck', window.scrollY > 24);
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
  var items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 90) + 'ms';
      io.observe(el);
    });
  }

  /* 공방: 제품 분류 필터 ------------------------------------------ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var products = document.querySelectorAll('.product');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      products.forEach(function (p) {
        p.hidden = !(cat === 'all' || p.getAttribute('data-category') === cat);
      });
    });
  });

  /* 북스테이: 요금 계산 + 예약 페이지로 이동 ----------------------- */
  var booking = document.getElementById('booking');

  if (booking) {
    var bkRoom = document.getElementById('bkRoom');
    var bkIn = document.getElementById('bkIn');
    var bkOut = document.getElementById('bkOut');
    var bkSum = document.getElementById('bkSum');

    var iso = function (d) {
      var z = function (n) { return (n < 10 ? '0' : '') + n; };
      return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
    };
    var parse = function (v) {
      var p = v.split('-');
      return new Date(+p[0], +p[1] - 1, +p[2]);
    };
    var won = function (n) { return n.toLocaleString('ko-KR') + '원'; };
    var roomEl = function () {
      return document.querySelector('.room[data-room="' + bkRoom.value + '"]');
    };

    var today = new Date();
    bkIn.min = iso(today);
    bkOut.min = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

    var nights = function () {
      if (!bkIn.value || !bkOut.value) return 0;
      return Math.round((parse(bkOut.value) - parse(bkIn.value)) / 864e5);
    };

    var update = function () {
      if (bkIn.value) {
        var d = parse(bkIn.value);
        var next = iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
        bkOut.min = next;
        if (!bkOut.value || bkOut.value < next) bkOut.value = next;
      }
      var n = nights();
      var room = roomEl();
      if (n > 0 && room) {
        var price = +room.getAttribute('data-price') || 0;
        bkSum.innerHTML = n + '박 · 예상 요금<b>' + won(price * n) + '</b>';
      } else {
        bkSum.textContent = '날짜를 선택하면 요금이 계산됩니다.';
      }
    };

    [bkRoom, bkIn, bkOut].forEach(function (el) { el.addEventListener('change', update); });

    booking.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [bkIn, bkOut].forEach(function (el) {
        var bad = !el.value;
        el.classList.toggle('is-invalid', bad);
        if (bad) ok = false;
      });
      if (!ok || nights() < 1) {
        bkSum.textContent = '체크인·체크아웃 날짜를 확인해 주세요.';
        (bkIn.value ? bkOut : bkIn).focus();
        return;
      }
      var url = (roomEl() && roomEl().getAttribute('data-book')) || '#';
      if (url === '#') {
        bkSum.textContent = '예약 링크가 아직 연결되지 않았어요. 곧 열릴 예정입니다.';
        return;
      }
      window.open(url, '_blank', 'noopener') || (location.href = url);
    });

    update();
  }

  /* 갤러리: 제휴 문의 -------------------------------------------- */
  var inquiry = document.getElementById('inquiry');

  if (inquiry) {
    var msg = document.getElementById('inqMsg');
    var setMsg = function (text, kind) {
      msg.textContent = text;
      msg.className = 'form-msg' + (kind ? ' is-' + kind : '');
    };

    inquiry.addEventListener('submit', function (e) {
      e.preventDefault();

      var first = null;
      inquiry.querySelectorAll('[required]').forEach(function (el) {
        var bad = el.type === 'checkbox' ? !el.checked : !el.value.trim() || !el.checkValidity();
        (el.type === 'checkbox' ? el.closest('.check') : el).classList.toggle('is-invalid', bad);
        if (bad && !first) first = el;
      });
      if (first) {
        setMsg('* 표시된 항목과 개인정보 동의를 확인해 주세요.', 'err');
        first.focus();
        return;
      }

      var data = new FormData(inquiry);
      var endpoint = inquiry.getAttribute('data-endpoint');

      if (endpoint) {
        var btn = inquiry.querySelector('button[type="submit"]');
        btn.disabled = true;
        setMsg('보내는 중…');
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            inquiry.reset();
            setMsg('문의가 접수되었습니다. 3영업일 안에 답장 드릴게요.', 'ok');
          })
          .catch(function () {
            setMsg('전송에 실패했어요. 잠시 후 다시 시도하거나 이메일로 보내 주세요.', 'err');
          })
          .then(function () { btn.disabled = false; });
        return;
      }

      var labels = { name: '이름', org: '소속', email: '이메일', phone: '연락처', type: '문의 유형', period: '희망 시기', message: '내용' };
      var body = Object.keys(labels).map(function (k) {
        return '[' + labels[k] + '] ' + (data.get(k) || '-');
      }).join('\n');
      var subject = '[CYAN 제휴 문의] ' + data.get('type') + ' — ' + data.get('name');
      location.href = 'mailto:' + inquiry.getAttribute('data-mail') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      setMsg('메일 앱이 열리면 내용을 확인하고 보내 주세요.', 'ok');
    });

    inquiry.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid')) e.target.classList.remove('is-invalid');
    });
    inquiry.addEventListener('change', function (e) {
      var c = e.target.closest('.check');
      if (c) c.classList.remove('is-invalid');
    });
  }

  /* 푸터 연도 ----------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
