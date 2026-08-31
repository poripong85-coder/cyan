/* CYAN — gallery house */
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

  /* 푸터 연도 ----------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
