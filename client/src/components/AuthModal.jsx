import React, { useState } from 'react';
import { X, Lock, Mail, User, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Form Input State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'register') {
      if (!name) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = activeTab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = activeTab === 'register' 
        ? { name, email, password }
        : { email, password };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

      if (response.data?.success) {
        const { user, token } = response.data;
        localStorage.setItem('charge_nova_token', token);
        localStorage.setItem('charge_nova_user', JSON.stringify(user));
        
        setSuccessMessage(activeTab === 'register' ? 'Account created successfully!' : 'Logged in successfully!');
        
        setTimeout(() => {
          onAuthSuccess(user, token);
          onClose();
        }, 800);
      }
    } catch (error) {
      console.error('Auth Error:', error);
      const apiErr = error.response?.data?.error || error.message || 'Authentication failed.';
      setErrorMessage(apiErr);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-100">
                {activeTab === 'login' ? 'Sign In to Charge Nova' : 'Create Real Account'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Access saved trips & EV analytics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 m-4 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Register</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Name Field (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanish Bhagat"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 font-semibold"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. tanish@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 font-semibold"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 font-semibold"
            />
          </div>

          {/* Confirm Password (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 font-semibold"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{activeTab === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
