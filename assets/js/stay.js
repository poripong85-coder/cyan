/* CYAN — 시안북스테이: 객실 소개 · 날짜 선택 · 예약 신청 */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, S = C.data.stay;
  var $ = function (id) { return document.getElementById(id); };

  var today = u.today();
  var lastDay = new Date(today.getFullYear(), today.getMonth() + (S.openMonths || 3), today.getDate());
  var closed = {};
  (S.closed || []).forEach(function (d) { closed[d] = true; });

  var state = {
    room: S.rooms[0],
    ci: null,          // 체크인 Date
    co: null,          // 체크아웃 Date
    month: new Date(today.getFullYear(), today.getMonth(), 1),
    guests: S.rooms[0].capacity
  };

  var roomById = function (id) {
    return S.rooms.filter(function (r) { return r.id === id; })[0];
  };

  /* 그 날 밤에 묵을 수 있는지 */
  var nightOpen = function (d) {
    var k = u.iso(d);
    if (d < today || d >= lastDay || closed[k]) return false;
    return (S.booked[state.room.id] || []).indexOf(k) === -1;
  };

  /* ci 부터 co 전날까지 모두 비어 있는지 */
  var rangeOpen = function (ci, co) {
    for (var d = ci; d < co; d = u.addDays(d, 1)) if (!nightOpen(d)) return false;
    return true;
  };

  var nights = function () {
    return state.ci && state.co ? Math.round((state.co - state.ci) / 864e5) : 0;
  };

  var isWeekend = function (d) { return S.weekendDays.indexOf(d.getDay()) !== -1; };

  var price = function () {
    var r = state.room, wd = 0, we = 0;
    if (!state.co) return null;
    for (var d = state.ci; d < state.co; d = u.addDays(d, 1)) isWeekend(d) ? we++ : wd++;
    var extra = Math.max(0, state.guests - r.capacity);
    return {
      wd: wd, we: we, extra: extra,
      total: wd * r.weekday + we * r.weekend + extra * r.extraPerson * (wd + we)
    };
  };

  /* 객실 소개 ------------------------------------------------------ */
  $('stayRooms').innerHTML = S.rooms.map(function (r, i) {
    return '<article class="room reveal' + (i % 2 ? ' room--flip' : '') + '">' +
      '<div class="room-visual">' + u.frame(r.image, r.name, 'wide') + '</div>' +
      '<div class="room-body">' +
        '<p class="tile-no">' + u.pad(i + 1) + ' · ' + u.esc(r.en) + '</p>' +
        '<h2 class="room-name">' + u.esc(r.name) + '</h2>' +
        '<p class="room-text">' + u.esc(r.summary) + '</p>' +
        '<ul class="dots">' + r.features.map(function (f) { return '<li>' + u.esc(f) + '</li>'; }).join('') + '</ul>' +
        '<dl class="room-meta">' +
          '<div><dt>인원</dt><dd>기준 ' + r.capacity + '인 · 최대 ' + r.maxCapacity + '인</dd></div>' +
          '<div><dt>1박</dt><dd>평일 ' + u.won(r.weekday) + ' · 주말 ' + u.won(r.weekend) + '</dd></div>' +
        '</dl>' +
        '<div class="show-actions"><a class="btn" href="#book" data-room="' + u.esc(r.id) + '">이 방 예약하기</a></div>' +
      '</div>' +
    '</article>';
  }).join('');

  $('stayTimes').textContent = '체크인 ' + S.checkIn + ' · 체크아웃 ' + S.checkOut;
  $('stayIncluded').innerHTML = (S.included || []).map(function (t) { return '<li>' + u.esc(t) + '</li>'; }).join('');
  $('stayNotice').innerHTML = (S.notice || []).map(function (t) { return '<li>' + u.esc(t) + '</li>'; }).join('');

  /* 객실 고르기 ---------------------------------------------------- */
  $('stayPick').innerHTML = S.rooms.map(function (r, i) {
    return '<label class="pick-item">' +
      '<input type="radio" name="room" value="' + u.esc(r.id) + '"' + (i === 0 ? ' checked' : '') + '>' +
      '<span class="pick-box">' +
        '<span class="pick-name">' + u.esc(r.name) + '</span>' +
        '<span class="pick-sub">' + u.esc(r.en) + ' · 최대 ' + r.maxCapacity + '인</span>' +
        '<span class="pick-price">' + u.won(r.weekday) + '~</span>' +
      '</span>' +
    '</label>';
  }).join('');

  var guests = u.stepper($('stayGuests'), 1, state.room.maxCapacity, function (v) {
    state.guests = v;
    summary();
  });

  var setRoom = function (id) {
    var r = roomById(id);
    if (!r) return;
    state.room = r;
    var radio = document.querySelector('#stayPick input[value="' + id + '"]');
    if (radio) radio.checked = true;
    /* 바뀐 방에서 이미 고른 날짜를 쓸 수 없으면 다시 고르기 */
    if (state.ci && !nightOpen(state.ci)) { state.ci = state.co = null; }
    else if (state.co && !rangeOpen(state.ci, state.co)) { state.co = null; }
    $('stayGuestHelp').textContent = '기준 ' + r.capacity + '인 · 최대 ' + r.maxCapacity + '인 · 기준 인원 초과 시 1인당 1박 ' + u.won(r.extraPerson);
    guests.set(Math.min(state.guests, r.maxCapacity), 1, r.maxCapacity);
    calendar();
  };

  $('stayPick').addEventListener('change', function (e) { setRoom(e.target.value); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-room]');
    if (a) setRoom(a.getAttribute('data-room'));
  });

  /* 달력 ----------------------------------------------------------- */
  var wide = window.matchMedia('(min-width: 760px)');

  var monthHtml = function (first) {
    var y = first.getFullYear(), m = first.getMonth();
    var html = '<div class="cal-month"><p class="cal-title">' + y + '. ' + u.pad(m + 1) + '</p>' +
      '<div class="cal-grid" role="grid">' +
      u.week.map(function (w, i) { return '<span class="cal-wd' + (i === 0 ? ' is-sun' : '') + '">' + w + '</span>'; }).join('');

    for (var i = 0; i < first.getDay(); i++) html += '<span></span>';

    var choosingOut = state.ci && !state.co;
    var days = new Date(y, m + 1, 0).getDate();

    for (var day = 1; day <= days; day++) {
      var d = new Date(y, m, day);
      var k = u.iso(d);
      var open = nightOpen(d);
      var asOut = choosingOut && d > state.ci &&
        Math.round((d - state.ci) / 864e5) <= S.maxNights && rangeOpen(state.ci, d);
      var cls = ['cal-day'];
      var status = '';

      if (+d === +today) cls.push('is-today');
      if (isWeekend(d)) cls.push('is-wknd');
      if (state.ci && +d === +state.ci) { cls.push('is-sel', 'is-start'); status = '체크인'; }
      if (state.co && +d === +state.co) { cls.push('is-sel', 'is-end'); status = '체크아웃'; }
      if (state.ci && state.co && d > state.ci && d < state.co) cls.push('is-range');

      var enabled = open || asOut;
      if (!open && d >= today && d < lastDay) { cls.push('is-full'); if (!status) status = asOut ? '체크아웃 가능' : '마감'; }
      if (asOut) cls.push('is-out');

      html += '<button type="button" class="' + cls.join(' ') + '" data-date="' + k + '"' +
        (enabled ? '' : ' disabled') +
        ' aria-label="' + u.dateLabel(d) + (status ? ', ' + status : '') + '"' +
        (cls.indexOf('is-sel') !== -1 ? ' aria-pressed="true"' : '') + '>' + day + '</button>';
    }
    return html + '</div></div>';
  };

  var calendar = function () {
    var count = wide.matches ? 2 : 1;
    var minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var maxMonth = new Date(lastDay.getFullYear(), lastDay.getMonth() - count + 1, 1);
    if (state.month > maxMonth) state.month = maxMonth;
    if (state.month < minMonth) state.month = minMonth;

    var months = '';
    for (var i = 0; i < count; i++) {
      months += monthHtml(new Date(state.month.getFullYear(), state.month.getMonth() + i, 1));
    }
    $('stayCal').innerHTML =
      '<div class="cal-nav">' +
        '<button type="button" data-month="-1" aria-label="이전 달"' + (state.month <= minMonth ? ' disabled' : '') + '>←</button>' +
        '<button type="button" data-month="1" aria-label="다음 달"' + (state.month >= maxMonth ? ' disabled' : '') + '>→</button>' +
      '</div>' +
      '<div class="cal-months">' + months + '</div>';

    var help = $('stayHelp');
    if (!state.ci) help.textContent = '체크인 날짜를 고르세요.';
    else if (!state.co) help.textContent = u.dateLabel(state.ci) + ' 체크인 · 체크아웃 날짜를 고르세요. (최대 ' + S.maxNights + '박)';
    else help.textContent = u.dateLabel(state.ci) + ' — ' + u.dateLabel(state.co) + ' · ' + nights() + '박';

    summary();
  };

  $('stayCal').addEventListener('click', function (e) {
    var nav = e.target.closest('[data-month]');
    if (nav) {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + (+nav.getAttribute('data-month')), 1);
      calendar();
      return;
    }
    var btn = e.target.closest('[data-date]');
    if (!btn || btn.disabled) return;
    var d = u.parse(btn.getAttribute('data-date'));

    if (state.ci && !state.co && btn.classList.contains('is-out')) state.co = d;
    else { state.ci = d; state.co = null; }

    calendar();
    var again = $('stayCal').querySelector('[data-date="' + u.iso(d) + '"]');
    if (again) again.focus();
  });

  if (wide.addEventListener) wide.addEventListener('change', calendar);

  /* 요약 ----------------------------------------------------------- */
  var rows = function (pairs) {
    return pairs.map(function (p) {
      return '<div' + (p[2] ? ' class="' + p[2] + '"' : '') + '><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd></div>';
    }).join('');
  };

  var sumPairs = function () {
    var r = state.room, p = price();
    var pairs = [
      ['객실', u.esc(r.name)],
      ['체크인', state.ci ? u.dateLabel(state.ci) + ' ' + S.checkIn : '—'],
      ['체크아웃', state.co ? u.dateLabel(state.co) + ' ' + S.checkOut : '—'],
      ['인원', state.guests + '명']
    ];
    if (p) {
      if (p.wd) pairs.push(['평일 ' + p.wd + '박', u.won(r.weekday * p.wd), 'sum-sub']);
      if (p.we) pairs.push(['주말 ' + p.we + '박', u.won(r.weekend * p.we), 'sum-sub']);
      if (p.extra) pairs.push(['추가 ' + p.extra + '인 × ' + (p.wd + p.we) + '박', u.won(p.extra * r.extraPerson * (p.wd + p.we)), 'sum-sub']);
      pairs.push(['합계', u.won(p.total), 'sum-total']);
    }
    return pairs;
  };

  var summary = function () {
    $('staySum').innerHTML = rows(sumPairs());
    $('staySubmit').disabled = !state.co;
  };

  /* 신청 ----------------------------------------------------------- */
  var form = $('stayForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('stayMsg');
    msg.textContent = '';
    if (!state.co) { msg.textContent = '날짜를 먼저 골라주세요.'; return; }
    if (!u.validate(form)) { msg.textContent = '표시된 항목을 확인해 주세요.'; return; }

    var p = price();
    var btn = $('staySubmit');
    btn.disabled = true;
    btn.textContent = '보내는 중…';

    u.submit('[북스테이 예약] ' + u.dateLabel(state.ci, false) + ' ' + state.room.name + ' · ' + $('sName').value, {
      '구분': '시안북스테이 숙박 예약',
      '객실': state.room.name,
      '체크인': u.dateLabel(state.ci) + ' ' + S.checkIn,
      '체크아웃': u.dateLabel(state.co) + ' ' + S.checkOut,
      '박수': nights() + '박',
      '인원': state.guests + '명',
      '금액': u.won(p.total),
      '이름': $('sName').value.trim(),
      '연락처': $('sPhone').value.trim(),
      '이메일': $('sEmail').value.trim() || '-',
      '요청 사항': $('sMemo').value.trim() || '-'
    }).then(function (how) {
      $('stayDoneSum').innerHTML = rows(sumPairs());
      $('stayDoneText').textContent = (how === 'mail'
        ? '메일 앱에 신청 내용이 채워졌습니다. 메일을 보내주시면 접수됩니다. '
        : '') + '확인 후 ' + $('sPhone').value.trim() + ' 번호로 안내 문자를 드립니다. ' +
        '안내를 받으시면 ' + C.data.site.bankAccount + ' 으로 숙박 요금을 입금해 주세요.';
      form.hidden = true;
      $('stayDone').hidden = false;
      $('stayDone').focus();
    }).catch(function (err) {
      msg.textContent = '보내지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요. (' + err.message + ')';
      btn.disabled = false;
      btn.textContent = '예약 신청하기';
    });
  });

  setRoom(state.room.id);
})();
