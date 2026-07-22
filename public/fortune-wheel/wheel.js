/* ══════════════════════════════════════════════════════════
   724BETs – Fortune Wheel JS Engine
   Shared state between user page and admin panel
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ── SHARED SEGMENTS DATA (synced via localStorage) ──────── */
const DEFAULT_SEGMENTS = [
  { id: 1, label: '50 TL Nakit',    value: 50,   type: 'cash',     weight: 25, color: '#D4AF37', active: true  },
  { id: 2, label: '10 Freespin',    value: 10,   type: 'freespin', weight: 20, color: '#0d0d0d', active: true  },
  { id: 3, label: '100 TL Bonus',   value: 100,  type: 'cash',     weight: 15, color: '#1c1c1c', active: true  },
  { id: 4, label: 'Tekrar Dene',    value: 0,    type: 'retry',    weight: 18, color: '#D4AF37', active: true  },
  { id: 5, label: '25 TL Nakit',    value: 25,   type: 'cash',     weight: 10, color: '#0d0d0d', active: true  },
  { id: 6, label: '250 TL JACKPOT', value: 250,  type: 'cash',     weight: 3,  color: '#1c1c1c', active: true  },
  { id: 7, label: '20 Freespin',    value: 20,   type: 'freespin', weight: 7,  color: '#D4AF37', active: true  },
  { id: 8, label: '500 TL VIP',     value: 500,  type: 'cash',     weight: 2,  color: '#0d0d0d', active: true  },
];

const DEFAULT_SETTINGS = {
  cooldownHours: 12,
  convertEnabled: true,
  wheelEnabled: true,
  autoPublish: false,
};

/* ── STATE HELPERS ───────────────────────────────────────── */
function getSegments() {
  try {
    const raw = localStorage.getItem('wheel_segments');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration: if they contain old colors, clear and use new defaults
      if (parsed.some(s => s.color === '#00FFCC' || s.color === '#f2ca50')) {
        localStorage.removeItem('wheel_segments');
        return DEFAULT_SEGMENTS;
      }
      return parsed;
    }
    return DEFAULT_SEGMENTS;
  } catch { return DEFAULT_SEGMENTS; }
}

function saveSegments(segs) {
  localStorage.setItem('wheel_segments', JSON.stringify(segs));
}

function getSettings() {
  try {
    const raw = localStorage.getItem('wheel_settings');
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function saveSettings(s) {
  localStorage.setItem('wheel_settings', JSON.stringify(s));
}

function getLastSpinTime() {
  const t = localStorage.getItem('wheel_last_spin');
  return t ? parseInt(t, 10) : null;
}

function setLastSpinTime() {
  localStorage.setItem('wheel_last_spin', Date.now().toString());
}

function getWalletData() {
  try {
    const raw = localStorage.getItem('wheel_wallet');
    if (raw) return JSON.parse(raw);
    return { total: 750, history: [
      { label: '50 TL Nakit', value: 50, type: 'cash', date: 'Bugün, 09:14' },
      { label: '20 Freespin', value: 20, type: 'freespin', date: 'Dün, 21:33' },
      { label: '100 TL Bonus', value: 100, type: 'cash', date: '27 May, 14:05' },
    ]};
  } catch { return { total: 750, history: [] }; }
}

function addWalletEntry(entry) {
  const w = getWalletData();
  if (entry.type === 'cash') w.total += entry.value;
  const now = new Date();
  entry.date = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }) + ', ' +
               now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  w.history.unshift(entry);
  localStorage.setItem('wheel_wallet', JSON.stringify(w));
  return w;
}

/* ── WEIGHTED RANDOM PICKER ──────────────────────────────── */
function pickSegmentByWeight(segments) {
  const active = segments.filter(s => s.active);
  const total = active.reduce((acc, s) => acc + s.weight, 0);
  let r = Math.random() * total;
  for (const seg of active) {
    r -= seg.weight;
    if (r <= 0) return seg;
  }
  return active[active.length - 1];
}

