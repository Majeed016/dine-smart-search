
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 24, showText = true }) => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex items-center justify-center bg-burgundy-800 text-white rounded-full p-1.5">
        <Utensils size={size} />
      </div>
      {showText && (
        <span className="font-bold text-lg md:text-xl">BookTable</span>
      )}
    </Link>
  );
};

export default Logo;
