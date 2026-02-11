
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-300 flex flex-col shadow-lg z-20">
        <div className="p-6 border-b border-gray-100 bg-white flex justify-center md:justify-start overflow-hidden">
          <Logo size="sm" />
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => onViewChange('REQUEST')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded text-sm font-bold transition-all ${
              activeView === 'REQUEST' ? 'bg-[#00529B] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            물품 신청하기
          </button>
          
          <button
            onClick={() => onViewChange('HISTORY')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded text-sm font-bold transition-all ${
              activeView === 'HISTORY' ? 'bg-[#00529B] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            내 신청내역
          </button>

          {user.isAdmin && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Administrator</p>
              <button
                onClick={() => onViewChange('ADMIN')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded text-sm font-bold transition-all ${
                  activeView === 'ADMIN' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.543-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                신청 관리 모드
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 bg-white mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 truncate">{user.employeeId}</p>
              <p className="text-sm font-medium text-gray-600 truncate">{user.name}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-center text-xs text-gray-400 hover:text-red-500 font-bold py-2 border border-gray-200 rounded hover:border-red-200 transition-all"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white border-b border-gray-300 h-16 flex items-center px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-gray-700">
            {activeView === 'REQUEST' && '사무용품 신청서 작성'}
            {activeView === 'HISTORY' && '나의 신청 내역'}
            {activeView === 'ADMIN' && '전사 신청 통합 관리'}
          </h2>
          <div className="ml-auto text-xs text-gray-400 font-medium tracking-tight">
            SBS M&C Office Supply Portal v1.0
          </div>
        </header>
        <div className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
