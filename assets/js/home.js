/* CYAN — 홈: 방명록 (남긴 글 · 쓰는 칸) · 계절 사진 (data.js 에서 자동) */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, d = C.data;
  var $ = function (id) { return document.getElementById(id); };

  /* 남긴 글: 최근 글을 쪽지로 ----------------------------------- */
  var list = d.guestbook || [];
  $('guestList').innerHTML = list.length ? list.slice(0, 6).map(function (g, i) {
    return '<li class="note note--' + (i % 3) + '">' +
      '<p class="note-text">' + u.esc(g.text) + '</p>' +
      '<p class="note-by">' + u.esc(g.name) + (g.date ? ' · ' + u.dateLabel(g.date, false) : '') + '</p>' +
    '</li>';
  }).join('') : '<li class="note note--empty">아직 남겨진 글이 없어요.<br>첫 글을 남겨 주세요.</li>';

  /* 쓰는 칸 ------------------------------------------------------ */
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

  /* 계절별 사진 -------------------------------------------------- */
  var m = new Date().getMonth() + 1;
  var key = m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';
  var s = (d.seasons || {})[key] || {};
  $('season').innerHTML = s.image
    ? '<img src="' + u.esc(s.image) + '" alt="' + u.esc(s.caption || '') + '"><figcaption>' + u.esc(s.caption || '') + '</figcaption>'
    : '<span class="hp-season-cap">' + u.esc(s.caption || '계절의 시안') + '</span><small>사진을 준비하고 있어요</small>';
})();
