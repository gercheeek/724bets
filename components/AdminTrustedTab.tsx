import React, { useState, useRef } from 'react';
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp,
  Shield, Star, Eye, EyeOff, MessageSquare, RefreshCw,
  Check, AlertCircle, Flame, Award, Clock, ToggleLeft, ToggleRight, ExternalLink
} from 'lucide-react';
import { TrustedCompany, CompanyComment, CompanyTier } from '../types';
import {
  loadTrustedComments, saveTrustedComments, saveTrustedCompanies,
  generateComment, processDripComments, processAutoReplies,
} from '../utils/trustedEngine';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

interface AdminTrustedTabProps {
  companies: TrustedCompany[];
  onSave: (companies: TrustedCompany[]) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function generateId(): string {
  return `tc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const TIER_OPTIONS: { value: CompanyTier; label: string; color: string }[] = [
  { value: 'featured', label: 'Özel Partner', color: '#00d4ff' },
  { value: 'gold', label: 'Altın', color: '#FFC107' },
  { value: 'silver', label: 'Gümüş', color: '#9CA3AF' },
  { value: 'bronze', label: 'Bronz', color: '#CD7F32' },
];

function tierColor(tier: string) {
  return TIER_OPTIONS.find(t => t.value === tier)?.color || '#9CA3AF';
}

function emptyCompany(): TrustedCompany {
  const now = Date.now();
  return {
    id: generateId(),
    name: '',
    logo: '',
    affiliateLink: '',
    tier: 'bronze',
    overallScore: 8.0,
    safetyScore: 8.0,
    bonusScore: 8.0,
    supportScore: 8.0,
    paymentScore: 8.0,
    welcomeBonus: '',
    bonusDetail: '',
    features: [],
    pros: [],
    cons: [],
    description: '',
    licenseInfo: '',
    foundedYear: 2023,
    minDeposit: '100 TL',
    withdrawalSpeed: '1-2 Saat',
    isActive: true,
    isFeatured: false,
    order: 99,
    createdAt: now,
    lastUpdated: now,
    nextCommentAt: now + 24 * 3600 * 1000,
    commentDripEnabled: true,
  };
}

// ── ScoreSlider ────────────────────────────────────────────────────────────────
function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const color = value >= 9.5 ? '#00d4ff' : value >= 9 ? '#10b981' : value >= 8 ? '#FFC107' : '#f59e0b';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{value.toFixed(1)}</span>
      </div>
      <input
        type="range" min={1} max={10} step={0.1} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  );
}

// ── Tag Editor ─────────────────────────────────────────────────────────────────
function TagEditor({ label, items, onChange, placeholder }: {
  label: string; items: string[]; onChange: (items: string[]) => void; placeholder: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    if (input.trim()) { onChange([...items, input.trim()]); setInput(''); }
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}>
            {item}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1, padding: 0, fontSize: 12 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-card)',
            borderRadius: 7, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 12,
            outline: 'none',
          }}
        />
        <button onClick={add} style={{ padding: '6px 12px', borderRadius: 7, background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)', color: '#FFC107', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
          Ekle
        </button>
      </div>
    </div>
  );
}

// ── Company Form ───────────────────────────────────────────────────────────────
function CompanyForm({
  company,
  onSave,
  onCancel,
}: {
  company: TrustedCompany;
  onSave: (c: TrustedCompany) => void;
  onCancel: () => void;
}) {
  const [local, setLocal] = useState<TrustedCompany>({ ...company });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<TrustedCompany>) => setLocal(prev => ({ ...prev, ...patch }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const resized = await resizeImage(file, 400, 400);
      const result = await uploadImageToSupabase(resized, 'slider-images', `trusted_logos/${local.id}`);
      if (result.url) set({ logo: result.url });
    } catch { /* silent */ } finally { setUploadingLogo(false); }
  };

  const handleSave = () => {
    onSave({ ...local, lastUpdated: Date.now() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-card)',
    borderRadius: 8, padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
    outline: 'none', marginTop: 4, boxSizing: 'border-box' as const,
  };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 2 };

  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-card)', borderRadius: 14, padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
          {company.name ? `${company.name} — Düzenle` : 'Yeni Şirket Ekle'}
        </h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Şirket Adı</label>
          <input value={local.name} onChange={e => set({ name: e.target.value })} placeholder="DiamondBet" style={inputStyle} />
        </div>
        {/* Tier */}
        <div>
          <label style={labelStyle}>Kategori</label>
          <select value={local.tier} onChange={e => set({ tier: e.target.value as CompanyTier })} style={inputStyle}>
            {TIER_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        {/* Affiliate Link */}
        <div>
          <label style={labelStyle}>Affiliate Linki</label>
          <input value={local.affiliateLink} onChange={e => set({ affiliateLink: e.target.value })} placeholder="https://" style={inputStyle} />
        </div>
        {/* Order */}
        <div>
          <label style={labelStyle}>Sıra</label>
          <input type="number" value={local.order} onChange={e => set({ order: parseInt(e.target.value) || 1 })} style={inputStyle} />
        </div>
        {/* Welcome Bonus */}
        <div>
          <label style={labelStyle}>Hoşgeldin Bonusu</label>
          <input value={local.welcomeBonus} onChange={e => set({ welcomeBonus: e.target.value })} placeholder="%200 Çevrimsiz + 1000 FS" style={inputStyle} />
        </div>
        {/* Bonus Detail */}
        <div>
          <label style={labelStyle}>Bonus Detay</label>
          <input value={local.bonusDetail} onChange={e => set({ bonusDetail: e.target.value })} placeholder="%40 Nakit İade" style={inputStyle} />
        </div>
        {/* Promotion Banner Text (for Featured) */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ ...labelStyle, color: '#00e676' }}>Günün Öne Çıkan Promosyon Metni (Sadece Special Partner/Featured)</label>
          <input value={local.promotionText || ''} onChange={e => set({ promotionText: e.target.value })} placeholder="%300 HOŞGELDİN BONUSU + 1500 FS" style={{ ...inputStyle, border: '1px solid rgba(0, 230, 118, 0.4)' }} />
        </div>
        {/* Promotion Color */}
        <div>
          <label style={labelStyle}>Promosyon Rengi</label>
          <input type="color" value={local.promotionColor || '#00e676'} onChange={e => set({ promotionColor: e.target.value })} style={{ ...inputStyle, height: 40, padding: '2px 6px' }} />
        </div>
        {/* Is Featured Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18 }}>
          <input type="checkbox" checked={local.isFeatured} onChange={e => set({ isFeatured: e.target.checked })} style={{ transform: 'scale(1.2)' }} />
          <label style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Öne Çıkan (Special Partner Banner)</label>
        </div>
        {/* License */}
        <div>
          <label style={labelStyle}>Lisans Bilgisi</label>
          <input value={local.licenseInfo} onChange={e => set({ licenseInfo: e.target.value })} placeholder="Curacao eGaming #5536/JAZ" style={inputStyle} />
        </div>
        {/* Founded Year */}
        <div>
          <label style={labelStyle}>Kuruluş Yılı</label>
          <input type="number" value={local.foundedYear} onChange={e => set({ foundedYear: parseInt(e.target.value) || 2020 })} style={inputStyle} />
        </div>
        {/* Min Deposit */}
        <div>
          <label style={labelStyle}>Min. Yatırım</label>
          <input value={local.minDeposit} onChange={e => set({ minDeposit: e.target.value })} placeholder="100 TL" style={inputStyle} />
        </div>
        {/* Withdrawal Speed */}
        <div>
          <label style={labelStyle}>Çekim Süresi</label>
          <input value={local.withdrawalSpeed} onChange={e => set({ withdrawalSpeed: e.target.value })} placeholder="1-2 Saat" style={inputStyle} />
        </div>
      </div>

      {/* Logo */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Logo URL / Yükle</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={local.logo} onChange={e => set({ logo: e.target.value })} placeholder="https://... veya yükle" style={{ ...inputStyle, flex: 1, marginTop: 0 }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploadingLogo}
            style={{ padding: '9px 14px', borderRadius: 8, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.3)', color: '#FFC107', cursor: 'pointer', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {uploadingLogo ? '...' : 'Yükle'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
          {local.logo && <img src={local.logo} alt="logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border-card)' }} />}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Platform Açıklaması</label>
        <textarea value={local.description} onChange={e => set({ description: e.target.value })} rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="Platform hakkında detaylı açıklama..." />
      </div>

      {/* Scores */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Puanlar</label>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, padding: '16px', marginTop: 6 }}>
          <ScoreSlider label="Genel Puan" value={local.overallScore} onChange={v => set({ overallScore: v })} />
          <ScoreSlider label="Güvenlik" value={local.safetyScore} onChange={v => set({ safetyScore: v })} />
          <ScoreSlider label="Bonus" value={local.bonusScore} onChange={v => set({ bonusScore: v })} />
          <ScoreSlider label="Destek" value={local.supportScore} onChange={v => set({ supportScore: v })} />
          <ScoreSlider label="Ödeme" value={local.paymentScore} onChange={v => set({ paymentScore: v })} />
        </div>
      </div>

      {/* Tag editors */}
      <TagEditor label="Özellik Etiketleri" items={local.features} onChange={v => set({ features: v })} placeholder="Kripto, 7/24 Destek, ..." />
      <TagEditor label="Avantajlar (Pros)" items={local.pros} onChange={v => set({ pros: v })} placeholder="Hızlı çekim..." />
      <TagEditor label="Dezavantajlar (Cons)" items={local.cons} onChange={v => set({ cons: v })} placeholder="Belge doğrulama uzun..." />

      {/* Toggles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        {[
          { key: 'isActive', label: 'Aktif', value: local.isActive },
          { key: 'isFeatured', label: 'Öne Çıkan', value: local.isFeatured },
          { key: 'commentDripEnabled', label: 'Yorum Damlaması', value: local.commentDripEnabled },
        ].map(toggle => (
          <button key={toggle.key} onClick={() => set({ [toggle.key]: !toggle.value } as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: toggle.value ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
              border: toggle.value ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border-card)',
              color: toggle.value ? '#10b981' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>
            {toggle.value ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
            {toggle.label}
          </button>
        ))}
      </div>

      {/* Save / Cancel */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSave}
          style={{
            flex: 1, padding: '11px', borderRadius: 9,
            background: saved ? '#10b981' : 'linear-gradient(135deg, #FFC107, #f59e0b)',
            border: 'none', color: '#000', fontWeight: 800, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.3s',
          }}>
          {saved ? <><Check size={15} /> Kaydedildi!</> : <><Save size={15} /> Kaydet</>}
        </button>
        <button onClick={onCancel}
          style={{ padding: '11px 20px', borderRadius: 9, background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-muted)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          İptal
        </button>
      </div>
    </div>
  );
}

// ── Comment Manager ────────────────────────────────────────────────────────────
function CommentManager({ company }: { company: TrustedCompany }) {
  const [comments, setComments] = useState<CompanyComment[]>([]);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [dripResult, setDripResult] = useState('');

  const refresh = () => {
    const all = loadTrustedComments();
    setComments(all.filter(c => c.companyId === company.id));
  };

  React.useEffect(refresh, [company.id]);

  const toggleVisibility = (id: string) => {
    const all = loadTrustedComments();
    const updated = all.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c);
    saveTrustedComments(updated);
    refresh();
  };

  const deleteComment = (id: string) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    const all = loadTrustedComments();
    saveTrustedComments(all.filter(c => c.id !== id));
    refresh();
  };

  const saveReply = (id: string) => {
    const all = loadTrustedComments();
    const updated = all.map(c => c.id === id ? {
      ...c,
      reply: { content: replyText, replyAt: Date.now(), isVisible: true, authorTitle: 'Firma Yetkilisi' }
    } : c);
    saveTrustedComments(updated);
    setEditingReply(null);
    setReplyText('');
    refresh();
  };

  const forceDrip = () => {
    // Force drip by resetting nextCommentAt
    const raw = localStorage.getItem('site_trusted_companies');
    if (!raw) return;
    const cos: TrustedCompany[] = JSON.parse(raw);
    const updated = cos.map(c => c.id === company.id ? { ...c, nextCommentAt: Date.now() - 1 } : c);
    saveTrustedCompanies(updated);
    processDripComments();
    processAutoReplies();
    refresh();
    setDripResult('✅ Yeni yorum eklendi!');
    setTimeout(() => setDripResult(''), 3000);
  };

  const sentimentColor = (s: string) => s === 'positive' ? '#10b981' : s === 'neutral' ? '#9CA3AF' : '#f59e0b';

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <MessageSquare size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />
          Yorumlar ({comments.length})
        </h4>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dripResult && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>{dripResult}</span>}
          <button onClick={forceDrip}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.25)', color: '#FFC107', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            <RefreshCw size={11} />
            Şimdi Damla
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Henüz yorum yok.</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px',
            marginBottom: 10, opacity: comment.isVisible ? 1 : 0.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{comment.authorAvatar} {comment.authorName}</span>
                  <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 6, background: `${sentimentColor(comment.sentiment)}18`, color: sentimentColor(comment.sentiment), fontWeight: 700 }}>
                    {comment.sentiment === 'positive' ? 'Pozitif' : comment.sentiment === 'neutral' ? 'Nötr' : 'Eleştirel'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>⭐ {comment.rating}/5</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{comment.content}</p>
                {comment.reply && (
                  <p style={{ fontSize: 11, color: comment.reply.isVisible ? '#00d4ff' : '#f59e0b', marginTop: 6, padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, borderLeft: `2px solid ${comment.reply.isVisible ? '#00d4ff' : '#f59e0b'}` }}>
                    {comment.reply.isVisible ? '✓ Yanıt görünür' : `⏳ Yanıt ${new Date(comment.reply.replyAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} de görünecek`}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => toggleVisibility(comment.id)}
                  title={comment.isVisible ? 'Gizle' : 'Göster'}
                  style={{ padding: '5px', borderRadius: 6, background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {comment.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button onClick={() => { setEditingReply(comment.id); setReplyText(comment.reply?.content || ''); }}
                  title="Yanıt Düzenle"
                  style={{ padding: '5px', borderRadius: 6, background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <Edit3 size={12} />
                </button>
                <button onClick={() => deleteComment(comment.id)}
                  title="Sil"
                  style={{ padding: '5px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', color: '#ef4444' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {editingReply === comment.id && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                  placeholder="Firma yetkilisi yanıtı..."
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 7, padding: '8px 10px', color: 'var(--text-primary)', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 7, marginTop: 7 }}>
                  <button onClick={() => saveReply(comment.id)}
                    style={{ padding: '6px 14px', borderRadius: 7, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                    <Check size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />Kaydet
                  </button>
                  <button onClick={() => setEditingReply(null)}
                    style={{ padding: '6px 12px', borderRadius: 7, background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ── Company Row ────────────────────────────────────────────────────────────────
function CompanyRow({ company, onEdit, onDelete, onToggle, expanded, onExpand }: {
  company: TrustedCompany;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  expanded: boolean;
  onExpand: () => void;
}) {
  const color = tierColor(company.tier);
  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${company.isActive ? 'var(--border-card)' : 'var(--border-subtle)'}`, borderRadius: 12, marginBottom: 10, overflow: 'hidden', opacity: company.isActive ? 1 : 0.6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }} onClick={onExpand}>
        {/* Logo */}
        <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', border: `1px solid ${color}30`, flexShrink: 0 }}>
          <img src={company.logo || 'https://picsum.photos/seed/placeholder/100/100'} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{company.name || 'İsimsiz'}</span>
            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 6, background: `${color}18`, color, fontWeight: 700, border: `1px solid ${color}30` }}>
              {TIER_OPTIONS.find(t => t.value === company.tier)?.label}
            </span>
            {!company.isActive && <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700 }}>GİZLİ</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Puan: {company.overallScore.toFixed(1)} · {company.welcomeBonus}</div>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onToggle(); }}
            style={{ padding: '5px', borderRadius: 7, background: company.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${company.isActive ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, cursor: 'pointer', color: company.isActive ? '#10b981' : 'var(--text-muted)' }}>
            {company.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onEdit(); }}
            style={{ padding: '5px', borderRadius: 7, background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)', cursor: 'pointer', color: '#FFC107' }}>
            <Edit3 size={13} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ padding: '5px', borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', color: '#ef4444' }}>
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
        </div>
      </div>

      {/* Expanded: Comment Manager */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <CommentManager company={company} />
        </div>
      )}
    </div>
  );
}

