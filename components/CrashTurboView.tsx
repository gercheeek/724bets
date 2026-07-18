import React from 'react';

export default function CrashTurboView({ siteUser, setSiteUser, onAuthRequired }: any) {
    // URL from the user
    const gameUrl = "https://crash.turbogfast.xyz/?token=&locale=tr&demo=true&sub_partner_id=LuckySplash&lobby_url=https%3A%2F%2F724bahis.com&cid=hub88tgb&custom_styles=";

    return (
        <div className="flex flex-col w-full h-full bg-[#10171E]">
            <iframe 
                src={gameUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="Crash Turbo"
            />
        </div>
    );
}
