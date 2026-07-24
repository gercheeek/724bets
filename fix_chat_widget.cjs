const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

// Replace orange chat button with neon green chat button
app = app.replace(
  /className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-\[0_0_20px_rgba\(245,166,35,0\.6\)\] hover:scale-110 hover:shadow-\[0_0_30px_rgba\(245,166,35,0\.8\)\] transition-all group"/g,
  'className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#00E676] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] border border-white/20 transition-all group"'
);

fs.writeFileSync('App.tsx', app);
console.log("Success");
