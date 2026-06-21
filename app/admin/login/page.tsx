'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { loginAction } from '../actions';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Masukkan kata sandi terlebih dahulu');
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await loginAction(password);
      if (res.success) {
        // Use window.location to force a clean layout re-evaluation with the new cookie
        window.location.href = '/admin';
      } else {
        setError(res.error || 'Kata sandi salah');
      }
    });
  };

  return (
    <div className="min-height-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Decorative Radial Backgrounds */}
      <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-md mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
            NuansaPos Admin
          </h1>
          <p className="text-slate-600 text-sm mt-2 font-body">
            Masukkan kata sandi administrator untuk mengakses sistem lisensi.
          </p>
        </div>

        {/* Glass Card Form */}
        <div className="glass rounded-3xl p-8 shadow-lg backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 font-body">
                Kata Sandi Administrator
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-4 pr-12 text-slate-900 font-body placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-xl flex items-center gap-3 font-body"
              >
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 group transition-all shadow-md shadow-brand/20"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-12 text-slate-400 text-xs font-body text-center z-10">
        <p>&copy; 2026 NuansaPos. All Rights Reserved.</p>
        <p className="mt-1">Sistem Aktivasi Lisensi Offline Terenkripsi Aman.</p>
      </div>
    </div>
  );
}
