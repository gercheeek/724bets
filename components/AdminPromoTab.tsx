import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AdminPromoTab: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newCode, setNewCode] = useState({
    code: '',
    reward_type: 'balance',
    reward_amount: 50,
    max_uses: 100,
    expires_at: ''
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPromoCodes(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.code.trim()) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const { error: insertError } = await supabase.from('promo_codes').insert([{
        code: newCode.code.trim().toUpperCase(),
        reward_type: newCode.reward_type,
        reward_amount: newCode.reward_amount,
        max_uses: newCode.max_uses || null,
        expires_at: newCode.expires_at ? new Date(newCode.expires_at).toISOString() : null
      }]);

      if (insertError) {
        if (insertError.code === '23505') setError('Bu kod zaten mevcut.');
        else setError(insertError.message);
      } else {
        setSuccess('Promosyon kodu başarıyla oluşturuldu.');
        setNewCode({ code: '', reward_type: 'balance', reward_amount: 50, max_uses: 100, expires_at: '' });
        fetchCodes();
      }
    } catch (err: any) {
      setError('Bir hata oluştu.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kodu silmek istediğinize emin misiniz? (Kullanım geçmişi de silinir)')) return;
    
    try {
      await supabase.from('promo_codes').delete().eq('id', id);
      fetchCodes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Ticket className="w-6 h-6 text-[#f0b90b]" />
          Promosyon Kodları
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Plus className="w-5 h-5 text-[#f0b90b]" />
              Yeni Kod Oluştur
            </h3>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-lg mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm p-3 rounded-lg mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{success}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Kod Adı</label>
                <input type="text" required value={newCode.code} onChange={e => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
                  placeholder="ÖRN: HOŞGELDİN2026" className="w-full bg-black border border-zinc-700 rounded p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Ödül Türü</label>
                  <select value={newCode.reward_type} onChange={e => setNewCode({...newCode, reward_type: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded p-2 text-white">
                    <option value="balance">Nakit Bakiye (TL)</option>
                    <option value="freespin">Free Spin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Miktar</label>
                  <input type="number" required min="1" value={newCode.reward_amount} onChange={e => setNewCode({...newCode, reward_amount: Number(e.target.value)})}
                    className="w-full bg-black border border-zinc-700 rounded p-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Kullanım Limiti</label>
                  <input type="number" min="0" value={newCode.max_uses} onChange={e => setNewCode({...newCode, max_uses: Number(e.target.value)})}
                    placeholder="Sınırsız için boş" className="w-full bg-black border border-zinc-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Son Kullanma</label>
                  <input type="datetime-local" value={newCode.expires_at} onChange={e => setNewCode({...newCode, expires_at: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded p-2 text-white text-sm" />
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-[#f0b90b] text-black font-bold py-3 rounded-lg hover:bg-[#e5a900] transition-colors flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kodu Oluştur'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-800 text-zinc-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Kod</th>
                    <th className="px-4 py-3">Ödül</th>
                    <th className="px-4 py-3">Limit/Kullanım</th>
                    <th className="px-4 py-3">Bitiş</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Yükleniyor...</td></tr>
                  ) : promoCodes.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Henüz kod oluşturulmadı.</td></tr>
                  ) : (
                    promoCodes.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-800/50">
                        <td className="px-4 py-3 font-bold text-[#f0b90b]">{c.code}</td>
                        <td className="px-4 py-3 text-white">{c.reward_amount} {c.reward_type === 'balance' ? 'TL' : 'FS'}</td>
                        <td className="px-4 py-3 text-zinc-400">
                          {c.current_uses} / {c.max_uses ? c.max_uses : '∞'}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-sm">
                          {c.expires_at ? new Date(c.expires_at).toLocaleString('tr-TR') : 'Süresiz'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoTab;
