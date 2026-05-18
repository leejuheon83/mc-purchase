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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="ui-spinner" aria-hidden />
        <p className="text-sm font-medium text-slate-600">로딩 중...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen relative bg-white flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="relative w-full max-w-md">
        <div className="relative rounded-3xl border border-slate-200/70 bg-white p-8 md:p-10 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.1)]">
          <div className="flex flex-col items-center mb-9">
            <Logo size="lg" className="mb-4 drop-shadow-sm" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight text-center">사무용품 신청 포털</h1>
            <p className="text-slate-500 text-sm mt-2 text-center leading-relaxed">
              내부 직원 전용 · 경영지원 비품 신청
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">사번</label>
              <input
                type="text"
                required
                autoComplete="username"
                className="ui-field py-3.5 px-4"
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
                className="ui-field py-3.5 px-4"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-700 leading-snug shadow-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="ui-btn-primary mt-1">
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">로그인 관련 문의: 경영지원팀 (내선 2828)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
