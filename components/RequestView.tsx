
import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface RequestViewProps {
  user: User;
  onSuccess: () => void | Promise<void>;
}

const labelCls = 'block text-sm font-semibold text-slate-700 mb-2';

const RequestView: React.FC<RequestViewProps> = ({ user, onSuccess }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalItem = item.trim();
    if (!finalItem) {
      alert('품목명을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await storageService.saveRequest({
        employeeId: user.employeeId,
        employeeName: user.name,
        department: user.department,
        item: finalItem,
        quantity,
        reason,
        purchaseUrl: purchaseUrl.trim() || undefined
      });

      alert('신청이 정상 접수되었습니다.');
      await onSuccess();
    } catch (error) {
      console.error('Failed to save request', error);
      alert('신청 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.1)]">
        <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-[#00529B] via-[#0078c8] to-[#00529B]" aria-hidden />
        <div className="relative p-6 md:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#00529B] mb-1">Quick request</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">빠른 신청</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              필요한 물품 정보를 한 번에 등록합니다. 표준 모델·예산 원칙은 우측 안내를 참고하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>신청자</label>
              <div className="ui-field ui-readonly py-3">{user.name} ({user.employeeId})</div>
            </div>

            <div>
              <label className={labelCls}>품목 입력</label>
              <input
                type="text"
                required
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="신청할 품목명을 입력하세요"
                className="ui-field py-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>수량</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="ui-field py-3"
                />
              </div>
              <div>
                <label className={`${labelCls} leading-snug`}>
                  (회사 지정 모델로 구매 / 참조용 url 입력 가능)
                </label>
                <input
                  type="url"
                  value={purchaseUrl}
                  onChange={(e) => setPurchaseUrl(e.target.value)}
                  placeholder="참조용 링크를 입력하세요 (선택)"
                  className="ui-field py-3"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>신청 사유(업무 목적성)</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="사용 목적을 간단히 적어 주세요 (5~200자)"
                className="ui-field py-3 min-h-[5.5rem] resize-y"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="ui-btn-primary">
              {isSubmitting ? '신청 중...' : '신청 완료'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestView;
