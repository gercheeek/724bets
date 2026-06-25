import React, { useState, useEffect } from 'react';

interface BrandSidePanelProps {
    position?: 'left' | 'right';
}

const BrandSidePanel: React.FC<BrandSidePanelProps> = ({ position = 'left' }) => {
    const [currentIdx, setCurrentIdx] = useState(0);

    const slides = [
        {
            badge: "ŞÖLEN",
            titleLine1: "%300",
            titleLine2: "NAKİT!",
            desc: "Pazartesi ve Cuma Günlerine Özel Yatırım Bonusu",
            link: "https://724bahis.net.net",
            btnText: "HEMEN KATIL"
        },
        {
            badge: "00:00 - 08:00",
            titleLine1: "%40 GECE",
            titleLine2: "KAYIP",
            desc: "724BAHİS.NET'te Gece Kuşlarına Özel Anlık Kayıp Bonusu",
            link: "https://724bahis.net.net",
            btnText: "HEMEN AL"
        },
        {
            badge: "SADAKAT",
            titleLine1: "HAFTALIK",
            titleLine2: "%15 İADE",
            desc: "Her Hafta %15 Sadakat Bonusu 724BAHİS.NET'te",
            link: "https://724bahis.net.net",
            btnText: "GÜVENCEYE AL"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <>
            <style>
                {`
                    :root {
                        --site-green: #22c55e;
                        --site-dark: #0a0a0a;
                        --site-text: #ffffff;
                        --site-gray: #a1a1aa;
                    }

                    .brand-side-panel {
                        position: fixed;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 190px;
                        background: rgba(10, 10, 10, 0.95);
                        border: 1px solid var(--site-green);
                        border-radius: 20px;
                        box-shadow: 0 0 30px rgba(34, 197, 94, 0.15);
                        z-index: 10000;
                        padding: 25px 15px;
                        font-family: 'Inter', sans-serif;
                        text-align: center;
                        color: var(--site-text);
                        backdrop-filter: blur(10px);
                    }

                    .brand-side-panel.left {
                        left: 15px;
                    }

                    .brand-side-panel.right {
                        right: 15px;
                    }

                    .panel-header {
                        font-weight: 900;
                        font-size: 14px;
                        letter-spacing: 1px;
                        border-bottom: 1px solid rgba(34, 197, 94, 0.2);
                        padding-bottom: 15px;
                        margin-bottom: 25px;
                        color: var(--site-green);
                        text-transform: uppercase;
                    }

                    .campaign-item {
                        display: none;
                        min-height: 250px;
                    }

                    .campaign-item.active {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        animation: slideInBrand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }

                    .badge {
                        background: linear-gradient(90deg, #22c55e, #4ade80);
                        color: #fff;
                        font-size: 10px;
                        font-weight: 900;
                        padding: 4px 12px;
                        border-radius: 6px;
                        margin-bottom: 15px;
                    }

                    .promo-title {
                        font-size: 26px;
                        font-weight: 900;
                        line-height: 1.1;
                        margin: 10px 0 16px 0;
                        color: #ffffff;
                        text-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
                    }

                    .promo-desc {
                        font-size: 12px;
                        color: var(--site-gray);
                        margin-bottom: 22px;
                        line-height: 1.5;
                        font-weight: 600;
                    }

                    .panel-btn {
                        display: block;
                        width: 100%;
                        background: linear-gradient(135deg, #22c55e, #16a34a);
                        color: #fff !important;
                        text-decoration: none;
                        font-weight: 900;
                        font-size: 13px;
                        padding: 14px 0;
                        border-radius: 12px;
                        transition: 0.3s;
                        box-shadow: 0 5px 15px rgba(34, 197, 94, 0.2);
                    }

                    .panel-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
                    }

                    .dots-container {
                        margin-top: 25px;
                        display: flex;
                        justify-content: center;
                        gap: 6px;
                    }

                    .dot {
                        height: 5px;
                        width: 5px;
                        background-color: rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        transition: 0.3s;
                    }

                    .dot.active {
                        background-color: var(--site-green);
                        width: 12px;
                        border-radius: 10px;
                    }

                    @keyframes slideInBrand {
                        from { opacity: 0; transform: translateX(var(--slide-from)); }
                        to { opacity: 1; transform: translateX(0); }
                    }

                    .brand-side-panel.left { --slide-from: -20px; }
                    .brand-side-panel.right { --slide-from: 20px; }

                    @media (max-width: 1200px) {
                        .brand-side-panel { width: 160px; padding: 15px 10px; }
                        .promo-title { font-size: 20px; }
                        .campaign-item { min-height: 200px; }
                    }

                    @media (max-width: 1024px) {
                        .brand-side-panel { display: none; }
                    }
                `}
            </style>

            <div className={`brand-side-panel ${position}`}>
                <div className="panel-header">724BAHİS.NET Teklifler</div>
                
                <div id="campaign-wrapper">
                    {slides.map((slide, index) => (
                        <div key={index} className={`campaign-item ${index === currentIdx ? 'active' : ''}`}>
                            <span className="badge">{slide.badge}</span>
                            <div className="promo-title">
                                {slide.titleLine1}<br />{slide.titleLine2}
                            </div>
                            <p className="promo-desc">{slide.desc}</p>
                            <a href={slide.link} target="_blank" rel="noopener noreferrer" className="panel-btn">
                                {slide.btnText}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="dots-container">
                    {slides.map((_, index) => (
                        <span key={index} className={`dot ${index === currentIdx ? 'active' : ''}`}></span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BrandSidePanel;
