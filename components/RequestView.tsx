
import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface RequestViewProps {
  user: User;
  onSuccess: () => void | Promise<void>;
}

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
      <div className="bg-slate-50 border border-slate-400 rounded-2xl p-5">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">빠른 신청</h3>
          <p className="text-slate-500 text-sm mt-1">필요한 물품 정보를 한 번에 등록하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">신청자</label>
            <div className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700">
              {user.name} ({user.employeeId})
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">품목 입력</label>
            <input
              type="text"
              required
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="신청할 품목명을 입력하세요"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">수량</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">참고 URL (선택사항)</label>
              <input
                type="url"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="구매 링크가 있으면 입력하세요"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">신청 사유</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="사용 목적을 간단히 적어 주세요 (5~200자)"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? '저장 중...' : '기록 저장'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestView;
