import re

filename = 'components/LiveWinModal.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_code = """const LiveWinModal: React.FC<LiveWinModalProps> = ({ win, onClose }) => {
    // Generate realistic mock data for the modal based on the win
    const betAmount = win.amount > 500 ? (win.amount / (Math.random() * 50 + 10)) : (win.amount / (Math.random() * 5 + 1.1));
    const multiplier = win.amount / betAmount;
    
    // Format date like "23 Ağu 2026 da 8:55 ÖS"
    const now = new Date();
    const dateStr = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: 'numeric', minute: '2-digit', hour12: true });"""

new_code = """const LiveWinModal: React.FC<LiveWinModalProps> = ({ win, onClose }) => {
    // Generate realistic mock data for the modal based on the win - Memoized to prevent flickering on re-renders
    const { betAmount, multiplier, dateStr, timeStr } = React.useMemo(() => {
        const amt = win.amount > 500 ? (win.amount / (Math.random() * 50 + 10)) : (win.amount / (Math.random() * 5 + 1.1));
        const mult = win.amount / amt;
        const now = new Date();
        return {
            betAmount: amt,
            multiplier: mult,
            dateStr: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
            timeStr: now.toLocaleTimeString('tr-TR', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    }, [win.id, win.amount]);"""

content = content.replace(old_code, new_code)
with open(filename, 'w') as f:
    f.write(content)
print("Fixed LiveWinModal flickering by memoizing random values")
