import React, { useState } from 'react';
import { PoolConfig, PoolMatch } from '../types';
import { Plus, Trash2, Play, CheckCircle2, Trophy, RefreshCw, Zap, Sparkles } from 'lucide-react';

const POOL_STORAGE_KEY = 'site_pool_config';

function loadPool(): PoolConfig | null {
    try { const d = localStorage.getItem(POOL_STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function savePool(p: PoolConfig) { localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(p)); }

const AdminPoolTab: React.FC = () => {
    const [pool, setPool] = useState<PoolConfig | null>(loadPool());
    const [matches, setMatches] = useState<PoolMatch[]>(pool?.matches || []);
    const [prizePool, setPrizePool] = useState(pool?.prizePool || 10000);
    const [prize15, setPrize15] = useState(pool?.prize15 || 5000);
    const [prize14, setPrize14] = useState(pool?.prize14 || 3000);
    const [prize13, setPrize13] = useState(pool?.prize13 || 2000);
    const [msg, setMsg] = useState('');

    // AI Paste Modal
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiInput, setAiInput] = useState('');

    const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 4000); };

    // ─── AI Parser ──────────────────────────────────────────────────────────────
    const handleAiParse = () => {
        if (!aiInput.trim()) return;

        const lines = aiInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const parsed: PoolMatch[] = [];
        let currentDate = new Date().toISOString().split('T')[0];
        let currentLeague = '';

        const monthMap: Record<string, string> = {
            'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04', 'mayıs': '05',
            'haziran': '06', 'temmuz': '07', 'ağustos': '08', 'eylül': '09',
            'ekim': '10', 'kasım': '11', 'aralık': '12',
        };

        for (let i = 0; i < lines.length; i++) {
            if (parsed.length >= 15) break;
            const text = lines[i];

            // 1. Date Detection (🗓 3 Mart 2026, 03.03.2026, etc.)
            const monthRegex = /(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)/i;
            if (text.includes('🗓') || monthRegex.test(text)) {
                const dMatch = text.match(/\d{1,2}/);
                const yMatch = text.match(/\d{4}/);
                if (dMatch && yMatch) {
                    const lowerTxt = text.toLowerCase();
                    const month = Object.entries(monthMap).find(([k]) => lowerTxt.includes(k))?.[1] || '01';
                    currentDate = `${yMatch[0]}-${month}-${dMatch[0].padStart(2, '0')}`;
                }
                continue;
            }

            // Numeric date (03.03.2026)
            const numDateMatch = text.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
            if (numDateMatch && !text.includes('vs') && !text.includes(' - ')) {
                currentDate = `${numDateMatch[3]}-${numDateMatch[2].padStart(2, '0')}-${numDateMatch[1].padStart(2, '0')}`;
                continue;
            }

            // 2. League Header
            if (!text.includes('vs') && !text.includes(' - ') && !text.match(/\d{2}:\d{2}/) && (text.endsWith(':') || text.includes('League') || text.includes('Liga') || text.includes('Lig') || text.includes('Serie') || text.includes('Ligue') || text.includes('Bundesliga') || text.includes('Premier'))) {
                const clean = text.replace(':', '').replace(/[()].*?[)]/g, '').replace('🔹', '').replace('⚽', '').trim();
                if (clean.length > 2) currentLeague = clean;
                continue;
            }

            let homeTeam = '';
            let awayTeam = '';
            let matchDate = currentDate;
            let matchTime = '';

            // 3. Compact Format: "28 Şubat 13:30 Kasımpaşa - Çaykur Rizespor"
            const compactMatch = text.match(/((?:\d{1,2}\s+)?(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık))\s+(\d{1,2}:\d{2})\s+([A-ZÇĞİÖŞÜa-zçğıöşü\s.&']+)\s*(?:-|–)\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&']+)/i);

            if (compactMatch) {
                matchTime = compactMatch[2].trim();
                homeTeam = compactMatch[3].trim();
                awayTeam = compactMatch[4].trim();
            } else {
                // 4. Standard Format: "Takım A vs Takım B" or "Takım A - Takım B"
                const teamMatch = text.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s.&'0-9]{2,})\s*(?:vs\.?|[-–])\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&'0-9]{2,})/);
                if (!teamMatch) continue;

                homeTeam = teamMatch[1].replace('🔹', '').trim();
                awayTeam = teamMatch[2].replace('🔹', '').trim();
                // Remove trailing time/score
                awayTeam = awayTeam.replace(/\s+\d{1,2}:\d{2}.*$/, '').trim();

                // Extract time from the line
                const timeMatch = text.match(/(\d{1,2}:\d{2})/);
                if (timeMatch) matchTime = timeMatch[1];
            }

            if (!homeTeam || !awayTeam || homeTeam.length < 2 || awayTeam.length < 2) continue;

            parsed.push({
                id: `m-${Date.now()}-${i}`,
                homeTeam: homeTeam.toUpperCase(),
                awayTeam: awayTeam.toUpperCase(),
                league: currentLeague || 'Genel',
                matchDate: matchTime ? `${matchDate} ${matchTime}` : matchDate,
            });
        }

        if (parsed.length === 0) {
            showMsg('❌ Hiçbir maç bulunamadı. Lütfen formatı kontrol edin.');
            return;
        }

        // Take first 15
        const final = parsed.slice(0, 15);
        setMatches(final);
        setShowAiModal(false);
        setAiInput('');
        showMsg(`✅ ${final.length} maç başarıyla oluşturuldu!${final.length < 15 ? ` (${15 - final.length} maç daha eklemeniz gerekiyor)` : ' Havuzu oluşturabilirsiniz!'}`);
    };

    // ─── Manual Match Handlers ──────────────────────────────────────────────────
    const addMatch = () => {
        if (matches.length >= 15) return;
        setMatches([...matches, { id: `m-${Date.now()}`, homeTeam: '', awayTeam: '', league: '', matchDate: new Date().toISOString().split('T')[0] }]);
    };

    const updateMatch = (idx: number, field: keyof PoolMatch, value: string) => {
        const updated = [...matches];
        updated[idx] = { ...updated[idx], [field]: value };
        setMatches(updated);
    };

    const removeMatch = (idx: number) => setMatches(matches.filter((_, i) => i !== idx));

    const handleCreate = () => {
        if (matches.length !== 15) { showMsg('Tam 15 maç girilmelidir!'); return; }
        if (matches.some(m => !m.homeTeam || !m.awayTeam)) { showMsg('Tüm takım adları doldurulmalıdır!'); return; }
        const newPool: PoolConfig = {
            id: `pool-${Date.now()}`,
            matches,
            entries: [],
            status: 'open',
            prizePool, prize15, prize14, prize13,
            freeEntryUsed: {},
            createdAt: Date.now(),
        };
        savePool(newPool);
        setPool(newPool);
        showMsg('🎉 Havuz başarıyla oluşturuldu ve açıldı!');
    };

    const handleStatusChange = (status: 'open' | 'live' | 'completed') => {
        if (!pool) return;
        const updated = { ...pool, status };
        if (status === 'completed') {
            updated.completedAt = Date.now();
            updated.entries = updated.entries.map(e => {
                let correct = 0;
                updated.matches.forEach((m, i) => { if (m.result && e.predictions[i] === m.result) correct++; });
                return { ...e, correctCount: correct };
            });
        }
        savePool(updated);
        setPool(updated);
        setMatches(updated.matches);
        showMsg(`Havuz durumu: ${status === 'open' ? 'Açık' : status === 'live' ? 'Canlı' : 'Tamamlandı'}`);
    };

    const handleResultChange = (idx: number, result: '1' | 'X' | '2' | '') => {
        if (!pool) return;
        const updatedMatches = [...pool.matches];
        updatedMatches[idx] = { ...updatedMatches[idx], result: result as any || undefined };
        const updated = { ...pool, matches: updatedMatches };
        savePool(updated);
        setPool(updated);
        setMatches(updatedMatches);
    };

    const handleReset = () => {
        if (!confirm('Havuzu sıfırlamak istediğinize emin misiniz?')) return;
        localStorage.removeItem(POOL_STORAGE_KEY);
        setPool(null);
        setMatches([]);
        showMsg('Havuz sıfırlandı.');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-3"><Trophy className="w-6 h-6 text-[#f0b90b]" /> 724BAHİS YÖNETİMİ</h2>
                {pool && (
                    <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-xl text-xs font-bold border border-red-500/30 hover:bg-red-500/30 transition-all">
                        <RefreshCw className="w-4 h-4" /> SIFIRLA
                    </button>
                )}
            </div>

            {msg && <div className="bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm p-4 rounded-xl animate-fade-in-up">{msg}</div>}

            {/* AI PASTE MODAL */}
            {showAiModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-[#f0b90b]/20 p-8 rounded-[40px] max-w-2xl w-full shadow-[0_0_50px_rgba(240,185,11,0.1)] relative">
                        <button onClick={() => setShowAiModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800">✕</button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f0b90b] to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(240,185,11,0.3)]">
                                <Sparkles className="w-8 h-8 text-black" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase">AI MAÇ YERLEŞTİRİCİ</h3>
                                <p className="text-zinc-400 text-sm mt-1">15 maçı kopyalayıp yapıştırın, otomatik olarak ayrıştırılacaktır.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">DESTEKLENEN FORMATLAR</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-zinc-800 rounded-lg text-[10px] text-zinc-400 font-bold">Galatasaray - Fenerbahçe</span>
                                    <span className="px-2 py-1 bg-zinc-800 rounded-lg text-[10px] text-zinc-400 font-bold">Real Madrid vs Barcelona</span>
                                    <span className="px-2 py-1 bg-zinc-800 rounded-lg text-[10px] text-zinc-400 font-bold">3 Mart 20:00 Takım A - Takım B</span>
                                    <span className="px-2 py-1 bg-zinc-800 rounded-lg text-[10px] text-zinc-400 font-bold">🗓 Tarih + Lig: başlığı</span>
                                </div>
                            </div>

                            <textarea
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                rows={12}
                                placeholder={`Örnek:\n\n🗓 3 Mart 2026\n\nSüper Lig:\nGalatasaray - Fenerbahçe\nBeşiktaş - Trabzonspor\n\nPremier League:\nManchester City - Liverpool\nArsenal - Chelsea\n...`}
                                className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-white font-mono placeholder:text-zinc-700 focus:border-[#f0b90b]/40 focus:outline-none transition-colors resize-none"
                            />

                            <button
                                onClick={handleAiParse}
                                disabled={!aiInput.trim()}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${aiInput.trim() ? 'bg-[#f0b90b] text-black hover:shadow-[0_0_30px_rgba(240,185,11,0.4)]' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'}`}
                            >
                                <Zap className="w-5 h-5" /> MAÇLARI OLUŞTUR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* POOL STATUS CONTROLS */}
            {pool && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">HAVUZ DURUMU</h3>
                    <div className="flex gap-3 mb-4">
                        {(['open', 'live', 'completed'] as const).map(s => (
                            <button key={s} onClick={() => handleStatusChange(s)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${pool.status === s ? 'bg-[#f0b90b] text-black' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}>
                                {s === 'open' ? '🟢 AÇIK' : s === 'live' ? '🔴 CANLI' : '✅ TAMAMLA'}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Katılımcı</p>
                            <p className="text-xl font-black text-white">{pool.entries.length}</p>
                        </div>
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Ödül Havuzu</p>
                            <p className="text-xl font-black text-[#f0b90b]">{pool.prizePool.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                            <p className="text-xs text-zinc-500 font-bold">Durum</p>
                            <p className="text-xl font-black text-white uppercase">{pool.status}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* MATCH RESULTS (when pool exists) */}
            {pool && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">MAÇ SONUÇLARI GİR</h3>
                    <div className="space-y-2">
                        {pool.matches.map((m, idx) => (
                            <div key={m.id} className="flex items-center gap-3 bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                                <span className="text-zinc-600 text-xs font-black w-6">{idx + 1}</span>
                                <span className="flex-1 text-white text-sm font-bold">{m.homeTeam} <span className="text-zinc-600">vs</span> {m.awayTeam}</span>
                                <span className="text-zinc-600 text-[10px] font-bold hidden md:block">{m.league}</span>
                                <div className="flex gap-1.5">
                                    {(['1', 'X', '2'] as const).map(r => (
                                        <button key={r} onClick={() => handleResultChange(idx, m.result === r ? '' : r)} className={`w-10 h-8 rounded-lg text-xs font-black border transition-all ${m.result === r ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}>
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CREATE NEW POOL */}
            {!pool && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">YENİ HAVUZ OLUŞTUR</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 font-bold block mb-1">Toplam Ödül (₺)</label>
                            <input type="number" value={prizePool} onChange={e => setPrizePool(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-[#f0b90b] font-black" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 font-bold block mb-1">15 Bilen (₺)</label>
                            <input type="number" value={prize15} onChange={e => setPrize15(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl p-3 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 font-bold block mb-1">14 Bilen (₺)</label>
                            <input type="number" value={prize14} onChange={e => setPrize14(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl p-3 font-bold" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 font-bold block mb-1">13 Bilen (₺)</label>
                            <input type="number" value={prize13} onChange={e => setPrize13(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-xl p-3 font-bold" />
                        </div>
                    </div>

                    {/* AI PASTE BUTTON + MANUAL ADD */}
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 font-bold">{matches.length}/15 Maç</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowAiModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f0b90b] to-yellow-600 text-black rounded-xl text-xs font-black hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all">
                                <Sparkles className="w-4 h-4" /> YAPAY ZEKA İLE YERLEŞTİR
                            </button>
                            <button onClick={addMatch} disabled={matches.length >= 15} className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all disabled:opacity-50 border border-zinc-700">
                                <Plus className="w-4 h-4" /> MANUEL EKLE
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {matches.map((m, idx) => (
                            <div key={m.id} className="flex items-center gap-2 bg-zinc-950 rounded-xl p-3 border border-zinc-800 group">
                                <span className="text-zinc-600 text-xs font-black w-6">{idx + 1}</span>
                                <input value={m.homeTeam} onChange={e => updateMatch(idx, 'homeTeam', e.target.value)} placeholder="Ev sahibi" className="flex-1 bg-black border border-zinc-800 rounded-lg p-2 text-sm" />
                                <span className="text-zinc-600 text-xs font-bold">vs</span>
                                <input value={m.awayTeam} onChange={e => updateMatch(idx, 'awayTeam', e.target.value)} placeholder="Deplasman" className="flex-1 bg-black border border-zinc-800 rounded-lg p-2 text-sm" />
                                <input value={m.league} onChange={e => updateMatch(idx, 'league', e.target.value)} placeholder="Lig" className="w-28 bg-black border border-zinc-800 rounded-lg p-2 text-sm" />
                                <input value={m.matchDate} onChange={e => updateMatch(idx, 'matchDate', e.target.value)} placeholder="Tarih" className="w-40 bg-black border border-zinc-800 rounded-lg p-2 text-sm" />
                                <button onClick={() => removeMatch(idx)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    {matches.length === 15 && (
                        <button onClick={handleCreate} className="w-full py-4 bg-[#f0b90b] text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] transition-all flex items-center justify-center gap-2">
                            <Play className="w-5 h-5" /> HAVUZU OLUŞTUR VE AÇ
                        </button>
                    )}

                    {matches.length > 0 && matches.length < 15 && (
                        <p className="text-center text-yellow-400/70 text-xs font-bold">⚠️ Havuz oluşturmak için {15 - matches.length} maç daha eklenmeli</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPoolTab;
