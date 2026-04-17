import React, { useState } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, ToggleLeft, ToggleRight, Layout, ChevronUp, ChevronDown } from 'lucide-react';
import { NewsSliderConfig, NewsSlide } from '../types';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

interface AdminNewsSliderTabProps {
    config: NewsSliderConfig;
    onSave: (config: NewsSliderConfig) => void;
}

const AdminNewsSliderTab: React.FC<AdminNewsSliderTabProps> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = useState<NewsSliderConfig>({ ...config });
    const [saved, setSaved] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const handleToggleActive = () => {
        setLocalConfig(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const addSlide = () => {
        const newSlide: NewsSlide = {
            id: Date.now().toString(),
            imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop',
            link: '',
            title: 'Yeni Haber Başlığı',
            category: 'GÜNCEL',
            isActive: true,
            order: localConfig.slides.length + 1
        };
        setLocalConfig(prev => ({ ...prev, slides: [...prev.slides, newSlide] }));
    };

    const removeSlide = (id: string) => {
        setLocalConfig(prev => ({ ...prev, slides: prev.slides.filter(s => s.id !== id) }));
    };

    const updateSlide = (id: string, field: keyof NewsSlide, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            slides: prev.slides.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(id);
        try {
            const resized = await resizeImage(file, 1200, 600);
            const { url } = await uploadImageToSupabase(resized, 'slider-images', `news-slider/${id}-${Date.now()}.jpg`);
            if (url) {
                updateSlide(id, 'imageUrl', url);
            }
        } catch (err) {
            console.error('Image upload failed:', err);
        } finally {
            setUploadingId(null);
        }
    };

    const handleSave = () => {
        onSave(localConfig);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...localConfig.slides];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSlides.length) return;

        [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
        
        // Update order property based on new position
        const reordered = newSlides.map((s, i) => ({ ...s, order: i + 1 }));
        setLocalConfig(prev => ({ ...prev, slides: reordered }));
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Layout style={{ width: 20, height: 20, color: '#000' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>GÜNDEM SLIDER YÖNETİMİ</h2>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', margin: 0 }}>Anasayfadaki haber kaydırıcısını düzenleyin</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        {localConfig.isActive ? 'SLIDER AKTİF' : 'SLIDER PASİF'}
                    </button>

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
                        {saved ? 'KAYDEDİLDİ' : 'AYARLARI KAYDET'}
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Otomatik Kaydırma Süresi (ms)</label>
                        <input 
                            type="number"
                            value={localConfig.autoPlayInterval}
                            onChange={(e) => setLocalConfig(prev => ({ ...prev, autoPlayInterval: parseInt(e.target.value) || 5000 }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                        />
                    </div>
                </div>
            </div>

            {/* Slide List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {localConfig.slides.map((slide, index) => (
                    <div key={slide.id} style={{ 
                        background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                            {/* Slide Preview / Image Upload */}
                            <div style={{ width: '200px', flexShrink: 0 }}>
                                <div style={{ 
                                    width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', 
                                    background: '#111', border: '1px solid #222', position: 'relative', marginBottom: '10px' 
                                }}>
                                    <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploadingId === slide.id ? 0.3 : 1 }} />
                                    {uploadingId === slide.id && (
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFD700]" />
                                        </div>
                                    )}
                                </div>
                                <label style={{ 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    width: '100%', padding: '8px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #222',
                                    color: '#fff', fontSize: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s'
                                }}>
                                    <ImageIcon style={{ width: 12, height: 12 }} /> 
                                    RESİM DEĞİŞTİR
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(slide.id, e)} />
                                </label>
                            </div>

                            {/* Slide Fields */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Haber Başlığı</label>
                                        <input 
                                            value={slide.title}
                                            onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Link / URL</label>
                                        <input 
                                            value={slide.link}
                                            onChange={(e) => updateSlide(slide.id, 'link', e.target.value)}
                                            placeholder="/news/..."
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>Kategori</label>
                                        <input 
                                            value={slide.category}
                                            onChange={(e) => updateSlide(slide.id, 'category', e.target.value)}
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                                        <button
                                            onClick={() => updateSlide(slide.id, 'isActive', !slide.isActive)}
                                            style={{
                                                flex: 1, height: '38px', borderRadius: '8px', border: '1px solid',
                                                fontSize: '10px', fontWeight: 800, cursor: 'pointer',
                                                background: slide.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                borderColor: slide.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                                                color: slide.isActive ? '#22c55e' : '#ef4444'
                                            }}
                                        >
                                            {slide.isActive ? 'AKTİF' : 'PASİF'}
                                        </button>
                                        <button
                                            onClick={() => removeSlide(slide.id)}
                                            style={{
                                                height: '38px', width: '40px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)',
                                                background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <Trash2 style={{ width: 14, height: 14 }} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Reorder Buttons */}
                            <div style={{ width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                                <button
                                    onClick={() => moveSlide(index, 'up')}
                                    disabled={index === 0}
                                    style={{ height: '30px', background: '#1a1a1a', border: '1px solid #222', color: '#fff', borderRadius: '6px', opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'default' : 'pointer' }}
                                >
                                    <ChevronUp style={{ width: 14, height: 14, margin: '0 auto' }} />
                                </button>
                                <button
                                    onClick={() => moveSlide(index, 'down')}
                                    disabled={index === localConfig.slides.length - 1}
                                    style={{ height: '30px', background: '#1a1a1a', border: '1px solid #222', color: '#fff', borderRadius: '6px', opacity: index === localConfig.slides.length - 1 ? 0.3 : 1, cursor: index === localConfig.slides.length - 1 ? 'default' : 'pointer' }}
                                >
                                    <ChevronDown style={{ width: 14, height: 14, margin: '0 auto' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {localConfig.slides.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
                    <Layout style={{ width: 40, height: 40, margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', fontWeight: 700 }}>Henüz slayt eklenmedi.</p>
                </div>
            )}

            <button
                onClick={addSlide}
                style={{
                    width: '100%', padding: '16px', borderRadius: '16px', cursor: 'pointer',
                    border: '2px dashed #333', background: 'transparent', color: '#666',
                    fontSize: '12px', fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    marginTop: '20px', transition: 'all 0.3s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666'; }}
            >
                <Plus style={{ width: 18, height: 18 }} /> Yeni Slayt Ekle
            </button>
        </div>
    );
};

export default AdminNewsSliderTab;
