import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register, demoLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSwitch = () => { setIsLogin(p => !p); onSwitch?.(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoLogin('Demo User', 'demo@wearai.com');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-charcoal/55 z-[500] flex items-center justify-center backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-warm-white rounded-[20px] p-10 w-full max-w-[420px] relative shadow-modal animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 bg-cream border-none rounded-full w-[30px] h-[30px] cursor-pointer text-muted flex items-center justify-center text-base hover:text-charcoal transition-colors">✕</button>

        <div className="font-serif text-[26px] font-bold mb-1">{isLogin ? 'Welcome back' : 'Create account'}</div>
        <div className="text-[13px] text-muted mb-7">{isLogin ? 'Sign in to your WearAI account' : 'Join WearAI and shop sustainably'}</div>

        {/* Social */}
        <button onClick={handleDemo} className="w-full py-2.5 bg-cream border border-black/10 rounded-xl font-sans text-[13px] cursor-pointer mb-2 flex items-center justify-center gap-2 hover:border-rust transition-colors">
          🌐 Continue with Google (Demo)
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-black/[0.08]" />
          <span className="text-xs text-muted">or use email</span>
          <div className="flex-1 h-px bg-black/[0.08]" />
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input className="form-input mb-3" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
          )}
          <input className="form-input mb-3" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="form-input mb-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full py-3 bg-charcoal text-warm-white rounded-xl font-sans text-[14px] font-semibold cursor-pointer mt-1 transition-colors hover:bg-rust disabled:opacity-60">
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-[12.5px] text-muted mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={handleSwitch} className="text-rust cursor-pointer font-medium">
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
