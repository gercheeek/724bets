import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Shield, Activity, Plus, Trash2, Save, AlertTriangle, Clock, Search, Ban, Volume2, VolumeX, Radio, Tv, X, Image as ImageIcon, RefreshCw, Eye, EyeOff, Users } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN CHAT TAB — Sohbet Yönetim Merkezi
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatChannel {
    id: number;
    name: string;
    slug: string;
    category: string;
    icon_url: string | null;
    is_active: boolean;
    order_index: number;
    created_at: string;
}

interface ChatBan {
    id: number;
    channel_id: number | null;
    user_id: string;
    username: string;
    ban_type: string;
    mute_until: string | null;
    reason: string;
    admin_id: string;
    admin_username: string;
    is_active: boolean;
    created_at: string;
}

interface ChatLog {
    id: number;
    action: string;
    admin_id: string;
    admin_username: string;
    target_user_id: string | null;
    target_username: string | null;
    channel_id: number | null;
    channel_name: string | null;
    details: any;
    created_at: string;
}

interface ChatSettings {
    chat_enabled: boolean;
    rate_limit_seconds: number;
    max_message_length: number;
}

const DEFAULT_SETTINGS: ChatSettings = { chat_enabled: true, rate_limit_seconds: 15, max_message_length: 500 };

const CATEGORIES = ['Genel', 'Spor', 'VIP', 'Özel'];

const ACTION_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    delete_message: { label: 'Mesaj Silindi', color: '#ef4444', icon: '🗑️' },
    mute_user: { label: 'Susturuldu', color: '#f59e0b', icon: '🔇' },
    ban_user: { label: 'Banlandı', color: '#ef4444', icon: '⛔' },
    unmute_user: { label: 'Ceza Kaldırıldı', color: '#10b981', icon: '🔊' },
    kill_switch_on: { label: 'Sohbet Kapatıldı', color: '#ef4444', icon: '⚠️' },
    kill_switch_off: { label: 'Sohbet Açıldı', color: '#10b981', icon: '✅' },
    channel_create: { label: 'Kanal Oluşturuldu', color: '#00FFC2', icon: '➕' },
    channel_delete: { label: 'Kanal Silindi', color: '#ef4444', icon: '🗑️' },
    settings_update: { label: 'Ayar Güncellendi', color: '#00FFC2', icon: '⚙️' },
};

