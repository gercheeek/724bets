/* ══════════════════════════════════════════════════════════
   724BETs – Admin Panel JS
   Full CRUD + Global Settings + Live Preview
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ── STATE ───────────────────────────────────────────────── */
let currentPage    = 'wheel';
let editingSegId   = null;   // null = new, number = edit
let deletingSegId  = null;
let adminWheel     = null;   // WheelRenderer for preview

const COLOR_PRESETS = [
  '#D4AF37', '#0d0d0d', '#1c1c1c'
];

/* ══════════════════════════════════════════════════════════
   ROUTING
   ══════════════════════════════════════════════════════════ */
function setPage(name) {
  currentPage = name;

  /* Mark active nav item */
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${name}'`)) {
      el.classList.add('active');
    }
  });

  const area = document.getElementById('content-area');
  const topbar = document.getElementById('topbar-title');

  switch (name) {
    case 'dashboard':
      topbar.innerHTML = '📊 <span>Genel</span> Dashboard';
      area.innerHTML = renderDashboard();
      initDashboardCharts();
      break;
    case 'wheel':
      topbar.innerHTML = '🎡 <span>Çark</span> Yönetim Paneli';
      area.innerHTML = renderWheelPage();
      initAdminWheel();
      break;
    case 'users':
      topbar.innerHTML = '👥 <span>Kullanıcı</span> Yönetimi';
      area.innerHTML = renderUsersPage();
      break;
    case 'transactions':
      topbar.innerHTML = '💳 <span>İşlem</span> Geçmişi';
      area.innerHTML = renderTransactionsPage();
      break;
    case 'settings':
      topbar.innerHTML = '⚙️ <span>Global</span> Ayarlar';
      area.innerHTML = renderSettingsPage();
      initSettingsBindings();
      break;
    case 'logs':
      topbar.innerHTML = '📋 <span>Log</span> Kayıtları';
      area.innerHTML = renderLogsPage();
      break;
    default:
      area.innerHTML = '<p style="color:var(--text-muted);padding:40px">Sayfa bulunamadı.</p>';
  }
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════════════════════════ */
function renderDashboard() {
  const wallet = getWalletData();
  const segs   = getSegments();
  const total  = segs.filter(s => s.active).reduce((a,s) => a + s.weight, 0);

  return `
  <div class="stats-row">
    <div class="stat-card">
      <div class="sc-icon gold">🎡</div>
      <div class="sc-value gold-text">2,847</div>
      <div class="sc-label">Toplam Çevirme (Bugün)</div>
      <div class="sc-delta up">+12.4%</div>
    </div>
    <div class="stat-card">
      <div class="sc-icon cyan">💰</div>
      <div class="sc-value cyan-text">₺48,250</div>
      <div class="sc-label">Dağıtılan Ödül</div>
      <div class="sc-delta up">+8.1%</div>
    </div>
    <div class="stat-card">
      <div class="sc-icon green">👥</div>
      <div class="sc-value green-text">1,423</div>
      <div class="sc-label">Aktif Kullanıcı</div>
      <div class="sc-delta up">+5.3%</div>
    </div>
    <div class="stat-card">
      <div class="sc-icon red">⏱</div>
      <div class="sc-value" style="color:var(--red)">₺12,100</div>
      <div class="sc-label">Bekleyen Çekim</div>
      <div class="sc-delta down">3 Talep</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div class="panel">
      <div class="section-header">
        <div>
          <div class="sh-title"><span>📈</span> 7 Günlük Çevirme Trendi</div>
          <div class="sh-sub">Son 7 gün toplam çevirme sayısı</div>
        </div>
      </div>
      <canvas id="spinChart" height="180" style="width:100%"></canvas>
    </div>
    <div class="panel">
      <div class="section-header">
        <div>
          <div class="sh-title"><span>🏆</span> Ödül Dağılımı</div>
          <div class="sh-sub">Segment isabet oranları</div>
        </div>
      </div>
      <canvas id="prizeChart" height="180" style="width:100%"></canvas>
    </div>
  </div>

  <div class="panel">
    <div class="section-header">
      <div>
        <div class="sh-title"><span>⚡</span> Son Aktiviteler</div>
        <div class="sh-sub">Gerçek zamanlı çevirme olayları</div>
      </div>
      <div class="sh-actions">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Loglar yenilendi','info')">⟳ Yenile</button>
      </div>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Kullanıcı</th><th>Ödül</th><th>Değer</th><th>Zaman</th><th>Durum</th></tr>
        </thead>
        <tbody>
          ${generateFakeActivity(10)}
        </tbody>
      </table>
    </div>
  </div>`;
}

