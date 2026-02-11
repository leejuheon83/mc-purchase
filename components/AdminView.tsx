
import React, { useState } from 'react';
import { SupplyRequest, RequestStatus } from '../types';
import { storageService } from '../services/storageService';
import { isFinalizedRequest } from '../services/requestMapper';
import Badge from './Badge';

interface AdminViewProps {
  requests: SupplyRequest[];
  onRefresh: () => Promise<void>;
}

const AdminView: React.FC<AdminViewProps> = ({ requests, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleStatusChange = async (id: string, status: RequestStatus, adminComment?: string) => {
    try {
      await storageService.updateRequestStatus(id, status, adminComment);
      setEditingId(null);
      setComment('');
      await onRefresh();
    } catch (error) {
      console.error('Failed to update request status', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 신청 항목을 삭제하시겠습니까?')) return;

    try {
      const ok = await storageService.deleteRequest(id);
      if (!ok) {
        alert('완료/반려/취소 상태에서만 삭제할 수 있습니다.');
        return;
      }
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete request', error);
      alert('항목 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">전체 신청 관리</h3>
          <p className="text-slate-500 text-sm">비품 신청을 승인하거나 처리 상태를 관리합니다.</p>
        </div>
        <div className="flex gap-2 text-sm text-slate-500">
          <span>대기: {requests.filter(r => r.status === RequestStatus.PENDING).length}건</span>
          <span>|</span>
          <span>완료: {requests.filter(r => r.status === RequestStatus.COMPLETED).length}건</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">신청자</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">품목(수량)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">사유 및 URL</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">현재상태</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{req.employeeName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{req.item}</div>
                    <div className="text-xs text-slate-500">{req.quantity}개</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 truncate" title={req.reason}>
                        {req.reason}
                      </p>
                      {req.purchaseUrl && (
                        <a 
                          href={req.purchaseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-medium"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          구매 링크
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={req.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === req.id ? (
                      <div className="flex flex-col gap-2 items-end">
                        <input 
                          type="text"
                          placeholder="반려 사유 또는 코멘트"
                          className="text-xs border rounded px-2 py-1 w-48"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusChange(req.id, RequestStatus.APPROVED, comment)}
                            className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                          >
                            승인
                          </button>
                          <button 
                            onClick={() => handleStatusChange(req.id, RequestStatus.REJECTED, comment)}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                          >
                            반려
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded hover:bg-slate-300"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {req.status === RequestStatus.PENDING && (
                          <button 
                            onClick={() => setEditingId(req.id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            처리하기
                          </button>
                        )}
                        {req.status === RequestStatus.APPROVED && (
                          <button 
                            onClick={() => handleStatusChange(req.id, RequestStatus.COMPLETED)}
                            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 font-semibold"
                          >
                            구매 완료
                          </button>
                        )}
                        {isFinalizedRequest(req.status) && (
                          <>
                            <button
                              onClick={() => handleDelete(req.id)}
                              className="text-red-500 hover:text-red-600 text-xs font-semibold"
                            >
                              삭제
                            </button>
                            <span className="text-slate-400 text-xs italic">처리됨</span>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
