const { spawn } = require('child_process');

console.log('🚀 724Bets Tüm Sistem Servisleri Başlatılıyor...\n');

const services = [
  { name: 'Vite Frontend', cmd: 'npx', args: ['vite', '--host'] },
  { name: 'Proxy Server', cmd: 'node', args: ['server.js'] }
];

const children = [];

console.log('🔄 İlk olarak maç öncesi (Prematch) veriler Atekbet üzerinden çekiliyor. Lütfen bekleyin (yaklaşık 10 sn)...');
const prematchProcess = spawn('node', ['fetch_atekbet_prematch.cjs'], { stdio: 'inherit', shell: true });

prematchProcess.on('close', (code) => {
    console.log(`✅ Prematch veri çekimi tamamlandı. (Çıkış kodu: ${code})`);
    console.log('🚀 Ana servisler (Vite & Proxy) başlatılıyor...');
    
    services.forEach(service => {
      const child = spawn(service.cmd, service.args, { stdio: 'inherit', shell: true });
      console.log(`✅ [${service.name}] Başlatıldı (PID: ${child.pid})`);
      children.push(child);
    });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Tüm servisler güvenle kapatılıyor...');
  children.forEach(child => child.kill('SIGINT'));
  process.exit();
});

process.on('SIGTERM', () => {
  children.forEach(child => child.kill('SIGTERM'));
  process.exit();
});
