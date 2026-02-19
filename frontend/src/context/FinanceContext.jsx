import { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, push, update, remove, set } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

const SAMPLE_TRANSACTIONS = [
  { title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2026-02-01', note: 'Monthly salary' },
  { title: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2026-02-02', note: 'Monthly rent' },
  { title: 'Groceries', amount: 320, type: 'expense', category: 'Food', date: '2026-02-05', note: 'Weekly groceries' },
  { title: 'Freelance Project', amount: 800, type: 'income', category: 'Freelance', date: '2026-02-08', note: 'Web design gig' },
  { title: 'Netflix', amount: 18, type: 'expense', category: 'Entertainment', date: '2026-02-10', note: 'Subscription' },
  { title: 'Gym', amount: 45, type: 'expense', category: 'Health', date: '2026-02-11', note: 'Monthly membership' },
  { title: 'Electric Bill', amount: 95, type: 'expense', category: 'Utilities', date: '2026-02-12', note: '' },
  { title: 'Dinner Out', amount: 65, type: 'expense', category: 'Food', date: '2026-02-14', note: 'Valentine dinner' },
  { title: 'Bonus', amount: 1000, type: 'income', category: 'Salary', date: '2026-02-15', note: 'Performance bonus' },
  { title: 'Spotify', amount: 10, type: 'expense', category: 'Entertainment', date: '2026-02-16', note: 'Subscription' },
  { title: 'Transport', amount: 60, type: 'expense', category: 'Transport', date: '2026-02-17', note: 'Monthly pass' },
  { title: 'Online Course', amount: 29, type: 'expense', category: 'Education', date: '2026-02-18', note: 'React course' },
];

const SAMPLE_GOALS = [
  { title: 'Emergency Fund', emoji: '🛡️', target: 50000, saved: 18000, deadline: '2026-12-31', color: 'violet' },
  { title: 'Vacation Trip', emoji: '✈️', target: 30000, saved: 8500, deadline: '2026-07-01', color: 'emerald' },
  { title: 'New Laptop', emoji: '💻', target: 80000, saved: 25000, deadline: '2026-09-30', color: 'amber' },
];

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Business', 'Rental Income', 'Pension', 'Side Income', 'Gift', 'Refund', 'Other'],
  expense: ['Food', 'Housing', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Insurance', 'Subscriptions', 'Travel', 'Personal Care', 'Dining Out', 'Clothing', 'EMI / Loan', 'Taxes', 'Charity', 'Other'],
};

export function FinanceProvider({ children }) {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cashcompass_theme') === 'dark');

  // ── Real-time listener: transactions ──
  useEffect(() => {
    if (!user?.id) return;
    const txRef = ref(db, `users/${user.id}/transactions`);
    const unsub = onValue(txRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
        // newest first
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(list);
      } else {
        // First login — seed sample data
        SAMPLE_TRANSACTIONS.forEach(tx => push(txRef, tx));
        setTransactions([]);
      }
      setDbLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  // ── Real-time listener: goals ──
  useEffect(() => {
    if (!user?.id) return;
    const goalsRef = ref(db, `users/${user.id}/goals`);
    const unsub = onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
        setGoals(list);
      } else {
        // First login — seed sample goals
        SAMPLE_GOALS.forEach(g => push(goalsRef, g));
        setGoals([]);
      }
    });
    return () => unsub();
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem('cashcompass_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ── Transactions CRUD ──
  const addTransaction = (tx) => {
    const txRef = ref(db, `users/${user.id}/transactions`);
    push(txRef, tx);
  };

  const updateTransaction = (id, updated) => {
    const txRef = ref(db, `users/${user.id}/transactions/${id}`);
    update(txRef, updated);
  };

  const deleteTransaction = (id) => {
    const txRef = ref(db, `users/${user.id}/transactions/${id}`);
    remove(txRef);
  };

  // ── Goals CRUD ──
  const addGoal = (goal) => {
    const goalsRef = ref(db, `users/${user.id}/goals`);
    push(goalsRef, goal);
  };

  const updateGoal = (id, updated) => {
    const goalRef = ref(db, `users/${user.id}/goals/${id}`);
    update(goalRef, updated);
  };

  const deleteGoal = (id) => {
    const goalRef = ref(db, `users/${user.id}/goals/${id}`);
    remove(goalRef);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      totalIncome,
      totalExpense,
      balance,
      darkMode,
      setDarkMode,
      dbLoading,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
