from supabase import create_client, Client
import json

SUPABASE_URL = "https://eaxtuvjcanakaqetuqlc.supabase.co"
SUPABASE_KEY = "sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table('live_matches').select('*').execute()
matches = response.data
for m in matches:
    print(f"{m['home_team']} vs {m['away_team']} | Status: {m['status']}")
