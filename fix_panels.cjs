const fs = require('fs');
const file = '/Users/alex/Desktop/7_24bets-landing-page/components/sports/LiveMatchInline.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const newPanel = `                     {/* Toplam Panel */}
                     <div className="bg-[#1a1d24] rounded-lg border border-[#2c313c] p-4 flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-[#e2e8f0] font-bold text-[14px]">Toplam Goller</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                           <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Üstü</span>
                           <span className="text-center text-[#a0a5b5] text-[12px] font-bold">Altı</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                           {ouLines.length > 0 ? ouLines.slice(0, 10).map((line, idx) => (
                              <React.Fragment key={idx}>
                                 <button 
                                   onClick={() => addSelection({
                                      id: \`\${match.id}_ou_\${line?.id}_over\`,
                                      matchId: match.id,
                                      matchName: \`\${match.home} vs \${match.away}\`,
                                      selectionName: \`Toplam \${line?.base} Üst\`,
                                      odd: parseFloat(line?.over || '0')
                                   })}
                                   className={\`h-11 rounded-md transition-colors flex flex-row items-center justify-between px-3 md:px-4 \${betSlip.some(s => s.id === \`\${match.id}_ou_\${line?.id}_over\`) ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400' : 'bg-[#252a33] hover:bg-[#313641] text-white'}\`}
                                 >
                                   <span className="text-[#a0a5b5] font-semibold text-[13px] text-left">{line?.base}</span>
                                   <span className="font-bold text-[13px] tracking-wide ml-auto"><AnimatedOdd value={line?.over || '-'} /></span>
                                 </button>
                                 <button 
                                   onClick={() => addSelection({
                                      id: \`\${match.id}_ou_\${line?.id}_under\`,
                                      matchId: match.id,
                                      matchName: \`\${match.home} vs \${match.away}\`,
                                      selectionName: \`Toplam \${line?.base} Alt\`,
                                      odd: parseFloat(line?.under || '0')
                                   })}
                                   className={\`h-11 rounded-md transition-colors flex flex-row items-center justify-between px-3 md:px-4 \${betSlip.some(s => s.id === \`\${match.id}_ou_\${line?.id}_under\`) ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400' : 'bg-[#252a33] hover:bg-[#313641] text-white'}\`}
                                 >
                                   <span className="text-[#a0a5b5] font-semibold text-[13px] text-left">{line?.base}</span>
                                   <span className="font-bold text-[13px] tracking-wide ml-auto"><AnimatedOdd value={line?.under || '-'} /></span>
                                 </button>
                              </React.Fragment>
                           )) : (
                              <div className="col-span-2 text-center text-[#a0a5b5] text-[12px] py-4">Şu an için bahis seçeneği bulunmamaktadır.</div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            )}`;

const before = lines.slice(0, 589);
const after = lines.slice(797);
const result = before.join('\n') + '\n' + newPanel + '\n' + after.join('\n');

fs.writeFileSync(file, result);
console.log('Fixed panel structure!');
