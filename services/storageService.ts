
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction
} from 'firebase/firestore';
import { SupplyRequest, RequestStatus } from '../types';
import { db } from './firebase';
import {
  applyCancel,
  applyPendingUpdate,
  createRequestRecord,
  toSupplyRequest
} from './requestMapper';

export type RequestUpdate = Pick<SupplyRequest, 'item' | 'quantity' | 'reason' | 'purchaseUrl'>;
type NewRequestInput = Omit<SupplyRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

const REQUESTS_COLLECTION = 'requests';
const requestsCollectionRef = collection(db, REQUESTS_COLLECTION);

export const storageService = {
  getRequests: async (): Promise<SupplyRequest[]> => {
    const snapshot = await getDocs(query(requestsCollectionRef, orderBy('createdAt', 'desc')));
    const mapped = snapshot.docs
      .map((requestDoc) => toSupplyRequest(requestDoc.id, requestDoc.data()))
      .filter((request): request is SupplyRequest => request !== null);
    return mapped;
  },

  saveRequest: async (request: NewRequestInput): Promise<SupplyRequest> => {
    const record = createRequestRecord(request);
    const docRef = await addDoc(requestsCollectionRef, {
      ...record,
      purchaseUrl: record.purchaseUrl ?? null,
      adminComment: record.adminComment ?? null
    });
    return { id: docRef.id, ...record };
  },

  updateRequestStatus: async (id: string, status: RequestStatus, adminComment?: string): Promise<void> => {
    const ref = doc(db, REQUESTS_COLLECTION, id);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) {
        return;
      }

      const current = toSupplyRequest(snap.id, snap.data());
      if (!current) {
        return;
      }

      transaction.update(ref, {
        status,
        adminComment: adminComment ?? null,
        updatedAt: Date.now()
      });
    });
  },

  updateRequest: async (id: string, updates: RequestUpdate): Promise<SupplyRequest | null> => {
    const ref = doc(db, REQUESTS_COLLECTION, id);
    const updated = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) {
        return null;
      }

      const current = toSupplyRequest(snap.id, snap.data());
      if (!current) {
        return null;
      }

      const next = applyPendingUpdate(current, updates);
      if (!next) {
        return null;
      }

      transaction.update(ref, {
        item: next.item,
        quantity: next.quantity,
        reason: next.reason,
        purchaseUrl: next.purchaseUrl ?? null,
        updatedAt: next.updatedAt
      });
      return next;
    });

    return updated;
  },

  cancelRequest: async (id: string, comment: string = '사용자 취소'): Promise<SupplyRequest | null> => {
    const ref = doc(db, REQUESTS_COLLECTION, id);
    const canceled = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) {
        return null;
      }

      const current = toSupplyRequest(snap.id, snap.data());
      if (!current) {
        return null;
      }

      const next = applyCancel(current, comment);
      if (!next) {
        return null;
      }

      transaction.update(ref, {
        status: next.status,
        adminComment: next.adminComment ?? null,
        updatedAt: next.updatedAt
      });
      return next;
    });

    return canceled;
  }
};
