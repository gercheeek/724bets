import React, { useEffect, useState, useRef } from 'react';

export const AnimatedOdd: React.FC<{ value: string }> = ({ value }) => {
    const [flashClass, setFlashClass] = useState('');
    const prevValueRef = useRef(value);

    useEffect(() => {
        if (value !== '-' && prevValueRef.current !== '-' && value !== prevValueRef.current) {
            const currentNum = parseFloat(value);
            const prevNum = parseFloat(prevValueRef.current);
            
            if (!isNaN(currentNum) && !isNaN(prevNum)) {
                if (currentNum > prevNum) {
                    setFlashClass('text-white bg-[#10b981] scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-none ring-2 ring-[#10b981]'); 
                } else if (currentNum < prevNum) {
                    setFlashClass('text-white bg-[#ef4444] scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-none ring-2 ring-[#ef4444]'); 
                }
                
                const timer = setTimeout(() => {
                    setFlashClass('text-white bg-transparent scale-100 transition-all duration-[800ms] ring-0');
                }, 600);
                
                prevValueRef.current = value;
                return () => clearTimeout(timer);
            }
        }
        prevValueRef.current = value;
    }, [value]);

    return (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[4px] font-black transform ${flashClass || 'text-white'}`}>
            {value}
        </span>
    );
};
