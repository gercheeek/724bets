// ─── Trusted Sites Engine ────────────────────────────────────────────────────
// Handles: comment drip scheduling, auto-reply generation, and data seeding.
// All storage via localStorage (site_trusted_companies, site_trusted_comments).
// This is called from App.tsx on mount and via a 60-second setInterval.

import { TrustedCompany, CompanyComment, CompanyReply } from '../types';
import { TRUSTED_COMPANIES_SEED } from '../constants';

const COMPANIES_KEY = 'site_trusted_companies';
const COMMENTS_KEY = 'site_trusted_comments';

// ── Storage helpers ────────────────────────────────────────────────────────────

export function loadTrustedCompanies(): TrustedCompany[] {
  try {
    const raw = localStorage.getItem(COMPANIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTrustedCompanies(companies: TrustedCompany[]): void {
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
}

export function loadTrustedComments(): CompanyComment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTrustedComments(comments: CompanyComment[]): void {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

// ── Comment template pools ─────────────────────────────────────────────────────

const POSITIVE_COMMENTS = [
  { text: "Çekim talebimi 15 dakikada hesabıma geçirdiler. Bu kadar hızlı ödeme yapan başka site görmedim!", rating: 5 },
  { text: "Müşteri hizmetleri gerçekten 7/24 aktif. Gece 3'te yazdım, 2 dakika içinde yanıt aldım. Teşekkürler!", rating: 5 },
  { text: "Hoşgeldin bonusu çevrim şartları diğer sitelere kıyasla çok makul. Kesinlikle tavsiye ederim.", rating: 5 },
  { text: "Yıllardır bahis oynuyorum, bu site şimdiye kadar en güvenilir gördüğüm platform. Para işlemleri kusursuz.", rating: 5 },
  { text: "Canlı bahis seçenekleri inanılmaz geniş. Her maçta 500+ market sunuluyor, rekabetçi oranlar da cabası.", rating: 5 },
  { text: "Kripto ile yatırım yapıyorum, 5 dakikada onaylanıyor. Çekim de aynı şekilde süper hızlı.", rating: 5 },
  { text: "Lisanslı site olması benim için en önemli kriter. Gönül rahatlığıyla oyun oynayabiliyorum.", rating: 5 },
  { text: "Mobil uygulama akıcı çalışıyor, hiçbir takılma yaşamadım. Arayüz de çok temiz ve kullanışlı.", rating: 5 },
  { text: "3 yıldır bu sitedeyim, hiç sorun yaşamadım. Arkadaşlarıma da tavsiye ediyorum.", rating: 5 },
  { text: "Slot oyunları çeşidi muazzam. Pragmatic, NetEnt, Evolution… hepsi burada. Ayrıca RTP oranları şeffaf.", rating: 5 },
  { text: "VIP programı gerçekten değerli. Cashback'ler ve özel bonuslar düzenli olarak geliyor.", rating: 5 },
  { text: "İlk yatırımımda bonus anında hesabıma yüklendi. Bekleme süreci olmadı, çok memnun kaldım.", rating: 5 },
  { text: "Hesap doğrulama süreci biraz uzun ama bir kez tamamlayınca çekim çok hızlı oluyor. Değer!", rating: 4 },
  { text: "Canlı casino bölümü özellikle güçlü. Blackjack ve rulet masaları gerçekten kaliteli dealer'larla.", rating: 5 },
  { text: "Papara ile yatırım mükemmel çalışıyor. Komisyon yok, anında yansıyor. 10/10 öneririm.", rating: 5 },
  { text: "Turnuvalar ve etkinlikler sürekli güncel. Her hafta yeni bir şey var, site hiç sıkıcı değil.", rating: 5 },
  { text: "Şikayet ettim, aynı gün geri döndüler ve sorunu çözdüler. Bu seviyede destek gerçekten nadir.", rating: 5 },
  { text: "Oranlar piyasanın en yükseğinde. Diğer sitelerde 1.85 gördüğüm maçı burada 1.92'den oynuyorum.", rating: 5 },
  { text: "Kayıp iadesi gerçekten hesabıma yansıdı! Boş vaatler değil, gerçek bir platform bu.", rating: 5 },
  { text: "Freespin'ler çok cömert. Haftalık promosyonlarda sürekli ekstra döndürme hakkı kazanıyorum.", rating: 5 },
  { text: "Futbol dışında basketbol ve tenis için de güçlü bahis seçenekleri var. Çok yönlü bir platform.", rating: 4 },
  { text: "Güvenlik konusunda şüphelerim vardı ama SSL sertifikası ve lisans belgelerini görünce rahatladım.", rating: 4 },
  { text: "İki faktörlü doğrulama var, hesap güvenliği çok iyi. Başka sitelerden farklı olarak gerçekten önem veriyorlar.", rating: 5 },
  { text: "Yatırım limitleri esnek, küçük miktarlarla başlayabiliyorsun. Yeni başlayanlar için ideal.", rating: 4 },
  { text: "Bahis geçmişim ve istatistiklerim detaylı gösteriliyor. Kendi performansımı analiz edebildiğim için çok faydalı.", rating: 5 },
  { text: "Çekim onayı beklediğimden çok hızlı geldi. Sabah talep ettim, öğleden önce param geldi.", rating: 5 },
  { text: "Spor bahislerinde naklen yayın var! Maçı izleyerek bahis oynamak çok keyifli.", rating: 5 },
  { text: "Promosyon şartlarını gizlice değiştirmiyorlar. Her şey şeffaf ve anlaşılır yazılı.", rating: 4 },
  { text: "Arkadaş davet et sistemi çok iyi çalışıyor. Davet ettiğim kişilerden güzel kazanımlar elde ettim.", rating: 5 },
  { text: "Bütçe yönetim araçları var, kendi limitlerimi belirleyebiliyorum. Sorumlu bahis anlayışı takdire şayan.", rating: 5 },
  { text: "Para çekme limitim yüksek ve sorunsuz işledi. Büyük kazançlarda da sorun çıkarmıyorlar.", rating: 5 },
  { text: "Canlı skor ve istatistikler entegre, bahis yaparken aynı anda analiz yapabiliyorum.", rating: 5 },
  { text: "Hesabım çalınmış gibi hissettim, destek hattı 1 saat içinde konuyu çözüp hesabı kurtardı. Güvenilir!", rating: 5 },
  { text: "Bahis kuponlarımı paylaşabildiğim sosyal özellik çok hoş. Topluluk hissi veriyor.", rating: 4 },
  { text: "Yıllık sadakat puanlarım bonus olarak geri döndü. Bu tür detaylar siteyi özel kılıyor.", rating: 5 },
];

const NEUTRAL_COMMENTS = [
  { text: "Genel olarak memnunum. Çekim süreleri bazen 1-2 gün sürebiliyor ama bu sektörde normal sayılır.", rating: 3 },
  { text: "Site yeni başlayanlar için biraz karmaşık gelebilir ama alıştıktan sonra her şey yerli yerine oturuyor.", rating: 3 },
  { text: "Bonus çevrim şartları standart, ne çok iyi ne çok kötü. Dengeli bir platform diyebilirim.", rating: 3 },
  { text: "Müşteri hizmetleri çoğu zaman hızlı ama yoğun saatlerde bekleme süresi uzayabiliyor.", rating: 3 },
  { text: "Güvenilir bir site olduğu kesin. Bazı küçük iyileştirmeler yapılabilir ama kullanılabilir.", rating: 3 },
  { text: "Oyun seçeneği bol, ama bazı sağlayıcılar eksik. Yine de büyük çoğunluğu burada var.", rating: 4 },
  { text: "Mobil versiyonu biraz daha optimize edilebilir, ama masaüstünde sorunsuz çalışıyor.", rating: 3 },
  { text: "Haftalık bonuslar düzenli geliyor, ama miktarlar artırılabilir. Yine de sıfırdan iyidir.", rating: 3 },
  { text: "Genel deneyimim pozitif. Birkaç teknik iyileştirmeyle çok daha iyi olacak.", rating: 4 },
  { text: "Güvenilirlik açısından sorun yok. Arayüz biraz daha modern olabilirdi ama işlevsellik tam.", rating: 3 },
];

const CRITICAL_COMMENTS = [
  { text: "Çekim sürecim beklenenden uzun sürdü, ama destek hattı bilgilendirdi ve sonunda çözüldü. Biraz sabır gerekiyor.", rating: 3 },
  { text: "Belge doğrulama süreci çok uzun benim için. Anlıyorum, güvenlik için gerekli, ama hızlandırılabilir.", rating: 2 },
  { text: "Bonus çevrim şartlarını başlangıçta tam okumadım, biraz karmaşıktı. Daha açık yazılabilir.", rating: 3 },
  { text: "Bir maçın oranları aniden değişti, tam bahis yaparken güncellendi. Çok sinir bozucu oldu.", rating: 2 },
  { text: "Canlı destek bazen çok meşgul görünüyor. Belki daha fazla temsilci eklense daha iyi olur.", rating: 3 },
  { text: "Mobil uygulamanın bazı bölümleri yavaş açılabiliyor. Genel olarak iyi ama optimize edilmeli.", rating: 3 },
  { text: "İlk çekim talebimde ek belge istediler, bu biraz zaman aldı. Ancak sonuçta sorun çözüldü.", rating: 3 },
  { text: "Promosyon mektubunun şartları biraz yanıltıcı hissettirdi. İleride daha net ifadeler kullansalar iyi olur.", rating: 2 },
];

// ── Reply template pools ───────────────────────────────────────────────────────

const POSITIVE_REPLIES = [
  "Değerli üyemiz, güzel yorumunuz için çok teşekkür ederiz! 🙏 Sizi mutlu etmek bizim en büyük motivasyonumuz. İyi oyunlar!",
  "Memnuniyetinizi paylaştığınız için minnettarız! Sizin gibi değerli üyelerimiz için en iyi hizmeti sunmaya devam edeceğiz. 🎯",
  "Harika bir deneyim yaşadığınızı öğrenmek bizi çok mutlu etti! Ekibimizin tüm özeni sizin gibi üyelerimiz için. ⭐",
  "Teşekkürler! 7/24 destek ekibimiz her zaman yanınızda olmaya devam edecek. Başarılar dileriz! 🏆",
  "Bu güzel geri bildiriminiz için teşekkür ederiz. Kaliteli hizmet sunmak her zaman önceliğimizdir. 💎",
  "Sizi memnun ettiğimiz için mutluyuz! Güvenilir ve şeffaf platformumuzda iyi eğlenceler. 🚀",
  "Paylaşımınız için teşekkürler! VIP programımızdan daha fazla yararlanmak için destek ekibimizle iletişime geçebilirsiniz. 👑",
];

const CRITICAL_REPLIES = [
  "Değerli üyemiz, yaşadığınız deneyim için özür dileriz. Söz konusu durumu incelemek üzere ekibimize aktardık. Lütfen destek hattımızdan bizimle iletişime geçin, çözüm üretmekten mutluluk duyarız. 🙏",
  "Üzücü deneyiminizi paylaştığınız için teşekkür ederiz. Süreçlerimizi sürekli iyileştirmeye çalışıyoruz ve bu geri bildiriminiz çok değerli. Destek ekibimiz konuyu inceleyecektir.",
  "Geri bildiriminiz için teşekkür ederiz. Belirttiğiniz konuyu teknik ekibimize ilettik. Yaşadığınız rahatsızlık için özür dileriz ve en kısa sürede çözüme kavuşturacağız.",
  "Değerli üyemiz, bu konuyu çok ciddiye alıyoruz. Müşteri deneyimini iyileştirmek için sürekli çalışıyoruz. Lütfen destek@[firma].com adresimize yazın, sorununuzu öncelikli olarak ele alacağız.",
  "Paylaşımınız için teşekkür ederiz. Doğrulama sürecimiz güvenliğiniz için zorunlu olmakla birlikte, deneyimi daha akıcı hale getirmek için çalışmalarımız devam etmektedir. Anlayışınız için teşekkürler.",
  "Yaşadığınız durumdan dolayı üzgünüz. Ekibimiz bu konuyu detaylı inceleyecek ve gerekli iyileştirmeleri yapacaktır. Geri bildiriminiz için minnettarız. 🙏",
];

const NEUTRAL_REPLIES = [
  "Değerli üyemiz, görüşlerinizi paylaştığınız için teşekkür ederiz. Belirttiğiniz konularda çalışmalarımız sürmektedir. İyi oyunlar! 🎯",
  "Geri bildiriminiz için teşekkürler! Platformumuzu daha da geliştirmek için çalışmaya devam ediyoruz. Herhangi bir konuda destek ekibimiz size yardımcı olmaktan mutluluk duyar.",
  "Yorumunuz için teşekkür ederiz. Daha iyi bir deneyim sunmak için önerilerinizi dikkate alıyoruz. 💪",
];

// ── Core generators ────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const AVATARS = ['😊', '🎯', '⚽', '🏆', '💰', '🎰', '🔥', '⭐', '👑', '🚀', '🎲', '💎', '🃏', '🎽', '🏅'];
const NAMES = [
  'Mehmet_K', 'AliB_34', 'Kerem_T', 'Emre_S', 'Murat_Y', 'Hasan_D', 'Onur_A', 'Berk_G',
  'Selim_V', 'Tarik_C', 'Fatih_O', 'Koray_M', 'Enes_R', 'Volkan_P', 'Caner_H', 'Serhat_N',
  'Ilker_B', 'Umut_F', 'Atilla_Z', 'Burak_Q', 'Haluk_W', 'Oguz_X', 'Levent_L', 'Ferhat_U',
  'Deniz_J', 'Yusuf_I', 'Ibrahim_E', 'Kadir_S', 'Sinan_T', 'Adem_K',
];

export function generateComment(companyId: string, sentiment: 'positive' | 'neutral' | 'critical'): CompanyComment {
  const pool = sentiment === 'positive' ? POSITIVE_COMMENTS : sentiment === 'neutral' ? NEUTRAL_COMMENTS : CRITICAL_COMMENTS;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const now = Date.now();

  // Critical comments get a reply scheduled 2–6 hours later
  // Neutral: 12–24 hours later
  // Positive: 24–48 hours later (lower urgency)
  // Trigger a reply between 2 to 6 hours for all comments
  const replyDelayMs = (2 + Math.random() * 4) * 3600 * 1000;

  const replyPool = sentiment === 'critical' ? CRITICAL_REPLIES : sentiment === 'neutral' ? NEUTRAL_REPLIES : POSITIVE_REPLIES;
  const replyText = replyPool[Math.floor(Math.random() * replyPool.length)];

  return {
    id: generateId(),
    companyId,
    authorName: NAMES[Math.floor(Math.random() * NAMES.length)],
    authorAvatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    content: template.text,
    sentiment,
    rating: template.rating,
    isSimulated: true,
    isVisible: true,
    createdAt: now - Math.floor(Math.random() * 12 * 3600 * 1000), // 0–12h ago jitter
    reply: {
      content: replyText,
      replyAt: now + replyDelayMs,
      isVisible: false,
      authorTitle: 'Firma Yetkilisi',
    },
  };
}

// Generate 2–3 seed comments spread over the past few days
function generateSeedComments(companyId: string): CompanyComment[] {
  const sentiments: ('positive' | 'neutral' | 'critical')[] = ['positive', 'positive', 'neutral'];
  const daysAgo = [3, 5, 7]; // spread over past week
  const comments: CompanyComment[] = [];

  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
  for (let i = 0; i < count; i++) {
    const sentiment = sentiments[i] || 'positive';
    const comment = generateComment(companyId, sentiment);
    // Override timing: make seed comments appear days ago, replies already visible
    const daysMs = (daysAgo[i] || 3 + i) * 24 * 3600 * 1000;
    comment.createdAt = Date.now() - daysMs - Math.floor(Math.random() * 6 * 3600 * 1000);
    if (comment.reply) {
      comment.reply.replyAt = comment.createdAt + 4 * 3600 * 1000;
      comment.reply.isVisible = true; // seed replies are already visible
    }
    comments.push(comment);
  }
  return comments;
}

// ── Drip Logic ─────────────────────────────────────────────────────────────────

export function processDripComments(): boolean {
  const companies = loadTrustedCompanies();
  const comments = loadTrustedComments();
  const now = Date.now();
  let changed = false;

  const updatedCompanies = companies.map(company => {
    if (!company.commentDripEnabled || !company.isActive) return company;
    if (now < company.nextCommentAt) return company;

    // Time to drip! Post 1 (occasionally 2) comments
    const count = Math.random() < 0.2 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      // Sentiment distribution: 80% positive, 20% critical
      const r = Math.random();
      const sentiment: 'positive' | 'critical' = r < 0.20 ? 'critical' : 'positive';
      comments.push(generateComment(company.id, sentiment));
    }

    // Schedule next drip: 20–26 hours from now
    const nextAt = now + (20 + Math.random() * 6) * 3600 * 1000;
    changed = true;
    return { ...company, nextCommentAt: nextAt };
  });

  if (changed) {
    saveTrustedCompanies(updatedCompanies);
    saveTrustedComments(comments);
  }
  return changed;
}

// ── Auto-Reply Logic ───────────────────────────────────────────────────────────

export function processAutoReplies(): boolean {
  const comments = loadTrustedComments();
  const now = Date.now();
  let changed = false;

  const updatedComments = comments.map(comment => {
    if (!comment.reply || comment.reply.isVisible) return comment;
    if (now >= comment.reply.replyAt) {
      changed = true;
      return { ...comment, reply: { ...comment.reply, isVisible: true } };
    }
    return comment;
  });

  if (changed) saveTrustedComments(updatedComments);
  return changed;
}

// ── Seeder ─────────────────────────────────────────────────────────────────────

export function seedTrustedData(): void {
  const existing = loadTrustedCompanies();
  if (existing.length > 0) {
    // Already seeded — just ensure drip schedules exist
    return;
  }

  const now = Date.now();
  const companies: TrustedCompany[] = TRUSTED_COMPANIES_SEED.map((company, index) => ({
    ...company,
    nextCommentAt: now + (index * 3.5 + Math.random() * 4) * 3600 * 1000, // stagger initial drips
    createdAt: now,
    lastUpdated: now,
  }));

  saveTrustedCompanies(companies);

  // Generate seed comments for each company
  const allComments: CompanyComment[] = [];
  companies.forEach(company => {
    allComments.push(...generateSeedComments(company.id));
  });
  saveTrustedComments(allComments);
}

// ── Main Entry ─────────────────────────────────────────────────────────────────

export function initTrustedEngine(): void {
  seedTrustedData();
  processDripComments();
  processAutoReplies();
}
