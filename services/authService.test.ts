import { describe, expect, it } from 'vitest';
import { authService } from './authService';

describe('authService.authenticate', () => {
  it('returns admin when admin credentials match', () => {
    const result = authService.authenticate('1111', '1111');
    expect(result).not.toBeNull();
    expect(result?.type).toBe('admin');
  });

  it('returns null for invalid admin password', () => {
    const result = authService.authenticate('1111', 'wrong');
    expect(result).toBeNull();
  });

  it('returns employee when loginId and password match a known employee', () => {
    const result = authService.authenticate('120032', '120032');
    expect(result?.type).toBe('employee');
    if (result?.type === 'employee') {
      expect(result.employee.employeeId).toBe('120032');
      expect(result.employee.name).toBe('이주헌');
    }
  });

  it('returns null when loginId and password do not match', () => {
    expect(authService.authenticate('120032', '120033')).toBeNull();
  });

  it('returns null for unknown employeeId even if passwords match', () => {
    expect(authService.authenticate('999999', '999999')).toBeNull();
  });

  it('trims whitespace before comparison', () => {
    const result = authService.authenticate(' 120032 ', '120032');
    expect(result?.type).toBe('employee');
  });

  it('returns null for empty values', () => {
    expect(authService.authenticate('', '')).toBeNull();
  });
});
