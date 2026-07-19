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
                    setFlashClass('text-[#10b981] scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-none'); 
                } else if (currentNum < prevNum) {
                    setFlashClass('text-[#ef4444] scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-none'); 
                }
                
                const timer = setTimeout(() => {
                    setFlashClass('text-white scale-100 transition-all duration-700');
                }, 500);
                
                prevValueRef.current = value;
                return () => clearTimeout(timer);
            }
        }
        prevValueRef.current = value;
    }, [value]);

    return (
        <span className={`inline-block font-black transform ${flashClass || 'text-white'}`}>
            {value}
        </span>
    );
};
