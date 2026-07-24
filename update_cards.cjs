const fs = require('fs');

let content = fs.readFileSync('components/RewardsPage.tsx', 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">[\s\S]*?<\/section>/;

const replacement = `<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Card 1 */}
            <div className="h-[280px] rounded-[1.5rem] bg-[#050505] group transition-all duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-3 hover:border-[#10b981]/50 cursor-pointer relative overflow-hidden group/card border border-white/10">
               {/* Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/images/ai-generated/how_join.jpg" alt="Üye Olun" className="w-full h-full object-cover transform group-hover/card:scale-[1.08] transition-transform duration-700 ease-out opacity-40 group-hover/card:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
               </div>
               
               <div className="p-6 flex flex-col items-center justify-end pb-8 text-center gap-3 h-full relative z-10">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover/card:text-[#10b981] transition-colors drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Üye Olun</h3>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">İster acemi olun ister tecrübeli bir profesyonel, ödüllerinizi yükseltmek için sadece bir tık uzaktasınız.</p>
               </div>
            </div>

            {/* Card 2 */}
            <div className="h-[280px] rounded-[1.5rem] bg-[#050505] group transition-all duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-3 hover:border-[#10b981]/50 cursor-pointer relative overflow-hidden group/card border border-white/10 mt-0 md:mt-8">
               {/* Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/images/ai-generated/how_play.jpg" alt="Oynayın ve Kazanın" className="w-full h-full object-cover transform group-hover/card:scale-[1.08] transition-transform duration-700 ease-out opacity-40 group-hover/card:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
               </div>
               
               <div className="p-6 flex flex-col items-center justify-end pb-8 text-center gap-3 h-full relative z-10">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover/card:text-[#10b981] transition-colors drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Oynayın ve Kazanın</h3>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Yaptığınız her bahis, kazansanız da kaybetseniz de size anında puan ve tecrübe kazandırır.</p>
               </div>
            </div>

            {/* Card 3 */}
            <div className="h-[280px] rounded-[1.5rem] bg-[#050505] group transition-all duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-3 hover:border-[#10b981]/50 cursor-pointer relative overflow-hidden group/card border border-white/10 mt-0 md:mt-16">
               {/* Background Image */}
               <div className="absolute inset-0 z-0">
                  <img src="/images/ai-generated/how_reward.jpg" alt="Ödülleri Alın" className="w-full h-full object-cover transform group-hover/card:scale-[1.08] transition-transform duration-700 ease-out opacity-40 group-hover/card:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
               </div>
               
               <div className="p-6 flex flex-col items-center justify-end pb-8 text-center gap-3 h-full relative z-10">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover/card:text-[#10b981] transition-colors drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Ödülleri Alın</h3>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">Puan toplayın ve ücretsiz bahisler, VIP ayrıcalıklar ve efsanevi bonusların kilidini açın.</p>
               </div>
            </div>
          </div>
        </section>`;

content = content.replace(regex, replacement);
fs.writeFileSync('components/RewardsPage.tsx', content);
console.log('Cards updated.');
