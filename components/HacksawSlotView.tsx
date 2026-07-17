import React from 'react';

export default function HacksawSlotView({ siteUser, setSiteUser, onAuthRequired }: any) {
    // URL from the user (Hacksaw Gaming)
    const gameUrl = "https://static-live.hacksawgaming.com/1061/1.5.3/index.html?language=tr&channel=desktop&gameid=1061&mode=2&token=demo&lobbyurl=https%3A%2F%2F724bahis.com&partner=demo&env=https://rgs-demo.hacksawgaming.com/api&realmoneyenv=https://rgs-demo.hacksawgaming.com/api&alwaysredirect=true";

    return (
        <div className="flex flex-col w-full h-full bg-[#10171E]" style={{ height: 'calc(100dvh - var(--header-height, 60px))' }}>
            <iframe 
                src={gameUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="Hacksaw Slot"
            />
        </div>
    );
}
