import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, admin, loading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white px-6">
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Portfolio
      </button>

      {/* Glow spot */}
      <div className="glow-spot bg-violet-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-violet-500/10 rounded-2xl border border-violet-500/20 text-violet-400 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Lock size={30} />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Admin Portal</h2>
          <p className="text-gray-400 text-sm mt-1.5 font-medium">Log in to manage your portfolio settings.</p>
        </div>

        <div className="glass-panel p-8 rounded-xl border border-white/5 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-gray-300 font-medium">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full glass-input pl-10 p-3 text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-300 font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 p-3 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  Verifying... <Loader2 className="animate-spin" size={16} />
                </>
              ) : "Authenticate Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
