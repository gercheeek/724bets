import React, { useEffect, useState, useRef } from 'react';
import { useInView, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  format?: 'currency' | 'number';
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  format = 'number',
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  
  const springValue = useSpring(0, {
    bounce: 0,
    duration: 1500 // 1.5 seconds animation
  });

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      let formatted = "";
      if (format === 'currency') {
        formatted = latest.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      } else {
        formatted = Math.floor(latest).toLocaleString('tr-TR');
      }
      setDisplayValue(formatted);
    });
    return () => unsubscribe();
  }, [springValue, format, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
