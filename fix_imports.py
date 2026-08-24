import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Fix lucide-react import
content = re.sub(r'\} AlertCircle \} from \'lucide-react\';', '} from \'lucide-react\';', content)

# Fix other broken imports
content = content.replace("import { AlertCircle, supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';", "import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';")
content = content.replace("import { AlertCircle, triggerGlobalToast } from './GlobalToaster';", "import { triggerGlobalToast } from './GlobalToaster';")

with open(filename, 'w') as f:
    f.write(content)
