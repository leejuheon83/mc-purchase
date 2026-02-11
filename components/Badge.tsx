
import React from 'react';
import { RequestStatus } from '../types';
import { STATUS_UI } from '../constants';

interface BadgeProps {
  status: RequestStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const config = STATUS_UI[status];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

export default Badge;
