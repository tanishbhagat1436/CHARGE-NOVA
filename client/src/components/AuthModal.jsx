import React, { useState } from 'react';
import { X, Lock, Mail, User, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../services/apiConfig';

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

      const response = await axios.post(`${getApiBaseUrl()}${endpoint}`, payload);

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
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-[99999] font-sans"
    >
      <div className="bg-white border border-surface-border w-full max-w-md rounded-2xl shadow-card-lg overflow-hidden relative text-ink">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-surface-border bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">
                {activeTab === 'login' ? 'Sign In to Charge Nova' : 'Create Free Account'}
              </h3>
              <p className="text-[11px] text-ink-secondary">Access saved trips & EV analytics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ink-tertiary hover:text-ink hover:bg-surface-subtle rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-surface-border bg-surface-muted text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'text-primary border-primary bg-white'
                : 'text-ink-secondary border-transparent hover:text-ink'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'text-primary border-primary bg-white'
                : 'text-ink-secondary border-transparent hover:text-ink'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Account</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-2.5 bg-danger/10 border border-danger/20 rounded-xl text-xs text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-2.5 bg-success/10 border border-success/20 rounded-xl text-xs text-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Name Field (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink-secondary flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-primary" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tanish Bhagat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-secondary flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink-secondary flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-primary" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Confirm Password Field (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink-secondary flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-primary" /> Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-surface-border rounded-lg px-3 py-2 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-primary hover:bg-primary-700 text-white font-semibold rounded-full text-xs transition-all shadow-card hover:shadow-card-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{activeTab === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
            )}
          </button>

          {/* Demo account hint */}
          <p className="text-[10px] text-ink-tertiary text-center pt-1">
            {activeTab === 'login' ? (
              <span>New to Charge Nova? Click "New Account" tab above.</span>
            ) : (
              <span>Already registered? Click "Sign In" tab above.</span>
            )}
          </p>

        </form>

      </div>
    </div>
  );
}
