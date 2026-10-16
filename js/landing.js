// ── Configuración de la API ───────────────────────────────────────────────────
// Cambia esta URL si tu API Node.js corre en otro puerto o dominio
const API_BASE = 'https://perugym.netlify.app';

// ── Optimiza URLs de Cloudinary automáticamente ───────────────────────────────
function cloudinaryOpt(url, width = 800) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

// ── Skeleton para planes mientras carga ───────────────────────────────────────
document.getElementById('plans-grid').innerHTML = Array.from({ length: 3 }, () =>
  '<div class="skeleton" aria-hidden="true"><span></span><span></span><span></span><span></span></div>'
).join('');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

async function fetchPublic(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!response.ok) throw new Error('Servicio no disponible');
    return await response.json();
  } finally { clearTimeout(timer); }
}

// ── Cargar landing e imágenes en paralelo ─────────────────────────────────────
Promise.all([
  fetchPublic('/api/landing').catch(() => ({})),
  fetchPublic('/api/planes/public').catch(() => null),
]).then(([cfg, plans]) => {

  // ── Imágenes del landing ──
  if (cfg.hero_bg_url) {
    const hero = document.getElementById('hero-bg');
    hero.src = cloudinaryOpt(cfg.hero_bg_url, 1100);
    hero.srcset = [480, 800, 1100].map(w => `${cloudinaryOpt(cfg.hero_bg_url, w)} ${w}w`).join(', ');
    hero.sizes = '(max-width:700px) calc(100vw - 40px), 600px';
  }
  if (cfg.about_img_url) {
    const aboutImg = document.getElementById('about-img');
    aboutImg.src = cloudinaryOpt(cfg.about_img_url, 800);
    aboutImg.loading = 'lazy';
  }

  // ── Planes ──
  const grid = document.getElementById('plans-grid');
  grid.setAttribute('aria-busy', 'false');
  if (!Array.isArray(plans) || !plans.length) {
    grid.innerHTML = `<div class="plans-status"><p>${plans === null ? 'No pudimos cargar los planes. Intenta nuevamente en unos minutos.' : 'Sin planes disponibles por el momento.'}</p><a href="#contacto">Consulta con nuestro equipo</a></div>`;
    return;
  }
  grid.innerHTML = plans.map((p, index) => {
    const featured = p.destacado;
    const features = (Array.isArray(p.caracteristicas) ? p.caracteristicas : []).filter(f => !/todo en plan pro/i.test(f));
    return `
      <div class="plan-card ${featured ? 'featured' : ''}" data-reveal data-reveal-delay="${index * 70}">
        ${featured ? '<div class="plan-badge">PLAN DESTACADO</div>' : ''}
        <h3 class="plan-name">${escapeHtml(p.nombre)}</h3>
        <div class="plan-sub">${escapeHtml(p.descripcion || '')}</div>
        <div class="plan-price"><sup>S/</sup> ${parseFloat(p.precio).toFixed(0)}<span>/mes</span></div>
        <ul class="plan-features">
          ${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
        <button data-plan="${escapeHtml(p._id)}" class="btn-plan ${featured ? 'btn-plan-red' : 'btn-plan-outline'}" aria-label="Elegir plan ${escapeHtml(p.nombre)}">Elegir este plan <span class="plan-arrow" aria-hidden="true">↗</span></button>
      </div>`;
  }).join('');
  window.GymMotion?.register(grid);
  grid.querySelectorAll('[data-plan]').forEach(button => {
    button.addEventListener('click', () => {
      const plan = plans.find(p => p._id === button.dataset.plan);
      if (plan) abrirSolicitud(plan._id, plan.nombre, Number(plan.precio));
    });
  });
});

