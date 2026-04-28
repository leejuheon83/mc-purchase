import { employees, type Employee } from '../data/employees';

const employeesById = new Map(employees.map((employee) => [employee.employeeId, employee]));
const ADMIN_CREDENTIALS = {
  id: 'admin',
  password: 'admin'
} as const;

type AuthResult =
  | { type: 'admin' }
  | { type: 'employee'; employee: Employee };

export const authService = {
  authenticate: (loginId: string, password: string): AuthResult | null => {
    const trimmedLoginId = loginId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLoginId || !trimmedPassword) {
      return null;
    }

    if (
      trimmedLoginId === ADMIN_CREDENTIALS.id &&
      trimmedPassword === ADMIN_CREDENTIALS.password
    ) {
      return { type: 'admin' };
    }

    if (trimmedLoginId !== trimmedPassword) {
      return null;
    }

    const employee = employeesById.get(trimmedLoginId);
    if (!employee) {
      return null;
    }

    return { type: 'employee', employee };
  }
};
