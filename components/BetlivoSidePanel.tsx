import React, { useState, useEffect } from 'react';

interface BetlivoSidePanelProps {
    position?: 'left' | 'right';
}

const BetlivoSidePanel: React.FC<BetlivoSidePanelProps> = ({ position = 'left' }) => {
    const [currentIdx, setCurrentIdx] = useState(0);

    const slides = [
        {
            badge: "ŞÖLEN",
            titleLine1: "%200",
            titleLine2: "NAKİT!",
            desc: "Salı, Çarşamba ve Perşembe Günlerine Özel",
            link: "https://t.ly/GercekLivo",
            btnText: "HEMEN KATIL"
        },
        {
            badge: "00:00 - 08:00",
            titleLine1: "%30 GECE",
            titleLine2: "KAYIP",
            desc: "Gece Kuşlarına Özel Anlık Kayıp Bonusu",
            link: "https://t.ly/GercekLivo",
            btnText: "HEMEN AL"
        },
        {
            badge: "SADAKAT",
            titleLine1: "HAFTALIK",
            titleLine2: "%10 İADE",
            desc: "Aylık %5 Bonus İle Her Zaman Güvendesin",
            link: "https://t.ly/GercekLivo",
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
                        --betlivo-green: #00ff88;
                        --betlivo-dark: #1a1f25;
                        --betlivo-text: #ffffff;
                        --betlivo-gray: #cccccc;
                    }

                    .betlivo-side-panel {
                        position: fixed;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 190px;
                        background: rgba(26, 31, 37, 0.98);
                        border: 1px solid var(--betlivo-green);
                        border-radius: 15px;
                        box-shadow: 0 0 25px rgba(0, 255, 136, 0.2);
                        z-index: 10000;
                        padding: 25px 15px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-align: center;
                        color: var(--betlivo-text);
                    }

                    .betlivo-side-panel.left {
                        left: 15px;
                    }

                    .betlivo-side-panel.right {
                        right: 15px;
                    }

                    .panel-header {
                        font-weight: 800;
                        font-size: 15px;
                        letter-spacing: 1px;
                        border-bottom: 1px dashed #333;
                        padding-bottom: 15px;
                        margin-bottom: 25px;
                        color: var(--betlivo-green);
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
                        animation: slideInBet 0.4s ease-out;
                    }

                    .badge {
                        background: #ffcc00;
                        color: #000;
                        font-size: 11px;
                        font-weight: bold;
                        padding: 4px 12px;
                        border-radius: 5px;
                        margin-bottom: 15px;
                    }

                    .promo-title {
                        font-size: 28px;
                        font-weight: 900;
                        line-height: 1.1;
                        margin: 10px 0 16px 0;
                        color: var(--betlivo-green);
                        text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
                    }

                    .promo-desc {
                        font-size: 13px;
                        color: var(--betlivo-gray);
                        margin-bottom: 22px;
                        line-height: 1.4;
                    }

                    .panel-btn {
                        display: block;
                        width: 100%;
                        background: var(--betlivo-green);
                        color: #000 !important;
                        text-decoration: none;
                        font-weight: 800;
                        font-size: 15px;
                        padding: 14px 0;
                        border-radius: 8px;
                        transition: 0.3s;
                    }

                    .panel-btn:hover {
                        transform: scale(1.05);
                        box-shadow: 0 0 15px var(--betlivo-green);
                    }

                    .dots-container {
                        margin-top: 25px;
                        display: flex;
                        justify-content: center;
                        gap: 6px;
                    }

                    .dot {
                        height: 6px;
                        width: 6px;
                        background-color: #444;
                        border-radius: 50%;
                        transition: 0.3s;
                    }

                    .dot.active {
                        background-color: var(--betlivo-green);
                        width: 15px;
                        border-radius: 10px;
                    }

                    @keyframes slideInBet {
                        from { opacity: 0; transform: translateX(var(--slide-from)); }
                        to { opacity: 1; transform: translateX(0); }
                    }

                    .betlivo-side-panel.left { --slide-from: -15px; }
                    .betlivo-side-panel.right { --slide-from: 15px; }

                    @media (max-width: 1200px) {
                        .betlivo-side-panel { width: 150px; padding: 15px 10px; }
                        .promo-title { font-size: 20px; }
                        .campaign-item { min-height: 200px; }
                    }

                    @media (max-width: 1024px) {
                        .betlivo-side-panel { display: none; }
                    }
                `}
            </style>

            <div className={`betlivo-side-panel ${position}`}>
                <div className="panel-header">Betlivo Teklifler</div>
                
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

export default BetlivoSidePanel;
