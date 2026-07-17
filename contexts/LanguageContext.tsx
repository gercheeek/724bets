import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageCode = 'tr' | 'en' | 'es' | 'pt';

interface Translations {
  [key: string]: {
    [key in LanguageCode]: string;
  };
}

const translations: Translations = {
  login: {
    tr: 'Giriş Yap',
    en: 'Login',
    es: 'Acceso',
    pt: 'Entrar',
  },
  register: {
    tr: 'Kayıt Ol',
    en: 'Register',
    es: 'Registro',
    pt: 'Registrar',
  },
  search: {
    tr: 'Oyunları ara...',
    en: 'Search games...',
    es: 'Buscar juegos...',
    pt: 'Pesquisar jogos...',
  },
  casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  sports: {
    tr: 'Spor Bahisleri',
    en: 'Sports Betting',
    es: 'Apuestas Deportivas',
    pt: 'Apostas Esportivas',
  },
  visit_casino: {
    tr: 'Ziyaret et Casino',
    en: 'Visit Casino',
    es: 'Visitar Casino',
    pt: 'Visitar Cassino',
  },
  visit_sports: {
    tr: 'Ziyaret et Sports',
    en: 'Visit Sports',
    es: 'Visitar Deportes',
    pt: 'Visitar Esportes',
  },
  live_games: {
    tr: 'Canlı Oyunlar',
    en: 'Live Games',
    es: 'Juegos en Vivo',
    pt: 'Jogos ao Vivo',
  },
  popular_games: {
    tr: 'Popüler Oyunlar',
    en: 'Popular Games',
    es: 'Juegos Populares',
    pt: 'Jogos Populares',
  },
  popular_sports: {
    tr: 'Popüler Sporlar',
    en: 'Popular Sports',
    es: 'Deportes Populares',
    pt: 'Esportes Populares',
  },
  view_all: {
    tr: 'Hepsi',
    en: 'All',
    es: 'Todo',
    pt: 'Tudo',
  },
  players: {
    tr: 'Oyuncular',
    en: 'Players',
    es: 'Jugadores',
    pt: 'Jogadores',
  },
  menu_home: {
    tr: 'Ana Sayfa',
    en: 'Home',
    es: 'Inicio',
    pt: 'Início',
  },
  menu_casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  menu_sports: {
    tr: 'Sporlar',
    en: 'Sports',
    es: 'Deportes',
    pt: 'Esportes',
  },
  menu_betslip: {
    tr: 'Kuponum',
    en: 'Betslip',
    es: 'Boleto',
    pt: 'Boletim',
  },
  menu_profile: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
  },
  play_real_money: {
    tr: 'Gerçek Parayla Oyna',
    en: 'Play with Real Money',
    es: 'Jugar con Dinero Real',
    pt: 'Jogar com Dinheiro Real',
  },
  play_demo: {
    tr: 'Eğlencesine Oyna (Demo)',
    en: 'Play for Fun (Demo)',
    es: 'Jugar por Diversión (Demo)',
    pt: 'Jogar por Diversão (Demo)',
  },
  live_casino: {
    tr: 'Canlı Casino',
    en: 'Live Casino',
    es: 'Casino en Vivo',
    pt: 'Cassino ao Vivo',
  },
  promo_1_title: {
    tr: 'Büyük Ödüller',
    en: 'Big Rewards',
    es: 'Grandes Recompensas',
    pt: 'Grandes Recompensas'
  },
  promo_1_sub: {
    tr: 'Hoşgeldin Bonusu Seni Bekliyor',
    en: 'Welcome Bonus is Waiting',
    es: 'El Bono de Bienvenida te Espera',
    pt: 'O Bônus de Boas-Vindas te Espera'
  },
  hero_title_1: {
    tr: 'Saniyeler İçinde Yatır,',
    en: 'Deposit in Seconds,',
    es: 'Deposita en Segundos,',
    pt: 'Deposite em Segundos,'
  },
  hero_title_2: {
    tr: 'Dakikalar İçinde Çek.',
    en: 'Withdraw in Minutes.',
    es: 'Retira en Minutos.',
    pt: 'Retire em Minutos.'
  },
  hero_subtitle: {
    tr: 'Kesintisiz eğlence başladı.',
    en: 'Uninterrupted entertainment has begun.',
    es: 'El entretenimiento ininterrumpido ha comenzado.',
    pt: 'O entretenimento ininterrupto começou.'
  },
  register_alt: {
    tr: 'Veya diğer seçeneklerle kaydolun',
    en: 'Or sign up with other options',
    es: 'O regístrate con otras opciones',
    pt: 'Ou inscreva-se com outras opções'
  },
  newly_added: {
    tr: 'Yeni Eklenenler',
    en: 'Newly Added',
    es: 'Recién Agregados',
    pt: 'Adicionados Recentemente'
  },
  newly_added_2: {
    tr: 'Yeni Eklenenler 2',
    en: 'Newly Added 2',
    es: 'Recién Agregados 2',
    pt: 'Adicionados Recentemente 2'
  },
  winners_title: {
    tr: '7/24 Kazananlar',
    en: '24/7 Winners',
    es: 'Ganadores 24/7',
    pt: 'Vencedores 24/7'
  },
  promo_2_title: {
    tr: 'Güvenilir Sistem',
    en: 'Trusted System',
    es: 'Sistema Confiable',
    pt: 'Sistema Confiável'
  },
  promo_2_sub: {
    tr: 'Lisanslı Altyapı ile Güvendesiniz',
    en: 'Safe with Licensed Infrastructure',
    es: 'Seguro con Infraestructura Licenciada',
    pt: 'Seguro com Infraestrutura Licenciada'
  },
  promo_3_title: {
    tr: 'Canlı Destek',
    en: 'Live Support',
    es: 'Soporte en Vivo',
    pt: 'Suporte ao Vivo'
  },
  promo_3_sub: {
    tr: '7/24 Kesintisiz Hizmet',
    en: '24/7 Uninterrupted Service',
    es: 'Servicio 24/7 Ininterrumpido',
    pt: 'Serviço 24/7 Ininterrupto'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isAnimating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    if (lang === language) return;
    setIsAnimating(true);
    
    // Hold screen, change language, then release screen
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Wait for translation to apply
    }, 600); // Wait for transition fade-in
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
