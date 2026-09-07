/* ════════════════════════════════════════════════════════════
   EARTHRIXX — studio interactions (vanilla JS, no deps)
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finePointer = window.matchMedia('(hover: hover), (pointer: fine)').matches;
  /* real touch devices: disable hover previews on first touch */
  window.addEventListener('touchstart', () => { finePointer = false; }, { once: true, passive: true });

  /* ── 1. Preloader ─────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  const loadCount = document.getElementById('loadCount');
  const loadBar = document.getElementById('loadBar');

  function finishLoading() {
    preloader.classList.add('done');
    document.body.classList.add('loaded');
    preloader.setAttribute('aria-hidden', 'true');
    setTimeout(() => { preloader.style.display = 'none'; }, 1000);
  }

  if (prefersReduced) {
    finishLoading();
  } else {
    let pct = 0;
    const tick = setInterval(() => {
      pct += Math.floor(Math.random() * 12) + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(tick);
        loadCount.textContent = '100%';
        loadBar.style.width = '100%';
        setTimeout(finishLoading, 350);
      } else {
        loadCount.textContent = pct + '%';
        loadBar.style.width = pct + '%';
      }
    }, 90);
  }

  /* ── 2. Custom cursor ─────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (finePointer && !prefersReduced) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t) return;
      ring.classList.add(t.dataset.cursor === 'play' ? 'play' : 'grow');
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t) return;
      ring.classList.remove('play', 'grow');
    });
  } else {
    cursor.style.display = 'none';
    ring.style.display = 'none';
  }

  /* ── 3. Header scroll state ───────────────────────────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── 4. Mobile menu ───────────────────────────────────── */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  function toggleMenu(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  }

  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  /* ── 5. Scroll reveals ────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ── 6. Work hover videos (lazy src) ──────────────────── */
  const workItems = document.querySelectorAll('.work__item');

  workItems.forEach((item) => {
    const video = item.querySelector('video');
    const src = item.dataset.video;

    item.addEventListener('mouseenter', () => {
      if (!finePointer) return;
      if (!video.getAttribute('src')) video.src = src;
      video.play().catch(() => {});
      item.classList.add('is-playing');
    });

    item.addEventListener('mouseleave', () => {
      video.pause();
      item.classList.remove('is-playing');
    });

    /* touch devices: tap once = preview, handled via focus/click */
    item.addEventListener('click', () => {
      if (finePointer) return;
      if (!video.getAttribute('src')) video.src = src;
      video.play().catch(() => {});
      item.classList.add('is-playing');
      setTimeout(() => {
        video.pause();
        item.classList.remove('is-playing');
      }, 4500);
    });
  });

  /* ── 7. Video modal ───────────────────────────────────── */
  const modal = document.getElementById('modal');
  const modalVideo = document.getElementById('modalVideo');
  const modalClose = document.getElementById('modalClose');

  function openModal(src) {
    modalVideo.src = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modalVideo.play().catch(() => {});
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }

  workItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openModal(item.dataset.video);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      if (menu.classList.contains('open')) toggleMenu(false);
    }
  });

  /* ── 8. Animated counters ─────────────────────────────── */
  const stats = document.querySelectorAll('.stat__num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1500;
      const start = performance.now();

      (function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      })(start);

      statObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  stats.forEach((s) => statObserver.observe(s));

  /* ── 9. Local time clock ──────────────────────────────── */
  const clock = document.getElementById('clock');

  function updateClock() {
    const d = new Date();
    clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, '0'))
      .join(':');
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* ── 10. Magnetic buttons ─────────────────────────────── */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }
})();
