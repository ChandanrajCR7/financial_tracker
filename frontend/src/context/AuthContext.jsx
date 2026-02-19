import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while Firebase resolves the persisted session
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
        };
        localStorage.setItem('cashcompass_name', u.name);
        setUser(u);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // rememberMe=true → persist across browser restarts (LOCAL)
  // rememberMe=false → persist only for current tab (SESSION)
  const login = useCallback(async (email, password, rememberMe = true) => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (err) {
      const msg = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-email': 'Invalid email address.',
      }[err.code] || 'Sign in failed. Please try again.';
      return { success: false, error: msg };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    const trimName = name.trim();
    const trimEmail = email.trim();
    if (!trimName || !trimEmail || !password)
      return { success: false, error: 'All fields are required.' };
    if (password.length < 6)
      return { success: false, error: 'Password must be at least 6 characters.' };
    try {
      const cred = await createUserWithEmailAndPassword(auth, trimEmail, password);
      await updateProfile(cred.user, { displayName: trimName });
      localStorage.setItem('cashcompass_name', trimName);
      return { success: true };
    } catch (err) {
      const msg = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
      }[err.code] || 'Registration failed. Please try again.';
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const updateName = useCallback(async (newName) => {
    const trimmed = newName.trim() || 'User';
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: trimmed });
    }
    localStorage.setItem('cashcompass_name', trimmed);
    setUser(prev => prev ? { ...prev, name: trimmed } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
