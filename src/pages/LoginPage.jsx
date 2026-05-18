// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Film, Star, TrendingUp, Heart, Clapperboard, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // SIMULASI LOGIN/SIGNUP PAKAI LOCALSTORAGE
    setTimeout(() => {
      if (isLogin) {
        // LOGIN: cek apakah email udah terdaftar
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          window.location.href = '/app';
        } else {
          setError('Invalid email or password');
        }
      } else {
        // SIGNUP: simpan user baru
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = users.some(u => u.email === email);
        
        if (exists) {
          setError('Email already registered');
        } else {
          users.push({ email, password });
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          window.location.href = '/app';
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex">
      {/* LEFT SIDE - Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-500/20 to-gold-500/20 flex-col justify-center px-12 relative overflow-hidden">
        <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="absolute top-20 left-10 opacity-10">
          <Film size={200} className="text-cyan-400" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <Clapperboard size={150} className="text-gold-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Film size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl gradient-text">ChevaVerse</span>
          </div>
          
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            {isLogin ? 'Welcome Back!' : 'Join the Community'}
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {isLogin 
              ? 'Sign in to continue your movie & anime journey' 
              : 'Create an account to start discovering thousands of movies and anime'}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Star size={18} className="text-gold-400" />
              <span>Discover trending movies & anime</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Heart size={18} className="text-red-400" />
              <span>Save favorites to your personal list</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <TrendingUp size={18} className="text-cyan-400" />
              <span>Get personalized recommendations</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Sparkles size={18} className="text-purple-400" />
              <span>Watch trailers and read reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full glass-card rounded-2xl p-8">
          <div className="lg:hidden flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Film size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">ChevaVerse</span>
            </div>
            <div className="w-12" />
          </div>

          <div className="hidden lg:flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Film size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">ChevaVerse</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-white">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin ? 'Enter your credentials to access your account' : 'Get started with ChevaVerse today'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 text-white placeholder:text-gray-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 text-white placeholder:text-gray-500"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 text-white placeholder:text-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}