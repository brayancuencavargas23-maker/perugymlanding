/* Progressive enhancement: elements are never hidden while waiting for JS/scroll. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const registered = new WeakSet();
  const seen = new WeakSet();
  const ease = 'cubic-bezier(.2,.7,.2,1)';

  function animate(element, frames, options = {}) {
    if (!element || preference.matches || !element.animate) return Promise.resolve();
    const animation = element.animate(frames, { duration: 220, easing: ease, fill: 'backwards', ...options });
    active.add(animation);
    return animation.finished.catch(() => {}).finally(() => {
      active.delete(animation);
      animation.cancel();
    });
  }

  function reveal(element) {
    if (seen.has(element)) return;
    seen.add(element);
    observer?.unobserve(element);
    const mobile = matchMedia('(max-width: 700px)').matches;
    // The element remains readable even during the reveal; the H1 never fades out.
    const isTitle = element.matches('h1');
    animate(element, [
      { opacity: isTitle ? 1 : .35, transform: `translateY(${mobile ? 12 : 20}px)` },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: mobile ? 350 : 460, delay: Number(element.dataset.revealDelay || 0) });
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: .08 }) : null;

  function register(root = document) {
    root.querySelectorAll('[data-reveal]').forEach(element => {
      if (registered.has(element)) return;
      registered.add(element);
      if (preference.matches || !observer) seen.add(element);
      else observer.observe(element);
    });
  }

  function group(selector, step = 70) {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.reveal = '';
      element.dataset.revealDelay = Math.min(index * step, 210);
    });
  }

  function setupFaq() {
    document.querySelectorAll('.faq-item').forEach(details => {
      const summary = details.querySelector('summary');
      let animation;
      let expanded = details.open;
      summary.addEventListener('click', event => {
        if (preference.matches || !details.animate) return; // Preserve native details behavior.
        event.preventDefault();
        const from = details.getBoundingClientRect().height;
        animation?.cancel();
        expanded = !expanded;
        details.dataset.expanded = String(expanded);
        details.open = true;
        const to = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
        details.style.overflow = 'hidden';
        animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 220, easing: ease });
        const current = animation;
        active.add(current);
        current.finished.catch(() => {}).then(() => {
          active.delete(current);
          if (animation !== current) return;
          details.open = expanded;
          details.style.overflow = '';
          delete details.dataset.expanded;
          animation = null;
        });
      });
      details.addEventListener('toggle', () => { if (!animation) expanded = details.open; });
    });
  }

  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    active.forEach(animation => animation.finish());
    observer?.disconnect();
    document.querySelectorAll('[data-reveal]').forEach(element => seen.add(element));
  });

  window.GymMotion = { animate, register };
  function init() {
    group('.hero-content > .eyebrow, .hero h1, .hero-desc, .hero-actions', 65);
    group('.photo-label', 0);
    group('.benefits article');
    group('.about-visual, .about-copy', 90);
    group('.image-caption span, .contact-top .slashes', 0);
    group('.section-heading, .faq-grid > div, .contact-top > div, .contact-top > .button', 60);
    register();
    setupFaq();
    // Keyboard navigation must never focus a partly transparent animated control.
    document.addEventListener('focusin', event => {
      const target = event.target.closest('[data-reveal]');
      if (!target) return;
      seen.add(target);
      observer?.unobserve(target);
      target.getAnimations().forEach(animation => animation.finish());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
