import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Star, Shield, Zap, Trophy, Clock, ExternalLink, CheckCircle2,
  XCircle, Award, Lock, MessageSquare, ChevronDown, ChevronUp, TrendingUp,
  CreditCard, HeartHandshake, Users, Flame, BadgeCheck
} from 'lucide-react';
import { TrustedCompany, CompanyComment } from '../types';
import { loadTrustedComments, processAutoReplies } from '../utils/trustedEngine';

interface TrustedDetailViewProps {
  company: TrustedCompany;
  onBack: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function tierColor(tier: string): string {
  if (tier === 'featured') return '#00d4ff';
  if (tier === 'gold') return '#FFC107';
  if (tier === 'silver') return '#9CA3AF';
  return '#CD7F32';
}

function tierLabel(tier: string): string {
  if (tier === 'featured') return 'ÖZEL PARTNER';
  if (tier === 'gold') return 'ALTIN';
  if (tier === 'silver') return 'GÜMÜŞ';
  return 'BRONZ';
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} dakika önce`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs} saat önce`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return 'dün';
  if (days < 30) return `${days} gün önce`;
  const months = Math.floor(days / 30);
  return `${months} ay önce`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScoreBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  const color = score >= 9.5 ? '#00d4ff' : score >= 9 ? '#10b981' : score >= 8 ? '#FFC107' : '#f59e0b';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 900, color }}>{score.toFixed(1)}</span>
      </div>
      <div style={{ height: 6, borderRadius: 10, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 10,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          width: animated ? `${(score / 10) * 100}%` : '0%',
          transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? '#FFC107' : 'none'} stroke={i <= rating ? '#FFC107' : '#4B5563'} />
      ))}
    </span>
  );
}

function SentimentDot({ sentiment }: { sentiment: string }) {
  const color = sentiment === 'positive' ? '#10b981' : sentiment === 'neutral' ? '#9CA3AF' : '#f59e0b';
  return <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />;
}

