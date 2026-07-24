const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

// Replace the blue/cyan and purple ambient background blobs with neutral or remove them completely.
// Since the user explicitly hates the blue tone, let's remove them or make them very subtle neutral.
app = app.replace(/<div className="absolute top-\[-20%\] left-\[-10%\] w-\[50%\] h-\[50%\] bg-\[#00ffff\]\/\[0\.015\] blur-\[150px\] rounded-full"><\/div>/g, '');
app = app.replace(/<div className="absolute top-\[30%\] right-\[-10%\] w-\[40%\] h-\[60%\] bg-\[#880088\]\/\[0\.015\] blur-\[150px\] rounded-full"><\/div>/g, '');
app = app.replace(/<div className="absolute bottom-\[-20%\] left-\[20%\] w-\[60%\] h-\[40%\] bg-\[#00ff88\]\/\[0\.01\] blur-\[150px\] rounded-full"><\/div>/g, '');

fs.writeFileSync('App.tsx', app);
console.log("Ambient blue blobs removed.");
