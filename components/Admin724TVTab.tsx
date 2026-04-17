import React, { useState } from 'react';
import { Plus, Trash2, Save, Tv, Radio, ToggleLeft, ToggleRight, MessageSquare, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { TVConfig, TVChannel } from '../types';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

interface Admin724TVTabProps {
    config: TVConfig;
    onSave: (config: TVConfig) => void;
}

const Admin724TVTab: React.FC<Admin724TVTabProps> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = useState<TVConfig>({ ...config });
    const [saved, setSaved] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const handleToggleActive = () => {
        setLocalConfig(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleToggleChat = () => {
        setLocalConfig(prev => ({ ...prev, chatEnabled: !prev.chatEnabled }));
    };

    const addChannel = () => {
        const newChannel: TVChannel = {
            id: Date.now().toString(),
            name: 'Yeni Kanal',
            slug: '',
            platform: 'kick',
            streamUrl: '',
            thumbnailUrl: '',
            category: 'CANLI YAYIN',
            isLive: false,
            isActive: true,
            order: localConfig.channels.length + 1,
        };
        setLocalConfig(prev => ({ ...prev, channels: [...prev.channels, newChannel] }));
    };

    const removeChannel = (id: string) => {
        setLocalConfig(prev => ({ ...prev, channels: prev.channels.filter(c => c.id !== id) }));
    };

    const updateChannel = (id: string, field: keyof TVChannel, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            channels: prev.channels.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
    };

    const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(id);
        try {
            const resized = await resizeImage(file, 200, 200);
            const { url } = await uploadImageToSupabase(resized, 'slider-images', `tv-channels/${id}-${Date.now()}.jpg`);
            if (url) updateChannel(id, 'thumbnailUrl', url);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploadingId(null);
        }
    };

    const moveChannel = (index: number, direction: 'up' | 'down') => {
        const arr = [...localConfig.channels];
        const newIdx = direction === 'up' ? index - 1 : index + 1;
        if (newIdx < 0 || newIdx >= arr.length) return;
        [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
        const reordered = arr.map((c, i) => ({ ...c, order: i + 1 }));
        setLocalConfig(prev => ({ ...prev, channels: reordered }));
    };

    const handleSave = () => {
        onSave(localConfig);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tv style={{ width: 20, height: 20, color: '#000' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>724TV YÖNETİMİ</h2>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', margin: 0 }}>Canlı yayın kanallarını ve sohbet ayarlarını yönetin</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                        {localConfig.isActive ? '724TV AKTİF' : '724TV PASİF'}
                    </button>

                    <button
                        onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                            border: 'none', fontSize: '11px', fontWeight: 900,
                            background: saved ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: '#000', textTransform: 'uppercase', letterSpacing: '1px',
                        }}
                    >
                        <Save style={{ width: 14, height: 14 }} />
                        {saved ? 'KAYDEDİLDİ' : 'AYARLARI KAYDET'}
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Canlı Skor Yazısı (Ticker)</label>
                        <input
                            value={localConfig.tickerText}
                            onChange={e => setLocalConfig(prev => ({ ...prev, tickerText: e.target.value }))}
                            placeholder="FB: 1 - GS: 0 | REAL MADRID: 2 - MAN CITY: 2"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={handleToggleChat}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                border: '1px solid', fontSize: '11px', fontWeight: 800,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                background: localConfig.chatEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                borderColor: localConfig.chatEnabled ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                                color: localConfig.chatEnabled ? '#22c55e' : '#ef4444',
                            }}
                        >
                            <MessageSquare style={{ width: 14, height: 14 }} />
                            {localConfig.chatEnabled ? 'SOHBET AKTİF' : 'SOHBET PASİF'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{
                            width: '100%', padding: '10px 14px', borderRadius: '8px',
                            background: '#0a0a0a', border: '1px solid #222',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}>
                            <Radio style={{ width: 14, height: 14, color: '#FFD700' }} />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ccc' }}>
                                {localConfig.channels.filter(c => c.isActive).length} Aktif Kanal
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Channel List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {localConfig.channels.map((ch, index) => (
                    <div key={ch.id} style={{
                        background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px',
                        padding: '20px', display: 'flex', gap: '20px',
                    }}>
                        {/* Thumbnail */}
                        <div style={{ width: '80px', flexShrink: 0 }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                overflow: 'hidden', background: '#111', border: '2px solid #222',
                                marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {ch.thumbnailUrl ? (
                                    <img src={ch.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploadingId === ch.id ? 0.3 : 1 }} />
                                ) : (
                                    <Tv style={{ width: 24, height: 24, color: '#333' }} />
                                )}
                            </div>
                            <label style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                padding: '4px', borderRadius: '6px', background: '#1a1a1a', border: '1px solid #222',
                                color: '#888', fontSize: '8px', fontWeight: 800, cursor: 'pointer',
                            }}>
                                <ImageIcon style={{ width: 10, height: 10 }} /> LOGO
                                <input type="file" hidden accept="image/*" onChange={e => handleImageUpload(ch.id, e)} />
                            </label>
                        </div>

                        {/* Fields */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Kanal Adı</label>
                                    <input
                                        value={ch.name}
                                        onChange={e => updateChannel(ch.id, 'name', e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Platform</label>
                                    <select
                                        value={ch.platform}
                                        onChange={e => updateChannel(ch.id, 'platform', e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                    >
                                        <option value="kick">Kick.com</option>
                                        <option value="custom">Özel URL</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>
                                        {ch.platform === 'kick' ? 'Kick Kullanıcı Adı' : 'Yayın URL'}
                                    </label>
                                    <input
                                        value={ch.streamUrl}
                                        onChange={e => updateChannel(ch.id, 'streamUrl', e.target.value)}
                                        placeholder={ch.platform === 'kick' ? 'kick_username' : 'https://...'}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Kategori</label>
                                    <input
                                        value={ch.category}
                                        onChange={e => updateChannel(ch.id, 'category', e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button
                                        onClick={() => updateChannel(ch.id, 'isLive', !ch.isLive)}
                                        style={{
                                            width: '100%', height: '38px', borderRadius: '8px', cursor: 'pointer',
                                            border: '1px solid', fontSize: '10px', fontWeight: 800,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                            background: ch.isLive ? 'rgba(239,68,68,0.1)' : 'rgba(100,100,100,0.1)',
                                            borderColor: ch.isLive ? 'rgba(239,68,68,0.3)' : '#333',
                                            color: ch.isLive ? '#ef4444' : '#666',
                                        }}
                                    >
                                        <Radio style={{ width: 10, height: 10 }} />
                                        {ch.isLive ? 'CANLI' : 'OFFLINE'}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button
                                        onClick={() => updateChannel(ch.id, 'isActive', !ch.isActive)}
                                        style={{
                                            width: '100%', height: '38px', borderRadius: '8px', cursor: 'pointer',
                                            border: '1px solid', fontSize: '10px', fontWeight: 800,
                                            background: ch.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                            borderColor: ch.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                                            color: ch.isActive ? '#22c55e' : '#ef4444',
                                        }}
                                    >
                                        {ch.isActive ? 'AKTİF' : 'PASİF'}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                                    <button onClick={() => moveChannel(index, 'up')} disabled={index === 0}
                                        style={{ flex: 1, height: '38px', background: '#1a1a1a', border: '1px solid #222', color: '#fff', borderRadius: '6px', opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChevronUp style={{ width: 14, height: 14 }} />
                                    </button>
                                    <button onClick={() => moveChannel(index, 'down')} disabled={index === localConfig.channels.length - 1}
                                        style={{ flex: 1, height: '38px', background: '#1a1a1a', border: '1px solid #222', color: '#fff', borderRadius: '6px', opacity: index === localConfig.channels.length - 1 ? 0.3 : 1, cursor: index === localConfig.channels.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChevronDown style={{ width: 14, height: 14 }} />
                                    </button>
                                    <button onClick={() => removeChannel(ch.id)}
                                        style={{ height: '38px', width: '38px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 style={{ width: 14, height: 14 }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {localConfig.channels.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
                    <Tv style={{ width: 40, height: 40, margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', fontWeight: 700 }}>Henüz kanal eklenmedi.</p>
                </div>
            )}

            <button
                onClick={addChannel}
                style={{
                    width: '100%', padding: '16px', borderRadius: '16px', cursor: 'pointer',
                    border: '2px dashed #333', background: 'transparent', color: '#666',
                    fontSize: '12px', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    marginTop: '20px', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666'; }}
            >
                <Plus style={{ width: 18, height: 18 }} /> Yeni Kanal Ekle
            </button>
        </div>
    );
};

export default Admin724TVTab;
