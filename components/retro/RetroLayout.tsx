import React from 'react';
import './retro.css';
import RetroSidebar from './RetroSidebar';
import RetroMain from './RetroMain';
import RetroChat from './RetroChat';

const RetroLayout: React.FC = () => {
  return (
    <div className="w-full h-screen bg-[#0a0a0a] crt-container p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans overflow-hidden">
      
      {/* 
        Main Retro Frame Grid
        Uses Flex or Grid based on screen size.
        Left: Nav/Mini Games (250px)
        Middle: Wheel/TV Area (Flex 1)
        Right: Chat/Rewards (300px)
      */}
      <div className="w-full h-full max-w-[1600px] flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* LEFT COLUMN: Mini Games / Nav */}
        <div className="hidden md:flex w-[200px] lg:w-[250px] shrink-0 h-full">
          <RetroSidebar />
        </div>

        {/* MIDDLE COLUMN: Main Arcade Area */}
        <div className="flex-1 h-full min-w-0">
          <RetroMain />
        </div>
        
      </div>
      
    </div>
  );
};

export default RetroLayout;
