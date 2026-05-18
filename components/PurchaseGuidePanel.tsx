import React, { useState } from 'react';

const accent = 'text-[#00529B]';
const accentSoft = 'bg-[#00529B]/10 text-[#00529B]';

/** 1·2·3 … 열 너비 통일 */
const pillClass =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00529B]/10 text-[10px] font-bold text-[#00529B]';

/** 품목별 행 라벨 — 좁은 열·왼쪽 정렬 */
const rowLabelBrand =
  'text-left text-[11px] font-bold leading-snug tracking-tight text-[#00529B] tabular-nums';
const rowLabelAmber =
  'text-left text-[11px] font-bold leading-snug tracking-tight text-amber-800 tabular-nums';

function Em({ children }: { children: React.ReactNode }) {
  return <span className={`font-semibold ${accent}`}>{children}</span>;
}

type TabId = 'principles' | 'items';

function DetailLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex min-w-0 items-start gap-x-2.5 border-b border-slate-100/90 py-2.5 last:border-0">
      <span className={`${pillClass} shrink-0`}>{label}</span>
      <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}

type ItemPair = {
  label: string;
  value: React.ReactNode;
  labelTone?: 'brand' | 'amber';
  /** 값을 한 줄로 유지 (좁은 폭에서 가로 스크롤 가능) */
  nowrap?: boolean;
};