/* ── WHEEL CANVAS RENDERER ───────────────────────────────── */
class WheelRenderer {
  constructor(canvas, size = 480) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = size;
    this.canvas.width = size;
    this.canvas.height = size;
    this.rotation = 0;
    this.isSpinning = false;
    this.spinAngle = 0;
    this.spinVelocity = 0;
    this.targetAngle = 0;
    this.onSpinEnd = null;
    this.segments = getSegments();
  }

  setSegments(segs) {
    this.segments = segs;
    this.draw();
  }

  draw() {
    const { ctx, size, rotation } = this;
    const cx = size / 2, cy = size / 2, r = size / 2 - 4;
    ctx.clearRect(0, 0, size, size);

    const active = this.segments.filter(s => s.active);
    if (!active.length) return;
    const arc = (Math.PI * 2) / active.length;

    active.forEach((seg, i) => {
      const start = rotation + i * arc;
      const end = start + arc;
      const mid = start + arc / 2;

      /* Segment fill */
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();

      /* Gold metallic gradient */
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, this._shadeHex(seg.color, 60));
      grd.addColorStop(0.6, seg.color);
      grd.addColorStop(1, this._shadeHex(seg.color, -40));
      ctx.fillStyle = grd;
      ctx.fill();

      /* Segment border – neon dividers */
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      /* Outer rim glow line */
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, start, end);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Label */
      ctx.save();
      ctx.translate(cx, cy);
      
      const normAngle = (mid % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const isLeft = normAngle > Math.PI / 2 && normAngle < 3 * Math.PI / 2;
      
      if (isLeft) {
        ctx.rotate(mid + Math.PI);
        ctx.textAlign = 'left';
      } else {
        ctx.rotate(mid);
        ctx.textAlign = 'right';
      }
      ctx.textBaseline = 'middle';

      const labelR = r * 0.72;
      const fontSize = Math.max(10, Math.min(14, (size / active.length) * 0.3));
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      
      const isGold = seg.color.toLowerCase() === '#d4af37';
      ctx.fillStyle = isGold ? '#0a0a0a' : '#ffffff';
      ctx.shadowColor = isGold ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = isGold ? 2 : 6;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const maxW = labelR * 0.8;
      const text = seg.label;
      ctx.fillText(text, isLeft ? -labelR : labelR, 0, maxW);
      ctx.restore();
    });

    /* Center hub */
    const hubR = size * 0.09;
    const hubGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubR);
    hubGrd.addColorStop(0, '#fff');
    hubGrd.addColorStop(0.3, '#f2ca50');
    hubGrd.addColorStop(0.7, '#D4AF37');
    hubGrd.addColorStop(1, '#8B6914');
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
    ctx.fillStyle = hubGrd;
    ctx.shadowColor = 'rgba(212,175,55,0.8)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Hub ring */
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Hub center dot */
    ctx.beginPath();
    ctx.arc(cx, cy, hubR * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1200';
    ctx.fill();
  }

  _shadeHex(hex, pct) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + pct));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + pct));
    let b = Math.min(255, Math.max(0, (num & 0xff) + pct));
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  }

  /* Spin to a specific segment index */
  spinToSegment(segIndex, duration = 5000) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const active = this.segments.filter(s => s.active);
    const arc = (Math.PI * 2) / active.length;
    /* Pointer is at top (−π/2). Calculate angle to land pointer on segment center */
    const segCenter = segIndex * arc + arc / 2;
    const target = -segCenter - Math.PI / 2;
    /* Add full rotations for drama */
    const fullRotations = (Math.PI * 2) * (5 + Math.floor(Math.random() * 4));
    this.targetAngle = this.rotation + fullRotations + (target - (this.rotation % (Math.PI * 2)));

    const startAngle = this.rotation;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      /* Ease out quint */
      const ease = 1 - Math.pow(1 - t, 5);

      this.rotation = startAngle + (this.targetAngle - startAngle) * ease;
      this.draw();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.rotation = this.targetAngle;
        this.isSpinning = false;
        if (this.onSpinEnd) this.onSpinEnd();
      }
    };
    requestAnimationFrame(animate);
  }
}

/* ══════════════════════════════════════════════════════════
   USER PAGE LOGIC
   ══════════════════════════════════════════════════════════ */

let wheelRenderer = null;
let countdownInterval = null;
let isPageSpinning = false;

function initUserPage() {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;

  wheelRenderer = new WheelRenderer(canvas, 480);
  wheelRenderer.draw();

  populatePrizeTable();
  checkSpinCooldown();
  startWinsTicker();

  // Refresh wallet
  const wallet = getWalletData();
  updateWalletUI(wallet);
}

