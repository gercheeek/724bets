import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

const AdminRainControl: React.FC<{ adminId: string }> = ({ adminId }) => {
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(300); // 5 dakika
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [loading, setLoading] = useState(false);

  // Yağmur Başlat
  const handleStartRain = async () => {
    if (amount <= 0 || duration <= 0) return alert('Geçerli değerler girin.');
    
    setLoading(true);
    try {
      // Bitiş süresini hesapla
      const endsAt = new Date();
      endsAt.setSeconds(endsAt.getSeconds() + duration);

      const { error } = await supabase.from('rain_events').insert({
        status: 'active',
        total_amount: amount,
        duration_seconds: duration,
        max_participants: maxParticipants,
        ends_at: endsAt.toISOString()
      });

      if (error) throw error;
      alert('Yağmur etkinliği başarıyla başlatıldı! 🌧️');
    } catch (err: any) {
      console.error(err);
      alert('Başlatılamadı: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Kill Switch - Acil Durdurma
  const handleKillSwitch = async () => {
    if (!window.confirm('DİKKAT: Aktif tüm yağmurları iptal etmek istediğinize emin misiniz?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('rain_events')
        .update({ status: 'cancelled' })
        .eq('status', 'active');

      if (error) throw error;
      alert('Tüm aktif yağmurlar acil durduruldu (Cancelled).');
    } catch (err: any) {
      alert('Durdurulamadı: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>🌧️ Yağmur Kontrol Paneli</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Havuz Tutarı (₺)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: 'white', border: 'none', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Süre (Saniye)</label>
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: 'white', border: 'none', borderRadius: '4px' }}
          />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Maksimum Katılımcı</label>
          <input 
            type="number" 
            value={maxParticipants} 
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', background: 'var(--bg-input)', color: 'white', border: 'none', borderRadius: '4px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button 
          onClick={handleStartRain} 
          disabled={loading}
          style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 'var(--radius-base)', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'İşleniyor...' : 'Yağmuru Başlat'}
        </button>
        <button 
          onClick={handleKillSwitch} 
          disabled={loading}
          style={{ padding: '12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 'var(--radius-base)', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🚨 KILL SWITCH
        </button>
      </div>
    </div>
  );
};

export default AdminRainControl;
