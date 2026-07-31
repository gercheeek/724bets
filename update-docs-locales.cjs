const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    docs: {
      badge: "Yasal Bilgilendirme",
      title: "Kullanım Şartları",
      intro_1: "Platformumuzu kullanmadan önce lütfen şartları dikkatlice okuyunuz.",
      intro_transparency: "Şeffaflık",
      intro_security: "güvenlik",
      intro_fair_play: "adil oyun",
      intro_2: "ilkeleri en büyük önceliğimizdir.",
      rule1_title: "1. Genel Kurallar & Yasal Uygunluk",
      rule1_desc1_1: "Sitemiz yalnızca",
      rule1_desc1_18plus: "18 yaşından büyük",
      rule1_desc1_2: "ve yasal olarak bahis oynama ehliyetine sahip kullanıcılara hizmet vermektedir. Yasalara tam uygunluk, platformumuzun en tavizsiz kuralıdır. İşlemleriniz üst düzey teknolojiyle denetlenir.",
      rule1_desc2: "Platformumuz uluslararası eGaming lisans standartlarına (Curaçao 1668/JAZ) göre denetlenmektedir. Kayıt olan her kullanıcı, hesap doğrulaması (KYC) ve Kara Para Aklamayı Önleme (AML) prosedürlerini peşinen kabul eder. Haksız kazanç ve arbitraj durumlarında hesap inisiyatifi yönetime aittir.",
      rule2_title: "2. Güvenlik, Gizlilik & Şifreleme",
      rule2_desc1_1: "Verileriniz, şifreleriniz ve finansal işlemleriniz uçtan uca şifrelenmiş sunucularımızda (SSL) en üst düzey",
      rule2_desc1_bank: "banka standartlarındaki",
      rule2_desc1_2: "protokollerle saklanmaktadır. Bilgileriniz 7/24 korunur.",
      rule2_desc2: "Altyapımız tamamen bağımsız siber güvenlik firmaları tarafından düzenli olarak test edilmektedir. Kişisel verileriniz hiçbir üçüncü şahıs kurum, kuruluş veya devlet makamıyla paylaşılmaz. Ödeme işlemlerinizde kripto para ağları da dahil olmak üzere sadece güvenilir ödeme geçitleri kullanılır.",
      rule3_title: "3. Sorumlu Oyun & Oyuncu Sağlığı",
      rule3_desc1_1: "Bahis ve casino tamamen bir eğlence aracıdır, bir gelir kapısı olarak görülmemelidir. Kişisel bütçe limitlerinizi aşmayınız. İhtiyacınız olduğunda",
      rule3_desc1_support: "7/24 canlı destek",
      rule3_desc1_2: "yanınızdadır.",
      rule3_desc2: "Oyuncularımızın psikolojik ve finansal sağlığı bizim için kazançtan daha önemlidir. İstediğiniz zaman profilinizden günlük, haftalık ve aylık yatırım veya kayıp limitleri ayarlayabilirsiniz. Gerekli durumlarda 'Kendimi Dışla (Self-Exclusion)' seçeneği ile hesabınızı süreli dondurabilir veya kalıcı olarak sildirebilirsiniz."
    }
  },
  en: {
    docs: {
      badge: "Legal Information",
      title: "Terms of Use",
      intro_1: "Please read the terms carefully before using our platform.",
      intro_transparency: "Transparency",
      intro_security: "security",
      intro_fair_play: "fair play",
      intro_2: "are our top priorities.",
      rule1_title: "1. General Rules & Legal Compliance",
      rule1_desc1_1: "Our site serves only users",
      rule1_desc1_18plus: "over 18 years old",
      rule1_desc1_2: "who are legally capable of betting. Full compliance with the law is our most uncompromising rule. Your transactions are monitored with high-level technology.",
      rule1_desc2: "Our platform is audited according to international eGaming licensing standards (Curaçao 1668/JAZ). Every registered user agrees in advance to account verification (KYC) and Anti-Money Laundering (AML) procedures. In cases of unfair advantage and arbitrage, account initiative belongs to the management.",
      rule2_title: "2. Security, Privacy & Encryption",
      rule2_desc1_1: "Your data, passwords, and financial transactions are stored on our end-to-end encrypted servers (SSL) with the highest level",
      rule2_desc1_bank: "bank standard",
      rule2_desc1_2: "protocols. Your information is protected 24/7.",
      rule2_desc2: "Our infrastructure is regularly tested by fully independent cyber security firms. Your personal data is never shared with any third party institution, organization, or government authority. Only reliable payment gateways, including crypto networks, are used for your payment transactions.",
      rule3_title: "3. Responsible Gaming & Player Health",
      rule3_desc1_1: "Betting and casino is entirely an entertainment tool and should not be seen as a source of income. Do not exceed your personal budget limits. Whenever you need it,",
      rule3_desc1_support: "24/7 live support",
      rule3_desc1_2: "is at your side.",
      rule3_desc2: "The psychological and financial health of our players is more important to us than profit. You can set daily, weekly, and monthly deposit or loss limits from your profile at any time. When necessary, you can temporarily suspend or permanently delete your account with the 'Self-Exclusion' option."
    }
  },
  'pt-BR': {
    docs: {
      badge: "Informação Legal",
      title: "Termos de Uso",
      intro_1: "Por favor, leia os termos cuidadosamente antes de usar nossa plataforma.",
      intro_transparency: "Transparência",
      intro_security: "segurança",
      intro_fair_play: "jogo justo",
      intro_2: "são nossas principais prioridades.",
      rule1_title: "1. Regras Gerais e Conformidade Legal",
      rule1_desc1_1: "Nosso site atende apenas usuários",
      rule1_desc1_18plus: "maiores de 18 anos",
      rule1_desc1_2: "que são legalmente capazes de apostar. Conformidade total com a lei é nossa regra mais rigorosa. Suas transações são monitoradas com tecnologia de alto nível.",
      rule1_desc2: "Nossa plataforma é auditada de acordo com os padrões internacionais de licenciamento de eGaming (Curaçao 1668/JAZ). Todo usuário registrado concorda antecipadamente com os procedimentos de verificação de conta (KYC) e Prevenção à Lavagem de Dinheiro (AML). Em casos de vantagem injusta e arbitragem, a iniciativa da conta pertence à administração.",
      rule2_title: "2. Segurança, Privacidade e Criptografia",
      rule2_desc1_1: "Seus dados, senhas e transações financeiras são armazenados em nossos servidores criptografados de ponta a ponta (SSL) com protocolos do",
      rule2_desc1_bank: "mais alto padrão bancário",
      rule2_desc1_2: ". Suas informações estão protegidas 24/7.",
      rule2_desc2: "Nossa infraestrutura é regularmente testada por empresas de segurança cibernética independentes. Seus dados pessoais nunca são compartilhados com nenhuma instituição, organização ou autoridade governamental de terceiros. Apenas gateways de pagamento confiáveis, incluindo redes criptográficas, são usados para suas transações financeiras.",
      rule3_title: "3. Jogo Responsável e Saúde do Jogador",
      rule3_desc1_1: "Apostas e cassino são uma ferramenta de entretenimento e não devem ser vistos como fonte de renda. Não exceda seus limites de orçamento pessoal. Sempre que precisar,",
      rule3_desc1_support: "o suporte ao vivo 24/7",
      rule3_desc1_2: "está ao seu lado.",
      rule3_desc2: "A saúde psicológica e financeira de nossos jogadores é mais importante para nós do que o lucro. Você pode definir limites diários, semanais e mensais de depósito ou perda no seu perfil a qualquer momento. Se necessário, você pode suspender temporariamente ou excluir permanentemente sua conta com a opção 'Autoexclusão'."
    }
  },
  es: {
    docs: {
      badge: "Información Legal",
      title: "Condiciones de Uso",
      intro_1: "Por favor lea los términos cuidadosamente antes de usar nuestra plataforma.",
      intro_transparency: "Transparencia",
      intro_security: "seguridad",
      intro_fair_play: "juego limpio",
      intro_2: "son nuestras prioridades.",
      rule1_title: "1. Reglas Generales y Cumplimiento Legal",
      rule1_desc1_1: "Nuestro sitio atiende solo a usuarios",
      rule1_desc1_18plus: "mayores de 18 años",
      rule1_desc1_2: "que sean legalmente capaces de apostar. El cumplimiento total de la ley es nuestra regla más estricta. Sus transacciones se supervisan con tecnología de alto nivel.",
      rule1_desc2: "Nuestra plataforma es auditada según las normas internacionales de licencias de eGaming (Curaçao 1668/JAZ). Todo usuario registrado acepta de antemano los procedimientos de verificación de cuentas (KYC) y la Prevención del Blanqueo de Capitales (AML). En casos de ventaja injusta y arbitraje, la iniciativa de la cuenta pertenece a la gerencia.",
      rule2_title: "2. Seguridad, Privacidad y Cifrado",
      rule2_desc1_1: "Sus datos, contraseñas y transacciones financieras se almacenan en nuestros servidores encriptados de extremo a extremo (SSL) con protocolos del",
      rule2_desc1_bank: "más alto nivel bancario",
      rule2_desc1_2: ". Su información está protegida 24/7.",
      rule2_desc2: "Nuestra infraestructura se prueba regularmente por empresas independientes de ciberseguridad. Sus datos personales nunca se comparten con terceros (institución, organización o autoridad gubernamental). Para sus transacciones de pago, solo se utilizan pasarelas confiables, incluidas las redes de criptomonedas.",
      rule3_title: "3. Juego Responsable y Salud del Jugador",
      rule3_desc1_1: "Las apuestas y los casinos son herramientas de entretenimiento y no deben verse como una fuente de ingresos. No exceda su presupuesto personal. Siempre que lo necesite,",
      rule3_desc1_support: "soporte en vivo 24/7",
      rule3_desc1_2: "está a su lado.",
      rule3_desc2: "La salud psicológica y financiera de nuestros jugadores es más importante para nosotros que las ganancias. Puede establecer límites diarios, semanales o mensuales de depósito o pérdida en su perfil en cualquier momento. Si es necesario, puede suspender temporalmente o eliminar permanentemente su cuenta con la opción de 'Autoexclusión'."
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.docs = { ...(data.docs || {}), ...translations[lang].docs };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
