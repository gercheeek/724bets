
import React from 'react';
import { Brand } from '../types';

interface BrandCardProps {
  brand: Brand;
  index?: number;
}

function getTierClass(index: number): string {
  if (index === 0) return 'altin';
  if (index === 1) return 'gumus';
  return 'bronz';
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, index = 0 }) => {
  const tierClass = getTierClass(index);

  return (
    <div className={`brand-card ${tierClass} animate-fade-in-up animate-delay-${Math.min(index + 1, 5)}`} style={{ opacity: 0 }}>
      <div className="brand-card-logo">
        <img src={brand.logo} alt={brand.name} />
      </div>

      <h3 className="brand-card-name">{brand.name}</h3>
      <p className="brand-card-subtitle">{brand.subtitle}</p>

      <div className="brand-card-offer">
        <span className="brand-card-offer-main">{brand.offerMain}</span>
        <span className="brand-card-offer-sub">{brand.offerSub}</span>
      </div>

      {brand.bonusText && (
        <a href={brand.link} className="brand-card-bonus">
          {brand.bonusText}
        </a>
      )}

      <a href={brand.link} className="brand-card-btn">
        Siteyi Ziyaret Et
      </a>
    </div>
  );
};

export default BrandCard;
