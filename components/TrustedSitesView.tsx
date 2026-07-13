import React, { useState, useEffect } from 'react';
import { Shield, Star, ChevronRight, ExternalLink, CheckCircle2, Award, Zap, Clock, Lock, TrendingUp, Users } from 'lucide-react';
import { TrustedCompany, CompanyComment } from '../types';
import { loadTrustedComments } from '../utils/trustedEngine';

interface TrustedSitesViewProps {
  companies: TrustedCompany[];
  onSelectCompany: (id: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function tierLabel(tier: string): string {
  if (tier === 'featured') return 'ÖZEL PARTNER';
  if (tier === 'gold') return 'ALTIN';
  if (tier === 'silver') return 'GÜMÜŞ';
  return 'BRONZ';
}

function tierColor(tier: string): string {
  if (tier === 'featured') return '#00d4ff';
  if (tier === 'gold') return '#FFC107';
  if (tier === 'silver') return '#9CA3AF';
  return '#CD7F32';
}

function getAvgRating(comments: CompanyComment[], companyId: string): number {
  const co = comments.filter(c => c.companyId === companyId && c.isVisible);
  if (!co.length) return 0;
  return co.reduce((s, c) => s + c.rating, 0) / co.length;
}

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 10) * circ;
  const color = score >= 9.5 ? '#00d4ff' : score >= 9 ? '#FFC107' : score >= 8.5 ? '#10b981' : '#9CA3AF';
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill="var(--text-primary)"
        style={{ fontSize: size < 60 ? '11px' : '14px', fontWeight: 800, fontFamily: 'inherit' }}>
        {score.toFixed(1)}
      </text>
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} fill={i <= Math.round(rating) ? '#FFC107' : 'none'} stroke={i <= Math.round(rating) ? '#FFC107' : '#6B7280'} />
      ))}
    </span>
  );
}

// ── Featured Hero Card ────────────────────────────────────────────────────────

type CardProps = { company: TrustedCompany; commentCount: number; avgRating: number; onClick: () => void; comments?: CompanyComment[]; };

