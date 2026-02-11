
import { RequestStatus } from './types';

export const SUPPLY_ITEMS = [
  '볼펜',
  '샤프',
  '테이프',
  '지우개',
  '마우스',
  '키보드',
  '기타(직접 입력)'
];

export const DEPARTMENTS = [
  '경영지원팀',
  'IT 개발팀',
  '마케팅팀',
  '인사팀',
  '영업본부',
  '디자인팀'
];

export const STATUS_UI = {
  [RequestStatus.PENDING]: {
    label: '승인대기',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  [RequestStatus.APPROVED]: {
    label: '승인완료',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  [RequestStatus.REJECTED]: {
    label: '반려됨',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  [RequestStatus.COMPLETED]: {
    label: '구매완료',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  [RequestStatus.CANCELED]: {
    label: '취소됨',
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  }
};
