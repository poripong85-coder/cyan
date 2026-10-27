/* CYAN — 시안 공방: 클래스 소개 · 일정 선택 · 예약 신청 */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, W = C.data.workshop;
  var $ = function (id) { return document.getElementById(id); };

  var state = { cls: W.classes[0], slot: null, people: 1 };

  var clsById = function (id) {
    return W.classes.filter(function (c) { return c.id === id; })[0];
  };

  /* 반복 일정 + 추가 회차 → 앞으로 열리는 회차 목록 */
  var sessions = function (c) {
    var now = new Date();
    var today = u.today();
    var end = u.addDays(today, (W.weeksAhead || 6) * 7);
    var keys = {};

    for (var d = today; d <= end; d = u.addDays(d, 1)) {
      if (c.schedule.days.indexOf(d.getDay()) === -1) continue;
      c.schedule.times.forEach(function (t) { keys[u.iso(d) + ' ' + t] = true; });
    }
    (c.extra || []).forEach(function (k) { keys[k] = true; });
    (c.off || []).forEach(function (k) { delete keys[k]; });

    return Object.keys(keys).sort().map(function (k) {
      var p = k.split(' '), hm = p[1].split(':');
      var at = u.parse(p[0]);
      at.setHours(+hm[0], +hm[1]);
      return { key: k, date: p[0], time: p[1], at: at, full: (c.soldOut || []).indexOf(k) !== -1 };
    }).filter(function (s) { return s.at > now && s.at <= u.addDays(end, 1); });
  };

  var scheduleText = function (c) {
    return '매주 ' + c.schedule.days.map(function (i) { return u.week[i]; }).join(' · ') + ' ' + c.schedule.times.join(' · ');
  };

  /* 클래스 소개 ---------------------------------------------------- */
  $('wsClasses').innerHTML = W.classes.map(function (c, i) {
    return '<article class="room reveal' + (i % 2 ? ' room--flip' : '') + '">' +
      '<div class="room-visual">' + u.frame(c.image, c.name, 'wide') + '</div>' +
      '<div class="room-body">' +
        '<p class="tile-no">' + u.pad(i + 1) + ' · ' + u.esc(c.en) + '</p>' +
        '<h2 class="room-name">' + u.esc(c.name) + '</h2>' +
        '<p class="room-text">' + u.esc(c.summary) + '</p>' +
        '<dl class="room-meta">' +
          '<div><dt>일정</dt><dd>' + scheduleText(c) + '</dd></div>' +
          '<div><dt>시간</dt><dd>' + u.esc(c.duration) + ' · 정원 ' + c.capacity + '명</dd></div>' +
          '<div><dt>수강료</dt><dd>1인 ' + u.won(c.price) + '</dd></div>' +
          '<div><dt>포함</dt><dd>' + c.includes.map(u.esc).join(' · ') + '</dd></div>' +
        '</dl>' +
        '<div class="show-actions"><a class="btn" href="#book" data-class="' + u.esc(c.id) + '">이 클래스 예약하기</a>' +
        '<span class="chip">' + u.esc(c.level) + '</span></div>' +
      '</div>' +
    '</article>';
  }).join('');

  $('wsNotice').innerHTML = (W.notice || []).map(function (t) { return '<li>' + u.esc(t) + '</li>'; }).join('');

  /* 클래스 고르기 -------------------------------------------------- */
  $('wsPick').innerHTML = W.classes.map(function (c, i) {
    return '<label class="pick-item">' +
      '<input type="radio" name="cls" value="' + u.esc(c.id) + '"' + (i === 0 ? ' checked' : '') + '>' +
      '<span class="pick-box">' +
        '<span class="pick-name">' + u.esc(c.name) + '</span>' +
        '<span class="pick-sub">' + u.esc(c.duration) + ' · 정원 ' + c.capacity + '명</span>' +
        '<span class="pick-price">' + u.won(c.price) + '</span>' +
      '</span>' +
    '</label>';
  }).join('');

  var people = u.stepper($('wsPeople'), 1, state.cls.capacity, function (v) {
    state.people = v;
    summary();
  });

  var setClass = function (id) {
    var c = clsById(id);
    if (!c) return;
    state.cls = c;
    state.slot = null;
    var radio = document.querySelector('#wsPick input[value="' + id + '"]');
    if (radio) radio.checked = true;
    $('wsPeopleHelp').textContent = '한 회차 정원 ' + c.capacity + '명 · 남은 자리는 신청 후 확인해 드립니다.';
    people.set(Math.min(state.people, c.capacity), 1, c.capacity);
    slots();
  };

  $('wsPick').addEventListener('change', function (e) {
    if (e.target.name === 'cls') setClass(e.target.value);
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-class]');
    if (a) setClass(a.getAttribute('data-class'));
  });

  /* 일정 ----------------------------------------------------------- */
  var slots = function () {
    var list = sessions(state.cls);
    var byDate = {};
    list.forEach(function (s) { (byDate[s.date] = byDate[s.date] || []).push(s); });
    var dates = Object.keys(byDate);

    $('wsSlots').innerHTML = dates.length ? dates.map(function (date) {
      return '<div class="slots-row">' +
        '<p class="slots-date">' + u.dateLabel(date) + '</p>' +
        '<div class="slots-times">' + byDate[date].map(function (s) {
          var sel = state.slot && state.slot.key === s.key;
          return '<button type="button" class="slot' + (sel ? ' is-sel' : '') + '" data-slot="' + s.key + '"' +
            (s.full ? ' disabled' : '') + ' aria-pressed="' + sel + '"' +
            ' aria-label="' + u.dateLabel(date) + ' ' + s.time + (s.full ? ', 마감' : '') + '">' +
            s.time + (s.full ? ' <em>마감</em>' : '') + '</button>';
        }).join('') + '</div>' +
      '</div>';
    }).join('') : '<p class="empty">지금은 열린 일정이 없습니다. 인스타그램에서 다음 일정을 안내드릴게요.</p>';

    summary();
  };

  $('wsSlots').addEventListener('click', function (e) {
    var b = e.target.closest('[data-slot]');
    if (!b || b.disabled) return;
    var key = b.getAttribute('data-slot');
    state.slot = sessions(state.cls).filter(function (s) { return s.key === key; })[0] || null;
    slots();
    var again = $('wsSlots').querySelector('[data-slot="' + key + '"]');
    if (again) again.focus();
  });

  /* 요약 ----------------------------------------------------------- */
  var sumPairs = function () {
    var c = state.cls, s = state.slot;
    return [
      ['클래스', u.esc(c.name)],
      ['일정', s ? u.dateLabel(s.date) + ' ' + s.time : '—'],
      ['소요 시간', u.esc(c.duration)],
      ['인원', state.people + '명'],
      [u.won(c.price) + ' × ' + state.people, u.won(c.price * state.people), 'sum-sub'],
      ['합계', u.won(c.price * state.people), 'sum-total']
    ];
  };

  var rows = function (pairs) {
    return pairs.map(function (p) {
      return '<div' + (p[2] ? ' class="' + p[2] + '"' : '') + '><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd></div>';
    }).join('');
  };

  var summary = function () {
    $('wsSum').innerHTML = rows(sumPairs());
    $('wsSubmit').disabled = !state.slot;
  };

  /* 신청 ----------------------------------------------------------- */
  var form = $('wsForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('wsMsg');
    msg.textContent = '';
    if (!state.slot) { msg.textContent = '일정을 먼저 골라주세요.'; return; }
    if (!u.validate(form)) { msg.textContent = '표시된 항목을 확인해 주세요.'; return; }

    var c = state.cls, s = state.slot;
    var btn = $('wsSubmit');
    btn.disabled = true;
    btn.textContent = '보내는 중…';

    u.submit('[공방 클래스] ' + s.date + ' ' + s.time + ' ' + c.name + ' · ' + $('wName').value.trim(), {
      '구분': '시안 공방 클래스 예약',
      '클래스': c.name,
      '일정': u.dateLabel(s.date) + ' ' + s.time,
      '인원': state.people + '명',
      '금액': u.won(c.price * state.people),
      '이름': $('wName').value.trim(),
      '연락처': $('wPhone').value.trim(),
      '요청 사항': $('wMemo').value.trim() || '-'
    }).then(function (how) {
      $('wsDoneSum').innerHTML = rows(sumPairs());
      $('wsDoneText').textContent = (how === 'mail'
        ? '메일 앱에 신청 내용이 채워졌습니다. 메일을 보내주시면 접수됩니다. '
        : '') + '자리를 확인한 뒤 ' + $('wPhone').value.trim() + ' 번호로 안내 문자를 드립니다. ' +
        '안내를 받으시면 ' + C.data.site.bankAccount + ' 으로 수강료를 입금해 주세요.';
      form.hidden = true;
      $('wsDone').hidden = false;
      $('wsDone').focus();
    }).catch(function (err) {
      msg.textContent = '보내지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요. (' + err.message + ')';
      btn.disabled = false;
      btn.textContent = '예약 신청하기';
    });
  });

  setClass(state.cls.id);
})();
