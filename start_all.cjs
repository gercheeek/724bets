const { spawn } = require('child_process');

console.log('🚀 724Bets Tüm Sistem Servisleri Başlatılıyor...\n');

const services = [
  { name: 'Vite Frontend', cmd: 'npx', args: ['vite'] },
  { name: 'Proxy Server', cmd: 'node', args: ['server.js'] }
];

const children = [];

services.forEach(service => {
  const child = spawn(service.cmd, service.args, { stdio: 'inherit', shell: true });
  console.log(`✅ [${service.name}] Başlatıldı (PID: ${child.pid})`);
  children.push(child);
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
