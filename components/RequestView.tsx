
import React, { useState } from 'react';
import { SUPPLY_ITEMS } from '../constants';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface RequestViewProps {
  user: User;
  onSuccess: () => void | Promise<void>;
}

const RequestView: React.FC<RequestViewProps> = ({ user, onSuccess }) => {
  const [selectedItem, setSelectedItem] = useState(SUPPLY_ITEMS[0]);
  const [customItem, setCustomItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // '기타(직접 입력)' 문자열 매칭
  const isOtherSelected = selectedItem === '기타(직접 입력)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalItem = isOtherSelected ? customItem.trim() : selectedItem;
    
    if (isOtherSelected && !finalItem) {
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900">신청서 작성</h3>
        <p className="text-slate-500 text-sm mt-1">필요한 물품과 수량, 사유를 정확히 기재해 주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">품목 선택</label>
          <select 
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border"
          >
            {SUPPLY_ITEMS.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          
          {isOtherSelected && (
            <div className="mt-3">
              <input 
                type="text"
                required
                placeholder="신청할 품목명을 직접 입력하세요"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border bg-indigo-50/30"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">수량</label>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              min="1" 
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-32 rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border"
            />
            <span className="text-slate-500">개 / 개입</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">신청 사유</label>
          <textarea 
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="예: 프로젝트 팀 회의용 비품 충전, 신규 입사자 배정 등"
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">참고 URL(필수)</label>
          <input 
            type="url"
            required
            value={purchaseUrl}
            onChange={(e) => setPurchaseUrl(e.target.value)}
            placeholder="구매 희망 품목의 웹사이트 주소나 URL이 있으면 입력해 주세요"
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg text-white font-bold transition-all shadow-md ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? '제출 중...' : '신청서 제출'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestView;
