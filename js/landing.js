// ── Configuración de la API ───────────────────────────────────────────────────
// Cambia esta URL si tu API Node.js corre en otro puerto o dominio
const API_BASE = 'https://perugym.netlify.app';

// ── Optimiza URLs de Cloudinary automáticamente ───────────────────────────────
function cloudinaryOpt(url, width = 800) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

// ── Skeleton para planes mientras carga ───────────────────────────────────────
document.getElementById('plans-grid').innerHTML = Array.from({ length: 3 }, () => `
  <div style="background:#1a1a1a;border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:14px;min-height:320px">
    <div style="height:22px;width:55%;border-radius:6px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite"></div>
    <div style="height:14px;width:70%;border-radius:6px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite"></div>
    <div style="height:36px;width:45%;border-radius:6px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite;margin:8px 0"></div>
    <div style="height:12px;width:80%;border-radius:6px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite"></div>
    <div style="height:12px;width:65%;border-radius:6px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite"></div>
    <div style="height:12px;width:72%;border-radius:6px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite"></div>
    <div style="height:44px;border-radius:8px;background:linear-gradient(90deg,#2a2a2a 25%,#333 50%,#2a2a2a 75%);background-size:400px 100%;animation:_sk 1.4s ease-in-out infinite;margin-top:auto"></div>
  </div>
`).join('') + '<style>@keyframes _sk{0%{background-position:-400px 0}100%{background-position:400px 0}}</style>';

// ── Cargar landing e imágenes en paralelo ─────────────────────────────────────
Promise.all([
  fetch(`${API_BASE}/api/landing`).then(r => r.json()).catch(() => ({})),
  fetch(`${API_BASE}/api/planes/public`).then(r => r.json()).catch(() => []),
]).then(([cfg, plans]) => {

  // ── Imágenes del landing ──
  if (cfg.logo_url) {
    document.getElementById('nav-logo-img').src = cloudinaryOpt(cfg.logo_url, 120);
    document.getElementById('nav-logo-img').style.display = 'block';
    document.getElementById('nav-logo-text').style.display = 'none';
  }
  if (cfg.about_logo_url) {
    const overlay = document.querySelector('.about-logo-overlay');
    if (overlay) {
      overlay.innerHTML = `<img src="${cloudinaryOpt(cfg.about_logo_url, 200)}" alt="Peru Gym" loading="lazy" style="width:100%;height:100%;object-fit:contain;border-radius:50%;padding:16px">`;
    }
  }
  if (cfg.hero_bg_url) {
    document.getElementById('hero-bg').style.backgroundImage =
      `linear-gradient(to right, rgba(10,10,10,0.95) 45%, rgba(10,10,10,0.3) 100%), url('${cloudinaryOpt(cfg.hero_bg_url, 1400)}')`;
  }
  if (cfg.about_img_url) {
    const aboutImg = document.getElementById('about-img');
    aboutImg.src = cloudinaryOpt(cfg.about_img_url, 800);
    aboutImg.loading = 'lazy';
  }

  // ── Planes ──
  const grid = document.getElementById('plans-grid');
  if (!plans.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#666;padding:40px">Sin planes disponibles por el momento.</div>';
    return;
  }
  grid.innerHTML = plans.map(p => {
    const featured = p.destacado;
    const features = p.caracteristicas || [];
    return `
      <div class="plan-card ${featured ? 'featured' : ''}">
        ${featured ? '<div class="plan-badge">Más Popular</div>' : ''}
        <div class="plan-name">${p.nombre}</div>
        <div class="plan-sub">${p.descripcion || ''}</div>
        <div class="plan-price"><sup>S/</sup> ${parseFloat(p.precio).toFixed(0)}<span>/mes</span></div>
        <ul class="plan-features">
          ${features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button onclick="abrirSolicitud('${p._id}','${p.nombre.replace(/'/g,"\\'")}',${parseFloat(p.precio).toFixed(0)})" class="btn-plan ${featured ? 'btn-plan-red' : 'btn-plan-outline'}">Elegir Plan</button>
      </div>`;
  }).join('');
});

// ── Validación en tiempo real ─────────────────────────────────────────────────
function setFieldState(campo, state) {
  const input  = document.getElementById('sol-' + campo);
  const err    = document.getElementById('sol-' + campo + '-err');
  const ok     = document.getElementById('sol-' + campo + '-ok');
  if (!input) return;
  input.classList.remove('is-valid', 'is-error');
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
function abrirSolicitud(planId, planNombre, planPrecio) {
  document.getElementById('sol-plan-id').value = planId;
  document.getElementById('sol-modal-title').textContent = planNombre;
  document.getElementById('sol-modal-sub').textContent = 'Déjanos tus datos y te contactamos hoy';
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

  document.getElementById('sol-form-wrap').style.display = 'block';
  document.getElementById('sol-success-wrap').style.display = 'none';

  const modal = document.getElementById('modal-solicitud');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('sol-nombre').focus(), 100);
}

function cerrarSolicitud() {
  document.getElementById('modal-solicitud').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('modal-solicitud').addEventListener('click', function(e) {
  if (e.target === this) cerrarSolicitud();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') cerrarSolicitud();
});

// ── Enviar solicitud ──────────────────────────────────────────────────────────
async function enviarSolicitud() {
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
      mostrarErrorEnvio('⏳ ' + msg);
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

  function openMenu() {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
    overlay.classList.add('visible');
    requestAnimationFrame(() => overlay.classList.add('active'));
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
    overlay.classList.remove('active');
    overlay.addEventListener('transitionend', () => overlay.classList.remove('visible'), { once: true });
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
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      btn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menu.classList.contains('open')) closeMenu();
  });
})();
