import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Tv, Video, Gift, ToggleRight, ToggleLeft, Edit3, Image as ImageIcon, Youtube, ChevronDown, ChevronUp } from 'lucide-react';
import { Streamer, VOD, Gift as GiftType } from '../types';
import { supabase } from '../utils/supabase';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

interface Admin724TVTabProps {
    config?: any;
    onSave?: (cfg: any) => void;
}

const Admin724TVTab: React.FC<Admin724TVTabProps> = ({ config, onSave }) => {
    const [activeTab, setActiveTab] = useState<'streamers' | 'youtube' | 'vods' | 'gifts'>('streamers');
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [vods, setVods] = useState<VOD[]>([]);
    const [gifts, setGifts] = useState<GiftType[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'BEIN SPORTS Grubu': false,
        'S SPORT Grubu': false,
        'TRT KANALLARI': false,
        'SMART SPOR Grubu': false,
        'TIVIBU SPOR Grubu': false,
        'TABII SPOR Grubu': false,
        'Diğer Kanallar': false
    });
    const [editingStreamers, setEditingStreamers] = useState<Record<string, boolean>>({});
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const handleThumbnailUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(id);
        try {
            const resizedBlob = await resizeImage(file, 640, 360);
            const { url, error } = await uploadImageToSupabase(
                resizedBlob,
                'slider-images',
                `vod-thumbnails/${id}-${Date.now()}.jpg`
            );
            if (url) {
                setVods(prev => prev.map(p => p.id === id ? { ...p, thumbnail_url: url } : p));
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setVods(prev => prev.map(p => p.id === id ? { ...p, thumbnail_url: reader.result as string } : p));
                };
            }
        } catch (err) {
            console.error('Image processing failed:', err);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setVods(prev => prev.map(p => p.id === id ? { ...p, thumbnail_url: reader.result as string } : p));
            };
        } finally {
            setUploadingId(null);
        }
    };
    const handleVideoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Visual warning if file is huge (e.g. > 50MB) before starting upload
        if (file.size > 50 * 1024 * 1024) {
            alert("Video Boyutu Çok Büyük:\nSeçtiğiniz video 50MB sınırından büyük. Supabase Storage limitini aşacağı için yüklenemeyebilir.\n\nLütfen videoyu sıkıştırıp (MP4 480p/720p) boyutunu küçültün veya YouTube'a yükleyerek linkini yapıştırın.");
            return;
        }

        setUploadingId(id);
        try {
            const ext = file.name.split('.').pop() || 'mp4';
            const { url, error } = await uploadImageToSupabase(
                file,
                'slider-images',
                `vod-videos/${id}-${Date.now()}.${ext}`
            );
            if (url) {
                setVods(prev => prev.map(p => p.id === id ? { ...p, video_url: url } : p));
            } else {
                if (error?.message?.includes('exceeded the maximum') || error?.message?.includes('size')) {
                    alert("Yükleme Hatası:\nVideo dosya boyutu çok büyük (Supabase Storage limitini aşıyor).\n\nÖneri:\n1. Videonuzu daha küçük boyutlu / sıkıştırılmış (örneğin MP4 480p/720p) olarak yüklemeyi deneyin.\n2. Veya videoyu YouTube'a yükleyip linkini sol taraftaki URL alanına yapıştırın.");
                } else {
                    alert("Yükleme hatası: " + (error?.message || "Bilinmeyen hata"));
                }
            }
        } catch (err) {
            console.error('Video upload failed:', err);
            alert("Video yükleme işlemi başarısız oldu.");
        } finally {
            setUploadingId(null);
        }
    };

    const toggleGroup = (group: string) => setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    const toggleEdit = (id: string) => setEditingStreamers(prev => ({ ...prev, [id]: !prev[id] }));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        let streamersList: Streamer[] = [];
        let vodsList: VOD[] = [];
        let giftsList: GiftType[] = [];

        try {
            const { data: s, error: sErr } = await supabase.from('streamers').select('*').order('order_index', { ascending: true });
            if (!sErr && s) {
                streamersList = s;
            }
        } catch (e) {
            console.error("Error loading streamers from table:", e);
        }

        try {
            const { data: configData } = await supabase
                .from('site_configs')
                .select('value')
                .eq('key', 'site_tv_config')
                .maybeSingle();
            
            if (configData?.value?.channels) {
                const fallbackStreamers = configData.value.channels.map((ch: any) => ({
                    id: ch.id || `ch_${ch.order || Date.now()}`,
                    name: ch.name || 'Yayın',
                    kick_username: ch.platformUsername || ch.slug || ch.streamUrl || '',
                    platform_type: ch.platformType || ch.platform || 'kick',
                    avatar_url: ch.thumbnailUrl || '',
                    tags: ch.tags || [ch.category || 'CANLI YAYIN'],
                    is_live: ch.isLive || ch.isActive || false,
                    is_vip: ch.isVip || false,
                    source_type: ch.sourceType || 'platform',
                    video_url: ch.videoUrl || '',
                    iframe_url: ch.iframeUrl || '',
                    viewer_count: ch.viewer_count || 0,
                    order_index: ch.order || 0,
                    fallback_type: ch.fallback_type || 'none',
                    fallback_video_url: ch.fallback_video_url || '',
                    fallback_iframe_url: ch.fallback_iframe_url || ''
                }));

                // Merge fallback streamers that are not in the database
                fallbackStreamers.forEach((fs: any) => {
                    if (!streamersList.find(s => s.id === fs.id || (s.kick_username === fs.kick_username && fs.kick_username))) {
                        streamersList.push(fs);
                    }
                });
                
                // Re-sort after merging
                streamersList.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            }
        } catch (fallbackErr) {
            console.error("Error loading fallback streamers configuration:", fallbackErr);
        }

        try {
            const { data: v } = await supabase.from('vods').select('*').order('created_at', { ascending: false });
            if (v && v.length > 0) {
                vodsList = v;
            }
        } catch (e) {}

        if (vodsList.length === 0) {
            try {
                const { data: configData } = await supabase
                    .from('site_configs')
                    .select('value')
                    .eq('key', 'site_tv_config')
                    .maybeSingle();
                if (configData?.value?.vods) {
                    vodsList = configData.value.vods;
                }
            } catch (e) {}
        }

        try {
            const { data: g } = await supabase.from('gifts').select('*').order('order_index', { ascending: true });
            if (g) giftsList = g;
        } catch (e) {}

        setStreamers(streamersList);
        setVods(vodsList);
        setGifts(giftsList);
        setLoading(false);
    };

    const handleSaveStreamer = async (s: Streamer) => {
        setSaving(true);
        try {
            let errorObj = null;
            let dbSaveSuccess = false;
            let savedStreamer = { ...s };
            
            // Clean new_ prefix for DB insert
            if (s.id.startsWith('new_')) {
                savedStreamer = { ...s, id: `ch_${Date.now()}` };
            }
            
            try {
                if (s.id.startsWith('new_')) {
                    const { id, ...rest } = s;
                    const { error, data } = await supabase.from('streamers').insert(rest).select().single();
                    errorObj = error;
                    if (!error && data) {
                        savedStreamer = data;
                        dbSaveSuccess = true;
                    }
                } else {
                    const { error } = await supabase.from('streamers').update(s).eq('id', s.id);
                    errorObj = error;
                    if (!error) {
                        dbSaveSuccess = true;
                    }
                }
            } catch (dbErr: any) {
                errorObj = dbErr;
            }

            // Always update site_configs as a reliable backup
            const updatedStreamers = streamers.map(st => {
                if (st.id === s.id) {
                    return savedStreamer;
                }
                return st;
            });
            // If new streamer wasn't in list yet, add it
            if (s.id.startsWith('new_') && !updatedStreamers.find(st => st.id === savedStreamer.id)) {
                updatedStreamers.push(savedStreamer);
            }

            const { data: currentCfgData } = await supabase
                .from('site_configs')
                .select('value')
                .eq('key', 'site_tv_config')
                .maybeSingle();

            const existingValue = currentCfgData?.value || {};
            const newConfig = {
                ...existingValue,
                isActive: true,
                channels: updatedStreamers.map(st => ({
                    id: st.id,
                    name: st.name,
                    slug: st.kick_username || 'channel',
                    platform: st.platform_type,
                    streamUrl: st.kick_username || '',
                    thumbnailUrl: st.avatar_url || '',
                    category: st.tags?.[0] || "CANLI YAYIN",
                    isLive: st.is_live,
                    isActive: st.is_live,
                    order: st.order_index,
                    sourceType: st.source_type,
                    platformType: st.platform_type,
                    platformUsername: st.kick_username,
                    videoUrl: st.video_url,
                    iframeUrl: st.iframe_url,
                    isVip: st.is_vip,
                    tags: st.tags,
                    viewer_count: st.viewer_count,
                    fallback_type: st.fallback_type,
                    fallback_video_url: st.fallback_video_url,
                    fallback_iframe_url: st.fallback_iframe_url
                }))
            };
            
            // Always save to site_configs as backup
            await supabase
                .from('site_configs')
                .upsert({ key: 'site_tv_config', value: newConfig }, { onConflict: 'key' });
            if (onSave) onSave(newConfig);

            if (errorObj) {
                console.error("Database operation failed, saved to site_configs as fallback:", errorObj);
                alert('Yayıncı yedek sistem üzerinden kaydedildi. (DB hatası: ' + (errorObj.message || 'bilinmiyor') + ')');
            } else {
                alert('Yayıncı başarıyla güncellendi.');
            }
            await fetchData();
        } catch (err: any) {
            alert('Yayıncı kaydedilemedi: ' + err.message);
        } finally {
            setSaving(false);
        }
    };


    const handleDeleteStreamer = async (id: string) => {
        if (!confirm('Emin misiniz?')) return;
        setSaving(true);
        try {
            let dbDeleteSuccess = false;
            try {
                if (!id.startsWith('new_')) {
                    const { error } = await supabase.from('streamers').delete().eq('id', id);
                    if (!error) dbDeleteSuccess = true;
                }
            } catch (e) {}

            // If we are using fallback or db delete didn't run, update via site_configs fallback
            const updatedStreamers = streamers.filter(st => st.id !== id);
            const { data: currentCfgData } = await supabase
                .from('site_configs')
                .select('value')
                .eq('key', 'site_tv_config')
                .maybeSingle();

            const existingValue = currentCfgData?.value || {};
            const newConfig = {
                ...existingValue,
                isActive: true,
                channels: updatedStreamers.map(st => ({
                    id: st.id,
                    name: st.name,
                    slug: st.kick_username || 'channel',
                    platform: st.platform_type,
                    streamUrl: st.kick_username || '',
                    thumbnailUrl: st.avatar_url || '',
                    category: st.tags?.[0] || "CANLI YAYIN",
                    isLive: st.is_live,
                    isActive: st.is_live,
                    order: st.order_index,
                    sourceType: st.source_type,
                    platformType: st.platform_type,
                    platformUsername: st.kick_username,
                    videoUrl: st.video_url,
                    iframeUrl: st.iframe_url,
                    isVip: st.is_vip,
                    tags: st.tags,
                    viewer_count: st.viewer_count,
                    fallback_type: st.fallback_type,
                    fallback_video_url: st.fallback_video_url,
                    fallback_iframe_url: st.fallback_iframe_url
                }))
            };
            
            await supabase.from('site_configs').upsert({ key: 'site_tv_config', value: newConfig }, { onConflict: 'key' });
            if (onSave) onSave(newConfig);
            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const handleSaveVOD = async (v: VOD) => {
        setSaving(true);
        try {
            let savedVOD = { ...v };
            if (v.id.startsWith('new_')) {
                savedVOD = { ...v, id: `vod_${Date.now()}` };
            }

            // 1. Try DB Table write
            try {
                if (v.id.startsWith('new_')) {
                    const { id, ...rest } = v;
                    await supabase.from('vods').insert(rest);
                } else {
                    const { id, created_at, ...rest } = v;
                    await supabase.from('vods').update(rest).eq('id', v.id);
                }
            } catch (dbErr) {
                console.error("VOD table save failed, using config document fallback:", dbErr);
            }

            // 2. Always update site_configs tv_config document to persist VODs
            const updatedVods = vods.map(p => p.id === v.id ? savedVOD : p);
            if (v.id.startsWith('new_') && !updatedVods.find(p => p.id === savedVOD.id)) {
                updatedVods.push(savedVOD);
            }

            const { data: configData } = await supabase
                .from('site_configs')
                .select('value')
                .eq('key', 'site_tv_config')
                .maybeSingle();

            const existingValue = configData?.value || {};
            const newConfig = {
                ...existingValue,
                isActive: true,
                vods: updatedVods
            };

            await supabase
                .from('site_configs')
                .upsert({ key: 'site_tv_config', value: newConfig }, { onConflict: 'key' });

            if (onSave) onSave(newConfig);
            alert('Özet başarıyla kaydedildi.');
            await fetchData();
        } catch (err: any) {
            alert('Özet kaydedilemedi: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteVOD = async (id: string) => {
        if (!confirm('Emin misiniz?')) return;
        setSaving(true);
        try {
            // 1. Try DB Table delete
            try {
                if (!id.startsWith('new_')) {
                    await supabase.from('vods').delete().eq('id', id);
                }
            } catch (dbErr) {
                console.error("VOD table delete failed:", dbErr);
            }

            // 2. Update via site_configs document
            const updatedVods = vods.filter(p => p.id !== id);

            const { data: configData } = await supabase
                .from('site_configs')
                .select('value')
                .eq('key', 'site_tv_config')
                .maybeSingle();

            const existingValue = configData?.value || {};
            const newConfig = {
                ...existingValue,
                isActive: true,
                vods: updatedVods
            };

            await supabase
                .from('site_configs')
                .upsert({ key: 'site_tv_config', value: newConfig }, { onConflict: 'key' });

            if (onSave) onSave(newConfig);
            alert('Özet silindi.');
            await fetchData();
        } catch (err: any) {
            alert('Özet silinemedi: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveGift = async (g: GiftType) => {
        setSaving(true);
        try {
            if (g.id.startsWith('new_')) {
                const { id, ...rest } = g;
                await supabase.from('gifts').insert(rest);
            } else {
                await supabase.from('gifts').update(g).eq('id', g.id);
            }
            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGift = async (id: string) => {
        if (!confirm('Emin misiniz?')) return;
        setSaving(true);
        try {
            if (!id.startsWith('new_')) {
                await supabase.from('gifts').delete().eq('id', id);
            }
            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const addStreamer = () => {
        const newStreamer: Streamer = {
            id: `new_${Date.now()}`,
            name: 'Yeni Yayıncı',
            tags: ['CANLI YAYIN'],
            is_live: false,
            is_vip: false,
            source_type: 'platform',
            platform_type: 'kick',
            fallback_type: 'none',
            viewer_count: 0,
            order_index: streamers.length
        };
        setStreamers([...streamers, newStreamer]);
    };

    const addYoutubeStream = () => {
        const newStreamer: Streamer = {
            id: `new_${Date.now()}`,
            name: 'Yeni YouTube Yayını',
            tags: ['CANLI YAYIN'],
            is_live: false,
            is_vip: false,
            source_type: 'platform',
            platform_type: 'youtube',
            fallback_type: 'none',
            viewer_count: 0,
            order_index: streamers.length
        };
        setStreamers([...streamers, newStreamer]);
    };

    const addVOD = () => {
        const newVOD: VOD = {
            id: `new_${Date.now()}`,
            title: 'Yeni VOD',
            video_url: '',
            views: 0
        };
        setVods([newVOD, ...vods]);
    };

    const addGift = () => {
        const newGift: GiftType = {
            id: `new_${Date.now()}`,
            name: 'Yeni Hediye',
            emoji: '🎁',
            price: 10,
            order_index: gifts.length
        };
        setGifts([...gifts, newGift]);
    };

    if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Yükleniyor...</div>;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tv style={{ width: 20, height: 20, color: '#000' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>GAMBLING TV YÖNETİMİ</h2>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', margin: 0 }}>Yayıncılar, VOD'lar ve Sohbet Hediyeleri</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                {[
                    { id: 'streamers', label: 'YAYINCILAR', icon: <Tv size={16} /> },
                    { id: 'youtube', label: 'YOUTUBE', icon: <Youtube size={16} /> },
                    { id: 'vods', label: 'VOD (GEÇMİŞ YAYINLAR)', icon: <Video size={16} /> },
                    { id: 'gifts', label: 'HEDİYELER', icon: <Gift size={16} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                            background: activeTab === tab.id ? 'rgba(240,185,11,0.1)' : 'transparent',
                            border: `1px solid ${activeTab === tab.id ? '#f0b90b' : 'transparent'}`,
                            color: activeTab === tab.id ? '#f0b90b' : '#9ca3af',
                            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'streamers' && (() => {
                const groupedStreamers = {
                    'BEIN SPORTS Grubu': streamers.filter(s => s.platform_type !== 'youtube' && s.name.toUpperCase().includes('BEIN')),
                    'S SPORT Grubu': streamers.filter(s => s.platform_type !== 'youtube' && s.name.toUpperCase().includes('S SPORT')),
                    'TRT KANALLARI': streamers.filter(s => s.platform_type !== 'youtube' && s.name.toUpperCase().includes('TRT')),
                    'SMART SPOR Grubu': streamers.filter(s => s.platform_type !== 'youtube' && s.name.toUpperCase().includes('SMART')),
                    'TIVIBU SPOR Grubu': streamers.filter(s => s.platform_type !== 'youtube' && s.name.toUpperCase().includes('TIVIBU')),
                    'TABII SPOR Grubu': streamers.filter(s => s.platform_type !== 'youtube' && (s.name.toUpperCase().includes('TABII') || s.name.toUpperCase().includes('TABİİ'))),
                    'Diğer Kanallar': streamers.filter(s => s.platform_type !== 'youtube' && !['BEIN', 'TRT', 'S SPORT', 'SMART', 'TIVIBU', 'TABII', 'TABİİ'].some(k => s.name.toUpperCase().includes(k)))
                };

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button onClick={addStreamer} style={{ padding: '16px', borderRadius: '8px', border: '2px dashed #333', background: 'transparent', color: '#666', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                            <Plus size={18} /> YENİ YAYINCI EKLE
                        </button>

                        {Object.entries(groupedStreamers).map(([groupName, groupChannels]) => {
                            if (groupChannels.length === 0) return null;
                            const isExpanded = expandedGroups[groupName];
                            
                            return (
                                <div key={groupName} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                                    {/* Accordion Header */}
                                    <div 
                                        onClick={() => toggleGroup(groupName)}
                                        style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isExpanded ? '1px solid #1a1a1a' : 'none' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {isExpanded ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
                                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#e5e7eb' }}>{groupName} <span style={{ color: '#6b7280', fontWeight: 700, fontSize: '12px', marginLeft: '6px' }}>({groupChannels.length} Kanal)</span></h3>
                                        </div>
                                    </div>

                                    {/* Accordion Content */}
                                    {isExpanded && (
                                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {groupChannels.map(s => {
                                                const isEditing = editingStreamers[s.id];
                                                
                                                return (
                                                    <div key={s.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                        {/* Inline Row */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            {/* Logo Preview */}
                                                            <div style={{ width: '40px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                                                                {s.avatar_url ? (
                                                                    <img src={s.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                                                                ) : (
                                                                    <Tv size={14} color="#555" />
                                                                )}
                                                            </div>

                                                            {/* Core Inputs (Name, Order, Logo URL) */}
                                                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 3fr', gap: '10px' }}>
                                                                <input
                                                                    value={s.name}
                                                                    onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, name: e.target.value } : p))}
                                                                    placeholder="Kanal Adı"
                                                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '12px', fontWeight: 700 }}
                                                                />
                                                                <input
                                                                    type="number"
                                                                    value={s.order_index}
                                                                    onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, order_index: parseInt(e.target.value) } : p))}
                                                                    placeholder="Sıra"
                                                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '12px' }}
                                                                />
                                                                <input
                                                                    value={s.avatar_url || ''}
                                                                    onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, avatar_url: e.target.value } : p))}
                                                                    placeholder="Logo URL"
                                                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '12px' }}
                                                                />
                                                            </div>

                                                            {/* Live Toggle */}
                                                            <div 
                                                                onClick={() => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, is_live: !p.is_live } : p))}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '6px', flexShrink: 0 }}
                                                            >
                                                                {s.is_live ? (
                                                                    <ToggleRight size={28} color="#22c55e" />
                                                                ) : (
                                                                    <ToggleLeft size={28} color="#555" />
                                                                )}
                                                                <span style={{ fontSize: '10px', fontWeight: 800, color: s.is_live ? '#22c55e' : '#666', width: '45px' }}>{s.is_live ? 'CANLI' : 'KAPALI'}</span>
                                                            </div>

                                                            {/* Actions */}
                                                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                                <button onClick={() => toggleEdit(s.id)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: isEditing ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)', color: isEditing ? '#3b82f6' : '#9ca3af', border: 'none', cursor: 'pointer' }}>
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button onClick={() => handleSaveStreamer(s)} disabled={saving} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'none', cursor: 'pointer' }}>
                                                                    <Save size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeleteStreamer(s.id)} disabled={saving} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Expandable Advanced Options */}
                                                        {isEditing && (
                                                            <div style={{ borderTop: '1px dashed #333', paddingTop: '12px', marginTop: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                                                <div>
                                                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Kaynak Tipi</label>
                                                                    <select
                                                                        value={s.source_type}
                                                                        onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, source_type: e.target.value as any } : p))}
                                                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '11px' }}
                                                                    >
                                                                        <option value="platform">Platform (Kick/Twitch)</option>
                                                                        <option value="video">MP4 Video</option>
                                                                        <option value="iframe">Iframe</option>
                                                                    </select>
                                                                </div>
                                                                
                                                                {s.source_type === 'platform' && (
                                                                    <>
                                                                        <div>
                                                                            <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Platform</label>
                                                                            <select
                                                                                value={s.platform_type}
                                                                                onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, platform_type: e.target.value as any } : p))}
                                                                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '11px' }}
                                                                            >
                                                                                <option value="kick">Kick</option>
                                                                                <option value="twitch">Twitch</option>
                                                                                <option value="youtube">YouTube</option>
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Kullanıcı Adı</label>
                                                                            <input
                                                                                value={s.kick_username || ''}
                                                                                onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, kick_username: e.target.value } : p))}
                                                                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '11px' }}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {s.source_type === 'video' && (
                                                                    <div style={{ gridColumn: 'span 2' }}>
                                                                        <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Video URL</label>
                                                                        <input
                                                                            value={s.video_url || ''}
                                                                            onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, video_url: e.target.value } : p))}
                                                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '11px' }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {s.source_type === 'iframe' && (
                                                                    <div style={{ gridColumn: 'span 2' }}>
                                                                        <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Iframe URL</label>
                                                                        <input
                                                                            value={s.iframe_url || ''}
                                                                            onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, iframe_url: e.target.value } : p))}
                                                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '11px' }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })()}

            {/* YOUTUBE TAB */}
            {activeTab === 'youtube' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {streamers.filter(s => s.platform_type === 'youtube').map(s => (
                        <div key={s.id} style={{ background: '#0d0d0d', border: '1px solid #ff000033', borderRadius: '8px', padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>İsim (Başlık)</label>
                                    <input
                                        value={s.name}
                                        onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, name: e.target.value } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>YouTube ID veya Link</label>
                                    <input
                                        value={s.kick_username || ''}
                                        onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, kick_username: e.target.value } : p))}
                                        placeholder="UC... veya Video ID"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Sıra (Order)</label>
                                    <input
                                        type="number"
                                        value={s.order_index}
                                        onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, order_index: parseInt(e.target.value) } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 3' }}>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Thumbnail URL (Avatar)</label>
                                    <input
                                        value={s.avatar_url || ''}
                                        onChange={e => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, avatar_url: e.target.value } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button
                                    onClick={() => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, is_live: !p.is_live } : p))}
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: s.is_live ? 'rgba(34,197,94,0.1)' : '#1a1a1a', color: s.is_live ? '#22c55e' : '#666', border: '1px solid', borderColor: s.is_live ? '#22c55e' : '#333', cursor: 'pointer' }}
                                >
                                    {s.is_live ? 'CANLI YAYINDA' : 'ÇEVRİMDIŞI'}
                                </button>
                                <button
                                    onClick={() => setStreamers(prev => prev.map(p => p.id === s.id ? { ...p, is_vip: !p.is_vip } : p))}
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: s.is_vip ? 'rgba(240,185,11,0.1)' : '#1a1a1a', color: s.is_vip ? '#f0b90b' : '#666', border: '1px solid', borderColor: s.is_vip ? '#f0b90b' : '#333', cursor: 'pointer' }}
                                >
                                    {s.is_vip ? 'VIP (ÖNE ÇIKAN)' : 'NORMAL YAYIN'}
                                </button>
                                <button onClick={() => handleSaveStreamer(s)} disabled={saving} style={{ padding: '10px 20px', borderRadius: '8px', background: '#22c55e', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                                    {saving ? '...' : 'KAYDET'}
                                </button>
                                <button onClick={() => handleDeleteStreamer(s.id)} disabled={saving} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addYoutubeStream} style={{ padding: '16px', borderRadius: '8px', border: '2px dashed #ff000066', background: 'transparent', color: '#ff0000', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={18} /> YENİ YOUTUBE YAYINI EKLE
                    </button>
                </div>
            )}

            {/* VODS TAB */}
            {activeTab === 'vods' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {vods.map(v => (
                        <div key={v.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Başlık</label>
                                    <input
                                        value={v.title}
                                        onChange={e => setVods(prev => prev.map(p => p.id === v.id ? { ...p, title: e.target.value } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Thumbnail URL</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            value={v.thumbnail_url || ''}
                                            onChange={e => setVods(prev => prev.map(p => p.id === v.id ? { ...p, thumbnail_url: e.target.value } : p))}
                                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                        />
                                        <label style={{ padding: '10px 14px', borderRadius: '8px', background: '#f0b90b', color: '#000', fontSize: '11px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                            {uploadingId === v.id ? '...' : 'GÖRSEL SEÇ'}
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={e => handleThumbnailUpload(v.id, e)} 
                                                style={{ display: 'none' }} 
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Video URL Bağlantısı (YouTube / MP4 URL)</label>
                                    <input
                                        value={v.video_url}
                                        onChange={e => setVods(prev => prev.map(p => p.id === v.id ? { ...p, video_url: e.target.value } : p))}
                                        placeholder="Örn: https://www.youtube.com/watch?v=..."
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Masaüstünden Video Yükle</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: v.video_url?.includes('vod-videos/') ? '#22c55e' : '#6b7280', fontSize: '11px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {v.video_url?.includes('vod-videos/') ? `✓ Yüklenen Dosya: ${v.video_url.split('/').pop()}` : 'Henüz video yüklenmedi (dosya seçin)'}
                                        </div>
                                        <label style={{ padding: '10px 14px', borderRadius: '8px', background: '#f0b90b', color: '#000', fontSize: '11px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                            {uploadingId === v.id ? 'Yükleniyor...' : 'DOSYA SEÇ / YÜKLE'}
                                            <input 
                                                type="file" 
                                                accept="video/mp4,video/quicktime,video/x-matroska,video/*" 
                                                onChange={e => handleVideoUpload(v.id, e)} 
                                                style={{ display: 'none' }} 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleSaveVOD(v)} disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#22c55e', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                                    {saving ? '...' : 'KAYDET'}
                                </button>
                                <button onClick={() => handleDeleteVOD(v.id)} disabled={saving} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addVOD} style={{ padding: '16px', borderRadius: '8px', border: '2px dashed #333', background: 'transparent', color: '#666', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={18} /> YENİ VOD EKLE
                    </button>
                </div>
            )}

            {/* GIFTS TAB */}
            {activeTab === 'gifts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {gifts.map(g => (
                        <div key={g.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ fontSize: '40px' }}>{g.emoji}</div>
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Emoji</label>
                                    <input
                                        value={g.emoji}
                                        onChange={e => setGifts(prev => prev.map(p => p.id === g.id ? { ...p, emoji: e.target.value } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>İsim</label>
                                    <input
                                        value={g.name}
                                        onChange={e => setGifts(prev => prev.map(p => p.id === g.id ? { ...p, name: e.target.value } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        value={g.price}
                                        onChange={e => setGifts(prev => prev.map(p => p.id === g.id ? { ...p, price: parseFloat(e.target.value) } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 800, color: '#555', textTransform: 'uppercase' }}>Sıra</label>
                                    <input
                                        type="number"
                                        value={g.order_index}
                                        onChange={e => setGifts(prev => prev.map(p => p.id === g.id ? { ...p, order_index: parseInt(e.target.value) } : p))}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #222', background: '#0a0a0a', color: '#fff', fontSize: '12px' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleSaveGift(g)} disabled={saving} style={{ padding: '10px 20px', borderRadius: '8px', background: '#22c55e', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                                    {saving ? '...' : 'KAYDET'}
                                </button>
                                <button onClick={() => handleDeleteGift(g.id)} disabled={saving} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addGift} style={{ padding: '16px', borderRadius: '8px', border: '2px dashed #333', background: 'transparent', color: '#666', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={18} /> YENİ HEDİYE EKLE
                    </button>
                </div>
            )}
        </div>
    );
};

export default Admin724TVTab;
