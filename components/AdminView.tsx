
import React, { useEffect, useState } from 'react';
import { SupplyRequest, RequestStatus } from '../types';
import { storageService } from '../services/storageService';
import { isFinalizedRequest } from '../services/requestMapper';
import Badge from './Badge';

interface AdminViewProps {
  requests: SupplyRequest[];
  onRefresh: () => Promise<void>;
}

type AdminActionsVariant = 'table' | 'modal';

const AdminView: React.FC<AdminViewProps> = ({ requests, onRefresh }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

  const detailRequest = detailRequestId ? requests.find((r) => r.id === detailRequestId) : undefined;

  useEffect(() => {
    if (!detailRequestId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailRequestId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [detailRequestId]);

  const handleStatusChange = async (id: string, status: RequestStatus, adminComment?: string) => {
    try {
      await storageService.updateRequestStatus(id, status, adminComment);
      setEditingId(null);
      setRejectingId(null);
      setRejectReason('');
      setRejectError('');
      setDetailRequestId(null);
      await onRefresh();
    } catch (error) {
      console.error('Failed to update request status', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleRejectConfirm = (id: string) => {
    if (!rejectReason.trim()) {
      setRejectError('반려 사유를 입력해 주세요.');
      return;
    }
    handleStatusChange(id, RequestStatus.REJECTED, rejectReason.trim());
  };

  const startRejecting = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectError('');
  };

  const cancelRejecting = () => {
    setRejectingId(null);
    setRejectReason('');
    setRejectError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 신청 항목을 삭제하시겠습니까?')) return;

    try {
      const ok = await storageService.deleteRequest(id);
      if (!ok) {
        alert('완료/반려/취소 상태에서만 삭제할 수 있습니다.');
        return;
      }
      setDetailRequestId(null);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete request', error);
      alert('항목 삭제 중 오류가 발생했습니다.');
    }
  };

  const openPurchaseLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderAdminActions = (req: SupplyRequest, variant: AdminActionsVariant) => {
    const isModal = variant === 'modal';
    const rowWrap = isModal ? 'flex flex-wrap gap-2' : 'flex flex-wrap justify-end gap-2';

    if (variant === 'table' && detailRequestId === req.id && (editingId === req.id || rejectingId === req.id)) {
      return (
        <span className="text-xs text-slate-400 italic" title="상세 팝업에서 승인·반려를 진행할 수 있습니다.">
          팝업에서 처리 중
        </span>
      );
    }

    // 반려 사유 입력 단계
    if (rejectingId === req.id) {
      return (
        <div className={isModal ? 'flex flex-col gap-2' : 'flex flex-col gap-2 items-end'}>
          <div className="w-full">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">
              반려 사유 <span className="text-rose-400">(필수)</span>
            </label>
            <textarea
              rows={2}
              placeholder="반려 사유를 입력해 주세요"
              className={
                isModal
                  ? 'ui-field w-full py-2 text-xs resize-none'
                  : 'ui-field w-full max-w-[13rem] py-2 text-xs resize-none sm:max-w-xs'
              }
              value={rejectReason}
              onChange={(e) => { setRejectReason(e.target.value); setRejectError(''); }}
              autoFocus
            />
            {rejectError && (
              <p className="mt-1 text-[11px] text-rose-500">{rejectError}</p>
            )}
          </div>
          <div className={rowWrap}>
            <button
              type="button"
              onClick={() => handleRejectConfirm(req.id)}
              className="rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:brightness-105"
            >
              반려 확정
            </button>
            <button
              type="button"
              onClick={cancelRejecting}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              취소
            </button>
          </div>
        </div>
      );
    }

    // 처리하기 클릭 후 승인/반려 선택 단계
    if (editingId === req.id) {
      return (
        <div className={rowWrap}>
          <button
            type="button"
            onClick={() => handleStatusChange(req.id, RequestStatus.APPROVED)}
            className="rounded-lg bg-gradient-to-br from-[#0063b8] to-[#00529B] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#00529B]/20 hover:brightness-105"
          >
            승인
          </button>
          <button
            type="button"
            onClick={() => { setEditingId(null); startRejecting(req.id); }}
            className="rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:brightness-105"
          >
            반려
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            취소
          </button>
        </div>
      );
    }

    return (
      <div className={rowWrap}>
        {req.status === RequestStatus.PENDING && (
          <button
            type="button"
            onClick={() => setEditingId(req.id)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#00529B] hover:bg-[#00529B]/10 transition-colors"
          >
            처리하기
          </button>
        )}
        {req.status === RequestStatus.APPROVED && (
          <button
            type="button"
            onClick={() => handleStatusChange(req.id, RequestStatus.COMPLETED)}
            className="rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 hover:brightness-105"
          >
            구매 완료
          </button>
        )}
        {isFinalizedRequest(req.status) && (
          <>
            <button
              type="button"
              onClick={() => handleDelete(req.id)}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              삭제
            </button>
            <span className="text-slate-400 text-xs italic">처리됨</span>
          </>
        )}
      </div>
    );
  };

  const pending = requests.filter((r) => r.status === RequestStatus.PENDING).length;
  const completed = requests.filter((r) => r.status === RequestStatus.COMPLETED).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#00529B] mb-1">Admin</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">전체 신청 관리</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            비품 신청 승인·반려 및 구매 완료 처리를 진행합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
            대기 {pending}건
          </span>
          <span className="inline-flex items-center rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
            완료 {completed}건
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_24px_56px_-36px_rgba(15,23,42,0.22)] backdrop-blur-[2px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/90 bg-white">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">신청일</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">신청자</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">품목(수량)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">사유 및 URL</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">현재상태</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">관리액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {requests.map((req) => (
                <tr key={req.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{req.employeeName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{req.item}</div>
                    <div className="text-xs text-slate-500">{req.quantity}개</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setDetailRequestId(req.id)}
                        className="block w-full text-left text-sm text-slate-600 truncate hover:text-[#00529B] hover:underline underline-offset-2"
                        title={req.reason}
                      >
                        {req.reason}
                      </button>
                      {req.purchaseUrl && (
                        <a
                          href={req.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#00529B] hover:text-[#003d73]"
                          onClick={(e) => {
                            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
                            e.preventDefault();
                            setDetailRequestId(req.id);
                          }}
                        >
                          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          구매 링크
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={req.status} />
                  </td>
                  <td className="px-6 py-4 text-right">{renderAdminActions(req, 'table')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detailRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55"
          role="presentation"
          onClick={() => setDetailRequestId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-detail-title"
            className="admin-modal-panel max-w-lg w-full max-h-[min(90vh,640px)] overflow-y-auto rounded-3xl border border-slate-200 p-6 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#00529B] mb-1">신청자</p>
                <h4 id="admin-detail-title" className="text-xl font-bold text-slate-900 tracking-tight">
                  {detailRequest.employeeName}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  {detailRequest.department} · {detailRequest.employeeId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailRequestId(null)}
                className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                닫기
              </button>
            </div>

            <div className="admin-modal-panel-inner mt-5 space-y-4 rounded-2xl p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">신청일</p>
                <p className="text-sm text-slate-700">
                  {new Date(detailRequest.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">품목</p>
                <p className="text-sm font-semibold text-slate-900">{detailRequest.item}</p>
                <p className="text-xs text-slate-500">{detailRequest.quantity}개</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">사유</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detailRequest.reason}</p>
              </div>
              {detailRequest.purchaseUrl && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">구매 URL</p>
                  <button
                    type="button"
                    onClick={() => openPurchaseLink(detailRequest.purchaseUrl!)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00529B] hover:text-[#003d73] break-all text-left"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    새 탭에서 링크 열기
                  </button>
                  <p className="text-xs text-slate-400 mt-1 break-all">{detailRequest.purchaseUrl}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">상태</span>
                <Badge status={detailRequest.status} />
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">관리액션</p>
              {renderAdminActions(detailRequest, 'modal')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