const CommentCard: React.FC<{ comment: CompanyComment }> = ({ comment }) => {
  const sentimentBorder = comment.sentiment === 'critical' ? '#f59e0b30' : 'var(--border-card)';
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${sentimentBorder}`,
      borderRadius: 12,
      padding: '16px 18px',
      marginBottom: 12,
    }}>
      {/* Comment header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>
          {comment.authorAvatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{comment.authorName}</span>
            <SentimentDot sentiment={comment.sentiment} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <StarDisplay rating={comment.rating} />
        </div>
      </div>

      {/* Comment body */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
        {comment.content}
      </p>

      {/* Official reply */}
      {comment.reply?.isVisible && (
        <div style={{
          marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)',
          paddingLeft: 14, borderLeft: '2px solid rgba(0,212,255,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <BadgeCheck size={14} color="#00d4ff" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#00d4ff', letterSpacing: 0.5 }}>{comment.reply.authorTitle}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>{timeAgo(comment.reply.replyAt)}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
            {comment.reply.content}
          </p>
        </div>
      )}

      {/* Pending reply indicator */}
      {comment.reply && !comment.reply.isVisible && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', animation: 'pulse 1.5s ease infinite' }} />
          <span style={{ fontSize: 10, color: '#FFC107', fontWeight: 600 }}>Firma yetkilisi yanıt bekliyor...</span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

const TrustedDetailView: React.FC<TrustedDetailViewProps> = ({ company, onBack }) => {
  const [comments, setComments] = useState<CompanyComment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);

  const refreshComments = useCallback(() => {
    processAutoReplies();
    const all = loadTrustedComments();
    setComments(all.filter(c => c.companyId === company.id && c.isVisible));
  }, [company.id]);

  useEffect(() => {
    refreshComments();
    const interval = setInterval(refreshComments, 30000);
    return () => clearInterval(interval);
  }, [refreshComments]);

  const color = tierColor(company.tier);
  const avgRating = comments.length ? comments.reduce((s, c) => s + c.rating, 0) / comments.length : 0;
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Header with Back button and Company Name/CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px solid var(--border-card)',
            borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; (e.currentTarget as HTMLButtonElement).style.color = color; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          <ArrowLeft size={14} />
          Güvenilir Siteler
        </button>

        <a
          href={company.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '8px 16px', borderRadius: 8,
            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
            color: '#000',
            fontWeight: 800, fontSize: 12, letterSpacing: 0.5, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <ExternalLink size={14} />
          HEMEN KATIL
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', border: `1px solid ${color}40`, flexShrink: 0, background: `${color}10` }}>
          <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{company.name} Analizi</h1>
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14} fill={i <= Math.round(avgRating) ? '#FFC107' : 'none'} stroke={i <= Math.round(avgRating) ? '#FFC107' : '#4B5563'} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>({company.overallScore.toFixed(1)})</span>
      </div>

      {/* 4-column compact grid for all analyses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {/* Score breakdown */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, padding: '14px' }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={12} color={color} /> Puan Analizi
          </h2>
          <ScoreBar label="Güvenlik & Lisans" score={company.safetyScore} icon={<Shield size={11} />} />
          <ScoreBar label="Bonus & Promosyon" score={company.bonusScore} icon={<Trophy size={11} />} />
          <ScoreBar label="Müşteri Desteği" score={company.supportScore} icon={<HeartHandshake size={11} />} />
          <ScoreBar label="Ödeme Hızı" score={company.paymentScore} icon={<CreditCard size={11} />} />
        </div>

        {/* Info grid */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, padding: '14px' }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Award size={12} color={color} /> Platform Bilgileri
          </h2>
          {[
            { label: 'Kuruluş', value: company.foundedYear, icon: <Clock size={11} /> },
            { label: 'Min. Yatırım', value: company.minDeposit, icon: <CreditCard size={11} /> },
            { label: 'Çekim', value: company.withdrawalSpeed, icon: <Zap size={11} /> },
            { label: 'Lisans', value: company.licenseInfo, icon: <Shield size={11} /> },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                {item.icon} <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
            </div>
          ))}
          <div style={{ padding: '6px 8px', borderRadius: 6, background: `${color}10`, border: `1px solid ${color}25` }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Hoşgeldin Bonusu</div>
            <div style={{ fontSize: 12, fontWeight: 900, color }}>{company.welcomeBonus}</div>
          </div>
        </div>

        {/* Pros */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '14px' }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#10b981', marginBottom: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={12} /> Avantajlar
          </h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {company.pros.map((pro, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6, fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <CheckCircle2 size={10} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} /> {pro}
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '14px' }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', marginBottom: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <XCircle size={12} /> Dezavantajlar
          </h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {company.cons.map((con, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6, fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <XCircle size={10} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} /> {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 14, padding: '22px 26px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flame size={14} color={color} />
          Platform Hakkında
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
          {company.description}
        </p>
      </div>

      {/* Comments Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <MessageSquare size={14} color={color} />
            Kullanıcı Yorumları
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: `${color}18`, color, border: `1px solid ${color}30` }}>
              {comments.length}
            </span>
          </h2>
          {/* Rating summary */}
          {comments.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={14} fill="#FFC107" stroke="#FFC107" />
              <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)' }}>{avgRating.toFixed(1)}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 5</span>
            </div>
          )}
        </div>

        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
            <MessageSquare size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
          </div>
        ) : (
          <>
            {displayedComments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}

            {comments.length > 3 && (
              <button
                onClick={() => setShowAllComments(v => !v)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border-card)',
                  color: 'var(--text-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; (e.currentTarget as HTMLButtonElement).style.color = color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                {showAllComments ? (
                  <><ChevronUp size={14} /> Daha az göster</>
                ) : (
                  <><ChevronDown size={14} /> Tüm {comments.length} yorumu göster</>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: 36, padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
          ⚠️ Bu inceleme bağımsız değerlendirme kriterleri kullanılarak hazırlanmış olup sponsorludur. Yorumlar platformun gerçek kullanıcı deneyimlerini yansıtmaktadır. 18 yaşından küçüklerin kumar oynaması yasaktır.
        </p>
      </div>
    </div>
  );
};

export default TrustedDetailView;
