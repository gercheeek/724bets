import React, { useState } from 'react';
import { LuckyWheelConfig, LuckyWheelPrize, LuckyWheelMission, LuckyWheelFakeWinner } from '../types';
import { Save, Plus, Trash2, Edit2, Settings, Gift, Users, Target, Image as ImageIcon } from 'lucide-react';

interface AdminLuckyWheelTabProps {
  config: LuckyWheelConfig;
  onSave: (cfg: LuckyWheelConfig) => void;
}

const AdminLuckyWheelTab: React.FC<AdminLuckyWheelTabProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<LuckyWheelConfig>(config);
  const [activeTab, setActiveTab] = useState<'prizes' | 'missions' | 'livefeed' | 'general'>('prizes');

  const handleSave = () => {
    onSave(localConfig);
    alert('LuckyWheel ayarları başarıyla kaydedildi!');
  };

  const handlePrizeChange = (index: number, key: keyof LuckyWheelPrize, value: any) => {
    const newPrizes = [...localConfig.prizes];
    newPrizes[index] = { ...newPrizes[index], [key]: value };
    setLocalConfig({ ...localConfig, prizes: newPrizes });
  };

  const addPrize = () => {
    const newPrize: LuckyWheelPrize = {
      id: Date.now().toString(),
      name: 'Yeni Ödül',
      type: 'cash',
      icon: '🎁',
      value: 0,
      weight: 10,
      color: '#334155'
    };
    setLocalConfig({ ...localConfig, prizes: [...localConfig.prizes, newPrize] });
  };

  const removePrize = (index: number) => {
    const newPrizes = localConfig.prizes.filter((_, i) => i !== index);
    setLocalConfig({ ...localConfig, prizes: newPrizes });
  };

  return (
    <div className="bg-[#1a1c24] rounded-2xl border border-gray-800 shadow-2xl p-6 text-white h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-black uppercase text-[#0ea5e9] flex items-center gap-2">
            <Settings className="w-6 h-6" /> Lucky Wheel Yönetimi
          </h2>
          <p className="text-gray-400 text-sm mt-1">Kış/Yılbaşı temalı Çarkıfelek oyununun ayarlarını yönetin.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
        >
          <Save className="w-5 h-5" /> Kaydet
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'prizes', label: 'Ödüller', icon: Gift },
          { id: 'missions', label: 'Görevler', icon: Target },
          { id: 'livefeed', label: 'Canlı Akış (Fake)', icon: Users },
          { id: 'general', label: 'Genel Ayarlar', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id 
                ? 'bg-[#0ea5e9] text-white' 
                : 'bg-[#111318] text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-[#111318] p-5 rounded-xl border border-gray-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localConfig.isActive}
                  onChange={(e) => setLocalConfig({...localConfig, isActive: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-700 text-[#0ea5e9] focus:ring-[#0ea5e9] bg-gray-900"
                />
                <span className="font-medium">Lucky Wheel Aktif Mi?</span>
              </label>
            </div>
            
            <div className="bg-[#111318] p-5 rounded-xl border border-gray-800 space-y-4">
              <h3 className="font-bold text-[#0ea5e9] uppercase tracking-wider text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Büyük Ödül (Vitrin)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Ödül Adı</label>
                  <input 
                    type="text" 
                    value={localConfig.grandPrize.name}
                    onChange={(e) => setLocalConfig({
                      ...localConfig, 
                      grandPrize: { ...localConfig.grandPrize, name: e.target.value }
                    })}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Alt Başlık (Değer)</label>
                  <input 
                    type="text" 
                    value={localConfig.grandPrize.subtitle}
                    onChange={(e) => setLocalConfig({
                      ...localConfig, 
                      grandPrize: { ...localConfig.grandPrize, subtitle: e.target.value }
                    })}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2.5 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Görsel URL</label>
                  <input 
                    type="text" 
                    value={localConfig.grandPrize.image}
                    onChange={(e) => setLocalConfig({
                      ...localConfig, 
                      grandPrize: { ...localConfig.grandPrize, image: e.target.value }
                    })}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="space-y-4">
            {localConfig.prizes.map((prize, idx) => (
              <div key={prize.id} className="bg-[#111318] p-4 rounded-xl border border-gray-800 flex items-start gap-4">
                <div className="grid grid-cols-6 gap-4 flex-1">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Adı</label>
                    <input 
                      type="text" 
                      value={prize.name} 
                      onChange={(e) => handlePrizeChange(idx, 'name', e.target.value)}
                      className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tür</label>
                    <select 
                      value={prize.type}
                      onChange={(e) => handlePrizeChange(idx, 'type', e.target.value)}
                      className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2 text-sm"
                    >
                      <option value="cash">Nakit</option>
                      <option value="freespin">FreeSpin</option>
                      <option value="physical">Fiziksel</option>
                      <option value="special">Özel</option>
                      <option value="pas">Pas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Değer / İkon</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={prize.value}
                        onChange={(e) => handlePrizeChange(idx, 'value', Number(e.target.value))}
                        className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2 text-sm"
                        placeholder="Değer"
                      />
                      <input 
                        type="text" 
                        value={prize.icon}
                        onChange={(e) => handlePrizeChange(idx, 'icon', e.target.value)}
                        className="w-12 bg-[#0A0C10] border border-gray-800 rounded p-2 text-sm text-center"
                        placeholder="İkon"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ağırlık (%)</label>
                    <input 
                      type="number" 
                      value={prize.weight}
                      onChange={(e) => handlePrizeChange(idx, 'weight', Number(e.target.value))}
                      className="w-full bg-[#0A0C10] border border-gray-800 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Renk</label>
                    <input 
                      type="color" 
                      value={prize.color}
                      onChange={(e) => handlePrizeChange(idx, 'color', e.target.value)}
                      className="w-full h-9 bg-[#0A0C10] border border-gray-800 rounded cursor-pointer p-1"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => removePrize(idx)}
                  className="p-2 mt-5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button 
              onClick={addPrize}
              className="w-full py-3 border-2 border-dashed border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/5 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Yeni Ödül Ekle
            </button>
          </div>
        )}

        {(activeTab === 'missions' || activeTab === 'livefeed') && (
          <div className="bg-[#111318] p-8 rounded-xl border border-gray-800 text-center text-gray-400">
            <p>Bu bölümdeki ayarlar JSON objesi olarak tutulmaktadır. Detaylı CRUD işlemleri eklenebilir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLuckyWheelTab;
