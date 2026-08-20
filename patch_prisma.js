const fs = require('fs');
let code = fs.readFileSync('/opt/724bets-backend/socket_server.cjs', 'utf8');
code = code.replace(/require\(['"]@prisma\/client['"]\)/g, "require('./node_modules/.prisma/client/index.js')");
fs.writeFileSync('/opt/724bets-backend/socket_server.cjs', code);
console.log('Patched socket_server.cjs successfully!');
