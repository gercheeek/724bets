import re

file_path = '/opt/724bets-backend/socket_server.cjs'

with open(file_path, 'r') as f:
    content = f.read()

# Replace the incorrect time calculation logic
old_logic = """               const elapsedMins = Math.floor(match.SC.TS / 60);
               const period = match.SC.CP || 1;
               if (period === 1) return elapsedMins + "'";
               if (period === 2) return (45 + elapsedMins) + "'";
               if (period === 3) return (90 + elapsedMins) + "'";
               return elapsedMins + "'";"""

new_logic = """               const elapsedMins = Math.floor(match.SC.TS / 60);
               return elapsedMins + "'";"""

content = content.replace(old_logic, new_logic)

with open(file_path, 'w') as f:
    f.write(content)