function generateFakeActivity(n) {
  const users  = ['Mehmet K.','Ayşe S.','Emre T.','Fatma D.','Berk Y.','Zeynep A.','Hasan R.','Selin C.'];
  const prizes = ['50 TL Nakit','10 Freespin','Tekrar Dene','100 TL Bonus','250 TL JACKPOT','25 TL Nakit','20 Freespin'];
  const vals   = ['₺50','10 FS','—','₺100','₺250','₺25','20 FS'];
  const times  = ['2 dk önce','5 dk önce','8 dk önce','12 dk önce','15 dk önce','18 dk önce','22 dk önce','25 dk önce','30 dk önce','35 dk önce'];
  const statusBadges = {
    '—': '<span class="status-badge inactive">Tekrar</span>',
    default: '<span class="status-badge active" style="background:rgba(0,255,204,0.1);color:var(--cyan);border-color:rgba(0,255,204,0.25)">Kazandı ✓</span>'
  };
  let rows = '';
  for (let i = 0; i < n; i++) {
    const ui = Math.floor(Math.random() * users.length);
    const pi = Math.floor(Math.random() * prizes.length);
    const val = vals[pi];
    rows += `<tr>
      <td style="font-weight:600">${users[ui]}</td>
      <td>${prizes[pi]}</td>
      <td class="gold-text" style="font-weight:700">${val}</td>
      <td style="color:var(--text-dim)">${times[i] || times[times.length-1]}</td>
      <td>${val === '—' ? statusBadges['—'] : statusBadges.default}</td>
    </tr>`;
  }
  return rows;
}

function initDashboardCharts() {
  /* Spin trend chart */
  const sc = document.getElementById('spinChart');
  if (!sc) return;
  const sCtx = sc.getContext('2d');
  const days = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const data = [1840, 2100, 1650, 2450, 2800, 3200, 2847];
  drawLineChart(sCtx, sc.offsetWidth || 400, 180, days, data, '#D4AF37', 'rgba(212,175,55,0.15)');

  /* Prize distribution donut */
  const pc = document.getElementById('prizeChart');
  if (!pc) return;
  const pCtx = pc.getContext('2d');
  const segs = getSegments().filter(s => s.active);
  drawDonutChart(pCtx, 400, 180, segs);
}

function drawLineChart(ctx, w, h, labels, data, stroke, fill) {
  ctx.canvas.width  = w;
  ctx.canvas.height = h;
  const pad = { top: 20, right: 20, bottom: 30, left: 48 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top  - pad.bottom;
  const max = Math.max(...data) * 1.1;
  const step = cw / (data.length - 1);

  ctx.clearRect(0, 0, w, h);

  /* Grid */
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + ch - (i / 4) * ch;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
    ctx.fillStyle = 'rgba(229,226,225,0.3)';
    ctx.font = '10px Inter';
    ctx.fillText(Math.round(max * i / 4), 4, y + 4);
  }

  /* Fill */
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.left + i * step;
    const y = pad.top + ch - (v / max) * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + (data.length-1) * step, pad.top + ch);
  ctx.lineTo(pad.left, pad.top + ch);
  ctx.closePath();
  const grd = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
  grd.addColorStop(0, fill);
  grd.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.fillStyle = grd;
  ctx.fill();

  /* Line */
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.left + i * step;
    const y = pad.top + ch - (v / max) * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  /* Dots & labels */
  data.forEach((v, i) => {
    const x = pad.left + i * step;
    const y = pad.top + ch - (v / max) * ch;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = stroke; ctx.shadowColor = stroke; ctx.shadowBlur = 8;
    ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(229,226,225,0.5)';
    ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x, pad.top + ch + 16);
  });
}

