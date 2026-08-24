import re

filename = 'components/AdminPanel.tsx'
with open(filename, 'r') as f:
    content = f.read()

imports_to_lazy = [
    "AdminLuckyWheelTab",
    "AdminMembersTab",
    "AdminRiskTab",
    "AdminLiveRadarTab",
    "AdminMarketingTab",
    "AdminWithdrawalsTab",
    "AdminAuditLogsTab",
    "AdminSportsTab",
    "AdminOddsEngineTab",
    "AdminTVTab",
    "AdminDashboardTab",
    "AdminWhaleTab",
    "AdminLiquidityTab",
    "AdminProviderTab",
    "AdminWalletsTab",
    "AdminCommunityTab",
    "AdminKralTab",
    "AdminBettingEngineTab",
    "AdminFraudTab",
    "AdminDepositsTab"
]

for comp in imports_to_lazy:
    # Handle direct default imports
    pattern1 = rf"import {comp} from '\./{comp}';"
    if re.search(pattern1, content):
        content = re.sub(pattern1, f"const {comp} = React.lazy(() => import('./{comp}'));", content)
    
    # Handle curly brace imports
    pattern2 = rf"import {{\s*{comp}\s*}} from '\./{comp}';"
    if re.search(pattern2, content):
        content = re.sub(pattern2, f"const {comp} = React.lazy(() => import('./{comp}').then(module => ({{ default: module.{comp} }})));", content)


# Find the main content area which starts after `<div className="flex-1 flex flex-col min-w-0 bg-[#0B0E14]">` (now changed to bg-gradient)
# Wait, the switch(activeTab) handles rendering.
# We just need to wrap the switch with Suspense.
content = content.replace('{activeTab === \'luckywheel\' && (', '<React.Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[500px]"><div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div></div>}>\n{activeTab === \'luckywheel\' && (')
content = content.replace('      </div>\n    </div>', '      </React.Suspense>\n      </div>\n    </div>')

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated lazy loading in {filename}")
