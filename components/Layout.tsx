
import React from 'react';
import { User, ViewType } from '../types';
import Logo from './Logo';
import PurchaseGuidePanel from './PurchaseGuidePanel';

interface LayoutProps {
  user: User;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const navBtn = (active: boolean) =>
  `group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
    active
      ? 'bg-gradient-to-r from-[#00529B]/14 to-[#00529B]/5 text-[#004080] shadow-[inset_0_0_0_1px_rgba(0,82,155,0.12)] ring-1 ring-[#00529B]/10'
      : 'text-slate-600 hover:bg-white/90 hover:text-slate-900 hover:shadow-sm'
  }`;

const Layout: React.FC<LayoutProps> = ({ user, activeView, onViewChange, onLogout, children }) => {
  const initial = user.name?.charAt(0) ?? '?';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-slate-900">
      <aside className="w-full md:w-[19rem] shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200/70 flex flex-col z-20 shadow-[4px_0_24px_-12px_rgba(15,23,42,0.06)]">
        <div className="px-5 py-6 border-b border-slate-200/40 flex justify-center md:justify-start overflow-hidden">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em]">
            메뉴
          </p>
          <button type="button" onClick={() => onViewChange('REQUEST')} className={navBtn(activeView === 'REQUEST')}>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                activeView === 'REQUEST'
                  ? 'bg-[#00529B]/15 text-[#00529B]'
                  : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
              }`}
            >
              <svg className="w-[1.125rem] h-[1.125rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            물품 신청하기
          </button>

          <button type="button" onClick={() => onViewChange('HISTORY')} className={navBtn(activeView === 'HISTORY')}>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                activeView === 'HISTORY'
                  ? 'bg-[#00529B]/15 text-[#00529B]'
                  : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
              }`}
            >
              <svg className="w-[1.125rem] h-[1.125rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            내 신청내역
          </button>

          {user.isAdmin && (
            <div className="pt-6 mt-6 border-t border-slate-200/80">
              <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em]">
                관리자
              </p>
              <button type="button" onClick={() => onViewChange('ADMIN')} className={navBtn(activeView === 'ADMIN')}>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    activeView === 'ADMIN'
                      ? 'bg-[#00529B]/15 text-[#00529B]'
                      : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
                  }`}
                >
                  <svg className="w-[1.125rem] h-[1.125rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                신청 관리 모드
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200/50 bg-white mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00529B] to-[#003d73] text-sm font-bold text-white shadow-lg shadow-[#00529B]/25 ring-2 ring-white/90">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.employeeId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-center text-xs font-semibold text-slate-500 hover:text-rose-600 py-2.5 rounded-xl border border-slate-200/90 bg-white/60 hover:bg-rose-50/80 hover:border-rose-200/80 transition-all"
          >
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col min-h-0 min-w-0 overflow-y-auto overscroll-y-contain">
        <header className="sticky top-0 z-10 shrink-0 w-full border-b border-slate-200/70 bg-white px-6 py-4 md:px-8 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.08)]">
          <div className="flex max-w-[100rem] mx-auto w-full flex-col gap-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00529B]/90">Portal</p>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {activeView === 'REQUEST' && '사무용품 신청서 작성'}
              {activeView === 'HISTORY' && '나의 신청 내역'}
              {activeView === 'ADMIN' && '전사 신청 통합 관리'}
            </h2>
          </div>
        </header>
        <div className="flex flex-1 flex-col lg:flex-row min-h-0 min-w-0">
          <div className="flex-1 min-w-0 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
          <aside className="min-w-0 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200/70 bg-white lg:w-[24rem] xl:w-[26rem] p-6 md:p-8 lg:shadow-[-12px_0_40px_-28px_rgba(15,23,42,0.1)]">
            <PurchaseGuidePanel />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Layout;
