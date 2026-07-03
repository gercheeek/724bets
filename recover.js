const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('/Users/alex/.gemini/antigravity/brain/870381bb-bfbe-4579-a7ac-19628ffd1bd9/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastAppTsxContent = null;

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'PLANNER_RESPONSE' && parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
            if (call.args && call.args.TargetFile && call.args.TargetFile.endsWith('App.tsx')) {
              console.log('Found an edit to App.tsx at step', parsed.step_index);
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
