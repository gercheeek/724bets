import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Replace the signature
content = content.replace(
    "const WalletModal = ({ isOpen, onClose, initialTab = 'deposit' }: { isOpen: boolean, onClose: () => void, initialTab?: string }) => {",
    "const WalletModal = ({ onClose, initialTab = 'deposit' }: { onClose: () => void, initialTab?: string }) => {"
)

# Remove the useEffect that depends on isOpen and just run it on mount
old_useeffect = """  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSuccess(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);"""

new_useeffect = """  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setSuccess(false);
    return () => { document.body.style.overflow = 'unset'; };
  }, []);"""

content = content.replace(old_useeffect, new_useeffect)

# Remove the `if (!isOpen) return null;`
content = content.replace("  if (!isOpen) return null;\n", "")

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
