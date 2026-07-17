import React from 'react';

export default function RedTigerSlotView({ siteUser, setSiteUser, onAuthRequired }: any) {
    // URL from the user (Red Tiger / Evolution)
    const gameUrl = "https://ijtyxg64.4aaolyg5.click/frontend/evo/r2/#provider=redtiger&balance_id=demo-gammixcobwz00001-cGxheWluZ2d1ZXN0MDE1Ng%3D%3D-e41ebbe3-9ae3-4c77-8ac3-f2d1ff2f3c18&ua_launch_id=18c318b22b396fdc58cf9910&game=worldfootballfortunes&table_id=worldfootballfor";

    return (
        <div className="flex flex-col w-full h-full bg-[#10171E]" style={{ height: 'calc(100dvh - var(--header-height, 60px))' }}>
            <iframe 
                src={gameUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="Red Tiger Slot"
            />
        </div>
    );
}
