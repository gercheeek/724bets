const fs = require('fs');
const content = fs.readFileSync('socket_server.cjs', 'utf-8');
const modified = content.replace("io.emit('matches_update', formattedMatches);", "console.log(`Broadcasting ${formattedMatches.length} matches... (Live: ${Array.from(liveMatchesMap.values()).length}, Pre: ${Array.from(prematchMatchesMap.values()).length})`);\n    io.emit('matches_update', formattedMatches);");
fs.writeFileSync('socket_server.cjs', modified);
