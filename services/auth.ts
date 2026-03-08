/**
 * Firebase Auth for internal purchase site.
 * MVP: employeeNo is mapped to synthetic email (employeeNo@mc-purchase.internal).
 * For enterprise production, migrate to custom token / SSO later.
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type UserCredential
} from 'firebase/auth';
import { auth } from './firebase';
import { employees } from '../data/employees';

const SYNTHETIC_EMAIL_DOMAIN = '@mc-purchase.internal';
const ADMIN_EMPLOYEE_ID = '1111';

const employeesById = new Map(employees.map((e) => [e.employeeId, e]));

/**
 * 직원 목록에 있는 사번+비밀번호인지 검증.
 * 비밀번호는 사번과 동일한 경우 허용, 관리자(1111)는 별도 비밀번호.
 */
function isValidEmployeeCredential(employeeNo: string, password: string): boolean {
  const id = employeeNo.trim();
  const pwd = password.trim();
  if (!id || !pwd) return false;
  if (id === ADMIN_EMPLOYEE_ID) return pwd === '1111';
  if (employeesById.has(id)) return pwd === id;
  return false;
}

/**
 * Convert employee number to synthetic email for Firebase Auth.
 * Example: "10001" -> "10001@mc-purchase.internal"
 */
export function employeeNoToEmail(employeeNo: string): string {
  const trimmed = employeeNo.trim();
  if (!trimmed) return '';
  return `${trimmed}${SYNTHETIC_EMAIL_DOMAIN}`;
}

/**
 * Parse employee number from synthetic email.
 * Example: "10001@mc-purchase.internal" -> "10001"
 */
export function emailToEmployeeNo(email: string): string {
  if (!email || !email.includes(SYNTHETIC_EMAIL_DOMAIN)) return '';
  return email.replace(SYNTHETIC_EMAIL_DOMAIN, '');
}

/**
 * Sign in with employee number and password.
 * Uses signInWithEmailAndPassword under the hood with synthetic email.
 */
export async function signInWithEmployeeNo(
  employeeNo: string,
  password: string
): Promise<UserCredential> {
  const email = employeeNoToEmail(employeeNo);
  if (!email) {
    throw new Error('사번을 입력해 주세요.');
  }
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * 직원 목록 기반 로그인. 사번=비밀번호인 직원은 첫 로그인 시 자동으로 Firebase 사용자 생성.
 */
export async function signInWithEmployeeList(
  employeeNo: string,
  password: string
): Promise<UserCredential> {
  const id = employeeNo.trim();
  const pwd = password;

  if (!id) throw new Error('사번을 입력해 주세요.');
  if (!pwd) throw new Error('비밀번호를 입력해 주세요.');

  if (!isValidEmployeeCredential(id, pwd)) {
    throw new Error('등록된 사번이 아니거나 비밀번호가 올바르지 않습니다.');
  }

  try {
    return await signInWithEmployeeNo(id, pwd);
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code?: string }).code : '';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
      try {
        return await createUserWithEmployeeNo(id, pwd);
      } catch (createErr: unknown) {
        const createCode = createErr && typeof createErr === 'object' && 'code' in createErr ? (createErr as { code?: string }).code : '';
        if (createCode === 'auth/email-already-in-use') {
          throw new Error('사번 또는 비밀번호가 올바르지 않습니다.');
        }
        throw createErr;
      }
    }
    throw err;
  }
}

/**
 * Create a new user with employee number and password.
 * For admin use when registering new employees.
 */
export async function createUserWithEmployeeNo(
  employeeNo: string,
  password: string
): Promise<UserCredential> {
  const email = employeeNoToEmail(employeeNo);
  if (!email) {
    throw new Error('사번을 입력해 주세요.');
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 */
export async function logout(): Promise<void> {
  return signOut(auth);
}

/**
 * Map Firebase Auth error codes to user-friendly Korean messages.
 */
export function getKoreanFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: string }).code;
    const messages: Record<string, string> = {
      'auth/invalid-credential': '사번 또는 비밀번호가 올바르지 않습니다.',
      'auth/invalid-login-credentials': '사번 또는 비밀번호가 올바르지 않습니다.',
      'auth/user-not-found': '등록되지 않은 사번입니다.',
      'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
      'auth/invalid-email': '사번 형식이 올바르지 않습니다.',
      'auth/email-already-in-use': '이미 등록된 사번입니다.',
      'auth/weak-password': '비밀번호는 더 복잡하게 설정해주세요.',
      'auth/too-many-requests': '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
      'auth/network-request-failed': '네트워크 오류가 발생했습니다. 연결을 확인해 주세요.'
    };
    if (code && typeof code === 'string' && messages[code]) {
      return messages[code];
    }
  }
  return '로그인 중 오류가 발생했습니다.';
}