const AdminChatTab: React.FC = () => {
    const [subTab, setSubTab] = useState<'overview' | 'channels' | 'bans' | 'logs'>('overview');
    const [loading, setLoading] = useState(true);

    // Overview
    const [chatSettings, setChatSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
    const [totalMessages, setTotalMessages] = useState(0);
    const [activeBansCount, setActiveBansCount] = useState(0);
    const [recentActions, setRecentActions] = useState(0);
    const [settingsForm, setSettingsForm] = useState<ChatSettings>(DEFAULT_SETTINGS);

    // Channels
    const [channels, setChannels] = useState<ChatChannel[]>([]);
    const [showNewChannel, setShowNewChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelCategory, setNewChannelCategory] = useState('Genel');

    // Bans
    const [bans, setBans] = useState<ChatBan[]>([]);
    const [banUsername, setBanUsername] = useState('');
    const [banDuration, setBanDuration] = useState<number | null>(null); // days or null=permanent
    const [banReason, setBanReason] = useState('');

    // Logs
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [logFilter, setLogFilter] = useState('all');
    const [logSearch, setLogSearch] = useState('');

    // ── Data Fetching ─────────────────────────────────────────────────────────
    const fetchOverviewData = useCallback(async () => {
        try {
            const settings = await getGlobalConfig('chat_settings');
            if (settings) {
                setChatSettings(settings);
                setSettingsForm(settings);
            }
            const { count: msgCount } = await supabase.from('tv_chat').select('*', { count: 'exact', head: true });
            setTotalMessages(msgCount || 0);

            const { count: banCount } = await supabase.from('chat_bans').select('*', { count: 'exact', head: true }).eq('is_active', true);
            setActiveBansCount(banCount || 0);

            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: logCount } = await supabase.from('chat_moderation_logs').select('*', { count: 'exact', head: true }).gte('created_at', yesterday);
            setRecentActions(logCount || 0);
        } catch (e) {
            console.error('Overview fetch error:', e);
        }
    }, []);

    const fetchChannels = useCallback(async () => {
        try {
            const { data } = await supabase.from('chat_channels').select('*').order('order_index', { ascending: true });
            if (data) setChannels(data);
        } catch (e) {
            console.error('Channels fetch error:', e);
        }
    }, []);

    const fetchBans = useCallback(async () => {
        try {
            const { data } = await supabase.from('chat_bans').select('*').eq('is_active', true).order('created_at', { ascending: false });
            if (data) setBans(data);
        } catch (e) {
            console.error('Bans fetch error:', e);
        }
    }, []);

    const fetchLogs = useCallback(async () => {
        try {
            const { data } = await supabase.from('chat_moderation_logs').select('*').order('created_at', { ascending: false }).limit(200);
            if (data) setLogs(data);
        } catch (e) {
            console.error('Logs fetch error:', e);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchOverviewData();
            await fetchChannels();
            await fetchBans();
            await fetchLogs();
            setLoading(false);
        };
        load();

        // Realtime subscriptions
        const banSub = supabase.channel('admin-chat-bans')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_bans' }, () => { fetchBans(); fetchOverviewData(); })
            .subscribe();
        const logSub = supabase.channel('admin-chat-logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_moderation_logs' }, (payload) => {
                setLogs(prev => [payload.new as ChatLog, ...prev].slice(0, 200));
                fetchOverviewData();
            })
            .subscribe();
        const chSub = supabase.channel('admin-chat-channels')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_channels' }, () => fetchChannels())
            .subscribe();

        return () => {
            supabase.removeChannel(banSub);
            supabase.removeChannel(logSub);
            supabase.removeChannel(chSub);
        };
    }, [fetchOverviewData, fetchChannels, fetchBans, fetchLogs]);

    // ── Actions ───────────────────────────────────────────────────────────────
    const toggleKillSwitch = async () => {
        const newState = !chatSettings.chat_enabled;
        const updated = { ...chatSettings, chat_enabled: newState };
        await updateGlobalConfig('chat_settings', updated);
        setChatSettings(updated);
        setSettingsForm(updated);
        await supabase.from('chat_moderation_logs').insert({
            action: newState ? 'kill_switch_off' : 'kill_switch_on',
            admin_id: 'admin', admin_username: 'Yönetici'
        });
    };

    const saveSettings = async () => {
        await updateGlobalConfig('chat_settings', settingsForm);
        setChatSettings(settingsForm);
        await supabase.from('chat_moderation_logs').insert({
            action: 'settings_update',
            admin_id: 'admin', admin_username: 'Yönetici',
            details: { rate_limit_seconds: settingsForm.rate_limit_seconds, max_message_length: settingsForm.max_message_length }
        });
        alert('Ayarlar kaydedildi!');
    };

    const createChannel = async () => {
        if (!newChannelName.trim()) return;
        const maxOrder = channels.length > 0 ? Math.max(...channels.map(c => c.order_index)) + 1 : 1;
        const generatedSlug = newChannelName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { error } = await supabase.from('chat_channels').insert({
            name: newChannelName.trim(), slug: generatedSlug, category: newChannelCategory, order_index: maxOrder, is_active: true
        });
        if (!error) {
            await supabase.from('chat_moderation_logs').insert({
                action: 'channel_create', admin_id: 'admin', admin_username: 'Yönetici',
                channel_name: newChannelName.trim()
            });
            setNewChannelName(''); setShowNewChannel(false);
            fetchChannels();
        } else {
            alert('Kanal oluşturulurken hata: ' + error.message);
        }
    };

    const deleteChannel = async (ch: ChatChannel) => {
        if (!window.confirm(`"${ch.name}" kanalını silmek istediğinize emin misiniz?`)) return;
        await supabase.from('chat_channels').delete().eq('id', ch.id);
        await supabase.from('chat_moderation_logs').insert({
            action: 'channel_delete', admin_id: 'admin', admin_username: 'Yönetici',
            channel_id: ch.id, channel_name: ch.name
        });
        fetchChannels();
    };

    const toggleChannelActive = async (ch: ChatChannel) => {
        await supabase.from('chat_channels').update({ is_active: !ch.is_active }).eq('id', ch.id);
        fetchChannels();
    };

    const handleLogoUpload = async (ch: ChatChannel, file: File) => {
        try {
            const blob = await resizeImage(file, 128, 128);
            const { url, error } = await uploadImageToSupabase(blob, 'channel-logos', `logos/${ch.id}.jpg`);
            if (url && !error) {
                await supabase.from('chat_channels').update({ icon_url: url }).eq('id', ch.id);
                fetchChannels();
            } else {
                alert('Logo yükleme başarısız: ' + (error?.message || 'Bilinmeyen hata'));
            }
        } catch (e) {
            console.error('Logo upload error:', e);
            alert('Logo yüklenirken hata oluştu.');
        }
    };

    const applyBan = async () => {
        if (!banUsername.trim()) { alert('Kullanıcı adı gerekli!'); return; }
        if (banDuration === null && banDuration !== 0) {
            if (banDuration === undefined) { alert('Ceza süresi seçiniz!'); return; }
        }
        if (!banReason.trim()) { alert('Ceza nedeni girmek zorunludur!'); return; }

        let finalUserId = banUsername.trim();
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(finalUserId)) {
            const { data: memberData } = await supabase.from('members').select('id').eq('username', banUsername.trim()).single();
            if (memberData?.id) {
                finalUserId = memberData.id;
            } else {
                alert('Kullanıcı veritabanında bulunamadı (Geçersiz Kullanıcı Adı / UUID).');
                return;
            }
        }

        const muteUntil = banDuration === 0 ? null : (banDuration ? new Date(Date.now() + banDuration * 24 * 60 * 60 * 1000).toISOString() : null);
        const mutedUntilTs = banDuration === 0 ? -1 : (banDuration ? Date.now() + banDuration * 24 * 60 * 60 * 1000 : -1);

        await supabase.from('chat_bans').insert({
            user_id: finalUserId, username: banUsername.trim(),
            ban_type: 'mute', mute_until: muteUntil, reason: banReason.trim(),
            admin_id: 'admin', admin_username: 'Yönetici', is_active: true
        });

        await supabase.from('chat_moderation_logs').insert({
            action: 'mute_user', admin_id: 'admin', admin_username: 'Yönetici',
            target_user_id: finalUserId, target_username: banUsername.trim(),
            details: { duration_days: banDuration, reason: banReason.trim() }
        });

        // Backward compat
        const mutesData = await getGlobalConfig('tv_mutes');
        let currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
        currentMutes = currentMutes.filter((m: any) => m.userId !== finalUserId);
        currentMutes.push({ userId: finalUserId, username: banUsername.trim(), mutedUntil: mutedUntilTs });
        await updateGlobalConfig('tv_mutes', { mutedUsers: currentMutes });

        setBanUsername(''); setBanDuration(null); setBanReason('');
        fetchBans();
        alert('Ceza uygulandı!');
    };

    const removeBan = async (ban: ChatBan) => {
        await supabase.from('chat_bans').update({ is_active: false }).eq('id', ban.id);
        await supabase.from('chat_moderation_logs').insert({
            action: 'unmute_user', admin_id: 'admin', admin_username: 'Yönetici',
            target_user_id: ban.user_id, target_username: ban.username
        });
        // Backward compat
        const mutesData = await getGlobalConfig('tv_mutes');
        let currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
        currentMutes = currentMutes.filter((m: any) => m.userId !== ban.user_id);
        await updateGlobalConfig('tv_mutes', { mutedUsers: currentMutes });
        fetchBans();
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatDate = (iso: string) => new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const getRemainingTime = (muteUntil: string | null) => {
        if (!muteUntil) return 'Kalıcı';
        const remaining = new Date(muteUntil).getTime() - Date.now();
        if (remaining <= 0) return 'Süresi Dolmuş';
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        if (days > 0) return `${days}g ${hours}s kaldı`;
        return `${hours}s kaldı`;
    };

    const filteredLogs = logs.filter(log => {
        if (logFilter !== 'all' && log.action !== logFilter) return false;
        if (logSearch && !log.admin_username?.toLowerCase().includes(logSearch.toLowerCase()) && !log.target_username?.toLowerCase().includes(logSearch.toLowerCase())) return false;
        return true;
    });

    // ── Styles ────────────────────────────────────────────────────────────────
    const cardStyle: React.CSSProperties = {
        background: 'rgba(24,24,27,0.4)', border: '1px solid rgba(39,39,42,0.6)',
        borderRadius: '22px', overflow: 'hidden', transition: 'all 0.3s'
    };
    const innerCardStyle: React.CSSProperties = {
        background: '#161B22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px'
    };
    const sectionTitle: React.CSSProperties = {
        fontSize: '10px', color: '#71717a', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', paddingLeft: '2px'
    };
    const inputStyle: React.CSSProperties = {
        width: '100%', background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontWeight: 700,
        color: '#e5e7eb', outline: 'none', transition: 'border-color 0.2s'
    };
    const btnPrimary: React.CSSProperties = {
        background: 'linear-gradient(135deg, #00FFC2, #00D4AA)', color: '#000',
        fontWeight: 900, borderRadius: '12px', padding: '12px 20px', border: 'none',
        cursor: 'pointer', fontSize: '12px', letterSpacing: '0.5px', transition: 'all 0.2s'
    };
    const btnDanger: React.CSSProperties = {
        background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
        fontWeight: 900, borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '11px', transition: 'all 0.2s'
    };

    const tabBtn = (tab: typeof subTab, label: string, Icon: any) => (
        <button
            onClick={() => setSubTab(tab)}
            style={{
                padding: '10px 18px', borderRadius: '12px',
                border: subTab === tab ? '1px solid #00FFC2' : '1px solid rgba(255,255,255,0.06)',
                background: subTab === tab ? 'rgba(0,255,194,0.08)' : 'rgba(255,255,255,0.02)',
                color: subTab === tab ? '#00FFC2' : '#9ca3af',
                fontWeight: 900, fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px'
            }}
        >
            <Icon style={{ width: 14, height: 14 }} /> {label}
        </button>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid rgba(0,255,194,0.3)', borderTopColor: '#00FFC2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════════════
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield style={{ color: '#00FFC2', width: 22, height: 22 }} /> SOHBET YÖNETİM MERKEZİ
                    </h2>
                    <p style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
                        Moderasyon, kanal yönetimi ve güvenlik kontrolleri
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: chatSettings.chat_enabled ? '#00FFC2' : '#ef4444',
                        boxShadow: chatSettings.chat_enabled ? '0 0 8px #00FFC2' : '0 0 8px #ef4444'
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: chatSettings.chat_enabled ? '#00FFC2' : '#ef4444' }}>
                        {chatSettings.chat_enabled ? 'SOHBET AKTİF' : 'SOHBET KAPALI'}
                    </span>
                </div>
            </div>

            {/* Sub Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tabBtn('overview', 'GENEL BAKIŞ', Activity)}
                {tabBtn('channels', 'KANALLAR', Tv)}
                {tabBtn('bans', 'CEZA YÖNETİMİ', Shield)}
                {tabBtn('logs', 'CANLI LOG', MessageSquare)}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                OVERVIEW TAB
            ═══════════════════════════════════════════════════════════════════ */}
            {subTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Kill Switch */}
                    <section style={cardStyle}>
                        <div style={{ padding: '24px' }}>
                            <p style={sectionTitle}>⚡ SOHBET DURUM KONTROLÜ</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                                <button onClick={toggleKillSwitch} style={{
                                    flex: 1, padding: '18px 24px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    fontWeight: 900, fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.3s',
                                    background: chatSettings.chat_enabled
                                        ? 'linear-gradient(135deg, #00FFC2, #00D4AA)'
                                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    color: chatSettings.chat_enabled ? '#000' : '#fff',
                                    boxShadow: chatSettings.chat_enabled
                                        ? '0 0 30px rgba(0,255,194,0.2)'
                                        : '0 0 30px rgba(239,68,68,0.2)'
                                }}>
                                    {chatSettings.chat_enabled ? '✓ SOHBET AKTİF — Kapatmak İçin Tıklayın' : '✕ SOHBET KAPALI — Açmak İçin Tıklayın'}
                                </button>
                            </div>
                            <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '10px' }}>
                                {chatSettings.chat_enabled
                                    ? 'Sohbet şu anda tüm platformda açık. Kapatmak tüm kullanıcıların mesaj atmasını engelleyecek.'
                                    : 'Sohbet şu anda kapalı. Hiçbir kullanıcı mesaj atamıyor. Açmak için yukarıdaki butona tıklayın.'}
                            </p>
                        </div>
                    </section>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'TOPLAM MESAJ', value: totalMessages, icon: '💬' },
                            { label: 'AKTİF CEZALAR', value: activeBansCount, icon: '🔇' },
                            { label: 'SON 24 SAAT İŞLEM', value: recentActions, icon: '📋' },
                        ].map((stat, i) => (
                            <div key={i} style={innerCardStyle}>
                                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{stat.icon}</div>
                                <div style={{ fontSize: '28px', fontWeight: 900, color: '#00FFC2' }}>{stat.value.toLocaleString('tr-TR')}</div>
                                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Settings */}
                    <section style={cardStyle}>
                        <div style={{ padding: '24px' }}>
                            <p style={sectionTitle}>⚙️ HIZLI AYARLAR</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Rate Limit (saniye)</label>
                                    <input
                                        type="number" min={1} max={300}
                                        value={settingsForm.rate_limit_seconds}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, rate_limit_seconds: parseInt(e.target.value) || 15 })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Max Mesaj Uzunluğu</label>
                                    <input
                                        type="number" min={10} max={2000}
                                        value={settingsForm.max_message_length}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, max_message_length: parseInt(e.target.value) || 500 })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button onClick={saveSettings} style={btnPrimary}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Save style={{ width: 14, height: 14 }} /> KAYDET
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                CHANNELS TAB
            ═══════════════════════════════════════════════════════════════════ */}
            {subTab === 'channels' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* New Channel Button / Form */}
                    {!showNewChannel ? (
                        <button onClick={() => setShowNewChannel(true)} style={btnPrimary}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Plus style={{ width: 14, height: 14 }} /> YENİ KANAL EKLE
                            </span>
                        </button>
                    ) : (
                        <section style={cardStyle}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <p style={{ ...sectionTitle, marginBottom: 0 }}>➕ YENİ KANAL OLUŞTUR</p>
                                    <button onClick={() => setShowNewChannel(false)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                                        <X style={{ width: 16, height: 16 }} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Kanal Adı</label>
                                        <input
                                            value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)}
                                            placeholder="Örn: Genel Sohbet" style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Kategori</label>
                                        <select
                                            value={newChannelCategory} onChange={(e) => setNewChannelCategory(e.target.value)}
                                            style={{ ...inputStyle, cursor: 'pointer' }}
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                    <button onClick={createChannel} style={btnPrimary}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Save style={{ width: 14, height: 14 }} /> OLUŞTUR
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Channel Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {channels.map(ch => (
                            <div key={ch.id} style={innerCardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    {ch.icon_url ? (
                                        <img src={ch.icon_url} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} />
                                    ) : (
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,255,194,0.08)', border: '1px solid rgba(0,255,194,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Tv style={{ width: 20, height: 20, color: '#00FFC2' }} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>{ch.name}</div>
                                        <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{ch.category}</div>
                                    </div>
                                    <button onClick={() => toggleChannelActive(ch)} style={{
                                        padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                        fontWeight: 900, fontSize: '9px', letterSpacing: '0.5px',
                                        background: ch.is_active ? 'rgba(0,255,194,0.1)' : 'rgba(239,68,68,0.1)',
                                        color: ch.is_active ? '#00FFC2' : '#ef4444'
                                    }}>
                                        {ch.is_active ? 'AKTİF' : 'PASİF'}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <label style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        padding: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)',
                                        background: 'rgba(255,255,255,0.02)', cursor: 'pointer', fontSize: '10px',
                                        fontWeight: 800, color: '#9ca3af', transition: 'all 0.2s'
                                    }}>
                                        <ImageIcon style={{ width: 13, height: 13 }} /> LOGO YÜKLE
                                        <input type="file" accept="image/jpeg,image/png" hidden
                                            onChange={(e) => { if (e.target.files?.[0]) handleLogoUpload(ch, e.target.files[0]); }}
                                        />
                                    </label>
                                    <button onClick={() => deleteChannel(ch)} style={btnDanger}>
                                        <Trash2 style={{ width: 13, height: 13 }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {channels.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#4b5563', fontSize: '13px', fontWeight: 700 }}>
                            Henüz kanal eklenmemiş. Yukarıdaki butona tıklayarak ilk kanalınızı oluşturun.
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                BANS TAB
            ═══════════════════════════════════════════════════════════════════ */}
            {subTab === 'bans' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* New Ban Form */}
                    <section style={cardStyle}>
                        <div style={{ padding: '24px' }}>
                            <p style={sectionTitle}>🔇 YENİ CEZA VER</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Kullanıcı Adı / ID</label>
                                    <input value={banUsername} onChange={(e) => setBanUsername(e.target.value)} placeholder="Kullanıcı adını girin" style={inputStyle} />
                                </div>

                                <div>
                                    <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Ceza Süresi</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {[
                                            { label: '1 Hafta', value: 7 },
                                            { label: '1 Ay', value: 30 },
                                            { label: '2 Ay', value: 60 },
                                            { label: 'Kalıcı', value: 0 },
                                        ].map(opt => (
                                            <button key={opt.value} onClick={() => setBanDuration(opt.value)}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                                                    fontWeight: 900, fontSize: '11px', transition: 'all 0.2s',
                                                    border: banDuration === opt.value ? '1px solid #00FFC2' : '1px solid rgba(255,255,255,0.06)',
                                                    background: banDuration === opt.value ? 'rgba(0,255,194,0.1)' : 'rgba(255,255,255,0.02)',
                                                    color: banDuration === opt.value ? '#00FFC2' : (opt.value === 0 ? '#ef4444' : '#9ca3af')
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                                        Ceza Nedeni <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        value={banReason} onChange={(e) => setBanReason(e.target.value)}
                                        placeholder="Ceza nedenini yazın... (zorunlu)"
                                        rows={2}
                                        style={{ ...inputStyle, resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={applyBan}
                                        disabled={!banUsername.trim() || !banReason.trim() || banDuration === null}
                                        style={{
                                            ...btnPrimary,
                                            opacity: (!banUsername.trim() || !banReason.trim() || banDuration === null) ? 0.4 : 1,
                                            cursor: (!banUsername.trim() || !banReason.trim() || banDuration === null) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Ban style={{ width: 14, height: 14 }} /> CEZAYI UYGULA
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Active Bans List */}
                    <section style={cardStyle}>
                        <div style={{ padding: '24px' }}>
                            <p style={sectionTitle}>🚫 AKTİF CEZALAR ({bans.length})</p>
                            {bans.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px', color: '#4b5563', fontSize: '13px', fontWeight: 700 }}>
                                    Aktif ceza bulunmuyor.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {bans.map(ban => (
                                        <div key={ban.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px 16px', borderRadius: '12px',
                                            background: '#0D1117', border: '1px solid rgba(255,255,255,0.04)'
                                        }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                <VolumeX style={{ width: 14, height: 14, color: '#ef4444' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>{ban.username}</div>
                                                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {ban.reason}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{
                                                    fontSize: '10px', fontWeight: 900, letterSpacing: '0.5px',
                                                    color: ban.mute_until ? '#f59e0b' : '#ef4444',
                                                    padding: '2px 8px', borderRadius: '6px',
                                                    background: ban.mute_until ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'
                                                }}>
                                                    {getRemainingTime(ban.mute_until)}
                                                </div>
                                                <div style={{ fontSize: '9px', color: '#4b5563', marginTop: '4px' }}>{formatDate(ban.created_at)}</div>
                                            </div>
                                            <button onClick={() => removeBan(ban)} style={{
                                                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                                                color: '#10b981', borderRadius: '8px', padding: '6px 10px',
                                                cursor: 'pointer', fontWeight: 900, fontSize: '10px', flexShrink: 0
                                            }}>
                                                KALDIR
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                LOGS TAB
            ═══════════════════════════════════════════════════════════════════ */}
            {subTab === 'logs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Filter Bar */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <select value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
                            style={{ ...inputStyle, width: 'auto', minWidth: '180px', cursor: 'pointer' }}
                        >
                            <option value="all">Tümü</option>
                            <option value="delete_message">Mesaj Silme</option>
                            <option value="mute_user">Susturma</option>
                            <option value="unmute_user">Ceza Kaldırma</option>
                            <option value="kill_switch_on">Sohbet Kapatma</option>
                            <option value="kill_switch_off">Sohbet Açma</option>
                            <option value="channel_create">Kanal Oluşturma</option>
                            <option value="channel_delete">Kanal Silme</option>
                            <option value="settings_update">Ayar Güncelleme</option>
                        </select>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#4b5563' }} />
                            <input
                                value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
                                placeholder="Kullanıcı veya admin ara..."
                                style={{ ...inputStyle, paddingLeft: '38px' }}
                            />
                        </div>
                        <button onClick={fetchLogs} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RefreshCw style={{ width: 14, height: 14 }} />
                        </button>
                    </div>

                    {/* Log Entries */}
                    <section style={cardStyle}>
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {filteredLogs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#4b5563', fontSize: '13px', fontWeight: 700 }}>
                                    Henüz moderasyon işlemi bulunmuyor.
                                </div>
                            ) : (
                                filteredLogs.map(log => {
                                    const meta = ACTION_LABELS[log.action] || { label: log.action, color: '#9ca3af', icon: '📌' };
                                    let description = '';
                                    if (log.action === 'mute_user') {
                                        const dur = log.details?.duration_days;
                                        const durText = dur === -1 || dur === 0 ? 'kalıcı' : `${dur} gün`;
                                        description = `${log.admin_username} → ${log.target_username} susturuldu (${durText}) — "${log.details?.reason || ''}"`;
                                    } else if (log.action === 'unmute_user') {
                                        description = `${log.admin_username} → ${log.target_username} cezası kaldırıldı`;
                                    } else if (log.action === 'delete_message') {
                                        description = `${log.admin_username} mesaj sildi`;
                                    } else if (log.action === 'kill_switch_on') {
                                        description = `${log.admin_username} sohbeti kapattı`;
                                    } else if (log.action === 'kill_switch_off') {
                                        description = `${log.admin_username} sohbeti açtı`;
                                    } else if (log.action === 'channel_create') {
                                        description = `${log.admin_username} kanal oluşturdu: ${log.channel_name}`;
                                    } else if (log.action === 'channel_delete') {
                                        description = `${log.admin_username} kanal sildi: ${log.channel_name}`;
                                    } else if (log.action === 'settings_update') {
                                        description = `${log.admin_username} ayarları güncelledi`;
                                    } else {
                                        description = `${log.admin_username}: ${log.action}`;
                                    }

                                    return (
                                        <div key={log.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                            transition: 'background 0.15s'
                                        }}>
                                            <span style={{ fontSize: '16px', flexShrink: 0 }}>{meta.icon}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#e5e7eb' }}>{description}</span>
                                            </div>
                                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                                <span style={{
                                                    fontSize: '9px', fontWeight: 900, color: meta.color,
                                                    padding: '2px 6px', borderRadius: '4px',
                                                    background: `${meta.color}15`, letterSpacing: '0.3px'
                                                }}>
                                                    {meta.label}
                                                </span>
                                                <span style={{ fontSize: '9px', color: '#4b5563' }}>{formatTime(log.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default AdminChatTab;