// ── Validación en tiempo real ─────────────────────────────────────────────────
function setFieldState(campo, state) {
  const input  = document.getElementById('sol-' + campo);
  const err    = document.getElementById('sol-' + campo + '-err');
  const ok     = document.getElementById('sol-' + campo + '-ok');
  if (!input) return;
  input.classList.remove('is-valid', 'is-error');
  input.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
  if (ok) { ok.style.display = 'none'; ok.style.color = '#22c55e'; }
  if (err) err.classList.remove('visible');
  if (state === 'valid') {
    input.classList.add('is-valid');
    if (ok) ok.style.display = 'block';
  } else if (state === 'error') {
    input.classList.add('is-error');
    if (err) err.classList.add('visible');
  }
}

function validarCampo(campo) {
  const input = document.getElementById('sol-' + campo);
  if (!input) return true;
  const val = input.value.trim();

  if (campo === 'nombre') {
    if (!val) { setFieldState('nombre', 'idle'); return false; }
    if (val.length < 3) {
      const errEl = document.getElementById('sol-nombre-err');
      if (errEl) errEl.textContent = 'El nombre debe tener al menos 3 caracteres.';
      setFieldState('nombre', 'error'); return false;
    }
    if (val.length > 80) {
      const errEl = document.getElementById('sol-nombre-err');
      if (errEl) errEl.textContent = 'El nombre es demasiado largo.';
      setFieldState('nombre', 'error'); return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(val)) {
      const errEl = document.getElementById('sol-nombre-err');
      if (errEl) errEl.textContent = 'Solo se permiten letras y espacios.';
      setFieldState('nombre', 'error'); return false;
    }
    setFieldState('nombre', 'valid'); return true;
  }

  if (campo === 'telefono') {
    if (!val) { setFieldState('telefono', 'idle'); return false; }
    const digits = val.replace(/\D/g, '');
    const errMsg = document.getElementById('sol-telefono-err-msg');
    if (digits.length !== 9) {
      if (errMsg) errMsg.textContent = 'El teléfono debe tener exactamente 9 dígitos.';
      setFieldState('telefono', 'error'); return false;
    }
    if (!digits.startsWith('9')) {
      if (errMsg) errMsg.textContent = 'El número debe empezar con 9 (celular peruano).';
      setFieldState('telefono', 'error'); return false;
    }
    setFieldState('telefono', 'valid'); return true;
  }

  if (campo === 'email') {
    if (!val) { setFieldState('email', 'idle'); return true; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!emailOk) { setFieldState('email', 'error'); return false; }
    setFieldState('email', 'valid'); return true;
  }

  return true;
}

