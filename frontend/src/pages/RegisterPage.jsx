import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = register(form.name, form.email, form.password);
    if (result.success) {
      setSuccess(true);
      await new Promise(r => setTimeout(r, 350));
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const strengthScore = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strengthScore] || '';
  const strengthColor = ['', 'bg-rose-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'][strengthScore] || '';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">

      {/* ── Animated background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950" />
        <div style={{ animation: 'ccFloatA 20s ease-in-out infinite' }}
          className="absolute top-[8%] right-[12%] w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div style={{ animation: 'ccFloatB 25s ease-in-out infinite' }}
          className="absolute bottom-[10%] left-[8%] w-96 h-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div style={{ animation: 'ccFloatC 22s ease-in-out infinite' }}
          className="absolute top-[45%] right-[50%] w-60 h-60 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        <svg className="absolute top-[12%] left-[18%] opacity-[0.07]" style={{ animation: 'ccSpin 50s linear infinite' }} width="70" height="70" viewBox="0 0 70 70">
          <polygon points="35,4 66,58 4,58" fill="none" stroke="#10b981" strokeWidth="1.5"/>
        </svg>
        <svg className="absolute bottom-[15%] right-[12%] opacity-[0.07]" style={{ animation: 'ccSpin 45s linear infinite reverse' }} width="55" height="55" viewBox="0 0 55 55">
          <rect x="7" y="7" width="41" height="41" rx="5" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
        </svg>
        <div className="absolute top-0 left-0 right-0 h-48 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
      </div>

      {/* Stats strip */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-6 sm:gap-10 py-2.5 border-b border-white/5 bg-black/30 backdrop-blur-sm z-10">
        {[['₹2.4Cr+','Tracked'],['12K+','Users'],['Free','Forever'],['🔒','Private']].map(([val, label]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-emerald-400">{val}</span>
            <span className="text-slate-500 hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-[880px] mx-4 mt-10 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/[0.06]">
        <div className="flex min-h-[560px]">

          {/* Left branding */}
          <div className="hidden lg:flex flex-col justify-between w-[42%] p-10 bg-gradient-to-br from-emerald-700 via-emerald-800 to-violet-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/20 blur-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 1px, transparent 1px)',
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
                Your financial journey<br/>
                <span className="text-white/70 font-medium text-base">— starts right here.</span>
              </p>
              <p className="text-white/50 text-sm mt-3">Free forever. No credit card. No catch.</p>
            </div>

            <div className="relative z-10 flex flex-col gap-3.5">
              {[['🔒','100% private — data stays on your device'],['⚡','Up and running in under 30 seconds'],['📊','Instant charts from your first entry']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-sm flex-shrink-0">{icon}</div>
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-white/40 text-xs">Join thousands of smart savers today</span>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="flex-1 bg-slate-900 p-8 lg:p-10 flex flex-col justify-center">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="url(#mrg2)" strokeWidth="2"/>
                <polygon points="20,9 22.2,20 20,18 17.8,20" fill="#7c3aed"/>
                <polygon points="20,31 22.2,20 20,22 17.8,20" fill="#10b981"/>
                <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="url(#mrg2)" fontFamily="Arial">₹</text>
                <defs>
                  <linearGradient id="mrg2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-extrabold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">CashCompass</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-1">Create your account ✨</h2>
            <p className="text-slate-400 text-sm mb-6">Free forever · No credit card · Your data stays local</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">👤</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">✉️</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i <= strengthScore ? strengthColor : 'bg-slate-700'}`} />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${strengthScore <= 1 ? 'text-rose-400' : strengthScore <= 3 ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Confirm password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">✅</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.confirm}
                    onChange={e => update('confirm', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      form.confirm && form.confirm !== form.password
                        ? 'border-rose-500/50 focus:ring-rose-500'
                        : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-xs text-rose-400 mt-1">Passwords don't match</p>
                )}
                {form.confirm && form.confirm === form.password && form.password && (
                  <p className="text-xs text-emerald-400 mt-1">✓ Passwords match</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (!!form.confirm && form.confirm !== form.password)}
                className={`mt-1 w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-white
                  ${success
                    ? 'bg-emerald-500 shadow-emerald-900/50'
                    : 'bg-gradient-to-r from-emerald-500 to-violet-600 shadow-emerald-900/40 hover:shadow-emerald-800/60 hover:scale-[1.015] active:scale-[0.985]'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading && !success && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                )}
                {success ? '✓ Account created!' : loading ? 'Creating account…' : 'Create Account →'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Sign in
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
        @keyframes ccSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
