
import React, { useState } from 'react';
import { Plus, Trash2, Users, Trophy, Gift, Upload, Download, Instagram, Edit3, Clock } from 'lucide-react';
import { GiveawayConfig, Giveaway, GiveawayPrize, GiveawayParticipant, GiveawayRule } from '../types';

interface AdminGiveawayTabProps {
    config: GiveawayConfig;
    onConfigChange: (config: GiveawayConfig) => void;
}

const AdminGiveawayTab: React.FC<AdminGiveawayTabProps> = ({ config, onConfigChange }) => {
    const [subTab, setSubTab] = useState<'giveaways' | 'prizes' | 'participants' | 'import' | 'rules' | 'winners'>('giveaways');
    const [editingGiveawayId, setEditingGiveawayId] = useState<string | null>(null);
    const [bulkInput, setBulkInput] = useState('');
    const [importMsg, setImportMsg] = useState('');
    const [csvInput, setCsvInput] = useState('');

    // Currently selected giveaway for managing prizes/participants
    const [selectedGiveawayId, setSelectedGiveawayId] = useState<string>(config.giveaways[0]?.id || '');

    const saveConfig = (updates: Partial<GiveawayConfig>) => {
        onConfigChange({ ...config, ...updates });
    };

    // ─── GIVEAWAY CRUD ──────────────────────────────────
    const addGiveaway = () => {
        const newG: Giveaway = {
            id: `gw_${Date.now()}`,
            title: 'Yeni Çekiliş',
            description: 'Çekiliş açıklaması...',
            instagramPostUrl: '',
            startDate: new Date().toISOString().split('T')[0],
            drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'draft',
        };
        saveConfig({ giveaways: [...config.giveaways, newG] });
        setEditingGiveawayId(newG.id);
        setSelectedGiveawayId(newG.id);
    };

    const updateGiveaway = (id: string, updates: Partial<Giveaway>) => {
        saveConfig({ giveaways: config.giveaways.map(g => g.id === id ? { ...g, ...updates } : g) });
    };

    const deleteGiveaway = (id: string) => {
        if (!confirm('Çekiliş silinecek. Emin misiniz?')) return;
        saveConfig({
            giveaways: config.giveaways.filter(g => g.id !== id),
            prizes: config.prizes.filter(p => p.giveawayId !== id),
            participants: config.participants.filter(p => p.giveawayId !== id),
            winners: config.winners.filter(w => w.giveawayId !== id),
        });
        if (selectedGiveawayId === id) setSelectedGiveawayId(config.giveaways[0]?.id || '');
    };

    // ─── PRIZE CRUD ──────────────────────────────────
    const addPrize = () => {
        if (!selectedGiveawayId) return;
        const newP: GiveawayPrize = {
            id: `prize_${Date.now()}`,
            giveawayId: selectedGiveawayId,
            prizeName: 'Yeni Ödül',
            quantity: 1,
            icon: '🎁',
        };
        saveConfig({ prizes: [...config.prizes, newP] });
    };

    const updatePrize = (id: string, updates: Partial<GiveawayPrize>) => {
        saveConfig({ prizes: config.prizes.map(p => p.id === id ? { ...p, ...updates } : p) });
    };

    const deletePrize = (id: string) => {
        saveConfig({ prizes: config.prizes.filter(p => p.id !== id) });
    };

    // ─── PARTICIPANT CRUD ──────────────────────────────────
    const addParticipant = (name: string, instagram: string) => {
        if (!selectedGiveawayId || !name.trim()) return;
        const newP: GiveawayParticipant = {
            id: `part_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            giveawayId: selectedGiveawayId,
            name: name.trim(),
            instagram: instagram.trim().replace('@', ''),
            referralCode: Math.random().toString(36).substring(2, 8),
            referralCount: 0,
            entries: 1,
            joinedAt: Date.now(),
        };
        saveConfig({ participants: [...config.participants, newP] });
    };

    const deleteParticipant = (id: string) => {
        saveConfig({ participants: config.participants.filter(p => p.id !== id) });
    };

    // ─── BULK IMPORT ──────────────────────────────────
    const handleBulkImport = () => {
        if (!bulkInput.trim() || !selectedGiveawayId) return;
        const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newParticipants: GiveawayParticipant[] = lines.map((line, i) => {
            const cleaned = line.replace('@', '').trim();
            return {
                id: `part_${Date.now()}_${i}`,
                giveawayId: selectedGiveawayId,
                name: cleaned,
                instagram: cleaned,
                referralCode: Math.random().toString(36).substring(2, 8),
                referralCount: 0,
                entries: 1,
                joinedAt: Date.now(),
            };
        });

        // Deduplicate
        const existing = new Set(config.participants.filter(p => p.giveawayId === selectedGiveawayId).map(p => p.instagram.toLowerCase()));
        const unique = newParticipants.filter(p => !existing.has(p.instagram.toLowerCase()));

        saveConfig({ participants: [...config.participants, ...unique] });
        setImportMsg(`${unique.length} yeni katılımcı eklendi (${newParticipants.length - unique.length} mükerrer atlandı).`);
        setBulkInput('');
        setTimeout(() => setImportMsg(''), 4000);
    };

    const handleCsvImport = () => {
        if (!csvInput.trim() || !selectedGiveawayId) return;
        const lines = csvInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newParticipants: GiveawayParticipant[] = lines.map((line, i) => {
            const parts = line.split(',').map(s => s.trim());
            return {
                id: `part_${Date.now()}_csv_${i}`,
                giveawayId: selectedGiveawayId,
                name: parts[0] || `User_${i}`,
                instagram: (parts[1] || parts[0] || '').replace('@', ''),
                referralCode: Math.random().toString(36).substring(2, 8),
                referralCount: 0,
                entries: 1,
                joinedAt: Date.now(),
            };
        });

        const existing = new Set(config.participants.filter(p => p.giveawayId === selectedGiveawayId).map(p => p.instagram.toLowerCase()));
        const unique = newParticipants.filter(p => !existing.has(p.instagram.toLowerCase()));

        saveConfig({ participants: [...config.participants, ...unique] });
        setImportMsg(`CSV: ${unique.length} yeni katılımcı eklendi.`);
        setCsvInput('');
        setTimeout(() => setImportMsg(''), 4000);
    };

    // ─── RULE MANAGEMENT ──────────────────────────────────
    const updateRule = (id: string, updates: Partial<GiveawayRule>) => {
        saveConfig({ rules: config.rules.map(r => r.id === id ? { ...r, ...updates } : r) });
    };

    const addRule = () => {
        const newR: GiveawayRule = {
            id: `rule_${Date.now()}`,
            action: 'custom',
            label: 'Yeni Kural',
            entryValue: 1,
            icon: '✅',
        };
        saveConfig({ rules: [...config.rules, newR] });
    };

    const deleteRule = (id: string) => {
        saveConfig({ rules: config.rules.filter(r => r.id !== id) });
    };

    // ─── HELPERS ──────────────────────────────────
    const selectedPrizes = config.prizes.filter(p => p.giveawayId === selectedGiveawayId);
    const selectedParticipants = config.participants.filter(p => p.giveawayId === selectedGiveawayId);
    const selectedWinners = config.winners.filter(w => w.giveawayId === selectedGiveawayId);

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px',
        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', color: '#fff', fontSize: '13px',
        outline: 'none',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '10px', fontWeight: 800, color: '#888',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: '4px', display: 'block',
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px', padding: '20px',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3">
                    <Gift className="w-6 h-6 text-[#f0b90b]" /> ÇEKİLİŞ YÖNETİMİ
                </h2>
            </div>

            {/* Giveaway Selector */}
            <div className="flex items-center gap-3 flex-wrap">
                <select
                    value={selectedGiveawayId}
                    onChange={e => setSelectedGiveawayId(e.target.value)}
                    style={{
                        padding: '10px 16px', background: '#111', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700,
                        outline: 'none', minWidth: '200px',
                    }}
                >
                    {config.giveaways.map(g => (
                        <option key={g.id} value={g.id}>{g.title} ({g.status})</option>
                    ))}
                </select>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Users className="w-4 h-4" /> {selectedParticipants.length} katılımcı
                    <Gift className="w-4 h-4 ml-2" /> {selectedPrizes.length} ödül
                    <Trophy className="w-4 h-4 ml-2" /> {selectedWinners.length} kazanan
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 flex-wrap">
                {([
                    ['giveaways', '📋 Çekilişler'],
                    ['prizes', '🎁 Ödüller'],
                    ['participants', '👥 Katılımcılar'],
                    ['import', '📥 Toplu İçe Aktar'],
                    ['rules', '📏 Kurallar'],
                    ['winners', '🏆 Kazananlar'],
                ] as [typeof subTab, string][]).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setSubTab(key)}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${subTab === key ? 'bg-[#f0b90b] text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {importMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                    ✅ {importMsg}
                </div>
            )}

            {/* ═══ GIVEAWAYS TAB ═══ */}
            {subTab === 'giveaways' && (
                <div className="space-y-4">
                    <button onClick={addGiveaway} className="flex items-center gap-2 px-4 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-lg hover:bg-[#f0b90b]/90 transition-all">
                        <Plus className="w-4 h-4" /> YENİ ÇEKİLİŞ OLUŞTUR
                    </button>

                    {config.giveaways.map(g => (
                        <div key={g.id} style={cardStyle}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${g.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            g.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                        }`}>
                                        {g.status === 'active' ? '🟢 AKTİF' : g.status === 'completed' ? '✅ TAMAMLANDI' : '📝 TASLAK'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingGiveawayId(editingGiveawayId === g.id ? null : g.id)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteGiveaway(g.id)} className="p-2 rounded-lg bg-zinc-800 text-red-400 hover:bg-red-500/20 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {editingGiveawayId === g.id ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label style={labelStyle}>Başlık</label>
                                        <input value={g.title} onChange={e => updateGiveaway(g.id, { title: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Instagram Gönderi URL</label>
                                        <input value={g.instagramPostUrl} onChange={e => updateGiveaway(g.id, { instagramPostUrl: e.target.value })} style={inputStyle} placeholder="https://instagram.com/p/..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label style={labelStyle}>Açıklama</label>
                                        <textarea value={g.description} onChange={e => updateGiveaway(g.id, { description: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Başlangıç Tarihi</label>
                                        <input type="date" value={g.startDate} onChange={e => updateGiveaway(g.id, { startDate: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Çekiliş Tarihi</label>
                                        <input type="date" value={g.drawDate} onChange={e => updateGiveaway(g.id, { drawDate: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Durum</label>
                                        <select value={g.status} onChange={e => updateGiveaway(g.id, { status: e.target.value as any })} style={inputStyle}>
                                            <option value="draft">Taslak</option>
                                            <option value="active">Aktif</option>
                                            <option value="completed">Tamamlandı</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-black text-white">{g.title}</h3>
                                    <p className="text-zinc-500 text-sm mt-1">{g.description}</p>
                                    <div className="flex gap-4 mt-3 text-xs text-zinc-600">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {g.startDate} → {g.drawDate}</span>
                                        {g.instagramPostUrl && <span className="flex items-center gap-1"><Instagram className="w-3 h-3" /> Post bağlı</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ═══ PRIZES TAB ═══ */}
            {subTab === 'prizes' && (
                <div className="space-y-4">
                    <button onClick={addPrize} className="flex items-center gap-2 px-4 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-lg hover:bg-[#f0b90b]/90 transition-all">
                        <Plus className="w-4 h-4" /> ÖDÜL EKLE
                    </button>

                    {selectedPrizes.map(p => (
                        <div key={p.id} style={cardStyle} className="flex items-center gap-4">
                            <input
                                value={p.icon}
                                onChange={e => updatePrize(p.id, { icon: e.target.value })}
                                style={{ ...inputStyle, width: '50px', textAlign: 'center', fontSize: '24px' }}
                                maxLength={2}
                            />
                            <div className="flex-1">
                                <input
                                    value={p.prizeName}
                                    onChange={e => updatePrize(p.id, { prizeName: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Ödül adı"
                                />
                            </div>
                            <div style={{ width: '80px' }}>
                                <label style={labelStyle}>Adet</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={p.quantity}
                                    onChange={e => updatePrize(p.id, { quantity: parseInt(e.target.value) || 1 })}
                                    style={inputStyle}
                                />
                            </div>
                            <button onClick={() => deletePrize(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {selectedPrizes.length === 0 && (
                        <div className="text-center py-12 text-zinc-600 text-sm">Bu çekiliş için henüz ödül eklenmedi.</div>
                    )}
                </div>
            )}

            {/* ═══ PARTICIPANTS TAB ═══ */}
            {subTab === 'participants' && (
                <div className="space-y-4">
                    {/* Add single participant */}
                    <div style={cardStyle}>
                        <h3 className="text-sm font-black text-white mb-3">Katılımcı Ekle</h3>
                        <div className="flex gap-3">
                            <input id="newPartName" style={inputStyle} placeholder="Ad Soyad" />
                            <input id="newPartIG" style={inputStyle} placeholder="@instagram" />
                            <button
                                onClick={() => {
                                    const name = (document.getElementById('newPartName') as HTMLInputElement).value;
                                    const ig = (document.getElementById('newPartIG') as HTMLInputElement).value;
                                    addParticipant(name, ig);
                                    (document.getElementById('newPartName') as HTMLInputElement).value = '';
                                    (document.getElementById('newPartIG') as HTMLInputElement).value = '';
                                }}
                                className="px-4 py-2 bg-[#f0b90b] text-black font-black text-xs rounded-lg hover:bg-[#f0b90b]/90 transition-all whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4 inline" /> EKLE
                            </button>
                        </div>
                    </div>

                    {/* Participant list */}
                    <div className="text-xs text-zinc-500 font-bold">
                        Toplam: {selectedParticipants.length} katılımcı
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="space-y-2">
                        {selectedParticipants.map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                                <div className="w-8 h-8 rounded-lg bg-[#f0b90b]/10 border border-[#f0b90b]/20 flex items-center justify-center text-xs font-black text-[#f0b90b]">
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-white truncate">{p.name}</div>
                                    <div className="text-xs text-zinc-500">@{p.instagram}</div>
                                </div>
                                <div className="text-xs text-zinc-400 font-bold">{p.entries} giriş</div>
                                <div className="text-xs text-zinc-600">{p.referralCount} davet</div>
                                <button onClick={() => deleteParticipant(p.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {selectedParticipants.length === 0 && (
                        <div className="text-center py-12 text-zinc-600 text-sm">Henüz katılımcı yok.</div>
                    )}
                </div>
            )}

            {/* ═══ IMPORT TAB ═══ */}
            {subTab === 'import' && (
                <div className="space-y-6">
                    {/* Instagram Username Import */}
                    <div style={cardStyle}>
                        <div className="flex items-center gap-3 mb-4">
                            <Instagram className="w-5 h-5 text-[#f0b90b]" />
                            <h3 className="text-sm font-black text-white">Instagram Kullanıcı Adı Yapıştır</h3>
                        </div>
                        <p className="text-xs text-zinc-500 mb-3">
                            Her satıra bir kullanıcı adı yazın (@ işareti opsiyonel). Sistem otomatik olarak mükerrer girişleri filtreler.
                        </p>
                        <textarea
                            value={bulkInput}
                            onChange={e => setBulkInput(e.target.value)}
                            style={{ ...inputStyle, minHeight: '150px', resize: 'vertical', fontFamily: 'monospace' }}
                            placeholder={'@ahmet_yilmaz\n@mehmet_kaya\n@ayse_demir\n@fatma_celik'}
                        />
                        <button
                            onClick={handleBulkImport}
                            className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-lg hover:bg-[#f0b90b]/90 transition-all"
                        >
                            <Upload className="w-4 h-4" /> İÇE AKTAR ({bulkInput.split('\n').filter(l => l.trim()).length} satır)
                        </button>
                    </div>

                    {/* CSV Import */}
                    <div style={cardStyle}>
                        <div className="flex items-center gap-3 mb-4">
                            <Download className="w-5 h-5 text-[#f0b90b]" />
                            <h3 className="text-sm font-black text-white">CSV İçe Aktar</h3>
                        </div>
                        <p className="text-xs text-zinc-500 mb-3">
                            Format: İsim, Instagram Kullanıcı Adı (her satıra bir kayıt)
                        </p>
                        <textarea
                            value={csvInput}
                            onChange={e => setCsvInput(e.target.value)}
                            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'monospace' }}
                            placeholder={'Ahmet Yılmaz, @ahmet_yilmaz\nMehmet Kaya, @mehmet_kaya'}
                        />
                        <button
                            onClick={handleCsvImport}
                            className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-lg hover:bg-[#f0b90b]/90 transition-all"
                        >
                            <Upload className="w-4 h-4" /> CSV İÇE AKTAR
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ RULES TAB ═══ */}
            {subTab === 'rules' && (
                <div className="space-y-4">
                    <button onClick={addRule} className="flex items-center gap-2 px-4 py-2.5 bg-[#f0b90b] text-black font-black text-xs rounded-lg hover:bg-[#f0b90b]/90 transition-all">
                        <Plus className="w-4 h-4" /> KURAL EKLE
                    </button>

                    {config.rules.map(r => (
                        <div key={r.id} style={cardStyle} className="flex items-center gap-4">
                            <input
                                value={r.icon}
                                onChange={e => updateRule(r.id, { icon: e.target.value })}
                                style={{ ...inputStyle, width: '50px', textAlign: 'center', fontSize: '20px' }}
                                maxLength={2}
                            />
                            <div className="flex-1">
                                <input
                                    value={r.label}
                                    onChange={e => updateRule(r.id, { label: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Kural açıklaması"
                                />
                            </div>
                            <div style={{ width: '90px' }}>
                                <label style={labelStyle}>Giriş Değeri</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={r.entryValue}
                                    onChange={e => updateRule(r.id, { entryValue: parseInt(e.target.value) || 1 })}
                                    style={inputStyle}
                                />
                            </div>
                            <button onClick={() => deleteRule(r.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ═══ WINNERS TAB ═══ */}
            {subTab === 'winners' && (
                <div className="space-y-4">
                    {selectedWinners.length === 0 ? (
                        <div className="text-center py-16">
                            <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 text-sm font-bold">Henüz kazanan belirlenmedi.</p>
                            <p className="text-zinc-600 text-xs mt-1">Çekilişi başlatmak için ana sayfadaki çarkı kullanın.</p>
                        </div>
                    ) : (
                        selectedWinners.map((w, i) => (
                            <div key={w.id} style={cardStyle} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#f0b90b]/10 border border-[#f0b90b]/20 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-[#f0b90b]" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-black text-white">{w.participantName}</div>
                                    <div className="text-xs text-zinc-500">Ödül: {w.prizeName}</div>
                                </div>
                                <div className="text-xs text-zinc-600">
                                    {new Date(w.timestamp).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminGiveawayTab;
