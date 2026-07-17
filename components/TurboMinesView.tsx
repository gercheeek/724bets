import React from 'react';

export default function TurboMinesView({ siteUser, setSiteUser, onAuthRequired }: any) {
    // URL from the user
    const gameUrl = "https://turbomines.turbogfast.xyz/?token=&locale=tr&demo=true&sub_partner_id=LuckySplash&lobby_url=https%3A%2F%2F724bahis.com&cid=hub88tgb&custom_styles=";

    return (
        <div className="flex flex-col w-full h-full bg-[#10171E]" style={{ height: 'calc(100dvh - var(--header-height, 60px))' }}>
            <iframe 
                src={gameUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="Turbo Mines"
            />
        </div>
    );
}
