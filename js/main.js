/**
 * ================================================
 *  SHIRDEN DIGITAL - QR Code Generator
 *  Main JavaScript Module
 *  © 2025 שירדן שיווק דיגיטלי
 *  Uses: qrcodejs library (QRCode constructor)
 * ================================================
 */

'use strict';

/* ================================================
   DOM REFERENCES
   ================================================ */
const elements = {
  header:          document.querySelector('.site-header'),
  hamburger:       document.getElementById('hamburger'),
  mainNav:         document.getElementById('main-nav'),
  qrInput:         document.getElementById('qr-input'),
  inputClear:      document.getElementById('input-clear'),
  darkColor:       document.getElementById('qr-dark-color'),
  lightColor:      document.getElementById('qr-light-color'),
  darkHex:         document.getElementById('dark-hex'),
  lightHex:        document.getElementById('light-hex'),
  sizeSelect:      document.getElementById('qr-size'),
  generateBtn:     document.getElementById('generate-btn'),
  qrResult:        document.getElementById('qr-result'),
  qrPlaceholder:   document.getElementById('qr-placeholder'),
  qrOutput:        document.getElementById('qr-output'),
  qrDisplayCanvas: document.getElementById('qr-display-canvas'), // our controlled canvas
  downloadActions: document.getElementById('download-actions'),
  downloadPng:     document.getElementById('download-png-btn'),
  copyBtn:         document.getElementById('copy-btn'),
  backToTop:       document.getElementById('back-to-top'),
  toast:           document.getElementById('toast'),
  toastMsg:        document.getElementById('toast-msg'),
};

/* ================================================
   STATE
   ================================================ */
let qrInstance       = null;
let qrGenerated      = false;
let lastInput        = '';
let lastDownloadDataUrl = '';  // full-res data URL for download

/* ================================================
   HEADER — Sticky scroll + mobile nav
   ================================================ */
const initHeader = () => {
  const header = elements.header;
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const hamburger = elements.hamburger;
  const nav       = elements.mainNav;

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }
};

/* ================================================
   SMOOTH SCROLL
   ================================================ */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

/* ================================================
   BACK TO TOP
   ================================================ */
