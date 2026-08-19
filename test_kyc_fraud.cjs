require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTest() {
  console.log("🚀 KYC ve Fraud Testi Başlatılıyor...");
  
  // 1. Get a random user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("Kullanıcı bulunamadı. Lütfen önce kullanıcı oluşturun.");
    return;
  }
  
  console.log(`👤 Seçilen Kullanıcı: ${user.username} (ID: ${user.id})`);
  
  // 2. Upload Mock KYC Document
  console.log("\n📸 KYC Belgesi Yükleniyor...");
  const doc = await prisma.kycDocument.create({
    data: {
      userId: user.id,
      type: "id_front",
      fileUrl: "https://example.com/mock_id_front.jpg"
    }
  });
  
  await prisma.user.update({
    where: { id: user.id },
    data: { kycStatus: 'pending' }
  });
  
  let updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log(`✅ Belge Yüklendi! Belge ID: ${doc.id}`);
  console.log(`⏳ Kullanıcı KYC Durumu: ${updatedUser.kycStatus}`);
  
  // 3. Approve KYC Document
  console.log("\n✅ KYC Belgesi Onaylanıyor...");
  await prisma.kycDocument.update({
    where: { id: doc.id },
    data: { status: 'approved' }
  });
  
  await prisma.user.update({
    where: { id: user.id },
    data: { kycStatus: 'verified' }
  });
  
  updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log(`🎉 Kullanıcı KYC Durumu Güncellendi: ${updatedUser.kycStatus}`);
  
  // 4. Create Fraud Alert
  console.log("\n🚨 Fraud Alarmları Taranıyor (Mock)...");
  const alert = await prisma.fraudAlert.create({
    data: {
      userId: user.id,
      severity: "high",
      reason: "Riskli bahis deseni: Çoklu çapraz bahis (Arbitraj şüphesi)."
    }
  });
  
  await prisma.user.update({
    where: { id: user.id },
    data: { riskScore: { increment: 25 } }
  });
  
  updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log(`⚠️ Alarm Oluşturuldu! ID: ${alert.id}, Sebep: ${alert.reason}`);
  console.log(`📈 Yeni Risk Puanı: ${updatedUser.riskScore} / 100`);
  
  // 5. Resolve Fraud Alert
  console.log("\n🛡️ Alarm Çözümleniyor...");
  await prisma.fraudAlert.update({
    where: { id: alert.id },
    data: { isResolved: true, resolvedBy: "admin_1" }
  });
  console.log("✅ Alarm Başarıyla Kapatıldı!");

  console.log("\n🎉 TÜM TESTLER BAŞARIYLA TAMAMLANDI!");
  await prisma.$disconnect();
}

runTest().catch(console.error);
