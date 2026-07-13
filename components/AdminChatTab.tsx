import React, { useState, useEffect, useRef } from 'react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';

interface Bot {
  id: string;
  username: string;
  role?: string;
}

const GLOBAL_CHANNEL_ID = '00000000-0000-0000-0000-000000000000';

declare global {
  interface Window {
    globalSimulation?: {
      isRunning: boolean;
      scenarioText: string;
      delaySeconds: number;
      remainingMessages: number;
      statusMessage: string;
      onStateChange?: (state: { isRunning: boolean; remainingMessages: number; statusMessage: string }) => void;
      abortSimulation: () => void;
      startSimulation: (text: string, delay: number, botsList: any[], fetchBots: () => void) => void;
    };
  }
}

if (typeof window !== 'undefined' && !window.globalSimulation) {
  let isRunning = false;
  let scenarioText = localStorage.getItem('admin_scenario_text') || '';
  let delaySeconds = Number(localStorage.getItem('admin_scenario_delay') || '15');
  let remainingMessages = 0;
  let statusMessage = '';
  let timeoutId: any = null;

  const abortSimulation = () => {
    isRunning = false;
    remainingMessages = 0;
    statusMessage = '⏹️ Senaryo simülasyonu durduruldu.';
    if (timeoutId) clearTimeout(timeoutId);
    if (window.globalSimulation) {
      window.globalSimulation.isRunning = false;
      window.globalSimulation.remainingMessages = 0;
      window.globalSimulation.statusMessage = statusMessage;
      if (window.globalSimulation.onStateChange) {
        window.globalSimulation.onStateChange({ isRunning, remainingMessages, statusMessage });
      }
    }
  };

  const startSimulation = async (text: string, delay: number, botsList: any[], fetchBots: () => void) => {
    if (isRunning) return;
    isRunning = true;
    scenarioText = text;
    delaySeconds = delay;
    localStorage.setItem('admin_scenario_text', text);
    localStorage.setItem('admin_scenario_delay', String(delay));

    statusMessage = '⌛ Senaryo işleniyor, lütfen bekleyin...';
    if (window.globalSimulation) {
      window.globalSimulation.isRunning = true;
      window.globalSimulation.scenarioText = text;
      window.globalSimulation.delaySeconds = delay;
      window.globalSimulation.statusMessage = statusMessage;
      if (window.globalSimulation.onStateChange) {
        window.globalSimulation.onStateChange({ isRunning, remainingMessages, statusMessage });
      }
    }

    const lines = text.split('\n').filter(line => line.includes(':'));
    const parsedMessages = lines.map(line => {
      const colonIdx = line.indexOf(':');
      const username = line.substring(0, colonIdx).trim();
      let message = line.substring(colonIdx + 1).trim();
      message = message.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      return { username, message };
    });

    remainingMessages = parsedMessages.length;
    if (window.globalSimulation) {
      window.globalSimulation.remainingMessages = remainingMessages;
      if (window.globalSimulation.onStateChange) {
        window.globalSimulation.onStateChange({ isRunning, remainingMessages, statusMessage });
      }
    }

    const updatedBots = [...botsList];
    for (const msg of parsedMessages) {
      if (!isRunning) return;
      const exists = updatedBots.some(b => b.username.toLowerCase() === msg.username.toLowerCase());
      if (!exists) {
        try {
          const { data } = await supabase
            .from('members')
            .insert([{ 
              username: msg.username, 
              is_bot: true, 
              role: 'member',
              email: `${msg.username.replace(/\s+/g, '').toLowerCase()}_bot_${Date.now()}@724bahis.com`,
              password: 'bot_placeholder_pwd',
              status: 'active'
            }])
            .select();
          if (data && data.length > 0) {
            updatedBots.push(data[0]);
          }
        } catch (e) {
          console.error('Oto bot üretimi hatası:', e);
        }
      }
    }

    fetchBots();

    const runStep = async (index: number) => {
      if (!isRunning) return;
      if (index >= parsedMessages.length) {
        isRunning = false;
        statusMessage = '✅ Senaryo simülasyonu başarıyla tamamlandı!';
        remainingMessages = 0;
        if (window.globalSimulation) {
          window.globalSimulation.isRunning = false;
          window.globalSimulation.remainingMessages = 0;
          window.globalSimulation.statusMessage = statusMessage;
          if (window.globalSimulation.onStateChange) {
            window.globalSimulation.onStateChange({ isRunning, remainingMessages, statusMessage });
          }
        }
        return;
      }

      const currentMsg = parsedMessages[index];
      const botUser = updatedBots.find(b => b.username.toLowerCase() === currentMsg.username.toLowerCase());
      
      if (!botUser) {
        runStep(index + 1);
        return;
      }

      statusMessage = `💬 ${currentMsg.username} yazıyor...`;
      remainingMessages = parsedMessages.length - index;
      if (window.globalSimulation) {
        window.globalSimulation.statusMessage = statusMessage;
        window.globalSimulation.remainingMessages = remainingMessages;
        if (window.globalSimulation.onStateChange) {
          window.globalSimulation.onStateChange({ isRunning, remainingMessages, statusMessage });
        }
      }

      const typingChannel = supabase.channel('global-chat-room');
      typingChannel.send({
        type: 'broadcast',
        event: 'user_typing',
        payload: { username: currentMsg.username }
      });

      timeoutId = setTimeout(async () => {
        if (!isRunning) return;
        try {
          await supabase.from('tv_chat').insert([
            {
              channel_id: GLOBAL_CHANNEL_ID,
              user_id: botUser.id,
              username: botUser.username,
              role: botUser.role || 'member',
              message: currentMsg.message
            }
          ]);
        } catch (dbErr) {
          console.error('Mesaj gönderilemedi:', dbErr);
        }

        remainingMessages = parsedMessages.length - (index + 1);
        statusMessage = `⏱️ Sıradaki mesaj bekleniyor...`;
        if (window.globalSimulation) {
          window.globalSimulation.statusMessage = statusMessage;
          window.globalSimulation.remainingMessages = remainingMessages;
          if (window.globalSimulation.onStateChange) {
            window.globalSimulation.onStateChange({ isRunning, remainingMessages, statusMessage });
          }
        }

        const randomMultiplier = 0.8 + Math.random() * 0.4;
        const finalDelay = Math.max(0, (delaySeconds * 1000 * randomMultiplier) - 3000);
        
        timeoutId = setTimeout(() => {
          runStep(index + 1);
        }, finalDelay);

      }, 3000);
    };

    runStep(0);
  };

  window.globalSimulation = {
    isRunning,
    scenarioText,
    delaySeconds,
    remainingMessages,
    statusMessage,
    abortSimulation,
    startSimulation
  };
}