const initBackToTop = () => {
  const btn = elements.backToTop;
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ================================================
   SCROLL REVEAL
   ================================================ */
const initScrollReveal = () => {
  const targets = document.querySelectorAll(
    '.feature-card, .step-item, .section-header, .features-showcase, .steps-showcase, .steps-cta'
  );

  targets.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
};

/* ================================================
   INPUT — Clear button + Enter key
   ================================================ */
const initInputClear = () => {
  const input    = elements.qrInput;
  const clearBtn = elements.inputClear;
  if (!input || !clearBtn) return;

  input.addEventListener('input', () => {
    clearBtn.classList.toggle('visible', input.value.trim().length > 0);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('visible');
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') elements.generateBtn?.click();
  });
};

/* ================================================
   COLOR PICKERS
   ================================================ */
const initColorPickers = () => {
  const pairs = [
    { picker: elements.darkColor,  hex: elements.darkHex  },
    { picker: elements.lightColor, hex: elements.lightHex },
  ];

  pairs.forEach(({ picker, hex }) => {
    if (!picker || !hex) return;
    picker.addEventListener('input', () => {
      hex.textContent = picker.value.toUpperCase();
      if (qrGenerated && lastInput) generateQRCode(lastInput, false);
    });
  });

  elements.sizeSelect?.addEventListener('change', () => {
    if (qrGenerated && lastInput) generateQRCode(lastInput, false);
  });
};

/* ================================================
   QR CODE GENERATION — renders to hidden div, copies to display canvas
   ================================================ */
const generateQRCode = (text, showLoader = true) => {
  const displayCanvas = elements.qrDisplayCanvas;
  const output        = elements.qrOutput;
  const placeholder   = elements.qrPlaceholder;
  const qrResult      = elements.qrResult;
  const dlActions     = elements.downloadActions;
  const btn           = elements.generateBtn;

  if (!displayCanvas || !text.trim()) return;

  if (showLoader && btn) {
    btn.classList.add('loading');
    btn.setAttribute('disabled', 'true');
  }

  const sizeVal    = parseInt(elements.sizeSelect?.value || '300');
  const darkColor  = elements.darkColor?.value  || '#1a1a4e';
  const lightColor = elements.lightColor?.value || '#ffffff';

  // Display canvas is always 240px — clean and contained
  const DISPLAY_SIZE = 240;

  try {
    // 1. Create QR at full resolution in a hidden off-screen div
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(hiddenDiv);

    new QRCode(hiddenDiv, {
      text:         text.trim(),
      width:        sizeVal,
      height:       sizeVal,
      colorDark:    darkColor,
      colorLight:   lightColor,
      correctLevel: QRCode.CorrectLevel.H,
    });

    setTimeout(() => {
      // 2. Get the generated canvas from hidden div
      const sourceCanvas = hiddenDiv.querySelector('canvas');
      const sourceImg    = hiddenDiv.querySelector('img');

      // 3. Draw into our display canvas at DISPLAY_SIZE
      displayCanvas.width  = DISPLAY_SIZE;
      displayCanvas.height = DISPLAY_SIZE;
      const ctx = displayCanvas.getContext('2d');

      const drawSource = (src) => {
        ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
        ctx.drawImage(src, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);

        // Save full-res data URL for download
        if (sourceCanvas) {
          lastDownloadDataUrl = sourceCanvas.toDataURL('image/png');
        } else {
          lastDownloadDataUrl = displayCanvas.toDataURL('image/png');
        }

        // Show UI
        if (placeholder) placeholder.style.display = 'none';
        if (output)      output.style.display = 'flex';
        if (qrResult)    qrResult.classList.add('has-qr');
        if (dlActions)   dlActions.style.display = 'flex';

        qrGenerated = true;
        lastInput   = text.trim();

        if (showLoader && btn) {
          btn.classList.remove('loading');
          btn.removeAttribute('disabled');
        }

        // Cleanup hidden div
        document.body.removeChild(hiddenDiv);

        // Mobile scroll
        if (window.innerWidth <= 768) {
          output.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      if (sourceCanvas) {
        drawSource(sourceCanvas);
      } else if (sourceImg) {
        if (sourceImg.complete) {
          drawSource(sourceImg);
        } else {
          sourceImg.onload = () => drawSource(sourceImg);
        }
      } else {
        document.body.removeChild(hiddenDiv);
        showToast('שגיאה ביצירת הקוד.', false);
        if (showLoader && btn) {
          btn.classList.remove('loading');
          btn.removeAttribute('disabled');
        }
      }
    }, 250);

  } catch (err) {
    console.error('QR generation error:', err);
    showToast('שגיאה ביצירת הקוד. בדוק את הקישור ונסה שוב.', false);
    if (showLoader && btn) {
      btn.classList.remove('loading');
      btn.removeAttribute('disabled');
    }
  }
};

/* ================================================
   GET DISPLAY CANVAS
   ================================================ */
const getQRCanvas = () => elements.qrDisplayCanvas || null;

/* ================================================
   GENERATE BUTTON
   ================================================ */
const initGenerateButton = () => {
  const btn   = elements.generateBtn;
  const input = elements.qrInput;
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const value = input.value.trim();

    if (!value) {
      input.style.borderColor = '#ef4444';
      input.style.animation   = 'shake 0.4s ease';
      input.focus();
      showToast('אנא הזן כתובת URL או טקסט', false);
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.animation   = '';
      }, 800);
      return;
    }

    // Auto-prefix https://
    let processedValue = value;
    if (
      !value.startsWith('http://') &&
      !value.startsWith('https://') &&
      !value.startsWith('tel:') &&
      !value.startsWith('mailto:') &&
      !value.startsWith('wifi:') &&
      value.includes('.')
    ) {
      processedValue = 'https://' + value;
      input.value = processedValue;
    }

    generateQRCode(processedValue, true);
  });
};

/* ================================================
   DOWNLOAD PNG — uses saved full-res data URL
   ================================================ */
const initDownload = () => {
  const btn = elements.downloadPng;
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!qrGenerated || !lastDownloadDataUrl) return;
    try {
      const link    = document.createElement('a');
      link.download = 'qr-shirden.png';
      link.href     = lastDownloadDataUrl;
      link.click();
      showToast('הקובץ הורד בהצלחה! ✓', true);
    } catch (err) {
      console.error('Download error:', err);
      showToast('שגיאה בהורדה. נסה שוב.', false);
    }
  });
};

/* ================================================
   COPY TO CLIPBOARD
   ================================================ */
const initCopyButton = () => {
  const btn = elements.copyBtn;
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (!qrGenerated || !lastDownloadDataUrl) return;
    try {
      const res  = await fetch(lastDownloadDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('התמונה הועתקה ללוח!', true);
    } catch {
      showToast('הדפדפן לא תומך בהעתקת תמונה. השתמש בהורדה.', false);
    }
  });
};

/* ================================================
   TOAST
   ================================================ */
let toastTimer = null;

const showToast = (message, success = true) => {
  const toast    = elements.toast;
  const toastMsg = elements.toastMsg;
  const icon     = toast?.querySelector('i');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (icon) {
    icon.className = success ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    icon.style.color = success ? '#22c55e' : '#ef4444';
  }

  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
};

/* ================================================
   SHAKE ANIMATION (injected)
   ================================================ */
const injectAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
};

/* ================================================
   COLOR PRESETS
   ================================================ */
