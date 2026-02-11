
import React from 'react';
import logoImage from '../SBS M&C_CI_디지털작업용(프리뷰).png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md' }) => {
  const sizes = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoImage}
        alt="SBS M&C"
        className={`${sizes[size]} w-auto`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default Logo;
