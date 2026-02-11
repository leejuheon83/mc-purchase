import { describe, expect, it } from 'vitest';
import {
  applyCancel,
  applyPendingUpdate,
  createRequestRecord,
  toSupplyRequest
} from './requestMapper';
import type { RequestUpdate } from './storageService';
import { RequestStatus, type SupplyRequest } from '../types';

const createRequest = (overrides: Partial<SupplyRequest> = {}): SupplyRequest => ({
  id: 'req-1',
  employeeId: '120032',
  employeeName: '이주헌',
  department: '인사팀',
  item: '볼펜',
  quantity: 1,
  reason: '테스트',
  status: RequestStatus.PENDING,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides
});

describe('requestMapper', () => {
  it('creates request record with pending status and timestamps', () => {
    const record = createRequestRecord(
      {
        employeeId: '120032',
        employeeName: '이주헌',
        department: '인사팀',
        item: '볼펜',
        quantity: 2,
        reason: '필요',
        purchaseUrl: 'https://example.com'
      },
      1700000000000
    );

    expect(record.status).toBe(RequestStatus.PENDING);
    expect(record.createdAt).toBe(1700000000000);
    expect(record.updatedAt).toBe(1700000000000);
  });

  it('converts firestore-like data to supply request', () => {
    const request = toSupplyRequest('req-1', {
      employeeId: '120032',
      employeeName: '이주헌',
      department: '인사팀',
      item: '볼펜',
      quantity: 1,
      reason: '테스트',
      status: RequestStatus.PENDING,
      createdAt: 1000,
      updatedAt: 1000,
      purchaseUrl: null
    });

    expect(request).not.toBeNull();
    expect(request?.id).toBe('req-1');
    expect(request?.purchaseUrl).toBeUndefined();
  });

  it('updates only pending requests', () => {
    const updates: RequestUpdate = {
      item: '샤프',
      quantity: 3,
      reason: '수정 사유',
      purchaseUrl: 'https://example.com'
    };
    const updated = applyPendingUpdate(createRequest(), updates, 2000);
    expect(updated).not.toBeNull();
    expect(updated?.item).toBe('샤프');
    expect(updated?.updatedAt).toBe(2000);

    const blocked = applyPendingUpdate(
      createRequest({ status: RequestStatus.APPROVED }),
      updates,
      2000
    );
    expect(blocked).toBeNull();
  });

  it('cancels only pending requests', () => {
    const canceled = applyCancel(createRequest(), '사용자 취소', 2000);
    expect(canceled).not.toBeNull();
    expect(canceled?.status).toBe(RequestStatus.CANCELED);
    expect(canceled?.adminComment).toBe('사용자 취소');

    const blocked = applyCancel(
      createRequest({ status: RequestStatus.COMPLETED }),
      '사용자 취소',
      2000
    );
    expect(blocked).toBeNull();
  });
});
