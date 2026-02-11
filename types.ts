
export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export interface User {
  employeeId: string;
  name: string;
  department: string;
  isAdmin: boolean;
}

export interface SupplyRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  item: string;
  quantity: number;
  reason: string;
  purchaseUrl?: string; // 구매 링크 필드 (선택사항)
  status: RequestStatus;
  adminComment?: string;
  createdAt: number;
  updatedAt: number;
}

export type ViewType = 'REQUEST' | 'HISTORY' | 'ADMIN';
