import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Monitor, Save, Activity } from 'lucide-react';

export default function AdminTVTab() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [tvServer, setTvServer] = useState('xslot');
    const [xslotUrl, setXslotUrl] = useState('https://xslot116.live/');
    const [marsbahisUrl, setMarsbahisUrl] = useState('https://www.marsbahistv400.com/');

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_configs')
                .select('key, value')
                .in('key', ['site_tv_server', 'site_tv_xslot_url', 'site_tv_marsbahis_url']);

            if (error) throw error;

            if (data) {
                const serverConfig = data.find(d => d.key === 'site_tv_server');
                const xslotConfig = data.find(d => d.key === 'site_tv_xslot_url');
                const marsConfig = data.find(d => d.key === 'site_tv_marsbahis_url');

                if (serverConfig?.value) setTvServer(serverConfig.value);
                if (xslotConfig?.value) setXslotUrl(xslotConfig.value);
                if (marsConfig?.value) setMarsbahisUrl(marsConfig.value);
            }
        } catch (err) {
            console.error('Error fetching TV configs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = [
                { key: 'site_tv_server', value: tvServer },
                { key: 'site_tv_xslot_url', value: xslotUrl },
                { key: 'site_tv_marsbahis_url', value: marsbahisUrl }
            ];

            for (const update of updates) {
                await supabase
                    .from('site_configs')
                    .upsert({ key: update.key, value: update.value }, { onConflict: 'key' });
            }
            
            // Show some success feedback?
            alert('TV Ayarları başarıyla kaydedildi!');
        } catch (err) {
            console.error('Error saving TV configs:', err);
            alert('Kaydetme sırasında bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Activity className="w-8 h-8 animate-spin mx-auto mb-3" />
                <p>TV Ayarları yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                    <Monitor className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-white">TV & Canlı Maç Ayarları</h3>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                    {saving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div className="bg-[#111318] p-5 rounded-xl border border-gray-800 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Aktif TV Sunucusu</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setTvServer('xslot')}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                tvServer === 'xslot' 
                                ? 'bg-blue-600/20 border-blue-500 text-white' 
                                : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'
                            }`}
                        >
                            <div className="font-bold text-lg mb-1">Xslot TV</div>
                            <div className="text-xs opacity-70">Güncel ve hızlı yayın akışı</div>
                        </button>

                        <button
                            onClick={() => setTvServer('marsbahis')}
                            className={`p-4 rounded-xl border text-left transition-all ${
                                tvServer === 'marsbahis' 
                                ? 'bg-orange-600/20 border-orange-500 text-white' 
                                : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'
                            }`}
                        >
                            <div className="font-bold text-lg mb-1">Marsbahis TV</div>
                            <div className="text-xs opacity-70">Alternatif yayın kaynağı</div>
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                    <h4 className="font-medium text-white mb-4">Sunucu Adresleri</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Xslot TV Adresi</label>
                            <input 
                                type="text"
                                value={xslotUrl}
                                onChange={(e) => setXslotUrl(e.target.value)}
                                placeholder="Örn: https://xslot116.live/"
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Xslot'un güncel domain adresi (sonunda / bırakmanız tavsiye edilir)</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Marsbahis TV Adresi</label>
                            <input 
                                type="text"
                                value={marsbahisUrl}
                                onChange={(e) => setMarsbahisUrl(e.target.value)}
                                placeholder="Örn: https://www.marsbahistv400.com/"
                                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                    <h5 className="text-blue-400 font-bold mb-1 text-sm">Önemli Bilgi</h5>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Buradan sunucu veya adres değiştirdiğinizde, kullanıcılar TV sayfasını yenilediklerinde yeni ayarları göreceklerdir. Eğer proxy arka ucunda (Node.js) bir sorun varsa terminalden sunucuyu yeniden başlatmanız gerekebilir.
                    </p>
                </div>
            </div>
        </div>
    );
}
