
import React, { useState, useEffect, useCallback } from 'react';
import { User, ViewType, SupplyRequest } from './types';
import { DEPARTMENTS } from './constants';
import { storageService, type RequestUpdate } from './services/storageService';
import { authService } from './services/authService';
import Layout from './components/Layout';
import RequestView from './components/RequestView';
import HistoryView from './components/HistoryView';
import AdminView from './components/AdminView';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeView, setActiveView] = useState<ViewType>('REQUEST');
  const [requests, setRequests] = useState<SupplyRequest[]>([]);

  const refreshRequests = useCallback(async () => {
    try {
      const loaded = await storageService.getRequests();
      setRequests(loaded);
    } catch (error) {
      console.error('Failed to load requests', error);
      alert('신청 데이터 조회 중 오류가 발생했습니다.');
    }
  }, []);

  const handleUpdateRequest = useCallback(async (id: string, updates: RequestUpdate): Promise<boolean> => {
    try {
      const updated = await storageService.updateRequest(id, updates);
      if (!updated) {
        return false;
      }
      await refreshRequests();
      return true;
    } catch (error) {
      console.error('Failed to update request', error);
      alert('신청 수정 중 오류가 발생했습니다.');
      return false;
    }
  }, [refreshRequests]);

  const handleCancelRequest = useCallback(async (id: string): Promise<boolean> => {
    try {
      const canceled = await storageService.cancelRequest(id);
      if (!canceled) {
        return false;
      }
      await refreshRequests();
      return true;
    } catch (error) {
      console.error('Failed to cancel request', error);
      alert('신청 취소 중 오류가 발생했습니다.');
      return false;
    }
  }, [refreshRequests]);

  useEffect(() => {
    void refreshRequests();
  }, [refreshRequests]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const authResult = authService.authenticate(loginId, password);
    if (!authResult) {
      setLoginError('등록된 사번만 로그인 가능합니다. 비밀번호는 사번과 동일합니다.');
      return;
    }

    const newUser: User =
      authResult.type === 'admin'
        ? {
            employeeId: '1111',
            name: '관리자',
            department: '관리자',
            isAdmin: true
          }
        : {
            employeeId: authResult.employee.employeeId,
            name: authResult.employee.name,
            department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
            isAdmin: false
          };
    
    setUser(newUser);
    setActiveView(newUser.isAdmin ? 'ADMIN' : 'REQUEST');
  };

  const handleLogout = () => {
    setUser(null);
    setLoginId('');
    setPassword('');
    setLoginError('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" className="mb-2" />
            <p className="text-slate-500 text-sm">내부 직원 전용 사무용품 신청 시스템</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">사원번호</label>
              <input 
                type="text" 
                required
                className="w-full rounded-lg border-slate-200 py-3 px-4 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="사번을 입력하세요 (예: 120034)"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">비밀번호</label>
              <input 
                type="password" 
                required
                className="w-full rounded-lg border-slate-200 py-3 px-4 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#00529B] text-white font-bold py-3.5 rounded-lg hover:bg-[#003d73] transition-colors shadow-lg active:scale-[0.98]"
            >
              로그인
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              로그인 관련 문의: 경영지원팀 (내선 2828)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userRequests = requests.filter(r => r.employeeId === user.employeeId);

  return (
    <Layout 
      user={user} 
      activeView={activeView} 
      onViewChange={setActiveView} 
      onLogout={handleLogout}
    >
      {activeView === 'REQUEST' && (
        <RequestView 
          user={user} 
          onSuccess={async () => {
            await refreshRequests();
            setActiveView('HISTORY');
          }} 
        />
      )}
      
      {activeView === 'HISTORY' && (
        <HistoryView
          requests={userRequests}
          onCancel={handleCancelRequest}
          onUpdate={handleUpdateRequest}
        />
      )}
      
      {activeView === 'ADMIN' && user.isAdmin && (
        <AdminView requests={requests} onRefresh={refreshRequests} />
      )}
    </Layout>
  );
};

export default App;
