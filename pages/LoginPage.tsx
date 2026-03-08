'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmployeeList, getKoreanFirebaseErrorMessage } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const [employeeNo, setEmployeeNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!employeeNo.trim()) {
      setError('사번을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmployeeList(employeeNo.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : getKoreanFirebaseErrorMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 font-medium">로딩 중...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" className="mb-3" />
          <p className="text-slate-500 text-sm tracking-tight">내부 직원 전용 사무용품 신청 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">사번</label>
            <input
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
              placeholder="사번을 입력하세요 (예: 120034)"
              value={employeeNo}
              onChange={(e) => setEmployeeNo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#00529B] text-white font-semibold py-3.5 rounded-xl hover:bg-[#003d73] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-[0.99]"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">로그인 관련 문의: 경영지원팀 (내선 2828)</p>
        </div>
      </div>
    </div>
  );
}
