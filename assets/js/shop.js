/* CYAN — 시안 숍: 시리즈별 아카이브 · 장바구니 · 주문 신청 */
(function () {
  'use strict';

  var C = window.CYAN, u = C.util, D = C.data, cart = C.cart;
  var $ = function (id) { return document.getElementById(id); };

  var seriesById = {}, prodById = {};
  D.series.forEach(function (s) { seriesById[s.id] = s; });
  D.products.forEach(function (p) { prodById[p.id] = p; });

  var buyable = function (p) {
    var s = seriesById[p.series];
    return p && !p.soldOut && !p.link && s && s.status !== 'archive';
  };

  /* 시리즈 탭 ------------------------------------------------------ */
  var tabs = $('shopTabs');
  tabs.innerHTML = '<button type="button" role="tab" data-series="all" aria-selected="true">전체</button>' +
    D.series.map(function (s) {
      return '<button type="button" role="tab" data-series="' + u.esc(s.id) + '" aria-selected="false">' +
        'No.' + u.esc(s.no) + ' ' + u.esc(s.name) + (s.status === 'archive' ? ' <em>archive</em>' : '') + '</button>';
    }).join('');

  var priceHtml = function (p) {
    var s = seriesById[p.series];
    if (s && s.status === 'archive') return '<span class="muted">판매 종료</span>';
    if (p.soldOut) return '<s>' + u.won(p.price) + '</s> <span class="muted">품절</span>';
    return u.won(p.price);
  };

  var list = function (which) {
    var series = D.series.filter(function (s) { return which === 'all' || s.id === which; });
    $('shopList').innerHTML = series.map(function (s) {
      var items = D.products.filter(function (p) { return p.series === s.id; });
      return '<section class="series' + (s.status === 'archive' ? ' series--archive' : '') + '" aria-labelledby="sr-' + u.esc(s.id) + '">' +
        '<div class="series-head reveal">' +
          '<p class="series-no">No.' + u.esc(s.no) + ' · ' + u.esc(s.year) + (s.status === 'archive' ? ' · Archive' : '') + '</p>' +
          '<h2 class="series-name" id="sr-' + u.esc(s.id) + '">' + u.esc(s.name) + ' <em>' + u.esc(s.en) + '</em></h2>' +
          '<p class="series-text">' + u.esc(s.summary) + '</p>' +
        '</div>' +
        '<ul class="products">' + items.map(function (p) {
          return '<li class="product reveal' + (p.soldOut || s.status === 'archive' ? ' is-out' : '') + '">' +
            '<button type="button" data-prod="' + u.esc(p.id) + '">' +
              u.frame(p.image, p.name) +
              '<span class="product-name">' + u.esc(p.name) + '</span>' +
              '<span class="product-price">' + priceHtml(p) + '</span>' +
            '</button>' +
          '</li>';
        }).join('') + '</ul>' +
      '</section>';
    }).join('');
    u.reveal($('shopList'));
  };

  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-series]');
    if (!b) return;
    tabs.querySelectorAll('[data-series]').forEach(function (t) { t.setAttribute('aria-selected', String(t === b)); });
    list(b.getAttribute('data-series'));
  });

  list('all');

  /* 제품 자세히 ---------------------------------------------------- */
  var prodModal = u.dialog($('prodModal'));

  var openProduct = function (id) {
    var p = prodById[id];
    if (!p) return;
    var s = seriesById[p.series];
    var action;

    if (s.status === 'archive') action = '<p class="muted">지난 시리즈로 판매가 끝난 제품입니다.</p>';
    else if (p.soldOut) action = '<button class="btn btn--block" type="button" disabled>품절</button>';
    else if (p.link) action = '<a class="btn btn--block" href="' + u.esc(p.link) + '" target="_blank" rel="noopener">구매하러 가기 ↗</a>';
    else action =
      '<div class="buy">' +
        '<div class="stepper" id="prodQty">' +
          '<button type="button" data-step="-1" aria-label="수량 줄이기">−</button>' +
          '<output aria-live="polite">1</output>' +
          '<button type="button" data-step="1" aria-label="수량 늘리기">+</button>' +
        '</div>' +
        '<button class="btn" type="button" id="prodAdd">장바구니에 담기</button>' +
      '</div>' +
      '<p class="form-msg" id="prodMsg" role="status"></p>';

    $('prodModalBody').innerHTML =
      '<div class="prod">' +
        u.frame(p.image, p.name) +
        '<div class="prod-body">' +
          '<p class="series-no">No.' + u.esc(s.no) + ' ' + u.esc(s.name) + '</p>' +
          '<h2 class="modal-title" id="prodModalTitle">' + u.esc(p.name) + '</h2>' +
          '<p class="prod-price">' + priceHtml(p) + '</p>' +
          '<p class="show-text">' + u.esc(p.summary) + '</p>' +
          action +
        '</div>' +
      '</div>';

    var qtyEl = $('prodQty');
    if (qtyEl) {
      var qty = u.stepper(qtyEl, 1, 9);
      $('prodAdd').addEventListener('click', function () {
        var items = cart.read();
        var hit = items.filter(function (it) { return it.id === p.id; })[0];
        if (hit) hit.qty = Math.min(9, hit.qty + qty.value); else items.push({ id: p.id, qty: qty.value });
        cart.write(items);
        $('prodMsg').innerHTML = '장바구니에 담았습니다. <button type="button" class="link" id="prodToCart">장바구니 보기 →</button>';
        $('prodToCart').addEventListener('click', function () { prodModal.close(); openCart(); });
      });
    }
    prodModal.open();
  };

  $('shopList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-prod]');
    if (b) openProduct(b.getAttribute('data-prod'));
  });

  /* 장바구니 ------------------------------------------------------- */
  var cartModal = u.dialog($('cartModal'));
  var form = $('orderForm');

  var lines = function () {
    return cart.read().filter(function (it) { return buyable(prodById[it.id]); })
      .map(function (it) { return { p: prodById[it.id], qty: it.qty }; });
  };

  var totals = function () {
    var sub = lines().reduce(function (n, l) { return n + l.p.price * l.qty; }, 0);
    var pickup = $('oPickup').checked;
    var ship = !sub || pickup || sub >= D.shipping.freeOver ? 0 : D.shipping.fee;
    return { sub: sub, ship: ship, total: sub + ship, pickup: pickup };
  };

  var renderCart = function () {
    var ls = lines();
    $('cartItems').innerHTML = ls.length ? ls.map(function (l) {
      return '<li class="cart-item">' +
        u.frame(l.p.image, l.p.name) +
        '<div class="cart-info">' +
          '<p class="cart-name">' + u.esc(l.p.name) + '</p>' +
          '<p class="muted">' + u.won(l.p.price) + '</p>' +
          '<div class="stepper stepper--sm">' +
            '<button type="button" data-qty="-1" data-id="' + l.p.id + '" aria-label="수량 줄이기"' + (l.qty <= 1 ? ' disabled' : '') + '>−</button>' +
            '<output>' + l.qty + '</output>' +
            '<button type="button" data-qty="1" data-id="' + l.p.id + '" aria-label="수량 늘리기"' + (l.qty >= 9 ? ' disabled' : '') + '>+</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-side">' +
          '<p>' + u.won(l.p.price * l.qty) + '</p>' +
          '<button type="button" class="cart-del" data-del="' + l.p.id + '">삭제</button>' +
        '</div>' +
      '</li>';
    }).join('') : '<li class="empty">장바구니가 비어 있습니다.</li>';

    var t = totals();
    $('cartSum').innerHTML = ls.length ?
      '<div class="sum-sub"><dt>상품</dt><dd>' + u.won(t.sub) + '</dd></div>' +
      '<div class="sum-sub"><dt>배송비</dt><dd>' + (t.pickup ? '매장 수령' : t.ship ? u.won(t.ship) : '무료') + '</dd></div>' +
      '<div class="sum-total"><dt>합계</dt><dd>' + u.won(t.total) + '</dd></div>' +
      (t.pickup || t.ship === 0 ? '' : '<p class="muted sum-note">' + u.won(D.shipping.freeOver) + ' 이상 무료 배송</p>')
      : '';
    form.hidden = !ls.length;
    $('oAddr').required = !t.pickup;
    $('oAddr').closest('.field').hidden = t.pickup;
  };

  $('cartItems').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var items = cart.read();
    if (b.hasAttribute('data-del')) {
      items = items.filter(function (it) { return it.id !== b.getAttribute('data-del'); });
    } else if (b.hasAttribute('data-qty')) {
      items.forEach(function (it) {
        if (it.id === b.getAttribute('data-id')) it.qty = Math.min(9, Math.max(1, it.qty + (+b.getAttribute('data-qty'))));
      });
    }
    cart.write(items);
    renderCart();
  });

  $('oPickup').addEventListener('change', renderCart);

  $('orderBank').textContent = '주문 신청 후 확인 문자를 드립니다. 입금 계좌: ' + D.site.bankAccount;

  var openCart = function () {
    $('cartView').hidden = false;
    $('orderDone').hidden = true;
    $('orderMsg').textContent = '';
    renderCart();
    cartModal.open();
  };

  /* 헤더의 장바구니 버튼은 이 페이지에서 바로 열기 */
  document.querySelectorAll('.head-cart').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); openCart(); });
  });

  /* 주문 신청 ------------------------------------------------------ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('orderMsg');
    msg.textContent = '';
    var ls = lines();
    if (!ls.length) return;
    if (!u.validate(form)) { msg.textContent = '표시된 항목을 확인해 주세요.'; return; }

    var t = totals();
    var btn = $('orderSubmit');
    btn.disabled = true;
    btn.textContent = '보내는 중…';

    u.submit('[숍 주문] ' + $('oName').value.trim() + ' · ' + u.won(t.total), {
      '구분': '시안 숍 주문',
      '주문 상품': ls.map(function (l) { return l.p.name + ' × ' + l.qty + ' (' + u.won(l.p.price * l.qty) + ')'; }).join(', '),
      '상품 금액': u.won(t.sub),
      '배송비': t.pickup ? '매장 수령' : u.won(t.ship),
      '합계': u.won(t.total),
      '이름': $('oName').value.trim(),
      '연락처': $('oPhone').value.trim(),
      '주소': t.pickup ? '매장 수령' : $('oAddr').value.trim(),
      '요청 사항': $('oMemo').value.trim() || '-'
    }).then(function (how) {
      $('orderDoneText').textContent = (how === 'mail'
        ? '메일 앱에 주문 내용이 채워졌습니다. 메일을 보내주시면 접수됩니다. '
        : '') + '합계 ' + u.won(t.total) + '을 ' + D.site.bankAccount + ' 으로 입금해 주세요. 입금 확인 후 ' +
        (t.pickup ? '수령 안내를' : '발송 안내를') + ' 문자로 드립니다.';
      cart.write([]);
      form.reset();
      $('cartView').hidden = true;
      $('orderDone').hidden = false;
      $('orderDone').focus();
    }).catch(function (err) {
      msg.textContent = '보내지 못했습니다. 잠시 후 다시 시도해 주세요. (' + err.message + ')';
    }).then(function () {
      btn.disabled = false;
      btn.textContent = '주문 신청하기';
    });
  });

  /* 주소의 #cart · #제품id 로 바로 열기 */
  var hash = decodeURIComponent(location.hash.slice(1));
  if (hash === 'cart') openCart();
  else if (prodById[hash]) openProduct(hash);
})();
