
import React, { useState } from 'react';
import { SUPPLY_ITEMS } from '../constants';
import { SupplyRequest, RequestStatus } from '../types';
import Badge from './Badge';
import { RequestUpdate } from '../services/storageService';

interface HistoryViewProps {
  requests: SupplyRequest[];
  onCancel: (id: string) => Promise<boolean>;
  onUpdate: (id: string, updates: RequestUpdate) => Promise<boolean>;
}

const HistoryView: React.FC<HistoryViewProps> = ({ requests, onCancel, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState(SUPPLY_ITEMS[0]);
  const [customItem, setCustomItem] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);
  const [editReason, setEditReason] = useState('');
  const [editPurchaseUrl, setEditPurchaseUrl] = useState('');
  const [editError, setEditError] = useState('');

  const startEdit = (request: SupplyRequest) => {
    const isKnownItem = SUPPLY_ITEMS.includes(request.item);
    setEditingId(request.id);
    setEditItem(isKnownItem ? request.item : '기타(직접 입력)');
    setCustomItem(isKnownItem ? '' : request.item);
    setEditQuantity(request.quantity);
    setEditReason(request.reason);
    setEditPurchaseUrl(request.purchaseUrl ?? '');
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const handleSave = async () => {
    if (!editingId) return;

    const finalItem = editItem === '기타(직접 입력)' ? customItem.trim() : editItem;
    if (!finalItem) {
      setEditError('품목명을 입력해 주세요.');
      return;
    }
    if (!editReason.trim()) {
      setEditError('신청 사유를 입력해 주세요.');
      return;
    }

    const updates: RequestUpdate = {
      item: finalItem,
      quantity: Math.max(1, editQuantity),
      reason: editReason.trim(),
      purchaseUrl: editPurchaseUrl.trim() || undefined
    };

    const ok = await onUpdate(editingId, updates);
    if (!ok) {
      alert('승인대기 상태에서만 수정할 수 있습니다.');
      return;
    }
    setEditingId(null);
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">신청 내역이 없습니다</h3>
        <p className="text-slate-500 mt-1">필요한 사무용품을 신청해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">신청일자</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">품목</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">수량</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">링크/비고</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map(req => (
              <React.Fragment key={req.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {req.item}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {req.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={req.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="space-y-1">
                      {req.purchaseUrl && (
                        <a 
                          href={req.purchaseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-medium"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          URL 보기
                        </a>
                      )}
                      {req.status === RequestStatus.REJECTED && req.adminComment ? (
                        <div className="text-red-500 text-xs">반려사유: {req.adminComment}</div>
                      ) : req.status === RequestStatus.CANCELED && req.adminComment ? (
                        <div className="text-slate-500 text-xs">취소사유: {req.adminComment}</div>
                      ) : req.adminComment ? (
                        <div className="text-slate-500 text-xs">{req.adminComment}</div>
                      ) : !req.purchaseUrl && (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === RequestStatus.PENDING ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(req)}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm('신청을 취소하시겠습니까?')) return;
                            const ok = await onCancel(req.id);
                            if (!ok) {
                              alert('승인대기 상태에서만 취소할 수 있습니다.');
                            }
                          }}
                          className="text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                </tr>
                {editingId === req.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={6} className="px-6 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">품목</label>
                          <select
                            value={editItem}
                            onChange={(e) => setEditItem(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-white text-sm"
                          >
                            {SUPPLY_ITEMS.map(i => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                          {editItem === '기타(직접 입력)' && (
                            <input
                              type="text"
                              required
                              placeholder="신청할 품목명을 직접 입력하세요"
                              value={customItem}
                              onChange={(e) => setCustomItem(e.target.value)}
                              className="mt-2 w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-white text-sm"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">수량</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">신청 사유</label>
                          <textarea
                            rows={2}
                            value={editReason}
                            onChange={(e) => setEditReason(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">참고 URL (선택사항)</label>
                          <input
                            type="url"
                            value={editPurchaseUrl}
                            onChange={(e) => setEditPurchaseUrl(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border text-sm"
                          />
                        </div>
                      </div>
                      {editError && (
                        <div className="mt-3 text-xs text-red-500">{editError}</div>
                      )}
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700"
                        >
                          저장
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryView;
