import React, { useState } from 'react';
import { Plus, Trash2, Save, Flame, Link as LinkIcon, Clock, Trophy, ToggleLeft, ToggleRight } from 'lucide-react';
import { PopularBetsConfig, PopularBet } from '../types';

interface AdminPopularBetsTabProps {
    config: PopularBetsConfig;
    onSave: (config: PopularBetsConfig) => void;
}

const AdminPopularBetsTab: React.FC<AdminPopularBetsTabProps> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = useState<PopularBetsConfig>({ ...config });
    const [saved, setSaved] = useState(false);

    const handleToggleActive = () => {
        setLocalConfig(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const addBet = () => {
        const newBet: PopularBet = {
            id: Date.now().toString(),
            homeTeam: '',
            awayTeam: '',
            matchTime: 'Bugün 20:00',
            prediction: 'İlk Yarı/Maç Sonucu:',
            predictionShort: '1/1',
            odds: 1.50,
            playCount: Math.floor(Math.random() * 100) + 50,
            isHot: false,
            affiliateUrl: '',
            league: '',
        };
        setLocalConfig(prev => ({ ...prev, bets: [...prev.bets, newBet] }));
    };

    const removeBet = (id: string) => {
        setLocalConfig(prev => ({ ...prev, bets: prev.bets.filter(b => b.id !== id) }));
    };

    const updateBet = (id: string, field: keyof PopularBet, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            bets: prev.bets.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const handleSave = () => {
        onSave(localConfig);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Flame style={{ width: 20, height: 20, color: '#000' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>POPÜLER BAHİSLER</h2>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', margin: 0 }}>Anasayfada gösterilen popüler bahis kartlarını yönetin</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Toggle Active */}
                    <button
                        onClick={handleToggleActive}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                            border: '1px solid', fontSize: '11px', fontWeight: 800,
                            background: localConfig.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            borderColor: localConfig.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                            color: localConfig.isActive ? '#22c55e' : '#ef4444',
                        }}
                    >
                        {localConfig.isActive ? <ToggleRight style={{ width: 16, height: 16 }} /> : <ToggleLeft style={{ width: 16, height: 16 }} />}
                        {localConfig.isActive ? 'AKTİF' : 'PASİF'}
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                            border: 'none', fontSize: '11px', fontWeight: 900,
                            background: saved ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: '#000', textTransform: 'uppercase', letterSpacing: '1px',
                            transition: 'all 0.3s',
                        }}
                    >
                        <Save style={{ width: 14, height: 14 }} />
                        {saved ? 'KAYDEDİLDİ ✓' : 'KAYDET'}
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFD700' }}>{localConfig.bets.length}</div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Toplam Bahis</div>
                </div>
                <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#ef4444' }}>{localConfig.bets.filter(b => b.isHot).length}</div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Hot Bahis</div>
                </div>
                <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: localConfig.isActive ? '#22c55e' : '#ef4444' }}>{localConfig.isActive ? 'ON' : 'OFF'}</div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Durum</div>
                </div>
            </div>

            {/* Add Button */}
            <button
                onClick={addBet}
                style={{
                    width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer',
                    border: '2px dashed rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.03)',
                    color: '#FFD700', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    marginBottom: '20px', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; }}
            >
                <Plus style={{ width: 16, height: 16 }} /> Yeni Bahis Ekle
            </button>

            {/* Bets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localConfig.bets.map((bet, idx) => (
                    <div key={bet.id} style={{
                        background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px',
                        padding: '16px', position: 'relative',
                    }}>
                        {/* Card Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFD700', background: 'rgba(255,215,0,0.1)', padding: '3px 8px', borderRadius: '6px' }}>#{idx + 1}</span>
                                {bet.isHot && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 800 }}>🔥 HOT</span>}
                            </div>
                            <button
                                onClick={() => removeBet(bet.id)}
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Trash2 style={{ width: 12, height: 12 }} /> SİL
                            </button>
                        </div>

                        {/* Row 1: Teams */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Ev Sahibi</label>
                                <input
                                    value={bet.homeTeam}
                                    onChange={e => updateBet(bet.id, 'homeTeam', e.target.value)}
                                    placeholder="Galatasaray"
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Deplasman</label>
                                <input
                                    value={bet.awayTeam}
                                    onChange={e => updateBet(bet.id, 'awayTeam', e.target.value)}
                                    placeholder="Fenerbahçe"
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        {/* Row 2: Match Time + League */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>
                                    <Clock style={{ width: 10, height: 10, display: 'inline', marginRight: '4px' }} />Maç Zamanı
                                </label>
                                <input
                                    value={bet.matchTime}
                                    onChange={e => updateBet(bet.id, 'matchTime', e.target.value)}
                                    placeholder="Bugün 20:00"
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>
                                    <Trophy style={{ width: 10, height: 10, display: 'inline', marginRight: '4px' }} />Lig (opsiyonel)
                                </label>
                                <input
                                    value={bet.league || ''}
                                    onChange={e => updateBet(bet.id, 'league', e.target.value)}
                                    placeholder="Süper Lig"
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        {/* Row 3: Prediction Full + Short */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Tahmin Tipi</label>
                                <input
                                    value={bet.prediction}
                                    onChange={e => updateBet(bet.id, 'prediction', e.target.value)}
                                    placeholder="İlk Yarı/Maç Sonucu:"
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Kısa Tahmin</label>
                                <input
                                    value={bet.predictionShort}
                                    onChange={e => updateBet(bet.id, 'predictionShort', e.target.value)}
                                    placeholder="2/1"
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        {/* Row 4: Odds + Play Count + Hot Toggle */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Oran</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={bet.odds}
                                    onChange={e => updateBet(bet.id, 'odds', parseFloat(e.target.value) || 0)}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#FFD700', fontSize: '14px', fontWeight: 900, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Oynama Sayısı</label>
                                <input
                                    type="number"
                                    value={bet.playCount}
                                    onChange={e => updateBet(bet.id, 'playCount', parseInt(e.target.value) || 0)}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Hot Bahis</label>
                                <button
                                    onClick={() => updateBet(bet.id, 'isHot', !bet.isHot)}
                                    style={{
                                        width: '100%', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                                        border: '1px solid', fontSize: '11px', fontWeight: 800,
                                        background: bet.isHot ? 'rgba(239,68,68,0.15)' : '#111',
                                        borderColor: bet.isHot ? 'rgba(239,68,68,0.3)' : '#222',
                                        color: bet.isHot ? '#ef4444' : '#555',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {bet.isHot ? '🔥 HOT' : 'NORMAL'}
                                </button>
                            </div>
                        </div>

                        {/* Row 5: Affiliate URL */}
                        <div style={{ marginTop: '8px' }}>
                            <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <LinkIcon style={{ width: 10, height: 10 }} /> Affiliate Link
                            </label>
                            <input
                                value={bet.affiliateUrl}
                                onChange={e => updateBet(bet.id, 'affiliateUrl', e.target.value)}
                                placeholder="https://724bahis.net/kayit?ref=..."
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #222', background: '#111', color: '#22c55e', fontSize: '11px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {localConfig.bets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: '12px', fontWeight: 700 }}>
                    <Flame style={{ width: 32, height: 32, color: '#333', margin: '0 auto 12px' }} />
                    <p>Henüz popüler bahis eklenmedi</p>
                    <p style={{ fontSize: '10px', color: '#444' }}>Yukarıdaki butona tıklayarak yeni bahis ekleyebilirsiniz.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPopularBetsTab;
