const { spawn, execSync } = require('child_process');

console.log('🚀 724Bets Tüm Sistem Servisleri Başlatılıyor...\n');

try {
  console.log('🧹 Eski askıda kalan portlar ve önbellekler temizleniyor (Kesin Çözüm)...');
  execSync('lsof -ti :3002,4000 | xargs kill -9 2>/dev/null || true');
  execSync('pkill -9 esbuild 2>/dev/null || true');
  execSync('rm -rf node_modules/.vite 2>/dev/null || true');
} catch (e) {}


const services = [
  { name: 'Vite Frontend', cmd: 'npx', args: ['vite', '--host', '--port', '3002'] },
  { name: 'Proxy Server', cmd: 'node', args: ['server.js'] },
  { name: 'Chat Bot Service', cmd: 'node', args: ['chatBotService.js'] }
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
