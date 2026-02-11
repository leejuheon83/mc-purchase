import { RequestStatus, type SupplyRequest } from '../types';
import type { RequestUpdate } from './storageService';

type NewRequestInput = Omit<SupplyRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

const isRequestStatus = (value: unknown): value is RequestStatus => {
  return typeof value === 'string' && Object.values(RequestStatus).includes(value as RequestStatus);
};

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const createRequestRecord = (
  input: NewRequestInput,
  now: number = Date.now()
): Omit<SupplyRequest, 'id'> => ({
  ...input,
  status: RequestStatus.PENDING,
  createdAt: now,
  updatedAt: now
});

export const toSupplyRequest = (id: string, raw: Record<string, unknown>): SupplyRequest | null => {
  const {
    employeeId,
    employeeName,
    department,
    item,
    quantity,
    reason,
    status,
    createdAt,
    updatedAt,
    purchaseUrl,
    adminComment
  } = raw;

  if (
    typeof employeeId !== 'string' ||
    typeof employeeName !== 'string' ||
    typeof department !== 'string' ||
    typeof item !== 'string' ||
    typeof quantity !== 'number' ||
    typeof reason !== 'string' ||
    !isRequestStatus(status) ||
    typeof createdAt !== 'number' ||
    typeof updatedAt !== 'number'
  ) {
    return null;
  }

  return {
    id,
    employeeId,
    employeeName,
    department,
    item,
    quantity,
    reason,
    purchaseUrl: toOptionalString(purchaseUrl),
    adminComment: toOptionalString(adminComment),
    status,
    createdAt,
    updatedAt
  };
};

export const applyPendingUpdate = (
  request: SupplyRequest,
  updates: RequestUpdate,
  now: number = Date.now()
): SupplyRequest | null => {
  if (request.status !== RequestStatus.PENDING) {
    return null;
  }

  return {
    ...request,
    ...updates,
    updatedAt: now
  };
};

export const applyCancel = (
  request: SupplyRequest,
  comment: string,
  now: number = Date.now()
): SupplyRequest | null => {
  if (request.status !== RequestStatus.PENDING) {
    return null;
  }

  return {
    ...request,
    status: RequestStatus.CANCELED,
    adminComment: comment,
    updatedAt: now
  };
};