// ── Abrir modal ───────────────────────────────────────────────────────────────
let solicitudTrigger;
let solicitudClosing = false;
function abrirSolicitud(planId, planNombre, planPrecio) {
  if (solicitudClosing) return;
  window.ChatBot?.close();
  solicitudTrigger = document.activeElement;
  document.getElementById('sol-send-error')?.remove();
  document.getElementById('sol-plan-id').value = planId;
  document.getElementById('sol-modal-title').textContent = planNombre;
  document.getElementById('sol-modal-sub').textContent = 'Déjanos tus datos y te contactamos';
  document.getElementById('sol-price-display').textContent = 'S/ ' + planPrecio;

  ['nombre','telefono','email'].forEach(c => {
    const el = document.getElementById('sol-' + c);
    if (el) el.value = '';
    setFieldState(c, 'idle');
  });
  const dniEl = document.getElementById('sol-dni');
  if (dniEl) { dniEl.value = ''; dniEl.style.borderColor = ''; }

  const btn = document.getElementById('sol-btn-enviar');
  btn.disabled = false;
  btn.classList.remove('loading');
  btn.querySelector('.btn-text').textContent = 'Quiero que me contacten';

  document.getElementById('sol-form-wrap').style.display = 'block';
  document.getElementById('sol-success-wrap').style.display = 'none';

  const modal = document.getElementById('modal-solicitud');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.querySelector('main').inert = true;
  document.querySelector('header').inert = true;
  document.querySelector('footer').inert = true;
  const chatToggle = document.getElementById('chat-toggle-btn');
  if (chatToggle) chatToggle.inert = true;
  document.body.style.overflow = 'hidden';

  document.getElementById('sol-nombre').focus({ preventScroll: true });
  window.GymMotion?.animate(modal, [{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
  window.GymMotion?.animate(modal.querySelector('.sol-card'), [
    { transform: 'translateY(16px) scale(.985)' }, { transform: 'translateY(0) scale(1)' }
  ]);
}

async function cerrarSolicitud() {
  const modal = document.getElementById('modal-solicitud');
  if (modal.getAttribute('aria-hidden') === 'true' || solicitudClosing) return;
  solicitudClosing = true;
  modal.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
  await window.GymMotion?.animate(modal.querySelector('.sol-card'), [
    { opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(12px)' }
  ], { duration: 180 });
  modal.style.display = 'none';
  document.querySelector('main').inert = false;
  document.querySelector('header').inert = false;
  document.querySelector('footer').inert = false;
  const chatToggle = document.getElementById('chat-toggle-btn');
  if (chatToggle) chatToggle.inert = false;
  document.body.style.overflow = '';
  solicitudTrigger?.focus();
  modal.setAttribute('aria-hidden', 'true');
  solicitudClosing = false;
}

document.getElementById('modal-solicitud').addEventListener('click', function(e) {
  if (e.target === this) cerrarSolicitud();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') cerrarSolicitud();
  if (e.key === 'Tab' && document.getElementById('modal-solicitud').getAttribute('aria-hidden') === 'false') {
    const controls = [...document.querySelectorAll('#modal-solicitud button, #modal-solicitud input:not([type="hidden"])')].filter(el => el.offsetParent && el.tabIndex >= 0 && !el.disabled);
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// ── Enviar solicitud ──────────────────────────────────────────────────────────
async function enviarSolicitud() {
  if (document.getElementById('sol-btn-enviar').disabled) return;
  const nombreOk   = validarCampo('nombre');
  const telefonoOk = validarCampo('telefono');
  const emailOk    = validarCampo('email');

  if (!document.getElementById('sol-nombre').value.trim()) setFieldState('nombre', 'error');
  if (!document.getElementById('sol-telefono').value.trim()) setFieldState('telefono', 'error');

  if (!nombreOk || !telefonoOk || !emailOk) {
    const firstErr = document.querySelector('.sol-input-wrap input.is-error');
    if (firstErr) {
      firstErr.style.animation = 'none';
      firstErr.offsetHeight;
      firstErr.style.animation = 'shake 0.35s ease';
      setTimeout(() => firstErr.style.animation = '', 400);
      firstErr.focus();
    }
    return;
  }

  const nombre   = document.getElementById('sol-nombre').value.trim();
  const telefono = document.getElementById('sol-telefono').value.trim();
  const email    = document.getElementById('sol-email').value.trim();
  const planId   = document.getElementById('sol-plan-id').value;
  const dni      = document.getElementById('sol-dni')?.value.trim() || '';
  const website  = document.getElementById('sol-website').value;

  const btn = document.getElementById('sol-btn-enviar');
  btn.disabled = true;
  btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent = 'Enviando solicitud...';

  try {
    const res = await fetch(`${API_BASE}/api/solicitudes/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        dni:      dni || undefined,
        telefono: telefono.replace(/\D/g, ''),
        email:    email || undefined,
        plan_id:  planId,
        website,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al enviar');

    document.getElementById('sol-success-nombre').textContent = nombre.split(' ')[0];
    document.getElementById('sol-form-wrap').style.display = 'none';
    document.getElementById('sol-success-wrap').style.display = 'block';
    document.querySelector('#sol-success-wrap button').focus();
    window.GymMotion?.animate(document.getElementById('sol-success-wrap'), [
      { opacity: .4, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }
    ]);
    window.GymMotion?.animate(document.querySelector('.success-mark'), [
      { transform: 'scale(.85)' }, { transform: 'scale(1)' }
    ], { duration: 220 });

  } catch (err) {
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.querySelector('.btn-text').textContent = 'Quiero que me contacten';

    const msg = err.message || '';
    if (msg.toLowerCase().includes('nombre')) {
      setFieldState('nombre', 'error');
      const errEl = document.getElementById('sol-nombre-err');
      if (errEl) errEl.querySelector && (errEl.textContent = msg);
    } else if (msg.toLowerCase().includes('teléfono') || msg.toLowerCase().includes('número')) {
      setFieldState('telefono', 'error');
      const errMsg = document.getElementById('sol-telefono-err-msg');
      if (errMsg) errMsg.textContent = msg;
    } else if (msg.toLowerCase().includes('email')) {
      setFieldState('email', 'error');
    } else if (msg.toLowerCase().includes('espera') || msg.toLowerCase().includes('intentos')) {
      mostrarErrorEnvio(msg);
    } else {
      mostrarErrorEnvio(msg || 'No se pudo enviar. Por favor intenta de nuevo.');
    }
  }
}

function mostrarErrorEnvio(texto) {
  const existing = document.getElementById('sol-send-error');
  if (existing) existing.remove();
  const errDiv = document.createElement('div');
  errDiv.id = 'sol-send-error';
  errDiv.setAttribute('role', 'alert');
  errDiv.style.cssText = 'background:rgba(230,57,70,0.1);border:1px solid rgba(230,57,70,0.3);border-radius:8px;padding:10px 14px;font-size:13px;color:#e63946;margin-top:12px;text-align:center;line-height:1.4';
  errDiv.textContent = texto;
  const btn = document.getElementById('sol-btn-enviar');
  btn.parentNode.insertBefore(errDiv, btn.nextSibling);
  setTimeout(() => errDiv.remove(), 5000);
}

// Shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(shakeStyle);

// ── Menú hamburguesa (landing) ────────────────────────────────────────────────
(function() {
  const btn   = document.getElementById('hamburger-nav');
  const menu  = document.getElementById('nav-links');
  if (!btn || !menu) return;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);
  const mobileMenu = matchMedia('(max-width: 900px)');
  menu.inert = mobileMenu.matches;

  function openMenu() {
    menu.inert = false;
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
    overlay.classList.add('visible');
    requestAnimationFrame(() => overlay.classList.add('active'));
    menu.querySelector('a').focus();
  }

  function closeMenu() {
    if (menu.contains(document.activeElement)) btn.focus({ preventScroll: true });
    menu.inert = mobileMenu.matches;
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
    overlay.classList.remove('active');
    overlay.classList.remove('visible');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && menu.classList.contains('open')) {
      const links = [...menu.querySelectorAll('a')];
      if (e.shiftKey && document.activeElement === links[0]) { e.preventDefault(); btn.focus(); }
      else if (!e.shiftKey && document.activeElement === links[links.length - 1]) { e.preventDefault(); btn.focus(); }
      else if (document.activeElement === btn) { e.preventDefault(); (e.shiftKey ? links[links.length - 1] : links[0]).focus(); }
    }
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      btn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menu.classList.contains('open')) closeMenu();
    menu.inert = mobileMenu.matches && !menu.classList.contains('open');
  });
})();
document.getElementById('year').textContent = new Date().getFullYear();

// A visible external destination remains available while the lazy map loads.
const mapFrame = document.querySelector('.contact-grid iframe');
const mapPanel = document.createElement('div');
mapPanel.className = 'map-panel';
mapFrame.before(mapPanel);
mapPanel.append(mapFrame);
const mapLink = document.createElement('a');
mapLink.className = 'map-caption';
mapLink.href = 'https://www.google.com/maps/search/?api=1&query=-6.759794093236814,-79.862904925542';
mapLink.target = '_blank';
mapLink.rel = 'noopener noreferrer';
mapLink.innerHTML = '<span><i class="fas fa-location-dot" aria-hidden="true"></i> Encuentra tu próximo punto de partida</span><strong>Abrir Google Maps ↗</strong>';
mapPanel.append(mapLink);
