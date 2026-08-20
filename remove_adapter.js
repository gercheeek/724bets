const fs = require('fs');
let code = fs.readFileSync('/opt/724bets-backend/socket_server.cjs', 'utf8');
code = code.replace(/const \{ PrismaBetterSqlite3 \} = require\('@prisma\/adapter-better-sqlite3'\);/g, "");
code = code.replace(/const adapter = new PrismaBetterSqlite3\(db\);/g, "");
code = code.replace(/const prisma = new PrismaClient\(\{ adapter \}\);/g, "const prisma = new PrismaClient();");
fs.writeFileSync('/opt/724bets-backend/socket_server.cjs', code);
console.log('Removed Prisma adapter from socket_server.cjs successfully!');