export default function AdminChatTab() {
  // Alt Sekme Yönetimi
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'simulator' | 'punish' | 'logs' | 'interactives'>('simulator');
  
  // Bot & Simülatör State'leri
  const [bots, setBots] = useState<Bot[]>([]);
  const [newBotName, setNewBotName] = useState('');
  const [scenarioText, setScenarioText] = useState('');
  const [delaySeconds, setDelaySeconds] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // AI Autopilot (Oto-Pilot) State'leri
  const [hfToken, setHfToken] = useState(() => localStorage.getItem('hf_token') || '');
  const [isAutopilotRunning, setIsAutopilotRunning] = useState(false);
  const [autopilotTopic, setAutopilotTopic] = useState('');
  const [activeOverrideTopic, setActiveOverrideTopic] = useState('');
  const [overrideBanner, setOverrideBanner] = useState('');
  
  const autopilotTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Event Widget States
  const [eventShow, setEventShow] = useState(true);
  const [eventTitle, setEventTitle] = useState('Yeni Etkinlik');
  const [eventBrand, setEventBrand] = useState('Gamdom');
  const [eventPromo, setEventPromo] = useState('Kod Etkinliği');
  const [eventPrize, setEventPrize] = useState('920.000 TL');
  const [eventCtaText, setEventCtaText] = useState('Etkinliğe Katıl');
  const [eventCtaUrl, setEventCtaUrl] = useState('https://gamdom.com');

  // Poll States
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsStr, setPollOptionsStr] = useState('');
  const [pollIsActive, setPollIsActive] = useState(false);
  const [pollVotes, setPollVotes] = useState<number[]>([]);

  // Pinned Message States
  const [pinText, setPinText] = useState('');
  const [pinUsername, setPinUsername] = useState('Yönetici');
  const [pinRole, setPinRole] = useState('admin');
  const [pinIsActive, setPinIsActive] = useState(false);

  // Verileri İlk Açılışta Çek
  useEffect(() => {
    fetchBots();
    loadChatSettingsAdmin();

    if (window.globalSimulation) {
      setScenarioText(window.globalSimulation.scenarioText || localStorage.getItem('admin_scenario_text') || '');
      setDelaySeconds(window.globalSimulation.delaySeconds || Number(localStorage.getItem('admin_scenario_delay') || '15'));
      setIsRunning(window.globalSimulation.isRunning);
      setRemainingMessages(window.globalSimulation.remainingMessages);
      setStatusMessage(window.globalSimulation.statusMessage);

      window.globalSimulation.onStateChange = (state) => {
        setIsRunning(state.isRunning);
        setRemainingMessages(state.remainingMessages);
        setStatusMessage(state.statusMessage);
      };
    }

    return () => {
      if (window.globalSimulation) {
        window.globalSimulation.onStateChange = undefined;
      }
    };
  }, []);

  const loadChatSettingsAdmin = async () => {
    try {
      const settings = await getGlobalConfig('chat_settings');
      if (settings) {
        // Event settings
        if (settings.eventWidget) {
          setEventShow(settings.eventWidget.show !== false);
          setEventTitle(settings.eventWidget.title || 'Yeni Etkinlik');
          setEventBrand(settings.eventWidget.brandName || 'Gamdom');
          setEventPromo(settings.eventWidget.promoName || 'Kod Etkinliği');
          setEventPrize(settings.eventWidget.prizeAmount || '920.000 TL');
          setEventCtaText(settings.eventWidget.ctaText || 'Etkinliğe Katıl');
          setEventCtaUrl(settings.eventWidget.ctaUrl || 'https://gamdom.com');
        }

        // Poll settings
        if (settings.poll) {
          setPollQuestion(settings.poll.question || '');
          setPollOptionsStr(settings.poll.options ? settings.poll.options.join(', ') : '');
          setPollIsActive(settings.poll.isActive !== false);
          setPollVotes(settings.poll.votes || []);
        }

        // Pinned Message settings
        if (settings.pinnedMessage) {
          setPinText(settings.pinnedMessage.text || '');
          setPinUsername(settings.pinnedMessage.username || 'Yönetici');
          setPinRole(settings.pinnedMessage.role || 'admin');
          setPinIsActive(true);
        } else {
          setPinIsActive(false);
        }
      }
    } catch (e) {
      console.error('Failed to load settings in admin:', e);
    }
  };

  // API Token'ı local storage'da sakla
  useEffect(() => {
    localStorage.setItem('hf_token', hfToken);
  }, [hfToken]);

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, username, role')
        .eq('is_bot', true);
      if (!error && data) setBots(data);
    } catch (err) {
      console.error('Botlar yüklenirken hata:', err);
    }
  };

  // 🤖 HAYALET BOT ÜRETİCİ
  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{ 
          username: newBotName.trim(), 
          is_bot: true, 
          role: 'member',
          email: `${newBotName.trim().replace(/\s+/g, '').toLowerCase()}_bot_${Date.now()}@724bahis.com`,
          password: 'bot_placeholder_pwd',
          status: 'active'
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setBots(prev => [...prev, data[0]]);
        setNewBotName('');
        alert(`🤖 ${newBotName} başarıyla hayalet üye olarak eklendi!`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Bot eklenirken hata: ' + err.message);
    }
  };

  // 🎲 RASTGELE HAYALET BOT ÜRETİCİLERİ
  const handleCreateRandomBot = async () => {
    const pool = [
      'KuponcuReis', 'BahisCanavari', 'TekMacYatan', 'KasaKatlama', 'AltUstUstasi',
      'SlotKrali', 'RuletUstasi', 'BlackjackPro', 'BonusAvcisi', 'IddaaAnaliz',
      'BankoKuponcu', 'SistemciAga', 'CanliBahisci', 'SansliYusuf', 'KazananTayfa',
      'GolcuSaban', 'KuponUstasi', 'BahisDoktoru', 'SlotSever', 'CanliCanavari',
      'BahisGurmesi', 'KuponAnalizci', 'KasaKatlayici', 'GununBankosu', 'GolBekleyen',
      'KornerciReis', 'KartBahiscisi', 'CanliFatihi', 'SlotPrensi', 'RuletFatihi',
      'Aslan1905', 'Kanarya1907', 'Kartal1903', 'Firtina1967', 'SampiyonTayfa'
    ];
    
    const existingNames = new Set(bots.map(b => b.username.toLowerCase()));
    const availableNames = pool.filter(name => !existingNames.has(name.toLowerCase()));
    
    if (availableNames.length === 0) {
      alert('Tüm hazır takma adlar kullanıldı!');
      return;
    }
    
    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    
    try {
      setStatusMessage(`🤖 ${randomName} hayalet üyesi ekleniyor...`);
      const { data, error } = await supabase
        .from('members')
        .insert([{ 
          username: randomName, 
          is_bot: true, 
          role: 'member',
          email: `${randomName.toLowerCase()}_bot_${Date.now()}@724bahis.com`,
          password: 'bot_placeholder_pwd',
          status: 'active'
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setBots(prev => [...prev, data[0]]);
        setStatusMessage(`🤖 ${randomName} başarıyla hayalet üye olarak eklendi!`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err: any) {
      console.error(err);
      alert('Bot eklenirken hata: ' + err.message);
      setStatusMessage('');
    }
  };

  const handleCreate5RandomBots = async () => {
    const pool = [
      'KuponcuReis', 'BahisCanavari', 'TekMacYatan', 'KasaKatlama', 'AltUstUstasi',
      'SlotKrali', 'RuletUstasi', 'BlackjackPro', 'BonusAvcisi', 'IddaaAnaliz',
      'BankoKuponcu', 'SistemciAga', 'CanliBahisci', 'SansliYusuf', 'KazananTayfa',
      'GolcuSaban', 'KuponUstasi', 'BahisDoktoru', 'SlotSever', 'CanliCanavari',
      'BahisGurmesi', 'KuponAnalizci', 'KasaKatlayici', 'GununBankosu', 'GolBekleyen',
      'KornerciReis', 'KartBahiscisi', 'CanliFatihi', 'SlotPrensi', 'RuletFatihi',
      'Aslan1905', 'Kanarya1907', 'Kartal1903', 'Firtina1967', 'SampiyonTayfa'
    ];
    
    const existingNames = new Set(bots.map(b => b.username.toLowerCase()));
    const availableNames = pool.filter(name => !existingNames.has(name.toLowerCase()));
    
    if (availableNames.length < 5) {
      alert('Yeterli benzersiz takma ad kalmadı!');
      return;
    }
    
    const selected: string[] = [];
    const tempPool = [...availableNames];
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * tempPool.length);
      selected.push(tempPool.splice(idx, 1)[0]);
    }
    
    try {
      setStatusMessage('🤖 5 adet hayalet üye oluşturuluyor...');
      const { data, error } = await supabase
        .from('members')
        .insert(selected.map(name => ({
          username: name,
          is_bot: true,
          role: 'member',
          email: `${name.toLowerCase()}_bot_${Date.now()}_${Math.floor(Math.random()*1000)}@724bahis.com`,
          password: 'bot_placeholder_pwd',
          status: 'active'
        })))
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setBots(prev => [...prev, ...data]);
        setStatusMessage('🤖 5 adet hayalet üye başarıyla eklendi!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err: any) {
      console.error(err);
      alert('Toplu bot eklenirken hata: ' + err.message);
      setStatusMessage('');
    }
  };


  // 🗑️ HAYALET BOT SİLİCİ
  const handleDeleteBot = async (id: string) => {
    if (!confirm('Bu bot hesabını silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      if (error) {
        alert('Bot silinirken hata oluştu: ' + error.message);
      } else {
        setBots(prev => prev.filter(b => b.id !== id));
        alert('🤖 Bot başarıyla silindi!');
      }
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  // 🗑️ TÜM HAYALET BOTLARI SİL
  const handleDeleteAllBots = async () => {
    if (bots.length === 0) {
      alert('Sistemde silinecek bot bulunamadı.');
      return;
    }
    if (!confirm(`Sistemdeki TÜM (${bots.length}) botları silmek istediğinize emin misiniz?`)) return;
    
    try {
      setStatusMessage('🤖 Tüm botlar siliniyor...');
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('is_bot', true);
        
      if (error) {
        alert('Botlar toplu silinirken hata oluştu: ' + error.message);
      } else {
        setBots([]);
        setStatusMessage('🤖 Tüm botlar başarıyla silindi!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err: any) {
      console.error(err);
      alert('Toplu silme hatası: ' + err.message);
      setStatusMessage('');
    }
  };


  // 🚨 TÜM SOHBETİ TEMİZLE
  const handleClearChat = async () => {
    if (!confirm('Tüm sohbet geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    try {
      const { error } = await supabase
        .from('tv_chat')
        .delete()
        .neq('id', GLOBAL_CHANNEL_ID); // UUID null-like comparison to delete all rows
      if (error) {
        alert('Sohbet temizlenirken hata oluştu: ' + error.message);
      } else {
        alert('🚨 Tüm sohbet geçmişi başarıyla temizlendi!');
      }
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  // 🚀 AKILLI SENARYO SİMÜLATÖRÜ KONTROLLERİ
  const handleScenarioChange = (text: string) => {
    setScenarioText(text);
    localStorage.setItem('admin_scenario_text', text);
    if (window.globalSimulation) {
      window.globalSimulation.scenarioText = text;
    }
  };

  const handleDelayChange = (delay: number) => {
    setDelaySeconds(delay);
    localStorage.setItem('admin_scenario_delay', String(delay));
    if (window.globalSimulation) {
      window.globalSimulation.delaySeconds = delay;
    }
  };

  const handleStartSimulation = () => {
    if (!scenarioText.trim()) {
      alert('Lütfen senaryo metni girin!');
      return;
    }
    if (window.globalSimulation) {
      window.globalSimulation.startSimulation(scenarioText, delaySeconds, bots, fetchBots);
    }
  };

  const handleStopSimulation = () => {
    if (window.globalSimulation) {
      window.globalSimulation.abortSimulation();
    }
  };

  // 🎯 ANLIK KONU DEĞİŞTİRİCİ (SOBOTAJ) EMİR GÖNDERİMİ
  const handleOverrideTopic = () => {
    if (!autopilotTopic.trim()) return;
    setActiveOverrideTopic(autopilotTopic.trim());
    setOverrideBanner(`🎯 Yeni Konu 15sn İçinde Devreye Alınıyor`);
    setAutopilotTopic('');
  };

  // 🤖 AI AUTOPILOT ENGINE (Hugging Face / Zephyr tabanlı sonsuz sohbet)
  const runAutopilotStep = async () => {
    if (bots.length === 0) {
      setStatusMessage('⚠️ Autopilot için sistemde en az 1 bot hesabı bulunmalıdır.');
      setIsAutopilotRunning(false);
      return;
    }

    const token = hfToken || '';
    if (!token) {
      setStatusMessage('⚠️ Hugging Face Token eksik!');
      setIsAutopilotRunning(false);
      return;
    }

    try {
      // 1. Son 10 mesaj geçmişini al
      const { data: lastMessages } = await supabase
        .from('tv_chat')
        .select('username, message')
        .eq('channel_id', GLOBAL_CHANNEL_ID)
        .order('created_at', { ascending: false })
        .limit(10);

      const historyStr = lastMessages
        ? lastMessages.reverse().map(m => `${m.username}: ${m.message}`).join('\n')
        : '';

      // 2. Prompt oluşturma
      let systemPrompt = `Sen 724bahis.com sitesinde takılan heyecanlı bir bahisçi ve spor analistisin. 
Canlı maçları takip edip skorlara göre tepki veriyorsun. Asla bir yapay zeka olduğunu belli etme.
Kısa, öz ve argo içermeyen sokak ağzıyla (kanka, aga, hoca vb.) spor/casino muhabbeti yap.
Mesajların maksimum 1-2 cümle olsun. Zaman zaman Gamdom, 21.com gibi casino sitelerini öv.`;

      if (activeOverrideTopic) {
        systemPrompt += `\n\nYÖNETİCİDEN ACİL EMİR: Sohbetin konusunu sıradaki 1 veya en geç 2 mesaj içinde yavaşça, çaktırmadan ve pürüzsüzce şu konuya kaydırın: '${activeOverrideTopic}'. Botlar eski konuyu bir anda kesmesin; önce lafı buraya bağlayacak 1-2 cümle kursunlar, ardından tamamen bu yeni konuyu kendi aralarında bahis jargonuyla tartışmaya devam etsinler.`;
      }

      const combinedPrompt = `<|system|>\n${systemPrompt}</s>\n<|user|>\nŞU ANKİ SOHBET GEÇMİŞİ:\n${historyStr}\n\nSohbet geçmişine göre sıradaki mesajı yaz. Kendin olarak yaz. Sadece mesajı yaz, ismini veya başkalarının adını yazma.</s>\n<|assistant|>`;

      // 3. Hugging Face Zephyr API çağrısı
      setStatusMessage('🤖 Zephyr mesaj üretiyor...');
      const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inputs: combinedPrompt,
          parameters: { 
            max_new_tokens: 250, 
            temperature: 0.7 
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => 'Hata içeriği okunamadı.');
        throw new Error(`Hugging Face API Hatası (Kod: ${response.status}): ${errText}`);
      }

      const data = await response.json();
      
      let generatedText = '';
      if (Array.isArray(data) && data[0]?.generated_text) {
        generatedText = data[0].generated_text;
        // Prompt ekolarını temizle
        if (generatedText.startsWith(combinedPrompt)) {
          generatedText = generatedText.substring(combinedPrompt.length);
        }
      }
      
      generatedText = generatedText.trim().replace(/^["']|["']$/g, '').trim();

      if (!generatedText) {
        throw new Error('API geçerli bir mesaj dönmedi. Response: ' + JSON.stringify(data));
      }

      // 4. Rastgele bir bot seç ve mesajı gönder
      const randomBot = bots[Math.floor(Math.random() * bots.length)];
      
      setStatusMessage(`💬 ${randomBot.username} yazıyor...`);
      
      // "Yazıyor..." Broadcast
      const typingChannel = supabase.channel('global-chat-room');
      typingChannel.send({
        type: 'broadcast',
        event: 'user_typing',
        payload: { username: randomBot.username }
      });

      await new Promise(res => setTimeout(res, 3000));

      // Mesajı gönder
      await supabase.from('tv_chat').insert([
        {
          channel_id: GLOBAL_CHANNEL_ID,
          user_id: randomBot.id,
          username: randomBot.username,
          role: randomBot.role || 'member',
          message: generatedText
        }
      ]);

      // Eğer override konusu devrede idiyse ve uygulandıysa temizle
      if (activeOverrideTopic) {
        setActiveOverrideTopic('');
        setOverrideBanner('');
      }

      // 5. Bir sonraki adım için insansı gecikme hesapla ve zamanla
      const randomMultiplier = 0.8 + Math.random() * 0.4;
      const finalDelay = Math.max(0, (delaySeconds * 1000 * randomMultiplier) - 3000);
      
      setStatusMessage('⏱️ Oto-Pilot aktif, sıradaki döngü bekleniyor...');
      
      autopilotTimeoutRef.current = setTimeout(runAutopilotStep, finalDelay);

    } catch (err: any) {
      console.error('Autopilot Zephyr AI döngü hatası detaylı açıklama:', err?.message || err, err);
      setStatusMessage(`❌ Zephyr AI hatası: ${err?.message || 'Bilinmeyen hata'}`);
      autopilotTimeoutRef.current = setTimeout(runAutopilotStep, 5000);
    }
  };

  const startAutopilot = () => {
    setIsAutopilotRunning(true);
    setStatusMessage('🚀 Zephyr AI Oto-Pilot başlatılıyor...');
    runAutopilotStep();
  };

  const stopAutopilot = () => {
    setIsAutopilotRunning(false);
    if (autopilotTimeoutRef.current) {
      clearTimeout(autopilotTimeoutRef.current);
      autopilotTimeoutRef.current = null;
    }
    setStatusMessage('⏹️ AI Oto-Pilot durduruldu.');
  };

  const handleSaveInteractives = async () => {
    try {
      const currentSettings = await getGlobalConfig('chat_settings') || {};
      
      const newSettings = {
        ...currentSettings,
        eventWidget: {
          show: eventShow,
          title: eventTitle,
          brandName: eventBrand,
          promoName: eventPromo,
          prizeAmount: eventPrize,
          ctaText: eventCtaText,
          ctaUrl: eventCtaUrl
        },
        poll: {
          question: pollQuestion,
          options: pollOptionsStr.split(',').map(o => o.trim()).filter(Boolean),
          votes: pollVotes.length > 0 ? pollVotes : pollOptionsStr.split(',').map(o => o.trim()).filter(Boolean).map(() => 0),
          isActive: pollIsActive
        },
        pinnedMessage: pinIsActive ? {
          text: pinText,
          username: pinUsername,
          role: pinRole
        } : null
      };

      const { error } = await updateGlobalConfig('chat_settings', newSettings);
      if (error) {
        alert('Ayarlar kaydedilirken bir hata oluştu: ' + error.message);
      } else {
        alert('🎉 Sohbet etkileşim ayarları başarıyla kaydedildi!');
        loadChatSettingsAdmin();
      }
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  const handleResetPollVotes = () => {
    const opts = pollOptionsStr.split(',').map(o => o.trim()).filter(Boolean);
    setPollVotes(opts.map(() => 0));
    alert('Oylar sıfırlandı. Değişikliğin geçerli olması için KAYDET butonuna basın.');
  };

  // Unmount temizliği
  useEffect(() => {
    return () => {
      if (autopilotTimeoutRef.current) clearTimeout(autopilotTimeoutRef.current);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      {/* Başlık ve Global Status */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-green-400 tracking-wide">👑 SOHBET YÖNETİM MERKEZİ</h1>
          <p className="text-xs text-gray-400 mt-1">MODERASYON VE AI SENARYO KONTROLLERİ</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all tracking-wide uppercase shadow-lg shadow-red-900/10"
          >
            🚨 Sohbeti Temizle (Tümü)
          </button>
          {statusMessage && (
            <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm text-yellow-400 animate-pulse font-medium">
              {statusMessage}
            </div>
          )}
        </div>
      </div>

      {/* Yönetici Sekmeleri */}
      <div className="flex gap-2 mb-6 bg-gray-900 p-1.5 rounded-lg border border-gray-800 w-max">
        <button onClick={() => setActiveSubTab('overview')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'overview' ? 'bg-gray-800 text-green-400 border border-gray-700' : 'text-gray-400 hover:text-gray-200'}`}>GENEL BAKIŞ</button>
        <button onClick={() => setActiveSubTab('simulator')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'simulator' ? 'bg-gray-800 text-green-400 border border-gray-700' : 'text-gray-400 hover:text-gray-200'}`}>SENARYO SİMÜLATÖRÜ</button>
        <button onClick={() => setActiveSubTab('interactives')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'interactives' ? 'bg-gray-800 text-amber-400 border border-gray-700' : 'text-gray-400 hover:text-gray-200'}`}>ETKİNLİK & ANKET & SABİT</button>
        <button onClick={() => setActiveSubTab('punish')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'punish' ? 'bg-gray-800 text-red-400' : 'text-gray-400'}`}>CEZA YÖNETİMİ</button>
        <button onClick={() => setActiveSubTab('logs')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'logs' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'}`}>CANLI LOG</button>
      </div>

      {/* SENARYO SİMÜLATÖRÜ SEKMESİ */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon: Manuel Bot Ekleme & Listesi */}
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 space-y-5 h-max">
            <div>
              <h3 className="text-md font-bold mb-3 text-green-400 flex items-center gap-2">🤖 Yeni Hayalet Üye (Bot)</h3>
              <form onSubmit={handleCreateBot} className="flex gap-2">
                <input type="text" value={newBotName} onChange={(e) => setNewBotName(e.target.value)} placeholder="Kullanıcı Adı" className="flex-1 bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg font-bold text-sm transition-colors text-white">EKLE</button>
              </form>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCreateRandomBot}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold py-2 px-3 rounded-lg border border-zinc-700 transition-colors text-gray-200"
                >
                  🎲 Rastgele Bot
                </button>
                <button
                  onClick={handleCreate5RandomBots}
                  className="flex-1 bg-green-950/45 hover:bg-green-950/65 text-xs font-bold py-2 px-3 rounded-lg border border-green-900/60 transition-colors text-green-400"
                >
                  👥 Toplu Üret (5x)
                </button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sistemdeki Hayalet Üyeler ({bots.length})</h3>
                {bots.length > 0 && (
                  <button
                    onClick={handleDeleteAllBots}
                    className="text-red-500 hover:text-red-400 font-bold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    🚨 Tümünü Sil
                  </button>
                )}
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 h-64 overflow-y-auto space-y-1">
                {bots.length === 0 ? (
                  <p className="text-xs text-gray-600 p-4 text-center italic">Henüz bot hesap üretilmemiş.</p>
                ) : (
                  bots.map(b => (
                    <div key={b.id} className="text-xs p-2 bg-gray-900/50 rounded border border-gray-800 text-gray-300 flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-[8px]">●</span> {b.username}
                      </div>
                      <button
                        onClick={() => handleDeleteBot(b.id)}
                        className="text-red-500 hover:text-red-400 font-bold text-[10px] uppercase transition-colors"
                        title="Botu Sil"
                      >
                        Sil
                      </button>
                    </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Büyük Senaryo Giriş Alanı & AI Oto-Pilot */}
          <div className="lg:col-span-2 bg-gray-900 p-5 rounded-lg border border-gray-800 space-y-5">
            {/* AI OTO-PILOT AYARLARI */}
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-green-400">🤖 AI OTO-PILOT (SONSUZ SOHBET)</h3>
                <button
                  onClick={isAutopilotRunning ? stopAutopilot : startAutopilot}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider transition-colors ${
                    isAutopilotRunning ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-green-500 hover:bg-green-400 text-gray-950'
                  }`}
                >
                  {isAutopilotRunning ? '🛑 DURDUR' : '🚀 BAŞLAT'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Hugging Face Token</label>
                  <input
                    type="password"
                    value={hfToken}
                    onChange={(e) => setHfToken(e.target.value)}
                    placeholder="Inference API token girin"
                    className="w-full bg-gray-900 border border-gray-850 p-2 rounded text-white outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Mesaj Sıklığı (Saniye)</label>
                  <input
                    type="number"
                    value={delaySeconds}
                    onChange={(e) => handleDelayChange(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-850 p-2 rounded text-white outline-none focus:border-green-500 text-center"
                  />
                </div>
              </div>

              {/* ANLIK KONU DEĞİŞTİRİCİ (SABOTAJ) */}
              {isAutopilotRunning && (
                <div className="pt-2 border-t border-gray-800 space-y-2">
                  <label className="block text-xs font-bold text-yellow-500">🎯 Anlık Sohbet Emri (Sabotaj)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={autopilotTopic}
                      onChange={(e) => setAutopilotTopic(e.target.value)}
                      placeholder="Örn: Sağdaki 920.000 TL ödüllü Gamdom Kod Etkinliğini övün..."
                      className="flex-1 bg-gray-900 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-yellow-500"
                    />
                    <button
                      onClick={handleOverrideTopic}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-3 py-1.5 rounded text-xs tracking-wide transition-colors"
                    >
                      Konuyu Oraya Döndür
                    </button>
                  </div>
                  {overrideBanner && (
                    <div className="text-[10px] bg-green-950/40 border border-green-900/50 text-green-400 px-2 py-1 rounded w-max mt-1 font-semibold">
                      {overrideBanner}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MANUEL SENARYO ALANI */}
            <div className="space-y-4 pt-3 border-t border-gray-850">
              <h3 className="text-md font-bold text-gray-200">🎭 Hazır Sohbet Metni Senaryo Alanı</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Hedef Kanal</label>
                  <input type="text" value="Genel Sohbet (Global)" disabled className="w-full bg-gray-950 border border-gray-800 p-2.5 rounded-lg text-gray-400 text-sm outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Diyalog Geçmişi (Format: KullanıcıAdı: Mesaj)</label>
                <textarea value={scenarioText} onChange={(e) => handleScenarioChange(e.target.value)} placeholder="İrfan: Beyler Tayland Phuket'te hava efsane...&#10;KuponcuDayi: Biz de burada Temmuz sıcağında kupon kovalayalım [Gülerek]&#10;Kral_Analiz: Gamdom oranları açtı çökün beyler" className="w-full h-56 bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:border-green-500 outline-none font-mono leading-relaxed" disabled={isRunning || isAutopilotRunning} />
              </div>

              <button 
                onClick={isRunning ? handleStopSimulation : handleStartSimulation} 
                disabled={isAutopilotRunning || (!isRunning && !scenarioText.trim())} 
                className={`w-full py-3.5 rounded-lg font-black text-md tracking-wider transition-all shadow-lg ${isRunning ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-900/20' : 'bg-green-500 hover:bg-green-400 text-gray-950 shadow-green-900/10'}`}
              >
                {isRunning ? `⏹️ SİMÜLASYONU DURDUR (KALAN: ${remainingMessages} MESAJ)` : '🚀 SİMÜLASYONU BAŞLAT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DİĞER SEKMELER */}
      {activeSubTab === 'interactives' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-6">
            
            {/* ── YENİ ETKİNLİK PENCERESİ AYARLARI ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-md font-bold text-amber-400 flex items-center gap-2">🎫 YENİ ETKİNLİK PENCERESİ AYARLARI</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={eventShow} onChange={(e) => setEventShow(e.target.checked)} className="rounded border-gray-700 bg-gray-950 text-green-500 focus:ring-0" />
                  <span className="text-xs text-gray-300 font-bold uppercase">Göster</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Pencere Başlığı</label>
                  <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Yeni Etkinlik" className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Marka Adı</label>
                  <input type="text" value={eventBrand} onChange={(e) => setEventBrand(e.target.value)} placeholder="Gamdom" className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Etkinlik Açıklaması</label>
                  <input type="text" value={eventPromo} onChange={(e) => setEventPromo(e.target.value)} placeholder="Kod Etkinliği" className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Ödül Miktarı</label>
                  <input type="text" value={eventPrize} onChange={(e) => setEventPrize(e.target.value)} placeholder="920.000 TL" className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Buton Metni</label>
                  <input type="text" value={eventCtaText} onChange={(e) => setEventCtaText(e.target.value)} placeholder="Etkinliğe Katıl" className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Yönlendirme Linki (URL)</label>
                  <input type="text" value={eventCtaUrl} onChange={(e) => setEventCtaUrl(e.target.value)} placeholder="https://..." className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
              </div>
            </div>

            {/* ── SOHBET ANKETİ AYARLARI ── */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-md font-bold text-orange-400 flex items-center gap-2">📊 SOHBET ANKETİ AYARLARI</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pollIsActive} onChange={(e) => setPollIsActive(e.target.checked)} className="rounded border-gray-700 bg-gray-950 text-green-500 focus:ring-0" />
                  <span className="text-xs text-gray-300 font-bold uppercase">Aktif</span>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Anket Sorusu</label>
                  <input type="text" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="Bu akşam kim kazanır?" className="w-full bg-gray-950 border border-gray-850 p-2.5 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Seçenekler (Virgülle ayırarak yazın)</label>
                  <div className="flex gap-2">
                    <input type="text" value={pollOptionsStr} onChange={(e) => setPollOptionsStr(e.target.value)} placeholder="Galatasaray, Fenerbahçe, Beraberlik" className="flex-1 bg-gray-950 border border-gray-850 p-2.5 rounded text-xs text-white outline-none focus:border-green-500" />
                    <button onClick={handleResetPollVotes} className="bg-red-900/40 hover:bg-red-800 hover:text-white border border-red-700/30 text-red-400 px-3 py-2 rounded text-xs font-bold transition-all">
                      Oyları Sıfırla
                    </button>
                  </div>
                </div>
                {pollVotes.length > 0 && (
                  <div className="p-3 bg-gray-950 rounded-lg border border-gray-850 space-y-2">
                    <p className="text-xs font-black text-gray-300">📊 Güncel Oylama Sonuçları:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {pollOptionsStr.split(',').map((o, idx) => {
                        const optName = o.trim();
                        if (!optName) return null;
                        const votes = pollVotes[idx] || 0;
                        return (
                          <div key={idx} className="bg-gray-900 p-2 rounded border border-gray-800 text-center">
                            <p className="text-[10px] text-gray-400 font-bold truncate">{optName}</p>
                            <p className="text-sm font-black text-white mt-1">{votes} Oy</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── SABİTLENMİŞ MESAJ AYARLARI ── */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-md font-bold text-green-400 flex items-center gap-2">📌 SABİTLENMİŞ MESAJ AYARLARI</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pinIsActive} onChange={(e) => setPinIsActive(e.target.checked)} className="rounded border-gray-700 bg-gray-950 text-green-500 focus:ring-0" />
                  <span className="text-xs text-gray-300 font-bold uppercase">Aktif</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Sabitlenecek Mesaj</label>
                  <input type="text" value={pinText} onChange={(e) => setPinText(e.target.value)} placeholder="Tüm üyelere hoş geldiniz! Kodları kaçırmayın." className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Gönderen Adı</label>
                  <input type="text" value={pinUsername} onChange={(e) => setPinUsername(e.target.value)} className="w-full bg-gray-950 border border-gray-850 p-2 rounded text-xs text-white outline-none focus:border-green-500" />
                </div>
              </div>
            </div>

            {/* KAYDET BUTONU */}
            <button onClick={handleSaveInteractives} className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-black py-4 rounded-lg text-md tracking-wider transition-all shadow-lg shadow-green-900/10">
              💾 DEĞİŞİKLİKLERİ KAYDET VE UYGULA
            </button>

          </div>
        </div>
      )}

      {/* DİĞER SEKMELER */}
      {activeSubTab === 'overview' && (
        <div className="p-12 text-center text-gray-500 bg-gray-900 rounded-lg border border-gray-800">
          Sohbet yönetim merkezine hoş geldiniz. Kanallar ve Simülatör sekmelerini kullanarak sistemi anlık yönetebilirsiniz.
        </div>
      )}
      {activeSubTab === 'punish' && (
        <div className="p-12 text-center text-gray-500 bg-gray-900 rounded-lg border border-gray-800">Susturulan ve uzaklaştırılan kullanıcıların listesi burada yer alır.</div>
      )}
      {activeSubTab === 'logs' && (
        <div className="p-12 text-center text-gray-500 bg-gray-900 rounded-lg border border-gray-800">Tüm sohbet akışı ve admin temizlik logları canlı olarak buraya düşer.</div>
      )}
    </div>
  );
}