/* Prize table */
function populatePrizeTable() {
  const tbody = document.getElementById('prize-tbody');
  if (!tbody) return;
  const segs = getSegments().filter(s => s.active);
  const total = segs.reduce((a, s) => a + s.weight, 0);
  tbody.innerHTML = segs.map(s => {
    const pct = ((s.weight / total) * 100).toFixed(1);
    return `
      <tr>
        <td><span class="color-swatch" style="background:${s.color}"></span> &nbsp;${s.label}</td>
        <td class="gold-text" style="font-weight:700">${s.type === 'cash' ? '₺' + s.value : s.value + ' FS'}</td>
        <td>
          <div class="prob-bar-wrap">
            <div class="prob-bar-bg"><div class="prob-bar-fill" style="width:${Math.min(pct, 100)}%"></div></div>
            <span style="font-size:12px;font-weight:700;color:var(--gold);min-width:40px">%${pct}</span>
          </div>
        </td>
        <td><span class="status-badge active"><span class="pulse-dot" style="width:5px;height:5px;background:var(--cyan);border-radius:50%;animation:pulse-anim 1.6s infinite"></span> Aktif</span></td>
      </tr>`;
  }).join('');
}

/* Cooldown check */
function checkSpinCooldown() {
  const settings = getSettings();
  const lastSpin = getLastSpinTime();
  const cooldownMs = settings.cooldownHours * 60 * 60 * 1000;

  if (lastSpin && (Date.now() - lastSpin) < cooldownMs) {
    showCountdown(lastSpin, cooldownMs);
  } else {
    showSpinButton();
  }
}

function showSpinButton() {
  document.getElementById('btn-spin').style.display = '';
  document.getElementById('countdown-wrap').style.display = 'none';
  if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
}

