const fs = require('fs');

let oldContent = fs.readFileSync('GercekView_old.tsx', 'utf8');
let newContent = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

const heroStart = oldContent.indexOf('<div className="mb-8">\\n        <SportsHeroBanner />');
const searchEnd = oldContent.indexOf('{/* ── MATCH CARDS GRID ── */}');

if (heroStart !== -1 && searchEnd !== -1) {
    const oldSections = oldContent.substring(heroStart, searchEnd);
    
    // In newContent, find where to insert. We should insert it right before {/* ── ÖNE ÇIKANLAR (FEATURED) ── */}
    const insertPoint = newContent.indexOf('{/* ── ÖNE ÇIKANLAR (FEATURED) ── */}');
    
    if (insertPoint !== -1) {
        newContent = newContent.slice(0, insertPoint) + oldSections + '\\n      ' + newContent.slice(insertPoint);
        fs.writeFileSync('components/sports/GercekView.tsx', newContent);
        console.log("Successfully restored old sections.");
    } else {
        console.log("Could not find insert point in new file.");
    }
} else {
    // Let's try without the exact whitespace for heroStart
    const searchString = '<SportsHeroBanner />';
    const heroIndex = oldContent.indexOf(searchString);
    if (heroIndex !== -1) {
       const blockStart = oldContent.lastIndexOf('<div className="mb-8">', heroIndex);
       if (blockStart !== -1 && searchEnd !== -1) {
           const oldSections = oldContent.substring(blockStart, searchEnd);
           const insertPoint = newContent.indexOf('{/* ── ÖNE ÇIKANLAR (FEATURED) ── */}');
           if (insertPoint !== -1) {
                newContent = newContent.slice(0, insertPoint) + oldSections + '\\n      ' + newContent.slice(insertPoint);
                fs.writeFileSync('components/sports/GercekView.tsx', newContent);
                console.log("Successfully restored old sections (fallback match).");
           }
       } else {
           console.log("Fallback failed");
       }
    } else {
        console.log("Could not find SportsHeroBanner in old file.");
    }
}
