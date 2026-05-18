
import React from 'react';
import { RequestStatus } from '../types';
import { STATUS_UI } from '../constants';

interface BadgeProps {
  status: RequestStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const config = STATUS_UI[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default Badge;
