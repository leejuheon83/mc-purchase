import React, { useState } from 'react';

export default function PurchaseGuidePanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-300 rounded-xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
        aria-expanded={open}
      >
        <span>구매 원칙 · 품목별 구매 및 지급 기준</span>
        <span className="text-slate-500 shrink-0 text-xs font-normal">{open ? '접기' : '클릭하여 보기'}</span>
      </button>
      {open && (
        <div className="border-t border-slate-200 px-4 pb-4 pt-3 text-xs text-slate-700 leading-relaxed max-h-[min(70vh,32rem)] overflow-y-auto space-y-5">
          <section>
            <h3 className="font-bold text-slate-900 text-sm mb-2">[구매 원칙]</h3>
            <ul className="list-none space-y-1.5 pl-0">
              <li><span className="font-semibold text-slate-800">가.</span> 업무 목적성: 업무 수행과 직접 관련된 물품에 한하여 구매</li>
              <li><span className="font-semibold text-slate-800">나.</span> 표준화 원칙: 동일 용도의 물품은 회사 지정 표준 모델 우선 구매</li>
              <li><span className="font-semibold text-slate-800">다.</span> 예산 범위내: 공통 예산 내 구매</li>
              <li><span className="font-semibold text-slate-800">라.</span> 최소 필요 원칙: 과도한 고사양 / 고가 제품 제한</li>
            </ul>
          </section>
          <section>
            <h3 className="font-bold text-slate-900 text-sm mb-2">[품목별 구매 및 지급 기준]</h3>
            <ul className="list-none space-y-3 pl-0">
              <li>
                <span className="font-semibold text-slate-800">가.</span> IT기기(노트북 및 모니터): 표준사양 일괄구매(교체주기 5년)
                <p className="mt-1 pl-0 text-slate-600">※ 모니터 필요 시 업무 연락을 통한 주관부서 구매</p>
              </li>
              <li>
                <span className="font-semibold text-slate-800">나.</span> PC주변기기 및 액세서리: 키보드 및 마우스 입사 시 지급(기기 결함·고장 시 반납 후 교체)
                <ul className="mt-1.5 ml-3 list-disc space-y-1 text-slate-600">
                  <li>표준모델 지급 또는 동일 금액대 모델 구매</li>
                  <li>액정 보호 필름 및 보안 필름 등 회사 구매 불가(개인정보 취급 업무 한정 승인 후 지급)</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-slate-800">다.</span> 일반 소모성 사무용품: 볼펜, 테이프, 지우개 등 일반 소모품 주관부서 일괄 구매
                <ul className="mt-1.5 ml-3 list-disc space-y-1 text-slate-600">
                  <li>추가 품목 필요 시 신청(일괄 구매 후, 공용 서랍장 분출)</li>
                </ul>
              </li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
