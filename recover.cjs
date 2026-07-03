const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('/Users/alex/.gemini/antigravity/brain/870381bb-bfbe-4579-a7ac-19628ffd1bd9/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'PLANNER_RESPONSE' && parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
            if (call.args && call.args.TargetFile && call.args.TargetFile.endsWith('App.tsx')) {
              console.log('--- Step', parsed.step_index, '---');
              if (call.args.ReplacementChunks) {
                for (const chunk of call.args.ReplacementChunks) {
                  console.log('REPLACEMENT:\n', chunk.ReplacementContent);
                }
              } else if (call.args.ReplacementContent) {
                console.log('REPLACEMENT:\n', call.args.ReplacementContent);
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

processLineByLine();
