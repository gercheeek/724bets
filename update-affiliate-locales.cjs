const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'pt-BR', 'es'];
const dir = path.join(__dirname, 'i18n', 'locales');

const newContent = {
  tr: {
    affiliate: {
      badge: "VIP Ortaklık Programı",
      hero_title_1: "Sektörün En Çok",
      hero_title_2: "Kazandıran",
      hero_title_3: "Ağı.",
      hero_desc_1: "%60'a varan",
      hero_desc_2: "ömür boyu komisyon fırsatı ile kendi işinizin patronu olun. Dünyanın en iyi dönüştüren platformuna oyuncu yönlendirin ve limitsiz kazanın.",
      invite_link: "Size Özel Davet Linkiniz",
      copied: "Kopyalandı",
      copy: "Kopyala",
      active_players: "Aktif Oyuncu",
      payment_methods: "Ödeme Yöntemi",
      languages: "Dil Seçeneği",
      promo_video: "Tanıtım Videosu",
      promo_video_desc: "Sistemin nasıl çalıştığını izleyin",
      last_earning: "Son Kazanç",
      advantages: "Ayrıcalıklı",
      advantages_highlight: "Avantajlar",
      advantages_desc: "Ortaklarımıza sektördeki en iyi şartları sağlıyoruz. Hemen katılın ve aradaki farkı kendiniz görün.",
      feature1_title: "Anında Ödemeler",
      feature1_desc: "Kazançlarınızı bekletmiyoruz. Bakiyenizi istediğiniz an hızlıca çekin.",
      feature2_title: "Ömür Boyu Komisyon",
      feature2_desc: "Aktif oyunculardan kesintisiz %60'a varan pay almaya devam edin.",
      feature3_title: "Özel Anlaşmalar",
      feature3_desc: "RevShare, CPA veya Hibrit modeller ile özelleştirilmiş kazanç yapıları.",
      feature4_title: "7/24 VIP Destek",
      feature4_desc: "Size özel Affiliate Manager ile anlık desteğe kesintisiz ulaşın.",
      cta_badge: "Limitleri Kaldırın",
      cta_title_1: "Kazanmaya Başlamaya",
      cta_title_2: "Hazır Mısınız?",
      cta_desc_1: "Sadece",
      cta_desc_2: "1 dakikada",
      cta_desc_3: "hesabınızı oluşturun, özel linkinizi alın ve sınırsız oyuncu getirerek hemen kazanmaya başlayın.",
      apply_now: "Hemen Başvur"
    }
  },
  en: {
    affiliate: {
      badge: "VIP Affiliate Program",
      hero_title_1: "Industry's Most",
      hero_title_2: "Profitable",
      hero_title_3: "Network.",
      hero_desc_1: "Up to 60%",
      hero_desc_2: "lifetime commission opportunity to be your own boss. Refer players to the world's best converting platform and earn limitlessly.",
      invite_link: "Your Private Invite Link",
      copied: "Copied",
      copy: "Copy",
      active_players: "Active Players",
      payment_methods: "Payment Methods",
      languages: "Languages",
      promo_video: "Promo Video",
      promo_video_desc: "Watch how the system works",
      last_earning: "Last Earning",
      advantages: "Exclusive",
      advantages_highlight: "Advantages",
      advantages_desc: "We provide the best conditions in the industry to our partners. Join now and see the difference.",
      feature1_title: "Instant Payments",
      feature1_desc: "We don't keep your earnings waiting. Withdraw your balance instantly anytime.",
      feature2_title: "Lifetime Commission",
      feature2_desc: "Continue to receive up to 60% uninterrupted share from active players.",
      feature3_title: "Custom Deals",
      feature3_desc: "Customized earning structures with RevShare, CPA, or Hybrid models.",
      feature4_title: "24/7 VIP Support",
      feature4_desc: "Get uninterrupted instant support with your dedicated Affiliate Manager.",
      cta_badge: "Remove Limits",
      cta_title_1: "Ready to Start",
      cta_title_2: "Earning?",
      cta_desc_1: "Create your account in just",
      cta_desc_2: "1 minute",
      cta_desc_3: ", get your special link and start earning immediately by bringing unlimited players.",
      apply_now: "Apply Now"
    }
  },
  'pt-BR': {
    affiliate: {
      badge: "Programa VIP de Afiliados",
      hero_title_1: "A Rede Mais",
      hero_title_2: "Lucrativa",
      hero_title_3: "da Indústria.",
      hero_desc_1: "Até 60%",
      hero_desc_2: "de comissão vitalícia para ser seu próprio chefe. Indique jogadores para a plataforma com melhor conversão do mundo e ganhe sem limites.",
      invite_link: "Seu Link de Convite Privado",
      copied: "Copiado",
      copy: "Copiar",
      active_players: "Jogadores Ativos",
      payment_methods: "Métodos de Pagamento",
      languages: "Idiomas",
      promo_video: "Vídeo Promocional",
      promo_video_desc: "Veja como o sistema funciona",
      last_earning: "Último Ganho",
      advantages: "Exclusivo",
      advantages_highlight: "Vantagens",
      advantages_desc: "Oferecemos as melhores condições do setor aos nossos parceiros. Participe agora e veja a diferença.",
      feature1_title: "Pagamentos Instantâneos",
      feature1_desc: "Não fazemos seus ganhos esperarem. Retire seu saldo instantaneamente a qualquer momento.",
      feature2_title: "Comissão Vitalícia",
      feature2_desc: "Continue a receber até 60% de participação ininterrupta de jogadores ativos.",
      feature3_title: "Ofertas Personalizadas",
      feature3_desc: "Estruturas de ganhos personalizadas com modelos RevShare, CPA ou Híbridos.",
      feature4_title: "Suporte VIP 24/7",
      feature4_desc: "Obtenha suporte instantâneo ininterrupto com seu Gerente de Afiliados dedicado.",
      cta_badge: "Remova os Limites",
      cta_title_1: "Pronto para Começar",
      cta_title_2: "a Ganhar?",
      cta_desc_1: "Crie sua conta em apenas",
      cta_desc_2: "1 minuto",
      cta_desc_3: ", obtenha seu link especial e comece a ganhar imediatamente trazendo jogadores ilimitados.",
      apply_now: "Inscreva-se Agora"
    }
  },
  es: {
    affiliate: {
      badge: "Programa VIP de Afiliados",
      hero_title_1: "La Red Más",
      hero_title_2: "Rentable",
      hero_title_3: "de la Industria.",
      hero_desc_1: "Hasta 60%",
      hero_desc_2: "de oportunidad de comisión de por vida para ser su propio jefe. Recomiende jugadores a la plataforma con mejor conversión del mundo y gane sin límites.",
      invite_link: "Tu Enlace de Invitación",
      copied: "Copiado",
      copy: "Copiar",
      active_players: "Jugadores Activos",
      payment_methods: "Métodos de Pago",
      languages: "Idiomas",
      promo_video: "Video Promocional",
      promo_video_desc: "Mira cómo funciona el sistema",
      last_earning: "Último Gancho",
      advantages: "Exclusivo",
      advantages_highlight: "Ventajas",
      advantages_desc: "Ofrecemos las mejores condiciones del sector a nuestros socios. Únete ahora y nota la diferencia.",
      feature1_title: "Pagos Instantáneos",
      feature1_desc: "No hacemos que sus ganancias esperen. Retire su saldo al instante en cualquier momento.",
      feature2_title: "Comisión de por Vida",
      feature2_desc: "Continúe recibiendo hasta el 60% de la participación ininterrumpida de los jugadores activos.",
      feature3_title: "Ofertas Personalizadas",
      feature3_desc: "Estructuras de ganancias personalizadas con modelos RevShare, CPA o Híbridos.",
      feature4_title: "Soporte VIP 24/7",
      feature4_desc: "Obtenga soporte instantáneo ininterrumpido con su Gerente de Afiliados dedicado.",
      cta_badge: "Eliminar Límites",
      cta_title_1: "¿Listo para Empezar",
      cta_title_2: "a Ganar?",
      cta_desc_1: "Crea tu cuenta en solo",
      cta_desc_2: "1 minuto",
      cta_desc_3: ", obtén tu enlace especial y comienza a ganar de inmediato trayendo jugadores ilimitados.",
      apply_now: "Aplica Ya"
    }
  }
};

for (const lang of locales) {
  const filePath = path.join(dir, `${lang}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {}
  
  data.affiliate = newContent[lang].affiliate;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("Affiliate locales updated.");
