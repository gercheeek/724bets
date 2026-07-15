import React, { useState, useEffect, useRef } from 'react';

interface SlotTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  isReady?: boolean;
}

const SlotText: React.FC<SlotTextProps> = ({ text, className, onComplete, isReady = true }) => {
  const [displayedText, setDisplayedText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a ref for isReady so the interval always sees the latest value without restarting
  const isReadyRef = useRef(isReady);
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

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
      
      iteration += 1 / 5; // Faster lock-in
      
      // If content is not ready, keep the last letter spinning infinitely
      if (!isReadyRef.current && iteration >= text.length - 0.5) {
        iteration = text.length - 0.5;
      }
    }, 50); // Slightly faster flicker
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
