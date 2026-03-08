import type { User as FirebaseUser } from 'firebase/auth';

/**
 * App user derived from Firebase Auth + profile (Firestore-ready).
 */
export interface AuthUser {
  uid: string;
  employeeId: string;
  email: string;
  /** Display name from Firestore or employee directory. */
  name: string;
  department: string;
  isAdmin: boolean;
}

/**
 * Auth context value.
 */
export interface AuthContextValue {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}
