import React, { useState, useEffect, useRef } from 'react';

interface SlotTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  isReady?: boolean;
  trigger?: number;
  isSpinning?: boolean;
}

const SlotText: React.FC<SlotTextProps> = ({ text, className, onComplete, isReady = true, trigger = 0, isSpinning = false }) => {
  const [displayedText, setDisplayedText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const isReadyRef = useRef(isReady);
  const isSpinningRef = useRef(isSpinning);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    // Only handle changes if we've already mounted, 
    // to avoid double triggering on initial load.
    isSpinningRef.current = isSpinning;
    if (isSpinning) {
      startInfiniteSpin();
    } else {
      triggerAnimation();
    }
  }, [isSpinning]);

  const startInfiniteSpin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayedText(
        text.split("").map(() => letters[Math.floor(Math.random() * letters.length)]).join("")
      );
    }, 50);
  };

  const triggerAnimation = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (isSpinningRef.current) return; // Managed by startInfiniteSpin now

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
      
      iteration += 1 / 5; // Lock-in speed
      
      if (!isReadyRef.current && iteration >= text.length - 0.5) {
        iteration = text.length - 0.5;
      }
    }, 50);
  };

  useEffect(() => {
    if (!isSpinningRef.current) triggerAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  useEffect(() => {
    if (trigger > 0 && !isSpinningRef.current) {
      triggerAnimation();
    }
  }, [trigger]);

  return (
    <span className={className} style={{ display: 'inline-block', minWidth: `${text.length * 0.65}em` }}>
      {displayedText}
    </span>
  );
};

export default SlotText;
