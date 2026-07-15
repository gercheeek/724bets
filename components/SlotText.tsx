import React, { useState, useEffect, useRef } from 'react';

interface SlotTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
}

const SlotText: React.FC<SlotTextProps> = ({ text, className, onComplete }) => {
  const [displayedText, setDisplayedText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAnimation = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayedText(
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("")
      );
      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
        if (onComplete) onComplete();
      }
      iteration += 1 / 8; // Slower lock-in
    }, 60); // Slower flicker
  };

  useEffect(() => {
    triggerAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span className={className} onMouseEnter={triggerAnimation} style={{ display: 'inline-block', minWidth: `${text.length * 0.65}em` }}>
      {displayedText}
    </span>
  );
};

export default SlotText;
