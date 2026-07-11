import React, { useState } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, ToggleLeft, ToggleRight, Layout, ChevronUp, ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
import { CasinoLobbyGame } from '../types';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

interface AdminCasinoLobbyTabProps {
  games: CasinoLobbyGame[];
  onSave: (games: CasinoLobbyGame[]) => void;
}

const GRADIENT_THEMES = [
  { name: 'Altın Sarısı (Gold)', value: 'from-[#FFC107] to-[#3E2723]' },
  { name: 'Kırmızı Parıltı (Red)', value: 'from-[#FF1744] to-[#FF8F00]' },
  { name: 'Neon Pembe (Pink/Purple)', value: 'from-[#E040FB] to-[#FF4081]' },
  { name: 'Zümrüt Yeşili (Emerald)', value: 'from-[#00E676] to-[#1B5E20]' },
  { name: 'Derin Mavi (Dark Blue)', value: 'from-[#00E5FF] to-[#1A237E]' },
  { name: 'Kraliyet Moru (Royal Purple)', value: 'from-[#AA00FF] to-[#311B92]' },
  { name: 'Gri & Siyah (Stealth Grey)', value: 'from-[#37474F] to-[#000000]' }
];

const AdminCasinoLobbyTab: React.FC<AdminCasinoLobbyTabProps> = ({ games = [], onSave }) => {
  const [localGames, setLocalGames] = useState<CasinoLobbyGame[]>([...games]);
  const [activeSubTab, setActiveSubTab] = useState<'slot' | 'live' | 'sport'>('slot');
  const [saved, setSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Filter games based on current sub-tab
  const currentCategoryGames = localGames
    .filter(g => g.type === activeSubTab)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const addGame = () => {
    const newGame: CasinoLobbyGame = {
      id: Date.now().toString(),
      name: activeSubTab === 'slot' ? 'Yeni Slot Oyunu' : activeSubTab === 'live' ? 'Yeni Canlı Masa' : 'Yeni Spor',
      provider: 'PRAGMATIC PLAY',
      type: activeSubTab,
      lobbyCategory: 'popular',
      badgeText: '',
      badgeColor: 'bg-purple-600',
      themeColor: activeSubTab === 'slot' ? 'from-[#FFC107] to-[#3E2723]' : activeSubTab === 'live' ? 'from-[#00E676] to-[#1B5E20]' : 'from-[#00E5FF] to-[#1A237E]',
      image: '',
      link: 'https://724bahis.net',
      isActive: true,
      order: localGames.length + 1
    };
    setLocalGames(prev => [...prev, newGame]);
  };

  const removeGame = (id: string) => {
    setLocalGames(prev => prev.filter(g => g.id !== id));
  };

  const updateGame = (id: string, field: keyof CasinoLobbyGame, value: any) => {
    setLocalGames(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    try {
      // Upload the raw file directly without cropping/resizing
      const { url, error } = await uploadImageToSupabase(
        file, 
        'slider-images', 
        `casino-lobby/${id}-${Date.now()}.${file.name.split('.').pop() || 'jpg'}`
      );

      if (url) {
        updateGame(id, 'image', url);
      } else {
        // Fallback: Base64 encoding if upload fails or offline
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          updateGame(id, 'image', reader.result as string);
        };
      }
    } catch (err) {
      console.error('Image processing failed:', err);
      // Inline base64 fallback on error
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        updateGame(id, 'image', reader.result as string);
      };
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = () => {
    onSave(localGames);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const moveGame = (index: number, direction: 'up' | 'down') => {
    // Get list of games in current sub-tab first to preserve category ordering
    const sameTypeGames = [...currentCategoryGames];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sameTypeGames.length) return;

    // Swap elements
    [sameTypeGames[index], sameTypeGames[targetIndex]] = [sameTypeGames[targetIndex], sameTypeGames[index]];

    // Reassign orders for the current category
    const updatedSameType = sameTypeGames.map((g, i) => ({ ...g, order: i + 1 }));

    // Rebuild the final localGames array combining with other category games
    const otherTypeGames = localGames.filter(g => g.type !== activeSubTab);
    setLocalGames([...otherTypeGames, ...updatedSameType]);
  };

  return (
    <div className="animate-fade-in space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Layout className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase italic tracking-tight">CASINO LOBİSİ YÖNETİMİ</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Müşterilerinizin yönlendirileceği oyun afişlerini ve linklerini yönetin</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-300 ${
            saved 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/20' 
              : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02]'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'LOBİ KAYDEDİLDİ' : 'LOBİYİ KAYDET'}
        </button>
      </div>

      {/* ═══ Sub Tabs Selection ═══ */}
      <div className="flex border-b border-zinc-800 pb-px">
        <button
          onClick={() => setActiveSubTab('slot')}
          className={`px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'slot' 
              ? 'border-[#FFC107] text-[#FFC107]' 
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          SLOT OYUNLARI ({localGames.filter(g => g.type === 'slot').length})
        </button>
        <button
          onClick={() => setActiveSubTab('live')}
          className={`px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'live' 
              ? 'border-[#00E676] text-[#00E676]' 
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
          CANLI CASINO ({localGames.filter(g => g.type === 'live').length})
        </button>
        <button
          onClick={() => setActiveSubTab('sport')}
          className={`px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'sport' 
              ? 'border-[#00E5FF] text-[#00E5FF]' 
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          POPÜLER SPORLAR ({localGames.filter(g => g.type === 'sport').length})
        </button>
      </div>

      {/* ═══ Content List ═══ */}
      <div className="space-y-4">
        {currentCategoryGames.map((game, index) => (
          <div 
            key={game.id} 
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-5 hover:border-zinc-700/50 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Visual Preview Section */}
              <div className="w-[180px] flex-shrink-0 flex flex-col gap-2">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">KART ÖNİZLEMESİ</span>
                
                {/* Live Card Replica */}
                <div 
                  className="relative w-full h-[110px] rounded-lg overflow-hidden border border-white/5 select-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.9) 100%)'
                  }}
                >
                  {game.image ? (
                    <img 
                      src={game.image} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover" 
                      style={{ opacity: uploadingId === game.id ? 0.3 : 1 }} 
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-tr ${game.themeColor || 'from-zinc-700 to-zinc-900'} opacity-30`} />
                  )}

                  {/* Text overlays matching client lobby */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10 bg-black/30">
                    {game.type === 'live' && (
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="w-1 h-1 rounded-full bg-[#00E676]" />
                        <span className="text-[6px] font-bold text-[#00E676] uppercase">CANLI</span>
                      </div>
                    )}
                    <span className="text-center font-black text-white text-[10px] tracking-tight uppercase leading-tight">{game.name || 'İSİMSİZ'}</span>
                    <span className="text-[6px] font-extrabold text-zinc-400 uppercase tracking-widest mt-1">{game.provider || 'PRAGMATIC PLAY'}</span>
                  </div>

                  {uploadingId === game.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400" />
                    </div>
                  )}
                </div>

                {/* Upload Section */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-800 hover:bg-zinc-755 border border-zinc-700 text-[9px] font-black text-white rounded-lg cursor-pointer transition-all">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    Masaüstünden Yükle
                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(game.id, e)} />
                  </label>
                  <input
                    type="text"
                    value={game.image}
                    onChange={(e) => updateGame(game.id, 'image', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-amber-500/50 transition-all"
                    placeholder="Veya Görsel URL Linki Girin"
                  />
                </div>
              </div>

              {/* Data Settings Form */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Game Name */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Oyun Adı</label>
                  <input
                    type="text"
                    value={game.name}
                    onChange={(e) => updateGame(game.id, 'name', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                    placeholder="Örn: Fruit Party"
                  />
                </div>

                {/* Provider name */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Oyun Sağlayıcı</label>
                  <input
                    type="text"
                    value={game.provider}
                    onChange={(e) => updateGame(game.id, 'provider', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                    placeholder="Örn: PRAGMATIC PLAY"
                  />
                </div>

                {/* Affiliate redirect URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1 flex items-center gap-1">
                    Yönlendirme Linki (Affiliate / Tanıtım URL)
                    <ExternalLink className="w-3 h-3 text-zinc-600" />
                  </label>
                  <input
                    type="text"
                    value={game.link}
                    onChange={(e) => updateGame(game.id, 'link', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-emerald-400 font-mono outline-none focus:border-amber-500/50 transition-all"
                    placeholder="https://gidecegi-sponsor-site.com/..."
                  />
                </div>

                {/* Optional Cover URL (direct link input) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Veya Görsel URL Linki</label>
                  <input
                    type="text"
                    value={game.image.startsWith('data:') ? '' : game.image}
                    onChange={(e) => updateGame(game.id, 'image', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                    placeholder="https://resimler.com/afis.jpg"
                  />
                </div>

                {/* Custom theme color gradient if no image is uploaded */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Varsayılan Kart Teması (Görsel Yoksa)</label>
                  <select
                    value={game.themeColor}
                    onChange={(e) => updateGame(game.id, 'themeColor', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                  >
                    {GRADIENT_THEMES.map(theme => (
                      <option key={theme.value} value={theme.value}>{theme.name}</option>
                    ))}
                  </select>
                </div>

                {/* Lobi Kategorisi */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Kategori (Hangi Bölümde Görünecek)</label>
                  <select
                    value={game.lobbyCategory || 'popular'}
                    onChange={(e) => updateGame(game.id, 'lobbyCategory', e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                  >
                    <option value="popular">Popüler (Ana Vitrin)</option>
                    <option value="pragmatic">Pragmatic Play Serisi</option>
                    <option value="jackpots">Jackpotlar Gridi</option>
                    <option value="amusnet">Amusnet Casino Gridi</option>
                    <option value="yeni">Yeni Çıkanlar</option>
                    <option value="hizli">Hızlı Oyunlar</option>
                    <option value="galaxsys">Galaxsys</option>
                    <option value="amusnetBannerGames">Amusnet (Özel 5'li Bölüm)</option>
                    <option value="egtBannerGames">EGT (Özel 5'li Bölüm)</option>
                  </select>
                </div>

                {/* Badge (Etiket) */}
                <div className="flex gap-3 md:col-span-2">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Köşe Etiketi Yazısı (Boş bırakılabilir)</label>
                    <input
                      type="text"
                      value={game.badgeText || ''}
                      onChange={(e) => updateGame(game.id, 'badgeText', e.target.value)}
                      className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                      placeholder="Örn: EN İYİ, PİYANGO, YENİ"
                    />
                  </div>
                  <div className="w-[140px] space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Etiket Rengi</label>
                    <select
                      value={game.badgeColor || 'bg-purple-600'}
                      onChange={(e) => updateGame(game.id, 'badgeColor', e.target.value)}
                      className="w-full bg-black border border-zinc-850 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-amber-500/50 transition-all"
                    >
                      <option value="bg-purple-600">Mor</option>
                      <option value="bg-blue-500">Mavi</option>
                      <option value="bg-orange-500">Turuncu</option>
                      <option value="bg-emerald-500">Yeşil</option>
                      <option value="bg-red-500">Kırmızı</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Status and Action Buttons */}
              <div className="w-full lg:w-auto flex lg:flex-col justify-between lg:justify-center items-center gap-3 border-t lg:border-t-0 lg:border-l border-zinc-800/80 pt-4 lg:pt-0 lg:pl-6">
                
                {/* Active Toggle */}
                <button
                  onClick={() => updateGame(game.id, 'isActive', !game.isActive)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                    game.isActive 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-[#00E676]' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                  }`}
                >
                  {game.isActive ? 'AKTİF' : 'KAPALI'}
                </button>

                {/* Reordering */}
                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => moveGame(index, 'up')}
                    disabled={index === 0}
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => moveGame(index, 'down')}
                    disabled={index === currentCategoryGames.length - 1}
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Trash Icon */}
                <button
                  onClick={() => removeGame(game.id)}
                  className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>
          </div>
        ))}

        {currentCategoryGames.length === 0 && (
          <div className="text-center py-12 bg-zinc-950/20 border border-dashed border-zinc-800/80 rounded-lg">
            <Layout className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">BU KATEGORİDE HENÜZ OYUN EKLENMEDİ</p>
          </div>
        )}

        {/* Add New Game Trigger */}
        <button
          onClick={addGame}
          className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-amber-500/30 rounded-lg bg-transparent hover:bg-amber-400/5 text-zinc-500 hover:text-[#FFC107] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          YENİ {activeSubTab === 'slot' ? 'SLOT OYUNU' : 'CANLI CASINO MASASI'} EKLE
        </button>

      </div>

    </div>
  );
};

export default AdminCasinoLobbyTab;
