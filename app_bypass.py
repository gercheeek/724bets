import re

file_path = '/Users/alex/Desktop/7_24bets-landing-page/App.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Add state variable: const [maintenanceBypass, setMaintenanceBypass] = useState(false);
# Find a good place, for example after `const [isChatOpen, setIsChatOpen] = useState(false);`
content = content.replace(
    "const [isChatOpen, setIsChatOpen] = useState(false);",
    "const [isChatOpen, setIsChatOpen] = useState(false);\n  const [maintenanceBypass, setMaintenanceBypass] = useState(false);"
)

# Update the if statement for maintenance
content = content.replace(
    "if (siteStatusConfig.isMaintenance && userRole !== 'admin' && userRole !== 'moderator') {",
    "if (siteStatusConfig.isMaintenance && userRole !== 'admin' && userRole !== 'moderator' && !maintenanceBypass) {"
)

# Add onBypass prop to MaintenanceScreen
content = content.replace(
    "onAdminLogin={() => setAuthModalMode('admin')}",
    "onAdminLogin={() => setAuthModalMode('admin')}\n            onBypass={() => setMaintenanceBypass(true)}"
)

with open(file_path, 'w') as f:
    f.write(content)
