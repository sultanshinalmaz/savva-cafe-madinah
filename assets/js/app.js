/* ============================================================
   SAVVA · ساڤا — поведение сайта
   ============================================================ */
(function () {
  'use strict';
  var D = window.SAVVA, C = D.contacts;
  var html = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* «меньше движения» не учитываем: его включает экономия заряда на Android,
     и заказчик тогда не видел ни заставки, ни анимаций */
  var reduce = false;
  var lang = html.lang === 'ar' ? 'ar' : 'en';
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (t) { return t * t * (3 - 2 * t); };

  function T(key) { var v = D.t[lang][key]; return v == null ? (D.t.en[key] || '') : v; }
  function L(o) { return o ? (o[lang] || o.en || '') : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ITEMS = {};
  D.menu.forEach(function (cat) { cat.items.forEach(function (it) { it.cat = cat.id; ITEMS[it.id] = it; }); });
  function itemName(id) { var it = ITEMS[id]; return it ? it[lang] : ''; }
  function price(p) { return '<span class="mi__price"><i class="sar" role="img" aria-label="SAR"></i>' + esc(p) + '</span>'; }
  function waLink(text) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text || T('wa.text')); }

  /* ---------------- время Медины ---------------- */
  function medinaNow() {
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Riyadh', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      var d = new Date(Date.now() + (180 + new Date().getTimezoneOffset()) * 60000);
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[parts.weekday], min: (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10) };
  }
  function toMin(s) { var a = s.split(':'); return +a[0] * 60 + +a[1]; }
  function fmt(min) { min = ((min % 1440) + 1440) % 1440; var h = Math.floor(min / 60), m = min % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  function openState() {
    var n = medinaNow(), today = D.hours[n.day], close = toMin(today.close);
    if (n.min < close) return { open: true, until: today.close };            // после полуночи — вчерашняя смена
    if (n.min >= toMin(today.open)) return { open: true, until: today.close };
    return { open: false, opens: today.open, when: 'today' };
  }
  function renderStatus() {
    var s = openState();
    $$('[data-status]').forEach(function (el) {
      el.classList.toggle('is-open', s.open);
      el.querySelector('b').textContent = s.open
        ? T('status.open') + ' · ' + T('status.until') + ' ' + s.until
        : T('status.closed') + ' · ' + T('status.opens') + ' ' + s.opens;
    });
  }

  /* ---------------- язык ---------------- */
  function applyLang(next, animate) {
    lang = next;
    html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('savva-lang', lang); } catch (e) {}
    document.title = T('meta.title');
    $$('[data-t]').forEach(function (el) { el.textContent = T(el.getAttribute('data-t')); });
    $$('[data-t-html]').forEach(function (el) { el.innerHTML = T(el.getAttribute('data-t-html')); });
    $$('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', T(el.getAttribute('data-t-aria'))); });
    renderStatus(); renderBand(); renderMenu(); renderHours(); renderReviews(); renderGallery(); renderDayTicks(); dayUpdate(daySun.v, true);
    finderRender(); wireLinks(); if (introDone) mapSrc();
    $('#cookiePrice').innerHTML = price(ITEMS.madini.price).replace('mi__price', 'x');
    if (animate) { document.body.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' }); }
  }
  $('#langBtn').addEventListener('click', function () { applyLang(lang === 'ar' ? 'en' : 'ar', true); });

  /* ---------------- ссылки ---------------- */
  function wireLinks() {
    var map = {
      directions: C.directions, maps: C.maps, menuPdf: C.menuPdf, keeta: C.keeta, hungerstation: C.hungerstation,
      instagram: C.instagram, instagramDm: C.instagramDm, instagramChannel: C.instagramChannel, tiktok: C.tiktok, snapchat: C.snapchat,
      wa: waLink(), tel: 'tel:' + C.phone
    };
    $$('[data-href]').forEach(function (a) { var k = a.getAttribute('data-href'); if (map[k]) a.href = map[k]; });
    $$('.ph').forEach(function (s) { s.textContent = C.phoneShown; });
  }

  /* ---------------- заставка ---------------- */
  var intro = $('#intro'), introDone = false, afterIntro = [];
  function whenIntroDone(fn) { introDone ? fn() : afterIntro.push(fn); }
  (function () {
    if (!html.classList.contains('has-intro')) { intro.remove(); introDone = true; return; }
    var DONE_AT = 4400, CAP = 6800, started = 0, loaded = document.readyState === 'complete', finished = false, posterTimer;
    window.addEventListener('load', function () { loaded = true; });
    function finish() {
      if (finished) return; finished = true;
      intro.classList.add('is-leaving');
      setTimeout(function () {
        html.classList.remove('has-intro'); intro.remove(); introDone = true;
        afterIntro.forEach(function (f) { f(); }); afterIntro = [];
      }, 560);
    }
    function tick() {
      if (finished) return;
      var el = performance.now() - started;
      if ((el >= DONE_AT && loaded) || el >= CAP) finish(); else setTimeout(tick, 120);
    }
    function play(poster) {
      if (started) return;
      started = performance.now();
      intro.classList.add(poster ? 'is-poster' : 'is-playing');
      tick();
    }
    function tryStart() {
      if (started || document.visibilityState !== 'visible') return;
      requestAnimationFrame(function () { requestAnimationFrame(function () { play(false); }); });
      clearTimeout(posterTimer);
      posterTimer = setTimeout(function () { if (!started && document.visibilityState === 'visible') play(true); }, 400);
    }
    document.addEventListener('visibilitychange', tryStart);
    tryStart();
    $('.intro__skip', intro).addEventListener('click', finish);
    setTimeout(finish, 10000); // аварийный выход: webview может вечно отдавать hidden
  })();

  /* ---------------- шапка ---------------- */
  var top = $('#topbar'), burger = $('#burger'), lastY = 0;
  burger.addEventListener('click', function () {
    var on = !top.classList.contains('is-open');
    top.classList.toggle('is-open', on); burger.setAttribute('aria-expanded', on);
    document.body.style.overflow = on ? 'hidden' : '';
  });
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); var t = id.length > 1 && document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      top.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
      if (id === '#menu' && a.closest('.hero')) { t.scrollIntoView({ behavior: 'smooth' }); return; }
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- первый экран: полёт в букву ---------------- */
  var hero = $('.hero'), stick = $('.hero__stick'), word = $('#heroWord'), heroEnd = $('.hero__end');
  var FX = 0.4519, FY = 0.7245, R0 = 0.02996, ASPECT = 108 / 348;
  var heroGeom = {};
  function heroMeasure() {
    var vw = stick.clientWidth, vh = stick.clientHeight;
    var W0 = vw < 700 ? vw * 0.9 : Math.min(vw * 0.82, 1150);
    var H0 = W0 * ASPECT;
    var x0 = (vw - W0) / 2, y0 = vh * (vw < 700 ? 0.40 : 0.43) - H0 / 2;
    heroGeom = {
      vw: vw, vh: vh, W0: W0, H0: H0, x0: x0, y0: y0,
      px: x0 + FX * W0, py: y0 + FY * H0,
      sMax: Math.max(20, Math.hypot(vw / 2, vh / 2) / (R0 * W0) * 1.15)
    };
    stick.style.setProperty('--ar-top', (y0 + H0 + vh * 0.035) + 'px');
  }
  function heroUpdate() {
    var g = heroGeom, r = hero.getBoundingClientRect();
    var total = hero.offsetHeight - g.vh;
    var p = reduce ? 0 : clamp(-r.top / total, 0, 1);
    var z = clamp(p / 0.6, 0, 1), e = smooth(z);
    var s = Math.pow(g.sMax, z * z * 0.35 + e * 0.65);
    var W = g.W0 * s, H = g.H0 * s;
    var cx = lerp(g.px, g.vw / 2, e), cy = lerp(g.py, g.vh / 2, e);
    word.style.setProperty('--mw', W + 'px');
    word.style.setProperty('--mx', (cx - FX * W) + 'px');
    word.style.setProperty('--my', (cy - FY * H) + 'px');
    word.classList.toggle('is-full', z >= 1);
    word.style.webkitMaskImage = word.style.maskImage = z >= 1 ? 'none' : '';
    var fade = clamp(1 - z * 3, 0, 1), end = clamp((p - 0.62) / 0.22, 0, 1);
    stick.style.setProperty('--fade', fade);
    stick.style.setProperty('--end', end);
    word.style.setProperty('--shade', end);
    $('.hero__kicker').style.opacity = fade;
    heroEnd.classList.toggle('is-live', end > 0.6);
    $('.hero__branch--a').style.transform = 'rotate(-18deg) translateY(' + (p * -120) + 'px)';
    $('.hero__branch--b').style.transform = 'rotate(160deg) scaleX(-1) translateY(' + (p * 160) + 'px)';
  }

  /* видео в буквах: класс «видно» только после удачного play() */
  var heroVideo = $('#heroVideo');
  function startHeroVideo() {
    var c = navigator.connection || {};
    if (c.saveData || /2g/.test(c.effectiveType || '')) return;
    if (!heroVideo.src) heroVideo.src = innerWidth < 820 ? heroVideo.dataset.srcMobile : heroVideo.dataset.src;
    var pr = heroVideo.play();
    if (pr && pr.then) pr.then(function () { heroVideo.classList.add('is-on'); }).catch(function () {});
  }
  whenIntroDone(startHeroVideo);
  new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (!introDone) return; if (x.isIntersecting) startHeroVideo(); else heroVideo.pause(); });
  }).observe(hero);

  /* ---------------- прокрутка ---------------- */
  var ticking = false, fab = $('.fab');
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = scrollY, heroBottom = hero.offsetTop + hero.offsetHeight - 80;
      heroUpdate();
      top.classList.toggle('is-solid', y > heroBottom);
      top.classList.toggle('is-hidden', y > heroBottom + 200 && y > lastY && !top.classList.contains('is-open'));
      fab.classList.toggle('is-in', y > heroBottom);
      lastY = y;
      navSpy();
    });
  }
  var navLinks = $$('.top__nav a');
  function navSpy() {
    var mid = innerHeight * 0.4, cur = null;
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) { var r = s.getBoundingClientRect(); if (r.top < mid && r.bottom > mid) cur = a; } });
    navLinks.forEach(function (a) { a.classList.toggle('is-on', a === cur); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  var lastW = innerWidth;
  addEventListener('resize', function () {
    heroMeasure(); heroUpdate(); daySun.layout(); railProgress();
    if (innerWidth !== lastW) { lastW = innerWidth; }
  });

  /* ---------------- бегущая строка ---------------- */
  function renderBand() {
    var words = lang === 'ar'
      ? ['قهوة مختصة', 'سبانش لاتيه', 'سافا ماتشا', 'مديني كوكيز', 'V60', 'كركديه سافا', 'بئر عثمان', '6:30 — 2:00']
      : ['Specialty coffee', 'Spanish latte', 'Savva matcha', 'Madini cookies', 'V60 ice drip', 'Hibiscus slush', 'Bir Uthman', '6:30 — 2:00'];
    var one = words.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('');
    $('#bandTrack').innerHTML = one + one;
  }

  /* ---------------- меню ---------------- */
  var curTab = 'hot';
  function renderMenu() {
    var total = 0;
    $('#menuTabs').innerHTML = D.menu.map(function (c) {
      total += c.items.length;
      return '<button class="tab" role="tab" type="button" data-tab="' + c.id + '" aria-selected="' + (c.id === curTab) + '">' + esc(L(c.title)) + '<small>' + c.items.length + '</small></button>';
    }).join('');
    $('#menuCount').setAttribute('data-count', total);
    var cat = D.menu.filter(function (c) { return c.id === curTab; })[0];
    var other = lang === 'ar' ? 'en' : 'ar';
    $('#menuBoard').innerHTML = cat.items.map(function (it, k) {
      return '<div class="mi" style="--k:' + k + ';--hue:' + (it.hue || 'var(--cream)') + '">' +
        '<span class="mi__name">' + esc(it[lang]) + (it.star ? ' <span class="mi__star">' + esc(T('menu.star')) + '</span>' : '') + '</span>' +
        price(it.price) +
        '<span class="mi__alt" lang="' + other + '" dir="' + (other === 'ar' ? 'rtl' : 'ltr') + '">' + esc(it[other]) + '</span>' +
        (it.cal != null ? '<span class="mi__cal">' + it.cal + ' ' + esc(T('menu.cal')) + '</span>' : '') +
        (it.note ? '<span class="mi__note">' + esc(L(it.note)) + '</span>' : '') +
        '<i class="mi__fill"></i></div>';
    }).join('');
  }
  $('#menuTabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    curTab = b.getAttribute('data-tab'); renderMenu();
  });

  /* ---------------- подбор напитка ---------------- */
  var quiz = $('#quiz'), pick = {}, cup = $('#cup'), res = $('#finderResult');
  function finderLock() {
    $$('.quiz__step', quiz).forEach(function (s) {
      var k = s.getAttribute('data-step');
      var locked = (k === 'base' && !pick.temp) || (k === 'mood' && !pick.base);
      s.classList.toggle('is-locked', locked);
      $$('button', s).forEach(function (b) { b.classList.toggle('is-on', pick[k] === b.getAttribute('data-v')); });
    });
  }
  function finderRender() {
    finderLock();
    var done = pick.temp && pick.base && pick.mood;
    res.classList.toggle('is-done', !!done);
    cup.classList.toggle('is-hot', pick.temp === 'hot');
    cup.classList.toggle('is-iced', pick.temp === 'iced');
    var liquid = $('#cupLiquid');
    if (!done) {
      $('#finderName').textContent = '—'; $('#finderAlt').textContent = ''; $('#finderMeta').innerHTML = '';
      liquid.style.transform = 'translateY(' + (pick.base ? 190 : pick.temp ? 245 : 300) + 'px)';
      cup.style.setProperty('--drink', pick.base === 'matcha' ? '#a3b774' : pick.base === 'other' ? '#b3243f' : '#c79d77');
      return;
    }
    var id = D.finder[pick.temp][pick.base][pick.mood], it = ITEMS[id];
    cup.style.setProperty('--drink', it.hue || '#c79d77');
    liquid.style.transform = 'translateY(' + (pick.temp === 'iced' ? 92 : 108) + 'px)';
    $('#finderName').textContent = it[lang];
    $('#finderAlt').textContent = it[lang === 'ar' ? 'en' : 'ar'];
    $('#finderMeta').innerHTML = price(it.price) + (it.cal != null ? ' · ' + it.cal + ' ' + esc(T('menu.cal')) : '');
    var pair = ITEMS[D.finder.pair[pick.base]];
    $('#finderPair').innerHTML = esc(T('finder.pair')) + ': <b>' + esc(pair[lang]) + '</b>';
    $('#finderWa').href = waLink(T('finder.waText') + it[lang] + ' + ' + pair[lang]);
  }
  quiz.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-v]'); if (!b) return;
    var k = b.closest('.quiz__step').getAttribute('data-step');
    pick[k] = b.getAttribute('data-v');
    if (k === 'temp') { delete pick.base; delete pick.mood; }
    if (k === 'base') delete pick.mood;
    finderRender();
  });
  $('#finderAgain').addEventListener('click', function () { pick = {}; finderRender(); });

  /* ---------------- один день в Savva ---------------- */
  var DAY0 = 360, SPAN = 1200; // 06:00 → 02:00
  var SKY = [ // минуты от 06:00: верх, низ, солнце, свечение, звёзды
    [0,    '#3b3552', '#e69a6b', '#ffd08a', 'rgba(255,170,110,.6)', .2],
    [120,  '#7fb2d6', '#f2d7ae', '#fff1c4', 'rgba(255,236,180,.55)', 0],
    [420,  '#4f9bd1', '#cfe3ea', '#fffbe6', 'rgba(255,250,220,.6)', 0],
    [660,  '#5a86b8', '#f0c890', '#ffd37a', 'rgba(255,200,110,.6)', 0],
    [760,  '#2f3f6e', '#e0785a', '#ff9d5c', 'rgba(255,120,80,.6)', .1],
    [860,  '#1a2446', '#4a3a5c', '#f3ead7', 'rgba(240,230,210,.35)', .7],
    [1200, '#0b1024', '#1d2340', '#f3ead7', 'rgba(240,230,210,.3)', 1]
  ];
  function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function mix(a, b, t) { a = hex(a); b = hex(b); return 'rgb(' + a.map(function (v, i) { return Math.round(lerp(v, b[i], t)); }).join(',') + ')'; }
  var stage = $('.day__stage'), sunEl = $('#daySun'), arc = $('#dayArc'), nowEl = $('#dayNow');
  var daySun = { v: 0, pts: [], layout: function () {
    var w = stage.clientWidth, h = stage.clientHeight * 0.62, len = arc.getTotalLength();
    this.w = w; this.h = h; this.pts = [];
    for (var i = 0; i <= 200; i++) { var p = arc.getPointAtLength(len * i / 200); this.pts.push([p.x / 1000 * w, p.y / 300 * h]); }
    $('.day__arc').style.height = h + 'px';
    dayUpdate(this.v, true); placeNow();
  } };
  function ptAt(v) { var f = clamp(v / SPAN, 0, 1) * 200, i = Math.floor(f), a = daySun.pts[i], b = daySun.pts[Math.min(200, i + 1)]; if (!a) return [0, 0]; return [lerp(a[0], b[0], f - i), lerp(a[1], b[1], f - i)]; }
  var dayLast = -1;
  function dayUpdate(v, force) {
    daySun.v = v = clamp(v, 0, SPAN);
    var p = ptAt(v); sunEl.style.left = p[0] + 'px'; sunEl.style.top = p[1] + 'px';
    sunEl.setAttribute('aria-valuenow', Math.round(v)); sunEl.setAttribute('aria-valuetext', fmt(DAY0 + v));
    var k = 0; while (k < SKY.length - 2 && v > SKY[k + 1][0]) k++;
    var A = SKY[k], B = SKY[k + 1], t = clamp((v - A[0]) / (B[0] - A[0]), 0, 1);
    var sec = $('#day');
    sec.style.setProperty('--sky', 'linear-gradient(180deg,' + mix(A[1], B[1], t) + ',' + mix(A[2], B[2], t) + ')');
    sec.style.setProperty('--sun', mix(A[3], B[3], t));
    sec.style.setProperty('--glow', t < .5 ? A[4] : B[4]);
    sec.style.setProperty('--stars', lerp(A[5], B[5], t));
    sunEl.classList.toggle('is-night', v > 790); // после ~19:10 — луна
    $('#dayTime').textContent = fmt(DAY0 + v);
    var m = 0; D.day.forEach(function (d, i) { var dm = (toMin(d.t) - DAY0 + 1440) % 1440; if (dm <= v + 0.5) m = i; });
    if (m !== dayLast || force) {
      dayLast = m;
      var d = D.day[m];
      $('#dayText').textContent = d[lang];
      $('#dayItem').innerHTML = d.item ? '☕ ' + esc(itemName(d.item)) + ' · ' + price(ITEMS[d.item].price) + (d.with ? ' ' + esc(T('day.with')) + ' ' + esc(itemName(d.with)) : '') : '';
      $$('#dayTicks button').forEach(function (b, i) { b.classList.toggle('is-on', i === m); });
      if (!force && !reduce) $('#dayCard').animate([{ opacity: .2, transform: 'translate(-50%,8px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 380, easing: 'ease-out' });
    }
  }
  function nowV() { var n = medinaNow(); var v = (n.min - DAY0 + 1440) % 1440; return v <= SPAN ? v : null; }
  function placeNow() {
    var v = nowV(); nowEl.hidden = v == null; if (v == null) return;
    var p = ptAt(v); nowEl.style.left = p[0] + 'px'; nowEl.style.top = p[1] + 'px';
  }
  function renderDayTicks() {
    $('#dayTicks').innerHTML = D.day.map(function (d) { return '<button type="button" data-v="' + ((toMin(d.t) - DAY0 + 1440) % 1440) + '">' + d.t + '</button>'; }).join('');
  }
  $('#dayTicks').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) glideTo(+b.getAttribute('data-v')); });
  function glideTo(to) {
    var from = daySun.v, t0 = performance.now();
    (function step(t) { var k = clamp((t - t0) / 700, 0, 1); dayUpdate(lerp(from, to, smooth(k))); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function vFromX(x) {
    var best = 0, bd = 1e9;
    daySun.pts.forEach(function (p, i) { var d = Math.abs(p[0] - x); if (d < bd) { bd = d; best = i; } });
    return best / 200 * SPAN;
  }
  var dragging = false;
  stage.addEventListener('pointerdown', function (e) {
    if (e.target !== sunEl && !e.target.closest('.day__arc') && e.target !== stage) return;
    dragging = true; sunEl.setPointerCapture && sunEl.setPointerCapture(e.pointerId);
    dayUpdate(vFromX(e.clientX - stage.getBoundingClientRect().left));
  });
  addEventListener('pointermove', function (e) { if (dragging) dayUpdate(vFromX(e.clientX - stage.getBoundingClientRect().left)); });
  addEventListener('pointerup', function () { dragging = false; });
  sunEl.addEventListener('keydown', function (e) {
    var d = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15 }[e.key];
    if (d) { e.preventDefault(); dayUpdate(daySun.v + (html.dir === 'rtl' && /Left|Right/.test(e.key) ? -d : d)); }
  });

  /* ---------------- латте-арт ----------------
     Рисуем в логических единицах 600×600, холст — в реальном разрешении экрана.
     Фигуры бариста — покадровая анимация: каждый кадр = крема + фигура на прогрессе t,
     поэтому край не «пачкается» наслоением и движение плавное. */
  var cv = $('#latteCanvas'), cx = cv.getContext('2d'), LW = 600, K = 1, hint = $('#latteHint'), pouring = false;
  var MILK = '#faf4e8', CREMA = '#7a4623', base = document.createElement('canvas');
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a), 0, 1); };

  function paintCrema(c, px) { // одинаковая крема при каждой перерисовке (фиксированный «случай»)
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    c.setTransform(px / LW, 0, 0, px / LW, 0, 0);
    var g = c.createRadialGradient(LW * .46, LW * .44, LW * .05, LW / 2, LW / 2, LW / 2);
    g.addColorStop(0, '#8d5832'); g.addColorStop(.55, '#7a4623'); g.addColorStop(.86, '#5a3016'); g.addColorStop(1, '#3a1d0c');
    c.fillStyle = g; c.fillRect(0, 0, LW, LW);
    for (var i = 0; i < 1100; i++) {
      c.fillStyle = 'rgba(' + (rnd() < .5 ? '196,136,84' : '60,30,12') + ',' + (rnd() * .16).toFixed(3) + ')';
      var a = rnd() * 6.283, r = Math.sqrt(rnd()) * LW / 2;
      c.beginPath(); c.arc(LW / 2 + Math.cos(a) * r, LW / 2 + Math.sin(a) * r, .4 + rnd() * 1.8, 0, 6.283); c.fill();
    }
  }
  function fit() { // размер холста = экранный размер × плотность пикселей
    var w = cv.getBoundingClientRect().width || 400;
    var px = Math.round(clamp(w * (window.devicePixelRatio || 1), 600, 1400));
    if (cv.width === px && base.width === px) return;
    var old = null;
    if (cv.width) { old = document.createElement('canvas'); old.width = old.height = cv.width; old.getContext('2d').drawImage(cv, 0, 0); }
    cv.width = cv.height = base.width = base.height = px; K = px / LW;
    paintCrema(base.getContext('2d'), px);
    cx.setTransform(1, 0, 0, 1, 0, 0);
    if (old) cx.drawImage(old, 0, 0, px, px); else cx.drawImage(base, 0, 0);
    cx.setTransform(K, 0, 0, K, 0, 0);
  }
  function drawBase() { cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(base, 0, 0); cx.setTransform(K, 0, 0, K, 0, 0); }
  function fillShape(pathFn, color) { // заливка с мягким ореолом пены
    cx.save(); cx.beginPath(); pathFn();
    cx.fillStyle = color || MILK;
    cx.shadowColor = color ? 'rgba(70,36,14,.45)' : 'rgba(250,244,232,.55)'; cx.shadowBlur = 9 * K;
    cx.fill(); cx.shadowBlur = 0; cx.fill(); cx.restore();
  }
  function ellipse(x, y, rx, ry) { return function () { cx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, 6.283); }; }
  function taper(x, y0, y1, w0, w1) { // протяжка молочником: клин от w0 к w1
    return function () { cx.moveTo(x - w0 / 2, y0); cx.lineTo(x + w0 / 2, y0); cx.lineTo(x + w1 / 2, y1); cx.lineTo(x - w1 / 2, y1); cx.closePath(); cx.moveTo(x + w1 / 2, y1); cx.arc(x, y1, w1 / 2, 0, Math.PI); };
  }
  function heartPts(cxp, cyp, k, n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var t = i / n * 6.283;
      pts.push([cxp + 16 * Math.pow(Math.sin(t), 3) * k, cyp - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k]);
    }
    return pts;
  }
  function poly(pts) { return function () { pts.forEach(function (p, i) { i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1]); }); cx.closePath(); }; }

  var CC = LW / 2;
  var SHAPES = {
    /* пятно растёт → плавно перетекает в сердце (одинаковая параметризация круга и сердца) → протяжка */
    heart: function (t) {
      var a = easeOut(seg(t, 0, .45)), m = easeInOut(seg(t, .38, .78)), s = easeOut(seg(t, .74, 1));
      var N = 120, H = heartPts(CC, 290, 10.4, N), R = 150 * a;
      var pts = H.map(function (h, i) {
        var th = i / N * 6.283, cp = [CC + Math.sin(th) * R, 318 - Math.cos(th) * R * .94];
        return [lerp(cp[0], h[0], m), lerp(cp[1], h[1], m)];
      });
      if (R > .5) fillShape(poly(pts));
      if (s > 0) fillShape(taper(CC, 120, lerp(120, 520, s), 5, 2.4));
    },
    /* четыре слоя, каждый «вдавливает» предыдущий тонкой каёмкой кремы */
    tulip: function (t) {
      var rows = [[392, 150, 92], [300, 120, 72], [222, 90, 55], [162, 52, 40]];
      rows.forEach(function (r, j) {
        var p = easeOut(seg(t, j * .17, j * .17 + .3)); if (!p) return;
        if (j) fillShape(ellipse(CC, r[0] + 12 * p, (r[1] + 11) * p, (r[2] + 11) * p), CREMA);
        fillShape(ellipse(CC, r[0], r[1] * p, r[2] * p));
      });
      var s = easeOut(seg(t, .8, 1));
      if (s > 0) fillShape(taper(CC, 110, lerp(110, 505, s), 5, 2.4));
    },
    /* листья снизу вверх, покачиваясь из стороны в сторону, сверху сердечко, затем протяжка */
    rosetta: function (t) {
      var N = 15;
      for (var i = 0; i < N; i++) {
        var p = easeOut(seg(t, i / N * .62, i / N * .62 + .16)); if (!p) continue;
        var f = i / (N - 1), y = lerp(478, 158, f), w = lerp(150, 34, f) * p, x = CC + (i % 2 ? 1 : -1) * lerp(10, 3, f);
        fillShape((function (x, y, w) { return function () { cx.moveTo(x - w, y - 12); cx.quadraticCurveTo(x, y + 42, x + w, y - 12); cx.quadraticCurveTo(x, y + 15, x - w, y - 12); cx.closePath(); }; })(x, y, w));
      }
      var h = easeOut(seg(t, .7, .84));
      if (h > 0) fillShape(poly(heartPts(CC, 118, 1.9 * h, 60)));
      var s = easeOut(seg(t, .82, 1));
      if (s > 0) fillShape(taper(CC, 100, lerp(100, 520, s), 4.5, 2));
    }
  };
  function play(name, done) {
    pouring = true; hint.classList.add('is-gone');
    var t0 = performance.now(), ms = 2100;
    (function frame(now) {
      var t = clamp((now - t0) / ms, 0, 1);
      drawBase(); SHAPES[name](t);
      if (t < 1) requestAnimationFrame(frame); else { pouring = false; done && done(); }
    })(t0);
  }
  function stir(then) { // ложка: картинка закручивается и растворяется в креме
    pouring = true;
    var snap = document.createElement('canvas'); snap.width = snap.height = cv.width; snap.getContext('2d').drawImage(cv, 0, 0);
    var t0 = performance.now(), P = cv.width;
    (function f(now) {
      var k = clamp((now - t0) / 800, 0, 1);
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(base, 0, 0);
      cx.save(); cx.globalAlpha = 1 - easeInOut(k); cx.translate(P / 2, P / 2); cx.rotate(easeInOut(k) * 4.5); cx.translate(-P / 2, -P / 2); cx.drawImage(snap, 0, 0); cx.restore();
      cx.setTransform(K, 0, 0, K, 0, 0);
      if (k < 1) requestAnimationFrame(f); else { drawBase(); pouring = false; then && then(); }
    })(t0);
  }

  /* рисование пальцем: мягкие мазки молока, толщина зависит от скорости */
  function blob(x, y, r, a) {
    var g = cx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(250,244,232,' + a + ')'); g.addColorStop(.72, 'rgba(248,240,226,' + (a * .85) + ')'); g.addColorStop(1, 'rgba(240,226,204,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 6.283); cx.fill();
  }
  var last = null, lastT = 0, lastR = 22;
  function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * LW, (e.clientY - r.top) / r.height * LW]; }
  cv.addEventListener('pointerdown', function (e) {
    if (pouring) return; e.preventDefault(); cv.setPointerCapture(e.pointerId);
    last = pos(e); lastT = performance.now(); lastR = 24; blob(last[0], last[1], 24, .9); hint.classList.add('is-gone');
  });
  cv.addEventListener('pointermove', function (e) {
    if (!last) return;
    var p = pos(e), now = performance.now(), dist = Math.hypot(p[0] - last[0], p[1] - last[1]), speed = dist / Math.max(1, now - lastT);
    var r = lerp(lastR, clamp(28 - speed * 12, 6, 28), .25), n = Math.max(1, Math.ceil(dist / 2.5));
    for (var i = 1; i <= n; i++) blob(lerp(last[0], p[0], i / n), lerp(last[1], p[1], i / n), lerp(lastR, r, i / n), .45);
    last = p; lastT = now; lastR = r;
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) { cv.addEventListener(ev, function () { last = null; }); });

  fit(); drawBase();
  addEventListener('resize', function () { if (!pouring) fit(); });
  $$('[data-pour]').forEach(function (b) {
    b.addEventListener('click', function () { if (pouring) return; var k = b.getAttribute('data-pour'); stir(function () { play(k); }); });
  });
  $('#latteStir').addEventListener('click', function () { if (!pouring) stir(); });
  $('#latteSave').addEventListener('click', function () {
    var o = document.createElement('canvas'); o.width = o.height = 900; var c = o.getContext('2d');
    c.fillStyle = '#f5eee3'; c.fillRect(0, 0, 900, 900);
    c.save(); c.beginPath(); c.arc(450, 420, 380, 0, 6.283); c.clip(); c.drawImage(cv, 70, 40, 760, 760); c.restore();
    c.fillStyle = '#4d5741'; c.font = '500 30px "Readex Pro", sans-serif'; c.textAlign = 'center';
    c.fillText('SAVVA · ساڤا · Madinah', 450, 866);
    o.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'savva-latte-art.png'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); });
  });
  /* сердце само появляется, когда раздел впервые на экране */
  new IntersectionObserver(function (en, o) {
    en.forEach(function (x) { if (x.isIntersecting) { o.disconnect(); setTimeout(function () { if (!last && !pouring) { fit(); play('heart'); } }, 400); } });
  }, { threshold: .5 }).observe(cv);

  /* ---------------- галерея ---------------- */
  var rail = $('#spaceRail');
  function renderGallery() {
    rail.innerHTML = D.gallery.map(function (g) {
      var media = g.video
        ? '<video muted playsinline loop preload="none" poster="' + g.poster + '" data-src="' + g.video + '"></video>'
        : '<img src="' + g.src + '" alt="' + esc(g[lang]) + '" loading="lazy" draggable="false"' + (g.pos ? ' style="object-position:' + g.pos + '"' : '') + '>';
      return '<figure class="shot shot--' + g.shape + '"><div class="shot__frame">' + media + '</div><figcaption>' + esc(g[lang]) + '</figcaption></figure>';
    }).join('');
    $$('video', rail).forEach(function (v) { vio.observe(v); });
    railProgress();
  }
  /* стрелки и полоска прогресса галереи */
  function railStep() { var s = rail.querySelector('.shot'); return s ? s.offsetWidth + 20 : 300; }
  function railPos() { return Math.abs(rail.scrollLeft); }
  function railProgress() {
    var max = rail.scrollWidth - rail.clientWidth, bar = $('#spaceBar');
    var vis = rail.clientWidth / rail.scrollWidth, at = max > 0 ? railPos() / max : 0;
    bar.style.width = (vis * 100) + '%'; bar.style.marginInlineStart = (at * (1 - vis) * 100) + '%';
    $('#spacePrev').disabled = railPos() < 4; $('#spaceNext').disabled = railPos() > max - 4;
  }
  rail.addEventListener('scroll', function () { requestAnimationFrame(railProgress); }, { passive: true });
  $('#spacePrev').addEventListener('click', function () { rail.scrollBy({ left: (html.dir === 'rtl' ? 1 : -1) * railStep(), behavior: 'smooth' }); });
  $('#spaceNext').addEventListener('click', function () { rail.scrollBy({ left: (html.dir === 'rtl' ? -1 : 1) * railStep(), behavior: 'smooth' }); });
  var vio = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      var v = x.target;
      if (x.isIntersecting) { if (!v.src) v.src = v.dataset.src; var p = v.play(); p && p.catch && p.catch(function () {}); } else v.pause();
    });
  }, { threshold: .4 });
  (function () { // перетаскивание мышью
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', function (e) { if (!down) return; var d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = sl - d; });
    addEventListener('pointerup', function () { down = false; rail.classList.remove('is-drag'); });
  })();

  /* ---------------- отзывы ---------------- */
  function renderReviews() {
    var stars = '', full = Math.floor(C.rating), part = C.rating - full;
    for (var i = 0; i < 5; i++) {
      var f = i < full ? 1 : i === full ? part : 0;
      stars += '<svg viewBox="-10 -12 20 24"><defs><linearGradient id="bp' + i + '" x1="0" x2="1"><stop offset="' + f + '" stop-color="#3a2519"/><stop offset="' + f + '" stop-color="rgba(58,37,25,.2)"/></linearGradient></defs><g fill="url(#bp' + i + ')"><use href="#bean"/></g></svg>';
    }
    $('#revBeans').innerHTML = stars;
    $('#revTags').innerHTML = D.reviewTags.map(function (t) { return '<span class="tag">' + esc(t[lang]) + '<b>' + t.n + '</b></span>'; }).join('');
    var star5 = '<div class="rv__stars">' + new Array(6).join('<svg><use href="#i-star"/></svg>') + '</div>';
    $('#revGrid').innerHTML = D.reviews.map(function (r, i) {
      return '<figure class="rv reveal is-in">' + star5 + '<blockquote>' + esc(r[lang]) + '</blockquote><figcaption><i>' + esc(r.name.charAt(0)) + '</i><span>' + esc(r.name) + '<small>' + esc(L(r.meta)) + '</small></span></figcaption></figure>';
    }).join('');
  }

  /* ---------------- часы и карта ---------------- */
  function renderHours() {
    var n = medinaNow(), days = T('days'), order = [6, 0, 1, 2, 3, 4, 5]; // неделя с субботы, как в Саудии
    $('#hoursTable').innerHTML = order.map(function (d) {
      var h = D.hours[d];
      return '<tr class="' + (d === n.day ? 'is-today ' : '') + (d === 5 ? 'is-fri' : '') + '"><td>' + esc(days[d]) + '</td><td dir="ltr">' + h.open + ' – ' + h.close + '</td></tr>';
    }).join('');
  }
  // iframe с loading="lazy" браузер сам грузит у экрана — наблюдатель не нужен
  function mapSrc() { var u = C.mapEmbed.replace('{lang}', lang); var fr = $('#mapFrame'); if (fr.src !== u) fr.src = u; }
  whenIntroDone(mapSrc);

  /* ---------------- появление и счётчики ---------------- */
  var rio = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); rio.unobserve(x.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(function (el) { rio.observe(el); });
  var cio = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      if (!x.isIntersecting) return; cio.unobserve(x.target);
      var el = x.target, to = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), t0 = performance.now();
      if (reduce) { el.textContent = to.toFixed(dec); return; }
      (function f(t) { var k = clamp((t - t0) / 1600, 0, 1); el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec); if (k < 1) requestAnimationFrame(f); })(t0);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });
  new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) x.target.classList.add('is-in'); }); }, { threshold: .4 }).observe($('.foot__word'));

  /* ---------------- пасхалка: дождь из зёрен ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(s) { toastEl.textContent = s; toastEl.classList.add('is-in'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-in'); }, 2600); }
  function beanRain(ox, oy) {
    if (reduce) return;
    var box = $('#beanRain'), beans = [], H = innerHeight, W = innerWidth;
    for (var i = 0; i < 46; i++) {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '-10 -12 20 24'); s.innerHTML = '<use href="#bean"/>'; box.appendChild(s);
      beans.push({ el: s, x: ox, y: oy, vx: (Math.random() - .5) * 14, vy: -Math.random() * 16 - 6, r: Math.random() * 360, vr: (Math.random() - .5) * 30, b: 0 });
    }
    var t0 = performance.now();
    (function f(t) {
      var age = t - t0;
      beans.forEach(function (b) {
        b.vy += .6; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        if (b.y > H - 28) { b.y = H - 28; b.vy *= -.45; b.vx *= .8; b.vr *= .6; }
        if (b.x < 0 || b.x > W - 22) b.vx *= -1;
        b.el.style.transform = 'translate(' + b.x + 'px,' + b.y + 'px) rotate(' + b.r + 'deg)';
        b.el.style.opacity = age > 2600 ? Math.max(0, 1 - (age - 2600) / 700) : 1;
      });
      if (age < 3400) requestAnimationFrame(f); else box.innerHTML = '';
    })(t0);
    toast(T('toast.bean'));
  }
  $('.hero__ar svg').addEventListener('click', function (e) { beanRain(e.clientX, e.clientY); });

  /* ---------------- «кофе остывает», когда ушли со вкладки ---------------- */
  var realTitle = '';
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { realTitle = document.title; document.title = T('away'); }
    else if (realTitle) { document.title = realTitle; realTitle = ''; }
  });

  /* ---------------- запуск ---------------- */
  $('#year').textContent = new Date().getFullYear();
  $('#credit').textContent = D.credit ? T('foot.made') + ' ' + D.credit : '';
  daySun.v = nowV() == null ? 0 : nowV();
  applyLang(lang, false);
  heroMeasure(); heroUpdate(); daySun.layout();
  setInterval(function () { renderStatus(); placeNow(); }, 30000);
  whenIntroDone(function () {
    var h = window.__savvaHash, nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (h && !(nav && nav.type === 'reload')) { var t = document.querySelector(h); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
    else scrollTo(0, 0);
  });
})();
