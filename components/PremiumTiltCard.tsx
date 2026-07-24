import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface PremiumTiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function PremiumTiltCard({ children, className = "" }: PremiumTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position from -0.5 to 0.5 relative to center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid 3D effect - reduced stiffness for more pronounced swinging
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Map mouse position to rotation (max 25 degrees for obvious effect)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  // Map mouse position for Glare effect (from 0% to 100% position)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.8, 0.3, 0.8] // Very strong glare
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className={`relative ${className}`} style={{ perspective: 1500 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => {
          setIsHovered(true);
          const touch = e.touches[0];
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const mouseX = touch.clientX - rect.left;
          const mouseY = touch.clientY - rect.top;
          x.set((mouseX / rect.width) - 0.5);
          y.set((mouseY / rect.height) - 0.5);
        }}
        onTouchEnd={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full transition-shadow duration-300 rounded-[inherit]"
      >
        {/* We use translateZ to push the children slightly forward in 3D space */}
        <div 
          className="w-full h-full relative rounded-[inherit]"
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
        >
          {children}

          {/* Glare layer overlaid on top of the content */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden mix-blend-screen z-50">
              <motion.div
                className="absolute"
                style={{
                  background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)",
                  opacity: glareOpacity,
                  left: glareX,
                  top: glareY,
                  transform: "translate(-50%, -50%)",
                  width: "250%",
                  height: "250%",
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