// ── Main Tab ───────────────────────────────────────────────────────────────────

const AdminTrustedTab: React.FC<AdminTrustedTabProps> = ({ companies, onSave }) => {
  const [local, setLocal] = useState<TrustedCompany[]>(companies);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState<TrustedCompany | null>(null);

  // Sync prop changes
  React.useEffect(() => { setLocal(companies); }, [companies]);

  const handleSaveCompany = (updated: TrustedCompany) => {
    const exists = local.find(c => c.id === updated.id);
    const newList = exists
      ? local.map(c => c.id === updated.id ? updated : c)
      : [...local, updated];
    setLocal(newList);
    onSave(newList);
    setEditingId(null);
    setCreatingNew(false);
    setNewCompany(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Bu şirketi silmek istediğinize emin misiniz?')) return;
    const newList = local.filter(c => c.id !== id);
    setLocal(newList);
    onSave(newList);
  };

  const handleToggle = (id: string) => {
    const newList = local.map(c => c.id === id ? { ...c, isActive: !c.isActive, lastUpdated: Date.now() } : c);
    setLocal(newList);
    onSave(newList);
  };

  const handleStartNew = () => {
    setNewCompany(emptyCompany());
    setCreatingNew(true);
    setEditingId(null);
  };

  const sorted = [...local].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <Shield size={15} style={{ verticalAlign: 'middle', marginRight: 7, color: '#00d4ff' }} />
            Güvenilir Siteler Yönetimi
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
            {local.filter(c => c.isActive).length} aktif · {local.length} toplam şirket
          </p>
        </div>
        <button
          onClick={handleStartNew}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9,
            background: 'linear-gradient(135deg, rgba(255,193,7,0.15), rgba(255,193,7,0.08))',
            border: '1px solid rgba(255,193,7,0.35)', color: '#FFC107', fontWeight: 800, fontSize: 12,
            cursor: 'pointer', letterSpacing: 0.3,
          }}
        >
          <Plus size={14} />
          Yeni Şirket Ekle
        </button>
      </div>

      {/* New company form */}
      {creatingNew && newCompany && (
        <div style={{ marginBottom: 20 }}>
          <CompanyForm
            company={newCompany}
            onSave={handleSaveCompany}
            onCancel={() => { setCreatingNew(false); setNewCompany(null); }}
          />
        </div>
      )}

      {/* Company list */}
      {sorted.map(company => (
        <div key={company.id}>
          {editingId === company.id ? (
            <div style={{ marginBottom: 10 }}>
              <CompanyForm
                company={company}
                onSave={handleSaveCompany}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <CompanyRow
              company={company}
              onEdit={() => setEditingId(company.id)}
              onDelete={() => handleDelete(company.id)}
              onToggle={() => handleToggle(company.id)}
              expanded={expandedId === company.id}
              onExpand={() => setExpandedId(expandedId === company.id ? null : company.id)}
            />
          )}
        </div>
      ))}

      {local.length === 0 && !creatingNew && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <Shield size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 13 }}>Henüz şirket eklenmedi. "Yeni Şirket Ekle" butonunu kullanın.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTrustedTab;