function ItemBlock({ code, heading, rows }: { code: string; heading: React.ReactNode; rows: ItemPair[] }) {
  return (
    <div className="border-b border-slate-100/90 py-2.5 text-left last:border-0">
      <div className="flex min-w-0 gap-2">
        <span className={`${pillClass} mt-0.5 shrink-0`}>{code}</span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="min-w-0 text-[12px] font-bold leading-snug text-slate-900">{heading}</p>
          <dl className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-2 gap-y-1 items-baseline sm:grid-cols-[3.25rem_minmax(0,1fr)]">
            {rows.map((row) => {
              const labelCls = row.labelTone === 'amber' ? rowLabelAmber : rowLabelBrand;
              const ddCls = row.nowrap
                ? 'text-left text-[12px] leading-relaxed text-slate-700 whitespace-nowrap min-w-min'
                : 'min-w-0 text-left text-[12px] leading-relaxed text-slate-700';
              return (
                <React.Fragment key={`${code}-${row.label}`}>
                  <dt className={`${labelCls} shrink-0`}>{row.label}</dt>
                  <dd className={ddCls}>{row.value}</dd>
                </React.Fragment>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseGuidePanel() {
  const [tab, setTab] = useState<TabId>('principles');

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_48px_-28px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80 overflow-hidden">
      <div className="relative border-b border-slate-100/90 bg-white px-3 py-4 sm:px-4">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00529B]/40 via-[#0078c8]/50 to-[#00529B]/40" aria-hidden />
        <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accent}`}>Guide</p>
        <h2 className="mt-1 text-[15px] font-bold tracking-tight text-slate-900">구매·지급 안내</h2>
        <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">아래 칸을 눌러 세부 내용을 확인하세요.</p>

        <div className="mt-4 grid grid-cols-2 gap-2" role="tablist" aria-label="안내 구분">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'principles'}
            onClick={() => setTab('principles')}
            className={`rounded-2xl border px-2.5 py-2.5 text-left transition-all duration-200 ${
              tab === 'principles'
                ? 'border-[#00529B]/35 bg-gradient-to-br from-[#00529B]/12 to-white shadow-md shadow-[#00529B]/10 ring-1 ring-[#00529B]/15'
                : 'border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white hover:shadow-sm'
            }`}
          >
            <span className="block text-[12px] font-bold text-slate-900">구매 원칙</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
              업무목적성·표준화·예산범위내·최소필요
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'items'}
            onClick={() => setTab('items')}
            className={`rounded-2xl border px-2.5 py-2.5 text-left transition-all duration-200 ${
              tab === 'items'
                ? 'border-[#00529B]/35 bg-gradient-to-br from-[#00529B]/12 to-white shadow-md shadow-[#00529B]/10 ring-1 ring-[#00529B]/15'
                : 'border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white hover:shadow-sm'
            }`}
          >
            <span className="block text-[12px] font-bold text-slate-900">품목별 기준</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
              IT·주변기기·소모품
            </span>
          </button>
        </div>
      </div>

      <div className="px-3 py-4 pb-5 text-left sm:px-4" role="tabpanel" aria-live="polite">
        {tab === 'principles' && (
          <div className="rounded-2xl border border-slate-100/90 bg-white px-2 sm:px-3 py-1 shadow-inner">
            <DetailLine label="1" text="업무 목적성: 업무 수행과 직접 관련된 물품" />
            <DetailLine label="2" text="표준화 원칙: 동일 용도의 물품은 회사 지정 표준 모델 우선 구매" />
            <DetailLine label="3" text="예산 범위내: 공통 예산 내 구매" />
            <DetailLine label="4" text="최소 필요 원칙: 과도한 고사양 / 고가 제품 제한" />
          </div>
        )}

        {tab === 'items' && (
          <div className="rounded-2xl border border-slate-200/70 bg-white px-2.5 sm:px-3 py-2 shadow-inner">
            <ItemBlock
              code="1"
              heading={
                <>
                  <span className={accent}>IT기기</span>
                  <span className="text-slate-800"> (노트북·모니터)</span>
                </>
              }
              rows={[
                { label: '대상', value: '업무용 노트북, 모니터' },
                {
                  label: '구매',
                  value: (
                    <>
                      표준 사양 <Em>일괄 구매</Em>
                    </>
                  ),
                },
                {
                  label: '교체',
                  value: (
                    <>
                      <Em>5년</Em> 주기
                    </>
                  ),
                },
                {
                  label: '모니터',
                  value: (
                    <>
                      추가·교체는 <Em>업무 연락</Em> 후 <Em>주관부서</Em>에서 진행
                    </>
                  ),
                },
              ]}
            />
            <ItemBlock
              code="2"
              heading={
                <>
                  <span className={accent}>PC 주변기기</span>
                  <span className="text-slate-800">·액세서리</span>
                </>
              }
              rows={[
                { label: '대상', value: '키보드, 마우스, 업무용 액세서리' },
                {
                  label: '지급',
                  nowrap: true,
                  value: (
                    <>
                      <Em>입사 시 지급</Em> — 불량·고장 시 <Em>반납 후 교체</Em>
                    </>
                  ),
                },
                {
                  label: '기준',
                  value: (
                    <>
                      <Em>표준 모델</Em> 또는 회사가 정한 <Em>동일 금액대</Em>
                    </>
                  ),
                },
                {
                  label: '필름',
                  labelTone: 'amber',
                  value: (
                    <span className="text-amber-950/95">
                      <strong className="font-semibold text-amber-900">
                        액정·보안 필름 등은 회사 구매·지급 불가입니다.
                      </strong>{' '}
                      개인정보 취급 업무로 한정해 <strong className="font-semibold text-amber-900">승인된 경우</strong>에만
                      예외적으로 지급합니다.
                    </span>
                  ),
                },
              ]}
            />
            <ItemBlock
              code="3"
              heading={
                <>
                  <span className={accent}>일반 소모성</span>
                  <span className="text-slate-800"> 사무용품</span>
                </>
              }
              rows={[
                { label: '대상', value: '볼펜, 테이프, 지우개 등 사무 소모품' },
                {
                  label: '구매',
                  value: (
                    <>
                      <Em>주관부서</Em> <Em>일괄 구매</Em>
                    </>
                  ),
                },
                {
                  label: '추가',
                  value: (
                    <>
                      <span className={`inline rounded px-1 py-0.5 text-[11px] font-semibold ${accentSoft}`}>
                        신청 접수
                      </span>
                      {' → '}
                      일괄 구매 · <Em>공용 서랍장 분출</Em> 지급
                    </>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