function showCountdown(lastSpin, cooldownMs) {
  document.getElementById('btn-spin').style.display = 'none';
  document.getElementById('countdown-wrap').style.display = '';

  function tick() {
    const remaining = cooldownMs - (Date.now() - lastSpin);
    if (remaining <= 0) { showSpinButton(); return; }

    const h = Math.floor(remaining / 3_600_000);
    const m = Math.floor((remaining % 3_600_000) / 60_000);
    const s = Math.floor((remaining % 60_000) / 1_000);

    document.getElementById('ct-h').textContent = String(h).padStart(2, '0');
    document.getElementById('ct-m').textContent = String(m).padStart(2, '0');
    document.getElementById('ct-s').textContent = String(s).padStart(2, '0');
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

/* Spin action */
function spinWheel() {
  if (isPageSpinning || wheelRenderer.isSpinning) return;

  const segments = getSegments().filter(s => s.active);
  if (!segments.length) return;

  /* Pick winner */
  const winner = pickSegmentByWeight(segments);
  const winnerIndex = segments.findIndex(s => s.id === winner.id);

  isPageSpinning = true;
  document.getElementById('btn-spin').disabled = true;
  document.getElementById('btn-spin').style.opacity = '0.6';

  /* Add spinning class for ring animation */
  document.querySelector('.wheel-outer-ring').classList.add('spinning');

  wheelRenderer.onSpinEnd = () => {
    document.querySelector('.wheel-outer-ring').classList.remove('spinning');
    isPageSpinning = false;
    setLastSpinTime();

    /* Add to wallet */
    if (winner.type !== 'retry') {
      const wallet = addWalletEntry({ label: winner.label, value: winner.value, type: winner.type });
      updateWalletUI(wallet);
    }

    /* Show result */
    setTimeout(() => showResultModal(winner), 300);

    /* Start cooldown */
    const settings = getSettings();
    showCountdown(getLastSpinTime(), settings.cooldownHours * 60 * 60 * 1000);
  };

  wheelRenderer.spinToSegment(winnerIndex, 6000);
}

/* Wallet UI update */
function updateWalletUI(wallet) {
  const totalEl = document.getElementById('wallet-total');
  const countEl = document.getElementById('spin-count');
  const listEl  = document.getElementById('wh-list');
  const availEl = document.getElementById('withdraw-available');

  if (totalEl) totalEl.textContent = '₺' + wallet.total.toFixed(2);
  if (availEl) availEl.textContent = '₺' + wallet.total.toFixed(2);
  if (countEl) countEl.textContent = wallet.history.length + ' Çevirme';

  if (listEl) {
    listEl.innerHTML = wallet.history.slice(0, 5).map(h => `
      <li class="wh-item">
        <div class="wh-icon ${h.type === 'cash' ? 'gold' : 'cyan'}">${h.type === 'cash' ? '₺' : 'FS'}</div>
        <div class="wh-info">
          <span class="wh-name">${h.label}</span>
          <span class="wh-date">${h.date}</span>
        </div>
        <span class="wh-val ${h.type === 'cash' ? 'gold-text' : 'cyan-text'}">
          +${h.type === 'cash' ? '₺' + h.value : h.value + ' FS'}
        </span>
      </li>`).join('');
  }
}

/* Result modal */
function showResultModal(winner) {
  const icons = { cash: '💰', freespin: '🎰', retry: '🔄' };
  document.getElementById('modal-icon').textContent = icons[winner.type] || '🎁';
  document.getElementById('modal-title').textContent =
    winner.type === 'retry' ? 'Şanssız!' : 'Tebrikler!';
  document.getElementById('modal-reward').textContent =
    winner.type === 'retry' ? 'Bu sefer olmadı...' : winner.label + ' Kazandın!';

  const modal = document.getElementById('result-modal');
  modal.style.display = 'flex';
  launchConfetti();
}

/* Confetti */
function launchConfetti() {
  const container = document.getElementById('modal-confetti');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#D4AF37','#f2ca50','#FFD700','#00FFCC','#fff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${4 + Math.random() * 6}px;
      height:${4 + Math.random() * 6}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}%;
      top:-10px;
      border-radius:${Math.random() > 0.5 ? '50%' : '0'};
      opacity:${0.6 + Math.random() * 0.4};
      animation: confetti-fall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s both;
    `;
    container.appendChild(p);
  }
}

/* Auto-convert toggle */
function toggleAutoConvert(el) {
  const settings = getSettings();
  settings.convertEnabled = el.checked;
  saveSettings(settings);
}

/* Withdraw modal */
function openWithdrawModal() {
  const wallet = getWalletData();
  document.getElementById('withdraw-available').textContent = '₺' + wallet.total.toFixed(2);
  document.getElementById('withdraw-modal').style.display = 'flex';
}

function submitWithdraw() {
  const amount = parseFloat(document.getElementById('withdraw-amount').value);
  const iban   = document.getElementById('iban-input').value.trim();
  if (!iban || !amount || amount <= 0) {
    alert('Lütfen geçerli bir IBAN ve miktar girin.');
    return;
  }
  const wallet = getWalletData();
  if (amount > wallet.total) {
    alert('Yetersiz bakiye!');
    return;
  }
  wallet.total -= amount;
  localStorage.setItem('wheel_wallet', JSON.stringify(wallet));
  updateWalletUI(wallet);
  closeModal('withdraw-modal');
  setTimeout(() => alert('Çekim talebiniz alındı! 1-3 iş günü içinde hesabınıza geçecektir.'), 200);
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

/* Scrolling wins ticker */
function startWinsTicker() {
  const fakeWins = [
    { user: 'Hüseyin K.', prize: '₺250', type: 'gold' },
    { user: 'Zeynep A.', prize: '30 FS', type: 'cyan' },
    { user: 'Murat S.', prize: '₺100', type: 'gold' },
    { user: 'Elif D.', prize: '₺500', type: 'gold' },
    { user: 'Berk T.', prize: '20 FS', type: 'cyan' },
    { user: 'Selin Y.', prize: '₺50', type: 'gold' },
    { user: 'Ahmet R.', prize: '₺25', type: 'gold' },
  ];
  let idx = 0;
  const list = document.getElementById('wins-list');
  if (!list) return;

  setInterval(() => {
    const w = fakeWins[idx % fakeWins.length];
    idx++;
    const el = document.createElement('div');
    el.className = 'win-item compact-item';
    el.innerHTML = `<span class="win-user"><span class="gold-dot"></span>${w.user}</span><span class="win-prize ${w.type}-text">${w.prize}</span>`;
    list.insertBefore(el, list.firstChild);
    if (list.children.length > 3) list.removeChild(list.lastChild);
  }, 3500);
}

/* ── CONFETTI KEYFRAME (injected dynamically) ────────────── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes confetti-fall {
    0%   { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(300px) rotate(720deg); opacity:0; }
  }
  .modal-confetti {
    position:absolute;
    inset:0;
    pointer-events:none;
    overflow:hidden;
  }
`;
document.head.appendChild(styleSheet);

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initUserPage);
