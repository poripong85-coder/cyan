/* CYAN — 홈 (손그림 위): 방명록 · 계절 사진 (data.js 에서 자동) */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, d = C.data;
  var $ = function (id) { return document.getElementById(id); };

  /* 방명록: 그린 네모 안에 최근 글 세 개 ----------------------- */
  var list = d.guestbook || [];
  $('guestList').innerHTML = list.length ? list.slice(0, 3).map(function (g) {
    return '<li><p class="guest-text">' + u.esc(g.text) + '</p>' +
      '<p class="guest-by">— ' + u.esc(g.name) + (g.date ? ', ' + u.dateLabel(g.date, false) : '') + '</p></li>';
  }).join('') : '<li class="guest-empty">아직 남겨진 글이 없어요. 첫 글을 남겨 주세요.</li>';

  /* 남기기 (대화상자) */
  var modal = u.dialog($('guestModal'));
  $('guestOpen').addEventListener('click', function () { modal.open(); $('gName').focus(); });

  var form = $('guestForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('guestMsg');
    msg.textContent = '';
    if (!u.validate(form)) { msg.textContent = '이름과 남기실 말을 적어 주세요.'; return; }

    var btn = $('guestSubmit');
    btn.disabled = true;
    u.submit('[방명록] ' + $('gName').value.trim(), {
      '구분': '방명록',
      '이름': $('gName').value.trim(),
      '남긴 말': $('gText').value.trim()
    }).then(function (how) {
      form.innerHTML = '<p class="guest-thanks">고맙습니다. ' +
        (how === 'mail' ? '메일 앱에 글이 채워졌어요. 보내 주시면 ' : '') +
        '시안에서 읽고 방명록에 옮겨 적을게요.</p>';
    }).catch(function () {
      msg.textContent = '보내지 못했어요. 잠시 후 다시 해 주세요.';
      btn.disabled = false;
    });
  });

  /* 계절별 사진: 사진이 있으면 그린 네모를 채움 (없으면 손글씨 그대로) */
  var m = new Date().getMonth() + 1;
  var key = m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';
  var s = (d.seasons || {})[key] || {};
  if (s.image) {
    $('season').innerHTML = '<img src="' + u.esc(s.image) + '" alt="' + u.esc(s.caption || '') + '">' +
      (s.caption ? '<figcaption>' + u.esc(s.caption) + '</figcaption>' : '');
    $('season').classList.add('has-photo');
  }
})();
