
import React from 'react';
import { User, ViewType } from '../types';
import Logo from './Logo';

interface LayoutProps {
  user: User;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeView, onViewChange, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 text-slate-900">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="px-6 py-5 border-b border-slate-200 bg-white flex justify-center md:justify-start overflow-hidden">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-4">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main</p>
          <button
            onClick={() => onViewChange('REQUEST')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeView === 'REQUEST'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            물품 신청하기
          </button>

          <button
            onClick={() => onViewChange('HISTORY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeView === 'HISTORY'
                ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            내 신청내역
          </button>

          {user.isAdmin && (
            <div className="pt-6 mt-6 border-t border-slate-200">
              <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leadership</p>
              <button
                onClick={() => onViewChange('ADMIN')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeView === 'ADMIN'
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.543-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                신청 관리 모드
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 bg-white mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{user.employeeId}</p>
              <p className="text-sm text-slate-500 truncate">{user.name}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-center text-xs text-slate-400 hover:text-rose-500 font-semibold py-2.5 border border-slate-200 rounded-lg hover:border-rose-200 transition-all"
          >
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-slate-100 border-b border-slate-200 px-6 py-3 sticky top-0 z-10">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            {activeView === 'REQUEST' && '사무용품 신청서 작성'}
            {activeView === 'HISTORY' && '나의 신청 내역'}
            {activeView === 'ADMIN' && '전사 신청 통합 관리'}
          </h2>
        </header>
        <div className="p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
