const fs = require('fs');
let conf = fs.readFileSync('/etc/nginx/sites-available/default', 'utf8');

// If already patched, skip
if (!conf.includes('location /socket.io/')) {
    const block = `
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
`;
    conf = conf.replace('location / {', block + '    location / {');
    fs.writeFileSync('/etc/nginx/sites-available/default', conf);
}

// Remove any .rej files in sites-enabled
const files = fs.readdirSync('/etc/nginx/sites-enabled/');
for (const file of files) {
    if (file.endsWith('.rej')) {
        fs.unlinkSync('/etc/nginx/sites-enabled/' + file);
    }
}