function drawDonutChart(ctx, w, h, segments) {
  ctx.canvas.width  = w;
  ctx.canvas.height = h;
  const total = segments.reduce((a,s) => a + s.weight, 0);
  const cx = w * 0.35, cy = h / 2, r = Math.min(cx, cy) * 0.85, ir = r * 0.55;
  let angle = -Math.PI / 2;
  ctx.clearRect(0, 0, w, h);

  segments.forEach(seg => {
    const slice = (seg.weight / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.shadowColor = seg.color;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    angle += slice;
  });

  /* Inner hole */
  ctx.beginPath();
  ctx.arc(cx, cy, ir, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(14,14,14,0.95)';
  ctx.shadowBlur = 0;
  ctx.fill();

  /* Center label */
  ctx.fillStyle = '#D4AF37';
  ctx.font = '700 16px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(segments.length + ' Segment', cx, cy);

  /* Legend */
  const lx = w * 0.65, ly = 20;
  const visSegs = segments.slice(0, 8);
  visSegs.forEach((seg, i) => {
    const pct = ((seg.weight / total) * 100).toFixed(0);
    const y = ly + i * 20;
    ctx.beginPath();
    ctx.rect(lx, y, 10, 10);
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.fillStyle = 'rgba(229,226,225,0.7)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${seg.label} (${pct}%)`, lx + 16, y + 5);
  });
}

/* ══════════════════════════════════════════════════════════
   WHEEL MANAGEMENT PAGE
   ══════════════════════════════════════════════════════════ */
function renderWheelPage() {
  const segs     = getSegments();
  const settings = getSettings();
  const active   = segs.filter(s => s.active);
  const total    = active.reduce((a,s) => a + s.weight, 0);

  return `
  <!-- Stats row -->
  <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat-card">
      <div class="sc-icon gold">🎯</div>
      <div class="sc-value gold-text">${segs.length}</div>
      <div class="sc-label">Toplam Segment</div>
    </div>
    <div class="stat-card">
      <div class="sc-icon cyan">✅</div>
      <div class="sc-value cyan-text">${active.length}</div>
      <div class="sc-label">Aktif Segment</div>
    </div>
    <div class="stat-card">
      <div class="sc-icon green">⚖️</div>
      <div class="sc-value green-text">${total}</div>
      <div class="sc-label">Toplam Ağırlık</div>
    </div>
  </div>

  <!-- Main grid: editor + preview -->
  <div style="display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start">

    <!-- Segment Editor -->
    <div class="panel">
      <div class="section-header">
        <div>
          <div class="sh-title"><span>🗂</span> Segment Editörü</div>
          <div class="sh-sub">Çarkı oluşturan dilimleri yönet, sırala ve ağırlıklandır.</div>
        </div>
        <div class="sh-actions">
          <button class="btn btn-outline btn-sm" onclick="resetToDefaults()">↩ Varsayılana Dön</button>
          <button class="btn btn-gold btn-sm" onclick="openSegModal()">+ Segment Ekle</button>
        </div>
      </div>

      <div style="margin-bottom:12px;padding:12px 16px;background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.15);border-radius:10px;font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px">
        <span style="color:var(--gold);font-size:16px">ℹ</span>
        Ağırlıklar göreceli olarak hesaplanır. Örn: ağırlık 10 olan bir segment, toplam 100 içinde %10 ihtimale sahiptir.
      </div>

      <div class="data-table-wrap">
        <table class="data-table" id="segments-table">
          <thead>
            <tr>
              <th style="width:30px">#</th>
              <th>Renk</th>
              <th>Ödül Adı</th>
              <th>Tür</th>
              <th>Değer</th>
              <th>Ağırlık</th>
              <th>İhtimal</th>
              <th>Durum</th>
              <th style="text-align:right">İşlemler</th>
            </tr>
          </thead>
          <tbody id="seg-tbody">
            ${renderSegmentRows(segs, total)}
          </tbody>
        </table>
      </div>

      <!-- Weight total bar -->
      <div style="margin-top:16px;padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:12px;color:var(--text-muted);font-weight:600">Toplam Ağırlık Dağılımı</span>
          <span style="font-size:12px;font-weight:700;color:var(--gold)">${total} / 100 birim</span>
        </div>
        <div style="height:8px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.min((total/100)*100, 100)}%;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:99px;box-shadow:0 0 8px rgba(212,175,55,0.5);transition:width 0.4s"></div>
        </div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">
          ${total < 50 ? '⚠️ Düşük ağırlık — daha dengeli bir dağılım için ağırlıkları artırın.' :
            total > 150 ? '⚠️ Yüksek ağırlık — segmentler zaten göreceli olarak hesaplanır, bu normal.' :
            '✓ Ağırlık dağılımı ideal seviyede.'}
        </div>
      </div>
    </div>

    <!-- Wheel Preview -->
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="panel">
        <div class="sh-title" style="margin-bottom:16px"><span>👁</span> Çark Önizleme</div>
        <div class="wheel-preview-wrap">
          <div class="preview-canvas-ring">
            <canvas id="adminWheelCanvas" width="260" height="260"></canvas>
          </div>
          <button class="btn btn-outline btn-sm" style="width:100%" onclick="spinPreview()">▶ Test Çevir</button>
        </div>
      </div>

      <!-- Quick settings -->
      <div class="panel">
        <div class="sh-title" style="margin-bottom:16px"><span>⚡</span> Hızlı Ayarlar</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="setting-row" style="padding:12px">
            <div class="sr-info">
              <div class="sr-title" style="font-size:13px">Çark Aktif</div>
              <div class="sr-desc" style="font-size:11px">Kullanıcılar çevirebilir</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="qs-wheel-active" ${settings.wheelEnabled ? 'checked' : ''} onchange="quickToggle('wheelEnabled',this.checked)" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-row" style="padding:12px">
            <div class="sr-info">
              <div class="sr-title" style="font-size:13px">Nakde Çevir</div>
              <div class="sr-desc" style="font-size:11px">Kullanıcı çekim yapabilir</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="qs-convert" ${settings.convertEnabled ? 'checked' : ''} onchange="quickToggle('convertEnabled',this.checked)" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="form-group">
            <label class="form-label">Bekleme Süresi (saat)</label>
            <div class="input-group">
              <input type="number" id="qs-cooldown" class="form-input" value="${settings.cooldownHours}" min="1" max="168" onchange="quickUpdateCooldown(this.value)" />
              <span class="input-suffix">SA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderSegmentRows(segs, total) {
  return segs.map((seg, i) => {
    const pct = total > 0 ? ((seg.weight / total) * 100).toFixed(1) : '0.0';
    const typeLabels = { cash:'💰 Nakit', freespin:'🎰 Freespin', retry:'🔄 Tekrar', bonus:'🎁 Bonus' };
    return `
    <tr id="seg-row-${seg.id}" style="${!seg.active ? 'opacity:0.45' : ''}">
      <td style="color:var(--text-dim);font-size:12px">${i+1}</td>
      <td>
        <span class="color-swatch" style="background:${seg.color};width:22px;height:22px;border-radius:5px;display:inline-block;border:1px solid rgba(255,255,255,0.1);box-shadow:0 0 6px ${seg.color}50"></span>
      </td>
      <td style="font-weight:600;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${seg.label}</td>
      <td style="color:var(--text-muted);font-size:12px">${typeLabels[seg.type] || seg.type}</td>
      <td style="font-weight:700;color:var(--gold)">${seg.type === 'cash' ? '₺'+seg.value : seg.type === 'retry' ? '—' : seg.value+' FS'}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <input type="number" class="form-input" style="width:58px;padding:4px 8px;font-size:12px;text-align:center"
            value="${seg.weight}" min="1" max="100"
            onchange="inlineUpdateWeight(${seg.id}, this.value)" />
        </div>
      </td>
      <td>
        <div class="table-prob-bar">
          <div class="tpb-track"><div class="tpb-fill" style="width:${Math.min(pct,100)}%"></div></div>
          <span class="tpb-val">%${pct}</span>
        </div>
      </td>
      <td>
        <label class="toggle-switch" style="transform:scale(0.85);transform-origin:left">
          <input type="checkbox" ${seg.active ? 'checked' : ''} onchange="toggleSegmentActive(${seg.id}, this.checked)" />
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td>
        <div class="row-actions" style="justify-content:flex-end">
          <button class="btn btn-ghost btn-sm btn-icon" title="Düzenle" onclick="openSegModal(${seg.id})">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Sil" onclick="openDeleteModal(${seg.id})">🗑</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function initAdminWheel() {
  const canvas = document.getElementById('adminWheelCanvas');
  if (!canvas) return;
  adminWheel = new WheelRenderer(canvas, 260);
  adminWheel.draw();
}

function refreshSegmentTable() {
  const segs  = getSegments();
  const active = segs.filter(s => s.active);
  const total = active.reduce((a,s) => a + s.weight, 0);
  const tbody = document.getElementById('seg-tbody');
  if (tbody) tbody.innerHTML = renderSegmentRows(segs, total);
  if (adminWheel) { adminWheel.setSegments(segs); adminWheel.draw(); }
  updateWeightBar(total);
}

function updateWeightBar(total) {
  /* Live update weight bar without full re-render */
  const bar = document.querySelector('.panel .data-table-wrap + div [style*="background:linear-gradient"]');
  if (bar) bar.style.width = Math.min((total/100)*100, 100) + '%';
}

function spinPreview() {
  if (!adminWheel || adminWheel.isSpinning) return;
  const segs = getSegments().filter(s => s.active);
  if (!segs.length) return;
  const winner = pickSegmentByWeight(segs);
  const idx = segs.findIndex(s => s.id === winner.id);
  adminWheel.spinToSegment(idx, 3000);
}

/* ══════════════════════════════════════════════════════════
   SEGMENT CRUD
   ══════════════════════════════════════════════════════════ */
function openSegModal(id) {
  editingSegId = id || null;
  const modal = document.getElementById('seg-modal');
  const title = document.getElementById('seg-modal-title');

  /* Inject color presets */
  const presetsDiv = document.getElementById('color-presets');
  if (presetsDiv) {
    presetsDiv.innerHTML = COLOR_PRESETS.map(c =>
      `<div onclick="setPresetColor('${c}')" style="
        width:24px;height:24px;border-radius:5px;background:${c};cursor:pointer;
        border:2px solid rgba(255,255,255,0.1);transition:transform 0.15s;
        box-shadow:0 0 6px ${c}60
      " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>`
    ).join('');
  }

  if (id) {
    /* Edit mode */
    title.textContent = 'Segment Düzenle';
    const segs = getSegments();
    const seg  = segs.find(s => s.id === id);
    if (!seg) return;
    document.getElementById('seg-label').value  = seg.label;
    document.getElementById('seg-value').value  = seg.value;
    document.getElementById('seg-type').value   = seg.type;
    document.getElementById('seg-weight').value = seg.weight;
    document.getElementById('seg-color').value  = seg.color;
    document.getElementById('seg-color-preview').style.background = seg.color;
    document.getElementById('seg-active').checked = seg.active;
  } else {
    /* Add mode */
    title.textContent = 'Yeni Segment Ekle';
    document.getElementById('seg-label').value  = '';
    document.getElementById('seg-value').value  = '';
    document.getElementById('seg-type').value   = 'cash';
    document.getElementById('seg-weight').value = '10';
    document.getElementById('seg-color').value  = '#D4AF37';
    document.getElementById('seg-color-preview').style.background = '#D4AF37';
    document.getElementById('seg-active').checked = true;
  }
  updateSegUnit();
  modal.style.display = 'flex';
}

function closeAdminModal(id) {
  document.getElementById(id).style.display = 'none';
}

function updateColorPreview() {
  const color = document.getElementById('seg-color').value;
  document.getElementById('seg-color-preview').style.background = color;
}

function setPresetColor(color) {
  document.getElementById('seg-color').value = color;
  document.getElementById('seg-color-preview').style.background = color;
}

function updateSegUnit() {
  const type = document.getElementById('seg-type').value;
  const unit = document.getElementById('seg-unit');
  if (!unit) return;
  unit.textContent = type === 'freespin' ? 'FS' : type === 'retry' ? '—' : 'TL';
}

function saveSegment() {
  const label  = document.getElementById('seg-label').value.trim();
  const value  = parseFloat(document.getElementById('seg-value').value) || 0;
  const type   = document.getElementById('seg-type').value;
  const weight = parseInt(document.getElementById('seg-weight').value, 10) || 10;
  const color  = document.getElementById('seg-color').value;
  const active = document.getElementById('seg-active').checked;

  if (!label) { showToast('Ödül adı zorunludur!', 'error'); return; }
  if (weight < 1 || weight > 1000) { showToast('Ağırlık 1-1000 arasında olmalıdır!', 'error'); return; }

  const segs = getSegments();

  if (editingSegId) {
    /* Update */
    const idx = segs.findIndex(s => s.id === editingSegId);
    if (idx > -1) {
      segs[idx] = { ...segs[idx], label, value, type, weight, color, active };
    }
    showToast(`"${label}" güncellendi`, 'success');
  } else {
    /* Create */
    const maxId = segs.reduce((a,s) => Math.max(a, s.id), 0);
    segs.push({ id: maxId + 1, label, value, type, weight, color, active });
    showToast(`"${label}" eklendi`, 'success');
  }

  saveSegments(segs);
  closeAdminModal('seg-modal');
  refreshSegmentTable();
}

function toggleSegmentActive(id, active) {
  const segs = getSegments();
  const seg  = segs.find(s => s.id === id);
  if (!seg) return;
  seg.active = active;
  saveSegments(segs);
  refreshSegmentTable();
  showToast(`"${seg.label}" ${active ? 'aktif edildi' : 'devre dışı bırakıldı'}`, 'info');
}

function inlineUpdateWeight(id, val) {
  const weight = parseInt(val, 10);
  if (isNaN(weight) || weight < 1) return;
  const segs = getSegments();
  const seg  = segs.find(s => s.id === id);
  if (!seg) return;
  seg.weight = weight;
  saveSegments(segs);
  /* Re-render probability column only */
  const active = segs.filter(s => s.active);
  const total  = active.reduce((a,s) => a + s.weight, 0);
  const pct    = ((weight / total) * 100).toFixed(1);
  /* Find row and update prob bar */
  const row = document.getElementById(`seg-row-${id}`);
  if (row) {
    const bar  = row.querySelector('.tpb-fill');
    const span = row.querySelector('.tpb-val');
    if (bar)  bar.style.width  = Math.min(pct, 100) + '%';
    if (span) span.textContent = '%' + pct;
  }
  if (adminWheel) { adminWheel.setSegments(segs); adminWheel.draw(); }
}

function openDeleteModal(id) {
  deletingSegId = id;
  const segs = getSegments();
  const seg  = segs.find(s => s.id === id);
  document.getElementById('delete-seg-name').textContent = seg ? `"${seg.label}"` : '—';
  document.getElementById('delete-modal').style.display = 'flex';
}

function confirmDelete() {
  if (!deletingSegId) return;
  const segs  = getSegments();
  const seg   = segs.find(s => s.id === deletingSegId);
  const label = seg ? seg.label : '—';
  const updated = segs.filter(s => s.id !== deletingSegId);
  saveSegments(updated);
  deletingSegId = null;
  closeAdminModal('delete-modal');
  refreshSegmentTable();
  showToast(`"${label}" silindi`, 'error');
}

function resetToDefaults() {
  if (!confirm('Tüm segmentler varsayılana dönecek. Emin misiniz?')) return;
  saveSegments(DEFAULT_SEGMENTS);
  refreshSegmentTable();
  showToast('Segmentler varsayılana döndürüldü', 'info');
}

/* ══════════════════════════════════════════════════════════
   SETTINGS PAGE
   ══════════════════════════════════════════════════════════ */
function renderSettingsPage() {
  const s = getSettings();
  return `
  <div class="panel">
    <div class="sh-title" style="margin-bottom:4px"><span>🌍</span> Global Çark Ayarları</div>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:24px">Tüm kullanıcıları etkileyen sistem geneli ayarlar.</p>

    <div class="settings-grid">
      <div class="setting-row">
        <div class="sr-info">
          <div class="sr-title">🎡 Çarkı Aktif Et</div>
          <div class="sr-desc">Devre dışı bırakıldığında kullanıcılar çark sayfasına erişemez.</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="set-wheel-active" ${s.wheelEnabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="sr-info">
          <div class="sr-title">💸 Nakde Çevirme</div>
          <div class="sr-desc">Kullanıcıların kazandıklarını çekmesine izin verir.</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="set-convert" ${s.convertEnabled ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="sr-info">
          <div class="sr-title">🔁 Otomatik Yayınla</div>
          <div class="sr-desc">Segment değişiklikleri hemen canlıya alınır.</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="set-autopublish" ${s.autoPublish ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="sr-info">
          <div class="sr-title">⏱ Bekleme Süresi</div>
          <div class="sr-desc">Kullanıcıların iki çevirme arasında bekleyeceği süre.</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <input type="number" id="set-cooldown" class="form-input" style="width:80px;text-align:center"
            value="${s.cooldownHours}" min="1" max="168" />
          <span style="font-size:13px;color:var(--text-muted)">Saat</span>
        </div>
      </div>
    </div>

    <div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:12px">
      <button class="btn btn-ghost" onclick="setPage('settings')">Sıfırla</button>
      <button class="btn btn-gold" onclick="saveGlobalSettings()">💾 Ayarları Kaydet</button>
    </div>
  </div>

  <div class="panel">
    <div class="sh-title" style="margin-bottom:16px"><span>⚠️</span> Tehlikeli Bölge</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="setting-row">
        <div class="sr-info">
          <div class="sr-title" style="color:var(--red)">Tüm Çevirmeleri Sıfırla</div>
          <div class="sr-desc">Tüm kullanıcıların çevirme geçmişi ve bekleme süreleri temizlenir.</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="dangerReset('spins')">🗑 Sıfırla</button>
      </div>
      <div class="setting-row">
        <div class="sr-info">
          <div class="sr-title" style="color:var(--red)">Segmentleri Varsayılana Dön</div>
          <div class="sr-desc">Tüm özel segmentler silinir, varsayılan 8 segment yüklenir.</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="dangerReset('segments')">🔄 Varsayılan</button>
      </div>
    </div>
  </div>`;
}

function initSettingsBindings() { /* bindings on save click */ }

function saveGlobalSettings() {
  const s = getSettings();
  s.wheelEnabled    = document.getElementById('set-wheel-active').checked;
  s.convertEnabled  = document.getElementById('set-convert').checked;
  s.autoPublish     = document.getElementById('set-autopublish').checked;
  s.cooldownHours   = parseInt(document.getElementById('set-cooldown').value, 10) || 12;
  saveSettings(s);
  showToast('Global ayarlar kaydedildi ✓', 'success');
}

function quickToggle(key, val) {
  const s = getSettings();
  s[key] = val;
  saveSettings(s);
  showToast(`${key} ${val ? 'açıldı' : 'kapatıldı'}`, 'info');
}

function quickUpdateCooldown(val) {
  const h = parseInt(val, 10);
  if (isNaN(h) || h < 1) return;
  const s = getSettings();
  s.cooldownHours = h;
  saveSettings(s);
}

function dangerReset(type) {
  if (!confirm('Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) return;
  if (type === 'spins')    { localStorage.removeItem('wheel_last_spin'); localStorage.removeItem('wheel_wallet'); }
  if (type === 'segments') { saveSegments(DEFAULT_SEGMENTS); }
  showToast('İşlem tamamlandı', 'info');
}

/* ══════════════════════════════════════════════════════════
   USERS PAGE (stub)
   ══════════════════════════════════════════════════════════ */
function renderUsersPage() {
  const users = [
    { name:'Mehmet K.', spins:42, won:'₺850', last:'2 dk önce', status:'active' },
    { name:'Ayşe S.',   spins:28, won:'₺320', last:'15 dk önce', status:'active' },
    { name:'Emre T.',   spins:15, won:'₺150', last:'1 sa önce', status:'cooldown' },
    { name:'Fatma D.',  spins:67, won:'₺2,100', last:'3 sa önce', status:'active' },
    { name:'Berk Y.',   spins:5,  won:'₺50',  last:'Dün', status:'inactive' },
    { name:'Zeynep A.', spins:31, won:'₺480', last:'2 sa önce', status:'cooldown' },
  ];
  const statusBadges = {
    active:   '<span class="status-badge active">● Aktif</span>',
    cooldown: '<span class="status-badge" style="background:rgba(212,175,55,0.1);color:var(--gold);border-color:rgba(212,175,55,0.25)">⏱ Bekleme</span>',
    inactive: '<span class="status-badge inactive">○ Pasif</span>',
  };
  return `
  <div class="panel">
    <div class="section-header">
      <div>
        <div class="sh-title"><span>👥</span> Kullanıcı Yönetimi</div>
        <div class="sh-sub">${users.length} kullanıcı listeleniyor</div>
      </div>
      <div class="sh-actions">
        <button class="btn btn-ghost btn-sm">⬇ CSV İndir</button>
      </div>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Kullanıcı</th><th>Toplam Çevirme</th><th>Toplam Kazanım</th><th>Son Aktivite</th><th>Durum</th><th>İşlem</th></tr></thead>
        <tbody>
          ${users.map(u => `<tr>
            <td style="font-weight:600">${u.name}</td>
            <td style="color:var(--text-muted)">${u.spins}</td>
            <td class="gold-text" style="font-weight:700">${u.won}</td>
            <td style="color:var(--text-dim);font-size:12px">${u.last}</td>
            <td>${statusBadges[u.status]}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="showToast('Kullanıcı bekleme süresi sıfırlandı','success')">⏱ Sıfırla</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   TRANSACTIONS PAGE (stub)
   ══════════════════════════════════════════════════════════ */
function renderTransactionsPage() {
  const txs = [
    { user:'Fatma D.', type:'Çekim', amount:'₺500', iban:'TR00***1234', date:'Bugün 14:22', status:'pending' },
    { user:'Mehmet K.', type:'Ödül', amount:'₺250', iban:'—', date:'Bugün 12:11', status:'done' },
    { user:'Zeynep A.', type:'Çekim', amount:'₺100', iban:'TR00***5678', date:'Dün 19:08', status:'done' },
    { user:'Berk Y.', type:'Ödül', amount:'₺50', iban:'—', date:'Dün 11:33', status:'done' },
    { user:'Ayşe S.', type:'Çekim', amount:'₺320', iban:'TR00***9012', date:'27 May 08:55', status:'pending' },
  ];
  const statusBadges = {
    pending: '<span class="status-badge" style="background:rgba(255,193,7,0.1);color:#ffc107;border-color:rgba(255,193,7,0.3)">⏳ Bekliyor</span>',
    done:    '<span class="status-badge active">✓ Tamamlandı</span>',
  };
  return `
  <div class="panel">
    <div class="section-header">
      <div><div class="sh-title"><span>💳</span> İşlem Geçmişi</div></div>
      <div class="sh-actions">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Bekleyen çekimler onaylandı','success')">✓ Hepsini Onayla</button>
      </div>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Kullanıcı</th><th>Tür</th><th>Tutar</th><th>IBAN</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>
        <tbody>
          ${txs.map(t => `<tr>
            <td style="font-weight:600">${t.user}</td>
            <td style="color:var(--text-muted)">${t.type}</td>
            <td class="gold-text" style="font-weight:700">${t.amount}</td>
            <td style="font-size:12px;color:var(--text-dim);font-family:monospace">${t.iban}</td>
            <td style="font-size:12px;color:var(--text-dim)">${t.date}</td>
            <td>${statusBadges[t.status]}</td>
            <td>
              ${t.status === 'pending'
                ? `<button class="btn btn-gold btn-sm" onclick="showToast('Çekim onaylandı','success')">✓ Onayla</button>`
                : `<button class="btn btn-ghost btn-sm" onclick="showToast('Detay görüntüleniyor','info')">👁 Detay</button>`}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   LOGS PAGE (stub)
   ══════════════════════════════════════════════════════════ */
function renderLogsPage() {
  const log = [
    { time:'11:52:04', type:'INFO',  msg:'Segment "250 TL JACKPOT" güncellendi.' },
    { time:'11:48:21', type:'WIN',   msg:'Kullanıcı Mehmet K. → 50 TL Nakit kazandı.' },
    { time:'11:44:10', type:'INFO',  msg:'Yeni segment eklendi: "500 TL VIP".' },
    { time:'11:39:55', type:'WIN',   msg:'Kullanıcı Ayşe S. → 10 Freespin kazandı.' },
    { time:'11:35:03', type:'WARN',  msg:'Çekim talebi bekleniyor: Fatma D. - ₺500.' },
    { time:'11:30:17', type:'INFO',  msg:'Global ayarlar güncellendi. Bekleme: 12 saat.' },
    { time:'11:22:44', type:'ERROR', msg:'Geçersiz segment ağırlığı girişi reddedildi.' },
    { time:'11:18:09', type:'WIN',   msg:'Kullanıcı Emre T. → Tekrar Dene.' },
    { time:'11:09:33', type:'INFO',  msg:'Sistem başlatıldı. Tüm servisler aktif.' },
  ];
  const colors = { INFO:'var(--text-muted)', WIN:'var(--cyan)', WARN:'#ffc107', ERROR:'var(--red)' };
  return `
  <div class="panel">
    <div class="section-header">
      <div><div class="sh-title"><span>📋</span> Sistem Log Kayıtları</div></div>
      <div class="sh-actions">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Loglar temizlendi','info')">🗑 Temizle</button>
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.4);border:1px solid var(--border);border-radius:10px;padding:16px;font-family:monospace;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:500px;overflow-y:auto">
      ${log.map(l => `
        <div style="display:flex;gap:12px;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.02)">
          <span style="color:var(--text-dim);white-space:nowrap">${l.time}</span>
          <span style="color:${colors[l.type]};font-weight:700;min-width:48px">[${l.type}]</span>
          <span style="color:var(--text-muted)">${l.msg}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   GLOBAL ACTIONS
   ══════════════════════════════════════════════════════════ */
function saveAllChanges() {
  showToast('Tüm değişiklikler kaydedildi ✓', 'success');
}

function refreshData() {
  setPage(currentPage);
  showToast('Veriler yenilendi', 'info');
}

/* ══════════════════════════════════════════════════════════
   TOAST SYSTEM
   ══════════════════════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  const container = document.getElementById('toast-container');
  if (!container) return;

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(el);

  setTimeout(() => {
    el.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setPage('wheel');
});
