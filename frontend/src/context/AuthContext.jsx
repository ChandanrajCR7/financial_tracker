import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'cashcompass_users';
const SESSION_KEY = 'cashcompass_session';

// Seed a demo account on first load
function seedDemo() {
  const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!existing.find(u => u.email === 'demo@cashcompass.in')) {
    existing.push({
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@cashcompass.in',
      password: 'demo123',
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(existing));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function getSessionUser() {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  const users = getUsers();
  return users.find(u => u.id === sessionId) || null;
}

export function AuthProvider({ children }) {
  seedDemo();

  const [user, setUser] = useState(() => getSessionUser());

  const login = useCallback((email, password) => {
    const users = getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }
    localStorage.setItem(SESSION_KEY, found.id);
    // Sync name for GreetingWidget / legacy reads
    localStorage.setItem('cashcompass_name', found.name);
    setUser(found);
    return { success: true };
  }, []);

  const register = useCallback((name, email, password) => {
    const trimName = name.trim();
    const trimEmail = email.toLowerCase().trim();
    if (!trimName || !trimEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const users = getUsers();
    if (users.find(u => u.email === trimEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: trimName,
      email: trimEmail,
      password,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, newUser.id);
    localStorage.setItem('cashcompass_name', newUser.name);
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateName = useCallback((newName) => {
    const trimmed = newName.trim() || 'User';
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user?.id);
    if (idx !== -1) {
      users[idx].name = trimmed;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    localStorage.setItem('cashcompass_name', trimmed);
    setUser(prev => prev ? { ...prev, name: trimmed } : prev);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