const FeaturedCard: React.FC<CardProps> = ({ company, commentCount, avgRating, onClick, comments }) => {
  const isBetlivo = company.name.toLowerCase().includes('betlivo') || company.name.toLowerCase().includes('diamondbet');
  const accentColor = isBetlivo ? '#00E676' : '#00d4ff';
  const cardBg = isBetlivo
    ? 'linear-gradient(135deg, rgba(3, 40, 25, 0.3) 0%, rgba(10, 16, 13, 1) 60%)'
    : 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(17,17,24,1) 60%)';
  const cardBorder = isBetlivo ? '1px solid rgba(0, 230, 118, 0.45)' : '1px solid rgba(0,212,255,0.35)';
  const shadowGlow = isBetlivo ? '0 0 35px rgba(0, 230, 118, 0.15)' : '0 0 35px rgba(0,212,255,0.12)';
  const glowOrb = isBetlivo ? 'rgba(0, 230, 118, 0.08)' : 'rgba(0,212,255,0.08)';

  return (
    <div
      onClick={onClick}
      style={{
        background: cardBg,
        border: cardBorder,
        borderRadius: 18,
        padding: '24px 28px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: `${shadowGlow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
        marginBottom: 14,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = isBetlivo
          ? '0 0 50px rgba(0, 230, 118, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 0 50px rgba(0,212,255,0.22), inset 0 1px 0 rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = shadowGlow;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Glow orb */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${glowOrb}, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: 16, overflow: 'hidden',
          border: `2px solid ${accentColor}40`, flexShrink: 0,
          background: `${accentColor}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Name & meta */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>{company.name}</h3>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40`, letterSpacing: 0.5 }}>
              ✓ {tierLabel(company.tier)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <StarRow rating={avgRating} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{avgRating.toFixed(1)} ortalama · {commentCount} değerlendirme</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {company.features.slice(0, 5).map(f => (
              <span key={f} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontWeight: 600 }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Score Ring */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg width={72} height={72}>
              <circle cx={36} cy={36} r={29} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx={36} cy={36} r={29} fill="none"
                stroke={accentColor} strokeWidth="5"
                strokeDasharray={2 * Math.PI * 29}
                strokeDashoffset={2 * Math.PI * 29 * (1 - company.overallScore / 10)}
                strokeLinecap="round" transform="rotate(-90 36 36)"
                style={{ transition: 'stroke-dashoffset 1.4s ease' }}
              />
              <text x={36} y={40} textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'inherit' }}>{company.overallScore.toFixed(1)}</text>
            </svg>
          </div>
          <div style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 }}>GENEL PUAN</div>
        </div>
      </div>

      {/* CTA and Info Row */}
      <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <a
          href={company.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            flex: '0 1 200px', width: 200,
            padding: '11px 20px', textAlign: 'center', borderRadius: 10,
            background: `linear-gradient(135deg, ${accentColor}, ${isBetlivo ? '#00b050' : '#0099cc'})`,
            color: '#000',
            fontWeight: 800, fontSize: 13, letterSpacing: 0.5, textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 4px 15px ${accentColor}25`,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <ExternalLink size={14} />
          HEMEN KATIL
        </a>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={13} color="#10b981" />
            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>{company.licenseInfo}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={13} color="var(--text-muted)" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Çekim: {company.withdrawalSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gold Tier Card (2-col grid) ────────────────────────────────────────────────

const GoldCard: React.FC<CardProps> = ({ company, commentCount, avgRating, onClick, comments }) => {
  const color = tierColor(company.tier);
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${color}40`,
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${color}80`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${color}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${color}40`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', border: `1px solid ${color}30`, flexShrink: 0 }}>
            <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{company.name}</span>
              <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 10, background: `${color}20`, color, border: `1px solid ${color}40`, fontWeight: 700, letterSpacing: 0.5 }}>
                ✓ {tierLabel(company.tier)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StarRow rating={avgRating} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{commentCount} Yorum</span>
            </div>
          </div>
        </div>
        <ScoreRing score={company.overallScore} size={52} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>Hoşgeldin Bonusu</div>
        <div style={{ fontSize: 14, fontWeight: 800, color }}>
          {company.welcomeBonus}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>Kayıp Bonusu</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{company.bonusDetail}</div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
        {company.features.slice(0, 3).map(f => (
          <span key={f} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>{f}</span>
        ))}
      </div>

      {/* Comments Preview */}
      {comments && comments.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          textAlign: 'left'
        }}>
          <div style={{ fontSize: 9, color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Kullanıcı Yorumu
          </div>
          {comments.slice(0, 1).map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>{c.username}</span>
                <StarRow rating={c.rating} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                "{c.content}"
              </p>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={company.affiliateLink} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, padding: '9px 0', textAlign: 'center', borderRadius: 8, background: color, color: '#000', fontWeight: 800, fontSize: 11, textDecoration: 'none', letterSpacing: 0.3 }}
        >
          ZİYARET ET
        </a>
        <button
          onClick={onClick}
          style={{ flex: 1, padding: '9px 0', borderRadius: 8, background: 'transparent', border: `1px solid ${color}50`, color, fontWeight: 800, fontSize: 11, cursor: 'pointer', letterSpacing: 0.3 }}
        >
          AYRINTILI İNCELEME
        </button>
      </div>
    </div>
  );
}

// ── Silver Tier Card (3-col grid) ─────────────────────────────────────────────

const SilverCard: React.FC<CardProps> = ({ company, commentCount, avgRating, onClick }) => {
  const color = tierColor(company.tier);
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${color}50`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border-card)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-card)', flexShrink: 0 }}>
          <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', truncate: true } as any}>{company.name}</span>
            <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 6, background: `${color}18`, color, fontWeight: 700 }}>✓</span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{company.bonusDetail}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color, flexShrink: 0 }}>{company.overallScore.toFixed(1)}</div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 12 }}>{company.welcomeBonus}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <StarRow rating={avgRating} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({commentCount})</span>
        </div>
        <button onClick={onClick} style={{ fontSize: 9, color, background: 'transparent', border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 7px', cursor: 'pointer', fontWeight: 700 }}>
          İncele
        </button>
      </div>

      <a
        href={company.affiliateLink} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{ display: 'block', padding: '9px', textAlign: 'center', borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, color, fontWeight: 800, fontSize: 11, textDecoration: 'none' }}
      >
        ZİYARET ET
      </a>
    </div>
  );
}

// ── Bronze Compact Row ────────────────────────────────────────────────────────

const BronzeRow: React.FC<CardProps> = ({ company, commentCount, avgRating, onClick }) => {
  const color = tierColor(company.tier);
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: '12px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${color}40`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border-subtle)'; }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 7, overflow: 'hidden', flexShrink: 0 }}>
        <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 2 }}>{company.name}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <StarRow rating={avgRating} />
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Puan {company.overallScore.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <a
          href={company.affiliateLink} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ fontSize: 10, padding: '6px 12px', borderRadius: 7, background: `${color}15`, border: `1px solid ${color}30`, color, fontWeight: 700, textDecoration: 'none' }}
        >
          ZİYARET ET
        </a>
        <button onClick={onClick} style={{ fontSize: 10, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          İncele
        </button>
      </div>
    </div>
  );
}