const presets = [
  { dark: '#1a1a4e', light: '#ffffff', label: 'Navy' },
  { dark: '#6b21a8', light: '#ffffff', label: 'Purple' },
  { dark: '#14b8a6', light: '#ffffff', label: 'Teal' },
  { dark: '#0f172a', light: '#f1f5f9', label: 'Dark' },
  { dark: '#dc2626', light: '#fff7f7', label: 'Red' },
  { dark: '#16a34a', light: '#f0fdf4', label: 'Green' },
  { dark: '#d97706', light: '#fffbeb', label: 'Amber' },
  { dark: '#1d4ed8', light: '#eff6ff', label: 'Blue' },
];

const injectPresets = () => {
  const genColors = document.querySelector('.gen-colors');
  if (!genColors) return;

  const presetsEl = document.createElement('div');
  presetsEl.className = 'color-presets';
  presetsEl.innerHTML = `
    <p class="presets-label"><i class="fas fa-swatchbook"></i> פלטות מוכנות</p>
    <div class="presets-grid">
      ${presets.map((p, i) => `
        <button
          class="preset-btn${i === 0 ? ' preset-active' : ''}"
          data-dark="${p.dark}"
          data-light="${p.light}"
          title="${p.label}"
          style="background: linear-gradient(135deg, ${p.dark} 50%, ${p.light} 50%);"
          aria-label="${p.label}"
        ></button>
      `).join('')}
    </div>
  `;

  genColors.after(presetsEl);

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .color-presets { margin-bottom: 20px; }
    .presets-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.85rem; font-weight: 600; color: var(--text-gray); margin-bottom: 10px;
    }
    .presets-label i { color: var(--purple-secondary); }
    .presets-grid { display: flex; gap: 10px; flex-wrap: wrap; }
    .preset-btn {
      width: 38px; height: 38px; border-radius: 50%;
      border: 3px solid transparent; cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .preset-btn:hover { transform: scale(1.18); box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
    .preset-btn.preset-active { border-color: var(--purple-secondary); transform: scale(1.12); }
  `;
  document.head.appendChild(style);

  // Events
  presetsEl.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dark  = btn.dataset.dark;
      const light = btn.dataset.light;

      if (elements.darkColor)  elements.darkColor.value  = dark;
      if (elements.lightColor) elements.lightColor.value = light;
      if (elements.darkHex)    elements.darkHex.textContent  = dark.toUpperCase();
      if (elements.lightHex)   elements.lightHex.textContent = light.toUpperCase();

      presetsEl.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('preset-active'));
      btn.classList.add('preset-active');

      if (qrGenerated && lastInput) generateQRCode(lastInput, false);
    });
  });
};

/* ================================================
   QR OUTPUT STYLES OVERRIDE
   (qrcodejs creates a table/canvas inside the div)
   ================================================ */
const injectQRContainerStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    #qr-canvas {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      line-height: 0 !important;
      overflow: hidden !important;
    }
    /* Force canvas/img size — override qrcodejs inline styles */
    #qr-canvas canvas,
    #qr-canvas img {
      display: block !important;
      border-radius: 8px !important;
      max-width: 280px !important;
      max-height: 280px !important;
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
    }
    /* qrcodejs sometimes wraps in a table */
    #qr-canvas table {
      border: none !important;
      border-spacing: 0 !important;
    }
  `;
  document.head.appendChild(style);
};

/* ================================================
   WAIT FOR LIB
   ================================================ */
const waitForQRLib = () => {
  return new Promise((resolve, reject) => {
    if (typeof QRCode !== 'undefined') { resolve(); return; }
    let n = 0;
    const t = setInterval(() => {
      if (typeof QRCode !== 'undefined') { clearInterval(t); resolve(); }
      else if (++n > 80) { clearInterval(t); reject(new Error('QRCode lib not loaded')); }
    }, 100);
  });
};

/* ================================================
   INIT
   ================================================ */
const init = async () => {
  injectAnimations();
  injectQRContainerStyles();

  initHeader();
  initSmoothScroll();
  initBackToTop();
  initScrollReveal();
  initInputClear();
  initColorPickers();

  try {
    await waitForQRLib();
    initGenerateButton();
    initDownload();
    initCopyButton();
    injectPresets();
  } catch (err) {
    console.error('QR Library failed to load:', err);

    // Graceful error in generator card
    const card = document.querySelector('.generator-card');
    if (card) {
      const errEl = document.createElement('div');
      errEl.style.cssText = `
        background:#fef2f2; border:1px solid #fecaca; border-radius:12px;
        padding:16px; text-align:center; font-size:0.9rem; color:#dc2626; margin-top:16px;
      `;
      errEl.innerHTML = '<i class="fas fa-exclamation-circle" style="margin-left:6px;"></i>שגיאה בטעינת הספרייה. אנא רענן את הדף.';
      card.appendChild(errEl);
    }
  }
};

/* ================================================
   ENTRY POINT
   ================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
