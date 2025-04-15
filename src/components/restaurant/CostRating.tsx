
import React from 'react';

interface CostRatingProps {
  rating: number;
}

const CostRating: React.FC<CostRatingProps> = ({ rating }) => {
  const dollarSigns = [];
  for (let i = 1; i <= 4; i++) {
    dollarSigns.push(
      <span 
        key={i} 
        className={`${i <= rating ? 'text-gray-900' : 'cost-rating-inactive'}`}
      >
        $
      </span>
    );
  }
  return <div className="cost-rating flex">{dollarSigns}</div>;
};

export default CostRating;
