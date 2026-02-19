import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_EMAIL = 'demo@cashcompass.in';
const DEMO_PASS = 'demo123';
const REMEMBER_KEY = 'cashcompass_remember';

function loadRemembered() {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const remembered = loadRemembered();
  const [email, setEmail] = useState(remembered?.email || '');
  const [password, setPassword] = useState(remembered?.password || '');
  const [rememberMe, setRememberMe] = useState(!!remembered);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      setSuccess(true);
      await new Promise(r => setTimeout(r, 350));
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setError('');
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASS);
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(DEMO_EMAIL, DEMO_PASS);
    if (result.success) {
      setSuccess(true);
      await new Promise(r => setTimeout(r, 300));
      navigate('/dashboard', { replace: true });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">

      {/* ── Animated background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/60 to-slate-950" />
        {/* Animated orbs */}
        <div style={{ animation: 'ccFloatA 18s ease-in-out infinite' }}
          className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div style={{ animation: 'ccFloatB 22s ease-in-out infinite' }}
          className="absolute bottom-[12%] right-[10%] w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div style={{ animation: 'ccFloatC 26s ease-in-out infinite' }}
          className="absolute top-[55%] left-[60%] w-64 h-64 rounded-full bg-violet-400/10 blur-2xl" />
        <div style={{ animation: 'ccFloatD 20s ease-in-out infinite' }}
          className="absolute top-[30%] right-[30%] w-48 h-48 rounded-full bg-emerald-400/8 blur-2xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        {/* Floating shapes */}
        <svg className="absolute top-[8%] right-[20%] opacity-[0.08]" style={{ animation: 'ccSpin 40s linear infinite' }} width="80" height="80" viewBox="0 0 80 80">
          <polygon points="40,4 76,62 4,62" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
        </svg>
        <svg className="absolute bottom-[20%] left-[8%] opacity-[0.08]" style={{ animation: 'ccSpin 55s linear infinite reverse' }} width="60" height="60" viewBox="0 0 60 60">
          <rect x="8" y="8" width="44" height="44" rx="6" fill="none" stroke="#10b981" strokeWidth="1.5"/>
        </svg>
        <svg className="absolute top-[60%] right-[5%] opacity-[0.07]" style={{ animation: 'ccFloatA 14s ease-in-out infinite' }} width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4 4"/>
        </svg>
        <svg className="absolute top-[20%] left-[5%] opacity-[0.06]" style={{ animation: 'ccFloatB 18s ease-in-out infinite' }} width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3"/>
        </svg>
        {/* Dot grid bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
      </div>

      {/* Stats strip */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-6 sm:gap-10 py-2.5 border-b border-white/5 bg-black/30 backdrop-blur-sm z-10">
        {[['₹2.4Cr+','Tracked'],['12K+','Users'],['99.9%','Uptime'],['Free','Forever']].map(([val, label]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-emerald-400">{val}</span>
            <span className="text-slate-500 hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-[880px] mx-4 mt-10 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/[0.06]">
        <div className="flex min-h-[560px]">

          {/* Left panel */}
          <div className="hidden lg:flex flex-col justify-between w-[42%] p-10 bg-gradient-to-br from-violet-700 via-violet-800 to-emerald-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/20 blur-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />

            <div className="relative z-10 flex items-center gap-2.5">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <line x1="20" y1="2" x2="20" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="33" x2="20" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="2" y1="20" x2="7" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="33" y1="20" x2="38" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="20,9 22.2,20 20,18 17.8,20" fill="white"/>
                <polygon points="20,31 22.2,20 20,22 17.8,20" fill="rgba(255,255,255,0.55)"/>
                <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Arial">₹</text>
              </svg>
              <span className="text-xl font-extrabold text-white tracking-tight">CashCompass</span>
            </div>

            <div className="relative z-10">
              <div className="text-4xl text-white/20 font-serif leading-none mb-1">"</div>
              <p className="text-white font-bold text-xl leading-snug mb-2">
                Navigate your finances<br/>
                <span className="text-white/70 font-medium text-base">— with clarity & confidence.</span>
              </p>
              <p className="text-white/50 text-sm mt-3">Track every rupee. Reach every goal.</p>
            </div>

            <div className="relative z-10 flex flex-col gap-3.5">
              {[['📊','Visual spending breakdown'],['🎯','Savings goal tracking'],['💡','Smart AI suggestions']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-sm flex-shrink-0">{icon}</div>
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-white/40 text-xs">100% local · Zero servers · No tracking</span>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="flex-1 bg-slate-900 p-8 lg:p-10 flex flex-col justify-center">

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="url(#mlg2)" strokeWidth="2"/>
                <polygon points="20,9 22.2,20 20,18 17.8,20" fill="#7c3aed"/>
                <polygon points="20,31 22.2,20 20,22 17.8,20" fill="#10b981"/>
                <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="url(#mlg2)" fontFamily="Arial">₹</text>
                <defs>
                  <linearGradient id="mlg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-extrabold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">CashCompass</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back 👋</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to continue to your dashboard</p>

            {/* Demo CTA */}
            <button
              type="button"
              onClick={demoLogin}
              disabled={loading}
              className="w-full mb-5 p-3 rounded-xl bg-gradient-to-r from-violet-500/15 to-emerald-500/15 border border-violet-500/25 hover:border-violet-400/50 hover:from-violet-500/25 hover:to-emerald-500/25 transition-all flex items-center gap-3 group disabled:opacity-50 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-sm flex-shrink-0">🚀</div>
              <div>
                <p className="text-white text-xs font-bold">Try Demo Account</p>
                <p className="text-slate-400 text-xs">demo@cashcompass.in · demo123</p>
              </div>
              <span className="ml-auto text-violet-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">✉️</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">🔑</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-base"
                    tabIndex={-1}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit group">
                <div
                  onClick={() => setRememberMe(v => !v)}
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                    rememberMe ? 'bg-violet-500 border-violet-500' : 'border-slate-600 hover:border-violet-400'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Remember me on this device
                </span>
                {remembered && rememberMe && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Saved ✓
                  </span>
                )}
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-1 w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-white
                  ${success
                    ? 'bg-emerald-500 shadow-emerald-900/50'
                    : 'bg-gradient-to-r from-violet-600 to-emerald-500 shadow-violet-900/50 hover:shadow-violet-800/60 hover:scale-[1.015] active:scale-[0.985]'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading && !success && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                )}
                {success ? '✓ Signed in!' : loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>

      <p className="absolute bottom-3 text-slate-700 text-xs z-10 text-center px-4">
        © 2026 CashCompass · No servers · No tracking · 100% private
      </p>

      <style>{`
        @keyframes ccFloatA {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-30px) scale(1.08); }
          66% { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes ccFloatB {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-50px,30px) scale(1.05); }
          66% { transform: translate(30px,-40px) scale(0.97); }
        }
        @keyframes ccFloatC {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-30px,-25px) scale(1.1); }
        }
        @keyframes ccFloatD {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(25px,20px) scale(0.9); }
        }
        @keyframes ccSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
