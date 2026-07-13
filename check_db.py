from bot_pro import init_supabase
import json

supabase = init_supabase()
res = supabase.table("live_matches").select("*").limit(5).execute()
print(json.dumps(res.data, indent=2, ensure_ascii=False))
