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
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white border border-[#dadce0] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative text-[#202124]">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-[#dadce0] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-[#1a73e8] rounded-xl border border-blue-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {activeTab === 'login' ? 'Sign In to Charge Nova' : 'Create Free Account'}
              </h3>
              <p className="text-[11px] text-[#5f6368]">Access saved trips & EV analytics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#f8f9fa] m-4 rounded-xl border border-[#dadce0] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-[#1a73e8] shadow-sm font-bold'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-[#1a73e8] shadow-sm font-bold'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Register</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-1 space-y-3.5">
          
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[#d93025] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[#1e8e3e] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Name Field (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#1a73e8]" /> Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#1a73e8]" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. driver@example.com"
              className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#1a73e8]" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
            />
          </div>

          {/* Confirm Password (Register only) */}
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f6368] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#1a73e8]" /> Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-full shadow-sm transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50 mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{activeTab === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
