const fs = require('fs');
const path = '/Users/alex/Desktop/7_24bets-landing-page/components/sports/LiveMatchInline.tsx';
let content = fs.readFileSync(path, 'utf8');

// The goal: 
// Move the Right Column (from `         {/* Right Column (Video / Animation Player) */}` to its end before `      </div>`)
// and insert it right after the Scoreboard (before `             {/* CATEGORY TABS (UNDERLINE GLOW) */}`).
// Also change the wrapper classes to make it full width.

const rightColStartStr = '         {/* Right Column (Video / Animation Player) */}';
const rightColStartIdx = content.indexOf(rightColStartStr);

// Find the end of the Right Column block. It's right before `      </div>\n    </div>\n  );\n});`
const rightColEndStr = '      </div>\n    </div>\n  );\n});';
const rightColEndIdx = content.indexOf(rightColEndStr);

if (rightColStartIdx === -1 || rightColEndIdx === -1) {
  console.log("Could not find right column bounds");
  process.exit(1);
}

// Extract the Right Column
const rightColContent = content.substring(rightColStartIdx, rightColEndIdx);
// The remaining content after removing right column
content = content.substring(0, rightColStartIdx) + content.substring(rightColEndIdx);

// Now find where to insert the Right Column. It should go right after the Scoreboard block.
// Scoreboard block ends right before `             {/* CATEGORY TABS (UNDERLINE GLOW) */}`
const tabsStartStr = '             {/* CATEGORY TABS (UNDERLINE GLOW) */}';
const tabsStartIdx = content.indexOf(tabsStartStr);

if (tabsStartIdx === -1) {
  console.log("Could not find tabs bounds");
  process.exit(1);
}

// But wait! We need to close the left column's flex-1 div, and then insert the right column, and then close the top row, and open the bottom row.
// Let's modify the wrappers.

// Current Left Column opening:
// `         {/* LEFT SIDE: MATCH INFO & SCOREBOARD */}`
// `         <div className="w-full xl:w-[60%] flex flex-col relative z-10 shrink-0">`
const leftColOpenOld = '<div className="w-full xl:w-[60%] flex flex-col relative z-10 shrink-0">';
const leftColOpenNew = '<div className="flex-1 flex flex-col relative z-10 min-w-0">';
content = content.replace(leftColOpenOld, leftColOpenNew);

// Current Main Grid opening:
// `      {/* Main Grid: Left (Score & Markets) + Right (Video) */}`
// `      <div className="flex flex-col xl:flex-row gap-4">`
const mainGridOld = '<div className="flex flex-col xl:flex-row gap-4">';
const mainGridNew = `<div className="flex flex-col gap-6 w-full">
         <div className="flex flex-col xl:flex-row gap-4 w-full">`;
content = content.replace(mainGridOld, mainGridNew);


// Insertion logic:
// We need to inject:
// `         </div>` (Close the new flex-1 scoreboard left side)
// `         {rightColContent}` (The right column)
// `         </div>` (Close the top row flex-row)
// `         <div className="flex flex-col w-full">` (Open the bottom row for tabs and markets)
// right before `tabsStartStr`

const injection = `         </div>
${rightColContent}         </div>
         
         {/* BOTTOM ROW: TABS & MARKETS */}
         <div className="flex flex-col w-full">
`;

// Also, the old left column was closed right before the old right column position.
// There was a `         </div>` before `         {/* Right Column`. We need to remove it, or rather, it's now closing the BOTTOM ROW. Which is actually perfect!
// Let's check the old left column closing:
// At the end of the markets:
// `1174:          </div>`
// `1175:`
// `1176:          {/* Right Column ...`
// So the `</div>` at 1174 was closing the left column. Now it will close the BOTTOM ROW. Which is exactly what we need!
// And the `mainGridOld` `</div>` will still close the `Main Grid`. Wait, we opened a new `flex-col gap-6` wrapper. So we need an extra `</div>` at the very end.
// `content` ends with:
// `      </div>` (Main grid close)
// `    </div>` (App wrapper close)
// `  );`
// `});`
// We added a new wrapper `div.flex-col.gap-6.w-full` around everything. The old `mainGridOld` `div` is now the top row `div`.
// Wait, no. `mainGridOld` was replaced by TWO divs: `wrapper` and `top row`.
// So we need to add one more `</div>` at the end to balance it.
const finalClosingOld = '      </div>\n    </div>\n  );\n});';
const finalClosingNew = '      </div>\n      </div>\n    </div>\n  );\n});';
content = content.replace(finalClosingOld, finalClosingNew);

// Now perform the insertion
const finalContent = content.substring(0, tabsStartIdx) + injection + content.substring(tabsStartIdx);

// We also should upgrade the grid for the markets from `grid-cols-1 lg:grid-cols-2` to `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` because they are full width now!
const updatedContent = finalContent.replace(/lg:grid-cols-2/g, 'lg:grid-cols-2 xl:grid-cols-3');

fs.writeFileSync(path, updatedContent);
console.log("Success");
