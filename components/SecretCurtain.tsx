import React, { useState, useEffect } from 'react';

export default function SecretCurtain() {
    const [clickCount, setClickCount] = useState(0);
    const [isUnlocked, setIsUnlocked] = useState(true); // Default true to prevent flash

    useEffect(() => {
        // Check session storage on mount
        const unlocked = sessionStorage.getItem('secret_curtain_unlocked');
        if (unlocked || import.meta.env.DEV) {
            setIsUnlocked(true);
        } else {
            setIsUnlocked(false);
        }
    }, []);

    const handleClick = () => {
        if (isUnlocked) return;
        
        const newCount = clickCount + 1;
        setClickCount(newCount);
        
        if (newCount >= 6) {
            setIsUnlocked(true);
            sessionStorage.setItem('secret_curtain_unlocked', 'true');
        }
    };

    if (isUnlocked) return null;

    return (
        <div 
            onClick={handleClick}
            className="fixed inset-0 bg-black z-[99999] flex items-center justify-center cursor-default select-none"
            style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation' // Prevents double-tap zooming on mobile
            }}
        >
            {/* Invisible full-screen clickable area */}
        </div>
    );
}
