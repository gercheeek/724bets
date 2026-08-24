import React, { useState, useEffect } from 'react';
import { Wallet, Save, CheckCircle2, Plus, Trash2, Edit2, X } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  accountName: string;
  accountNo: string;
  minAmount: number;
  maxAmount: number | null;
  isActive: boolean;
}

export function AdminWalletsTab() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<Partial<PaymentMethod> | null>(null);

  const fetchMethods = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/payment-methods');
      const data = await res.json();
      if (data.success) {
        setMethods(data.methods);
      }
    } catch (err) {
      console.error('Error fetching methods', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSave = async () => {
    if (!editingMethod?.name || !editingMethod?.type) return;
    
    try {
      const isNew = !editingMethod.id;
      const url = '/api/admin/payment-methods';
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMethod)
      });
      
      const data = await res.json();
      if (data.success) {
        setEditingMethod(null);
        fetchMethods();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Kaydetme hatası');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('http://localhost:3001/api/admin/payment-methods', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchMethods();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-[#0F131A] min-h-full font-sans text-slate-300 relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Ödeme Yöntemleri (Hesaplar)</h2>
            <p className="text-sm text-zinc-500 mt-1">Kullanıcıların para yatıracağı cüzdan ve banka hesaplarını yönetin.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setEditingMethod({ isActive: true, type: 'bank_transfer', minAmount: 100 })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Yeni Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-zinc-500 py-10">Yükleniyor...</div>
        ) : methods.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500 py-10 border border-dashed border-zinc-800 rounded-xl">
            Henüz ödeme yöntemi eklenmemiş.
          </div>
        ) : (
          methods.map(method => (
            <div key={method.id} className="bg-[#1A1F29] p-5 rounded-xl border border-white/5 relative group">
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingMethod(method)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(method.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4 pr-16">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  method.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {method.isActive ? 'Aktif' : 'Pasif'}
                </span>
                <span className="text-xs bg-white/5 text-zinc-400 px-2 py-0.5 rounded uppercase">{method.type}</span>
              </div>
              
              <h3 className="font-bold text-white text-lg mb-1">{method.name}</h3>
              
              <div className="space-y-3 mt-4">
                <div>
                  <div className="text-[10px] uppercase text-zinc-500 font-bold mb-0.5">Alıcı Adı</div>
                  <div className="text-sm font-medium text-white">{method.accountName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-zinc-500 font-bold mb-0.5">Hesap No / IBAN / Cüzdan</div>
                  <div className="text-sm font-mono text-[#00E5FF] bg-black/30 p-2 rounded border border-white/5 truncate">
                    {method.accountNo}
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                  <div>
                    <div className="text-[10px] uppercase text-zinc-500 font-bold">Min</div>
                    <div className="text-sm font-bold text-white">{method.minAmount}</div>
                  </div>
                  {method.maxAmount && (
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-bold">Max</div>
                      <div className="text-sm font-bold text-white">{method.maxAmount}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingMethod && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1F29] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingMethod.id ? 'Yöntemi Düzenle' : 'Yeni Yöntem Ekle'}
              </h3>
              <button onClick={() => setEditingMethod(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Görünen Ad (Örn: Papara 1)</label>
                <input 
                  type="text" 
                  value={editingMethod.name || ''}
                  onChange={e => setEditingMethod({...editingMethod, name: e.target.value})}
                  className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Tür</label>
                <select 
                  value={editingMethod.type || 'bank_transfer'}
                  onChange={e => setEditingMethod({...editingMethod, type: e.target.value})}
                  className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  <option value="bank_transfer">Banka Havalesi/EFT</option>
                  <option value="papara">Papara</option>
                  <option value="crypto">Kripto Para</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Alıcı Ad-Soyad</label>
                <input 
                  type="text" 
                  value={editingMethod.accountName || ''}
                  onChange={e => setEditingMethod({...editingMethod, accountName: e.target.value})}
                  className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">IBAN / Cüzdan Adresi</label>
                <input 
                  type="text" 
                  value={editingMethod.accountNo || ''}
                  onChange={e => setEditingMethod({...editingMethod, accountNo: e.target.value})}
                  className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Min Tutar</label>
                  <input 
                    type="number" 
                    value={editingMethod.minAmount || ''}
                    onChange={e => setEditingMethod({...editingMethod, minAmount: Number(e.target.value)})}
                    className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Max Tutar (Opsiyonel)</label>
                  <input 
                    type="number" 
                    value={editingMethod.maxAmount || ''}
                    onChange={e => setEditingMethod({...editingMethod, maxAmount: Number(e.target.value)})}
                    className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input 
                  type="checkbox" 
                  checked={editingMethod.isActive}
                  onChange={e => setEditingMethod({...editingMethod, isActive: e.target.checked})}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500"
                />
                <span className="text-sm font-medium text-white">Bu yöntemi aktif olarak göster</span>
              </label>
              
              <button 
                onClick={handleSave}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
