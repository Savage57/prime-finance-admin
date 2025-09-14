import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../../hooks/useAuth';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('initializes with logged out state', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  test('initializes as authenticated when token exists', () => {
    localStorage.setItem('auth.token', 'mock-token');
    
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('logout clears tokens and state', () => {
    localStorage.setItem('auth.token', 'mock-token');
    localStorage.setItem('auth.refreshToken', 'mock-refresh-token');
    
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth.token')).toBe(null);
    expect(localStorage.getItem('auth.refreshToken')).toBe(null);
  });
});