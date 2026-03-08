'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { storageService, type RequestUpdate } from '../services/storageService';
import Layout from '../components/Layout';
import RequestView from '../components/RequestView';
import HistoryView from '../components/HistoryView';
import AdminView from '../components/AdminView';
import type { ViewType } from '../types';
import type { AuthUser } from '../types/auth';

function mapAuthUserToUser(a: AuthUser) {
  return {
    employeeId: a.employeeId,
    name: a.name,
    department: a.department,
    isAdmin: a.isAdmin
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>('REQUEST');
  const [requests, setRequests] = useState<import('../types').SupplyRequest[]>([]);

  const refreshRequests = useCallback(async () => {
    try {
      const loaded = await storageService.getRequests();
      setRequests(loaded);
    } catch (error) {
      console.error('Failed to load requests', error);
      alert('신청 데이터 조회 중 오류가 발생했습니다.');
    }
  }, []);

  const handleUpdateRequest = useCallback(
    async (id: string, updates: RequestUpdate): Promise<boolean> => {
      try {
        const updated = await storageService.updateRequest(id, updates);
        if (!updated) return false;
        await refreshRequests();
        return true;
      } catch (error) {
        console.error('Failed to update request', error);
        alert('신청 수정 중 오류가 발생했습니다.');
        return false;
      }
    },
    [refreshRequests]
  );

  const handleCancelRequest = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const canceled = await storageService.cancelRequest(id);
        if (!canceled) return false;
        await refreshRequests();
        return true;
      } catch (error) {
        console.error('Failed to cancel request', error);
        alert('신청 취소 중 오류가 발생했습니다.');
        return false;
      }
    },
    [refreshRequests]
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    void refreshRequests();
  }, [refreshRequests]);

  if (!user) return null;

  const appUser = mapAuthUserToUser(user);
  const userRequests = requests.filter((r) => r.employeeId === user.employeeId);

  return (
    <Layout
      user={appUser}
      activeView={activeView}
      onViewChange={setActiveView}
      onLogout={handleLogout}
    >
      {activeView === 'REQUEST' && (
        <RequestView
          user={appUser}
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
}
