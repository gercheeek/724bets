const fs = require('fs');
const readline = require('readline');

async function extractData() {
  const fileStream = fs.createReadStream('/Users/alex/.gemini/antigravity/brain/61d2d081-90bc-479a-a419-4ee4c6177d3a/.system_generated/logs/transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let output = '';

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'USER_INPUT') {
        const content = parsed.content || '';
        if (content.includes('groupedMatchesData') || content.includes('matchesData') || content.includes('Durum Yönetimi')) {
          output += `\n// --- FROM USER INPUT ---\n${content}\n`;
        }
      }
    } catch (e) {
      console.error("Error parsing line", e);
    }
  }

  fs.writeFileSync('/Users/alex/Desktop/7_24bets-landing-page/extracted_matches_data.ts', output);
  console.log("Extracted matches data to extracted_matches_data.ts");
}

extractData();
