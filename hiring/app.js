/* ═══════════════════════════════════════════════════════════
   MADRAS SOCIAL — front-end behaviour
   Forms post JSON to CONFIG.ENDPOINT (Google Apps Script).
   With no endpoint set, forms run in preview mode.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var C = window.CONFIG || { ROLES: [], ENDPOINT: '', REF_PREFIX: 'MS-2026', RESUME_MAX_MB: 5 };

  /* ── source tracking (?src=qr / poster / ig ...) ── */
  var SRC = new URLSearchParams(location.search).get('src') || 'direct';
  document.querySelectorAll('.src-field').forEach(function (i) { i.value = SRC; });

  /* ── roles: cards + dropdown + counts ── */
  var list = document.getElementById('role-list');
  var sel = document.getElementById('a-role');
  if (list && sel) {
    sel.innerHTML = '<option value="" disabled selected>Choose a role</option>';
    C.ROLES.forEach(function (r) {
      var d = document.createElement('div');
      d.className = 'role-open';
      d.innerHTML =
        '<span class="ro-title">' + r.title + '</span>' +
        (r.urgent ? '<span class="badge urgent">Urgent — Immediate Hire</span>' : '') +
        '<span class="badge gold">' + r.openings + ' opening' + (r.openings > 1 ? 's' : '') + '</span>' +
        (r.type ? '<span class="badge">' + r.type + '</span>' : '') +
        '<a class="btn btn-gold ro-btn" href="#apply" data-prefill="' + r.title + '">Apply</a>';
      list.appendChild(d);
      sel.insertAdjacentHTML('beforeend', '<option>' + r.title + '</option>');
    });
    sel.insertAdjacentHTML('beforeend', '<option>Talent pool — keep me on file</option>');
    var count = C.ROLES.reduce(function (n, r) { return n + (r.openings || 1); }, 0);
    var rc = document.getElementById('role-count'); if (rc) rc.textContent = count;
    var rk = document.getElementById('role-kinds'); if (rk) rk.textContent = C.ROLES.length;
  }

  /* ── prefill role from cards / talent pool ── */
  document.addEventListener('click', function (e) {
    var pre = e.target.closest('[data-prefill]');
    if (pre && sel) sel.value = pre.getAttribute('data-prefill');
    if (e.target.id === 'talent-btn' && sel) sel.value = 'Talent pool — keep me on file';
  });

  /* ── availability chips ── */
  document.querySelectorAll('#a-avail .chip').forEach(function (c) {
    function toggle() { c.classList.toggle('on'); }
    c.addEventListener('click', toggle);
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* ── resume upload ── */
  var drop = document.getElementById('resume-drop');
  var fileInput = document.getElementById('a-resume');
  var fileChip = document.getElementById('file-chip');
  var resumeErr = document.getElementById('resume-err');
  var resume = null; // {name, mime, data}
  var resumeReading = false; // FileReader is async and resume is required now
  var MAXMB = (C.RESUME_MAX_MB || 5);
  function resumeFail(msg) {
    resumeErr.textContent = msg;
    resumeErr.style.display = 'block';
    fileInput.value = '';
    resumeReading = false;
  }
  function setFile(f) {
    resumeErr.style.display = 'none';
    if (!f) return;
    if (f.size > MAXMB * 1024 * 1024) {
      resumeFail('That file is over ' + MAXMB + ' MB \u2014 a smaller PDF works best.'); return;
    }
    if (!/\.(pdf|doc|docx)$/i.test(f.name)) {
      resumeFail('PDF or Word files only, please.'); return;
    }
    var reader = new FileReader();
    resumeReading = true;
    reader.onload = function () {
      resume = { name: f.name, mime: f.type || 'application/octet-stream', data: String(reader.result).split(',')[1] };
      fileChip.textContent = '✓ ' + f.name;
      fileChip.style.display = 'block';
      drop.classList.remove('err');
      resumeReading = false;
    };
    reader.onerror = function () { resumeFail('That file could not be read \u2014 try another.'); };
    reader.readAsDataURL(f);
  }
  if (drop) {
    drop.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function () { setFile(fileInput.files[0]); });
    ['dragover', 'dragenter'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('drag'); }); });
    drop.addEventListener('drop', function (e) { setFile(e.dataTransfer.files[0]); });
  }

  /* ── validation helpers ── */
  function showErr(input, on) {
    if (!input) return;
    input.classList.toggle('err', on);
    var m = document.querySelector('.err-msg[data-for="' + input.id + '"]');
    if (m) m.style.display = on ? 'block' : 'none';
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  /* ── submission ── */
  function post(payload, onDone, onFail) {
    if (!C.ENDPOINT) {
      // preview mode — no backend yet
      setTimeout(function () { onDone({ ok: true, ref: C.REF_PREFIX + '-' + (100 + Math.floor(Math.random() * 900)), preview: true }); }, 400);
      return;
    }
    fetch(C.ENDPOINT, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(onDone)
      .catch(onFail);
  }

  function swap(formEl, confirmEl) {
    formEl.style.display = 'none';
    confirmEl.style.display = 'block';
    confirmEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;

    /* honeypot: pretend success */
    if (f.company_website && f.company_website.value) {
      var conf0 = document.getElementById(f.id === 'notify-form' ? 'notify-confirm' : 'apply-confirm');
      swap(f, conf0); return;
    }

    if (f.id === 'notify-form') {
      var em = f.querySelector('#n-email');
      var okN = validEmail(em.value.trim());
      showErr(em, !okN);
      if (!okN) return;
      post({
        kind: 'notify',
        email: em.value.trim(),
        phone: (f.querySelector('#n-phone') || {}).value || '',
        postal: (f.querySelector('#n-postal') || {}).value || '',
        source: SRC, page: location.pathname
      }, function (res) {
        if (res && res.ok === false) {
          alert("Something hiccuped — try once more, or email hello@madrassocial.ca and we'll add you by hand.");
          return;
        }
        swap(f, document.getElementById('notify-confirm'));
      }, function () { alert("Something hiccuped — try once more, or email hello@madrassocial.ca and we'll add you by hand."); });
    }

    if (f.id === 'apply-form') {
      var name = f.querySelector('#a-name'), phone = f.querySelector('#a-phone'),
          email = f.querySelector('#a-email'), start = f.querySelector('#a-start');
      var ok = true;
      var vName = name.value.trim().length > 1; showErr(name, !vName); ok = ok && vName;
      var vPhone = phone.value.replace(/\D/g, '').length >= 10; showErr(phone, !vPhone); ok = ok && vPhone;
      var vEmail = validEmail(email.value.trim()); showErr(email, !vEmail); ok = ok && vEmail;
      var vStart = !!start.value; showErr(start, !vStart); ok = ok && vStart;
      var vRole = !!sel.value; showErr(sel, !vRole); ok = ok && vRole;
      var vResume = !!resume;
      if (drop) drop.classList.toggle('err', !vResume);
      if (!vResume) {
        resumeErr.textContent = resumeReading
          ? 'Still reading your file \u2014 give it a second and send again.'
          : 'Please attach your resume \u2014 PDF or Word, max ' + MAXMB + ' MB.';
        resumeErr.style.display = 'block';
      }
      ok = ok && vResume;
      if (!ok) { f.querySelector('.err') && f.querySelector('.err').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

      var avail = Array.prototype.map.call(document.querySelectorAll('#a-avail .chip.on'), function (c) { return c.getAttribute('data-v'); }).join(', ');
      var btn = document.getElementById('apply-submit');
      btn.disabled = true; btn.textContent = 'Sending…';

      post({
        kind: 'application',
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        role: sel.value,
        type: (f.querySelector('#a-type') || {}).value || '',
        availability: avail,
        experience: (f.querySelector('#a-exp') || {}).value || '',
        start: start.value,
        referral: (f.querySelector('#a-ref') || {}).value || '',
        note: (f.querySelector('#a-note') || {}).value || '',
        source: SRC, page: location.pathname,
        resume: resume
      }, function (res) {
        btn.disabled = false; btn.textContent = 'Send it in';
        if (res && res.duplicate) {
          alert('Looks like you already applied with this number — one application covers you. We have it.');
          return;
        }
        // The backend can answer 200 and still have failed (sheet not shared,
        // bad payload). Without this the applicant sees "received" and their
        // application is nowhere.
        if (res && res.ok === false) {
          alert("Something hiccuped — try once more, or email hello@madrassocial.ca with your name and number.");
          return;
        }
        document.getElementById('apply-ref').textContent = (res && res.ref) || C.REF_PREFIX;
        swap(f, document.getElementById('apply-confirm'));
      }, function () {
        btn.disabled = false; btn.textContent = 'Send it in';
        alert("Something hiccuped — try once more, or email hello@madrassocial.ca with your name and number.");
      });
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   FX ENGINE — orbital menu · image stream · mask reveals ·
   scroll reveals · parallax · 3D tilt
   All vanilla, no dependencies. Honours prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var C = window.CONFIG || {};
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) document.documentElement.classList.add('reduced-motion');

  /* ── 1 · ORBITAL CIRCLE MENU ── */
  var orbit = document.getElementById('orbit');
  if (orbit && C.MENU && C.MENU.length) {
    var detail = document.getElementById('menu-detail');
    var elNum = document.getElementById('menu-num');
    var elName = document.getElementById('menu-name');
    var elDesc = document.getElementById('menu-desc');
    var N = C.MENU.length;
    var nodes = [];
    var offset = -Math.PI / 2;      // start at 12 o'clock
    var active = 0, autoplay = true, hovering = false;

    C.MENU.forEach(function (m, i) {
      var d = document.createElement('div');
      d.className = 'mnode';
      d.innerHTML = '<div class="mnode-inner" role="button" tabindex="0" aria-label="' + m.name + '">' +
        '<span class="n">0' + (i + 1) + '</span><span class="t">' + m.name + '</span></div>';
      var inner = d.firstChild;
      inner.style.transitionDelay = (0.08 * i) + 's,' + (0.08 * i) + 's,0s,0s,0s';
      function pick() { autoplay = false; setActive(i); }
      inner.addEventListener('click', pick);
      inner.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      orbit.appendChild(d);
      nodes.push(d);
    });

    function setActive(i, instant) {
      active = i;
      nodes.forEach(function (n, j) { n.classList.toggle('active', j === i); });
      if (instant) { render(i); return; }
      detail.classList.add('switching');
      setTimeout(function () { render(i); detail.classList.remove('switching'); }, 340);
    }
    function render(i) {
      elNum.textContent = '0' + (i + 1);
      elName.textContent = C.MENU[i].name;
      elDesc.textContent = C.MENU[i].desc;
    }
    render(0); nodes[0].classList.add('active');

    function place() {
      var R = orbit.clientWidth * 0.475;
      nodes.forEach(function (n, i) {
        var a = offset + (i * 2 * Math.PI / N);
        var x = Math.cos(a) * R, y = Math.sin(a) * R * 0.92;
        n.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,46px)';
      });
    }
    place();
    window.addEventListener('resize', place);

    // slow idle rotation (pauses on hover / reduced motion)
    if (!REDUCED) {
      (function spin(last) {
        requestAnimationFrame(function (t) {
          if (!hovering) { offset += 0.00028 * Math.min(t - (last || t), 50); place(); }
          spin(t);
        });
      })();
    }
    var wrap = document.getElementById('orbit-wrap');
    wrap.addEventListener('pointerenter', function () { hovering = true; });
    wrap.addEventListener('pointerleave', function () { hovering = false; orbit.style.transform = ''; });

    // 3D tilt toward the pointer
    if (!REDUCED) {
      wrap.addEventListener('pointermove', function (e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        orbit.style.transform = 'rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg)';
      });
    }

    // entrance + autoplay when scrolled into view
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          orbit.classList.add('live');
          seen.disconnect();
          if (!REDUCED) setInterval(function () { if (autoplay && !hovering) setActive((active + 1) % N); }, 4600);
        }
      });
    }, { threshold: 0.35 });
    seen.observe(orbit);
  }

  /* ── 2 · IMAGE STREAM (corridor out of the vanishing point) ── */
  var stage = document.querySelector('.stream-stage');
  if (stage) {
    var imgs = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];
    var PER_RAIL = 5, DUR = 18;
    ['left', 'right'].forEach(function (side, s) {
      for (var i = 0; i < PER_RAIL; i++) {
        var im = document.createElement('img');
        im.className = 's-card ' + side;
        var key = imgs[(s * PER_RAIL + i) % imgs.length];
        im.src = (window.PREVIEW_STREAM && window.PREVIEW_STREAM[key]) || ('assets/stream/' + key + '.jpg');
        im.alt = '';
        im.style.setProperty('--dur', DUR + 's');
        im.style.setProperty('--delay', (-i * DUR / PER_RAIL) + 's');
        im.style.top = (30 + (i % 2) * 26) + '%';
        stage.appendChild(im);
      }
    });
  }

  /* ── 3 · REVEAL-IMAGE-MASK (scroll-driven clip-path bloom) ── */
  var masks = Array.prototype.map.call(document.querySelectorAll('.mask-reveal'), function (el) {
    return { el: el, cur: 0, shape: el.getAttribute('data-shape') || 'circle' };
  });
  function maskTick() {
    var vh = innerHeight;
    masks.forEach(function (m) {
      var r = m.el.getBoundingClientRect();
      var target = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.62)));
      m.cur += (target - m.cur) * 0.14;                       // spring-ish smoothing
      if (Math.abs(target - m.cur) < 0.001) m.cur = target;
      var max = parseFloat(m.el.getAttribute('data-max') || 75);
      if (m.shape === 'circle') {
        m.el.style.clipPath = 'circle(' + (16 + m.cur * (max - 16)).toFixed(2) + '% at 50% 50%)';
      } else {
        m.el.style.clipPath = 'inset(' + ((1 - m.cur) * 30).toFixed(2) + '% round ' + ((1 - m.cur) * 24).toFixed(1) + 'px)';
      }
    });
  }

  /* ── 4 · SCROLL REVEALS (auto-applied) ── */
  var revealTargets = document.querySelectorAll('.slide-label, h1.display, h2.display, .lede, .tile, .role-open, .c-block > .eyebrow, .menu-detail, .orbit-wrap, .confirm-block, .fact, .people-motif, form .f-grid');
  var perSection = {};
  revealTargets.forEach(function (el) {
    var sec = el.closest('section, header, footer') || document.body;
    var k = sec.tagName + Array.prototype.indexOf.call(document.querySelectorAll('section,header,footer'), sec);
    perSection[k] = (perSection[k] || 0) + 1;
    el.classList.add('reveal');
    el.style.setProperty('--rd', (Math.min(perSection[k] - 1, 6) * 0.09) + 's');
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ── 4b · HERO — FOUR QUARTERS BECOMING ONE ──
     A quarter circle sits in each corner. Scrolling grows all four radii until
     they meet over the middle and read as a single uninterrupted image. The
     centre copy fades out as the picture closes over it. */
  var hrWrap = document.getElementById('hero-reveal');
  var hrQuads = document.querySelectorAll('#hero-reveal .hr-q');
  var hrImgs = document.querySelectorAll('#hero-reveal .hr-img');
  var hrCopy = document.getElementById('hr-copy');
  var hrCur = 0;
  // 71% is where four corner circles just cover the frame; 80% holds it a beat
  var HR_START = 38, HR_END = 80;
  function heroTick() {
    if (!hrWrap || !hrQuads.length) return;
    // travel = the run where the sticky panel is pinned, so the merge finishes
    // exactly as the hero releases (offsetTop accounts for the nav above it)
    var span = hrWrap.offsetHeight - innerHeight;
    var target = span > 0 ? Math.min(1, Math.max(0, (scrollY - hrWrap.offsetTop) / span)) : 1;
    hrCur += (target - hrCur) * 0.12;                       // same smoothing as the masks
    if (Math.abs(target - hrCur) < 0.001) hrCur = target;
    var e = hrCur * hrCur * (3 - 2 * hrCur);                // smoothstep — holds the four, then opens
    var r = (HR_START + e * (HR_END - HR_START)).toFixed(2);
    for (var i = 0; i < hrQuads.length; i++) {
      hrQuads[i].style.clipPath = 'circle(' + r + '% at ' + hrQuads[i].getAttribute('data-at') + ')';
    }
    var sc = (1.12 - e * 0.12).toFixed(4);
    for (var j = 0; j < hrImgs.length; j++) hrImgs[j].style.transform = 'scale(' + sc + ')';
    if (hrCopy) hrCopy.style.opacity = Math.max(0, 1 - Math.max(0, hrCur - 0.4) / 0.3).toFixed(3);
  }

  /* ── 5 · HERO PARALLAX ── */
  var heroBg = document.querySelector('.hero-bg');
  var heroInner = document.querySelector('.hero .inner');
  function parallax() {
    var y = scrollY;
    if (heroBg && y < innerHeight * 1.2) {
      heroBg.style.transform = 'translate3d(0,' + (y * 0.32).toFixed(1) + 'px,0) scale(1.12)';
      if (heroInner) heroInner.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0)';
    }
  }

  /* ── 6 · TILT CARDS (careers tiles) ── */
  if (!REDUCED) {
    document.querySelectorAll('.tile').forEach(function (t) {
      t.classList.add('tilt');
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = 'perspective(700px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateZ(8px)';
      });
      t.addEventListener('pointerleave', function () { t.style.transform = ''; });
    });
    document.querySelectorAll('.brand-motif, .people-motif, .motif-corner').forEach(function (m) { m.classList.add('floaty'); });
  }

  /* ── shared rAF loop ── */
  if (!REDUCED) {
    (function loop() { maskTick(); heroTick(); parallax(); requestAnimationFrame(loop); })();
  } else {
    masks.forEach(function (m) { m.el.style.clipPath = 'none'; });
  }
})();
