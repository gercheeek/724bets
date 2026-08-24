import re

filename = 'hooks/useRainEvent.ts'
with open(filename, 'r') as f:
    content = f.read()

# Fix useEffect dependency array to re-fetch when currentUserId changes
old_deps = "    return () => {\n      supabase.removeChannel(rainChannel);\n      supabase.removeChannel(participantsChannel);\n    };\n  }, []);"
new_deps = "    return () => {\n      supabase.removeChannel(rainChannel);\n      supabase.removeChannel(participantsChannel);\n    };\n  }, [currentUserId]);"
content = content.replace(old_deps, new_deps)

with open(filename, 'w') as f:
    f.write(content)
print("Updated dependencies in useRainEvent")