// ── Trust Badges Banner ───────────────────────────────────────────────────────

function TrustBadges() {
  const badges = [
    { icon: <Lock size={14} />, label: 'SSL Şifreli' },
    { icon: <Shield size={14} />, label: 'Lisanslı & Denetimli' },
    { icon: <CheckCircle2 size={14} />, label: 'Bağımsız Test' },
    { icon: <Clock size={14} />, label: '7/24 Destek' },
    { icon: <TrendingUp size={14} />, label: 'Hızlı Çekim' },
    { icon: <Award size={14} />, label: 'Güvenilir Ödeme' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32, padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      {badges.map(b => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '5px 12px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: '#10b981' }}>{b.icon}</span>
          {b.label}
        </div>
      ))}
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────

const TrustedSitesView: React.FC<TrustedSitesViewProps> = ({ companies, onSelectCompany }) => {
  const [comments, setComments] = useState<CompanyComment[]>([]);

  useEffect(() => {
    setComments(loadTrustedComments());
  }, []);

  const active = companies.filter(c => c.isActive).sort((a, b) => a.order - b.order);
  const featured = active.filter(c => c.tier === 'featured');
  const gold = active.filter(c => c.tier === 'gold');
  const silver = active.filter(c => c.tier === 'silver');
  const bronze = active.filter(c => c.tier === 'bronze');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 100px' }}>


      {featured.map(company => (
        <FeaturedCard
          key={company.id}
          company={company}
          commentCount={comments.filter(c => c.companyId === company.id && c.isVisible).length}
          avgRating={getAvgRating(comments, company.id)}
          onClick={() => onSelectCompany(company.id)}
          comments={comments.filter(c => c.companyId === company.id && c.isVisible)}
        />
      ))}

      {/* Gold Tier */}
      {gold.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={12} color="#FFC107" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFC107', letterSpacing: 1, textTransform: 'uppercase' }}>Altın Kategori</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,193,7,0.2)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {gold.map(company => (
              <GoldCard
                key={company.id}
                company={company}
                commentCount={comments.filter(c => c.companyId === company.id && c.isVisible).length}
                avgRating={getAvgRating(comments, company.id)}
                onClick={() => onSelectCompany(company.id)}
                comments={comments.filter(c => c.companyId === company.id && c.isVisible)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Silver Tier */}
      {silver.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(156,163,175,0.1)', border: '1px solid rgba(156,163,175,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={12} color="#9CA3AF" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase' }}>Gümüş Kategori</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(156,163,175,0.15)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {silver.map(company => (
              <SilverCard
                key={company.id}
                company={company}
                commentCount={comments.filter(c => c.companyId === company.id && c.isVisible).length}
                avgRating={getAvgRating(comments, company.id)}
                onClick={() => onSelectCompany(company.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bronze Tier */}
      {bronze.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(205,127,50,0.1)', border: '1px solid rgba(205,127,50,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={12} color="#CD7F32" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#CD7F32', letterSpacing: 1, textTransform: 'uppercase' }}>Bronz Kategori</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(205,127,50,0.15)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bronze.map(company => (
              <BronzeRow
                key={company.id}
                company={company}
                commentCount={comments.filter(c => c.companyId === company.id && c.isVisible).length}
                avgRating={getAvgRating(comments, company.id)}
                onClick={() => onSelectCompany(company.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {active.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏗️</div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Henüz aktif şirket bulunmuyor. Admin panelinden ekleyiniz.</p>
        </div>
      )}

      {/* Footer note */}
      <div style={{ marginTop: 48, padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          ⚠️ Bu listede yer alan siteler sponsorlu olup bağımsız güvenilirlik testinden geçirilmiştir. 18 yaşından küçüklerin kumar oynaması yasaktır. Lütfen sorumlu bir şekilde oynayın.
        </p>
      </div>
    </div>
  );
};

export default TrustedSitesView;
