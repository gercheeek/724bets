import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_mentions = """    if (EMOTES[part]) {
      return (
        <img 
          key={index} 
          src={EMOTES[part]} 
          alt={part} 
          className="inline-block h-6 w-6 align-middle mx-0.5"
        />
      );
    }
    return part;"""

new_mentions = """    if (EMOTES[part]) {
      return (
        <img 
          key={index} 
          src={EMOTES[part]} 
          alt={part} 
          className="inline-block h-6 w-6 align-middle mx-0.5"
        />
      );
    }
    
    // Highlight @mentions in green
    const mentionRegex = /(@[\\w]+)/g;
    if (mentionRegex.test(part)) {
        const subParts = part.split(mentionRegex);
        return subParts.map((subPart, subIdx) => {
            if (subPart.startsWith('@')) {
                return <span key={`${index}-${subIdx}`} className="text-[#00E701] font-bold bg-[#00E701]/10 px-1 rounded">{subPart}</span>;
            }
            return subPart;
        });
    }
    
    return part;"""

content = content.replace(old_mentions, new_mentions)
with open(filename, 'w') as f:
    f.write(content)
print("Updated Mentions Highlight")
