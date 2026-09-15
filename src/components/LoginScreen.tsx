import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export const LoginScreen: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white font-sans text-slate-900">
      {/* Left side: Branding / Illustration */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"></div>
        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight">InfraShield<span className="text-emerald-400">AI</span></span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight mb-6">
            Predict infrastructure delays before they become expensive.
          </h1>
          <p className="text-lg text-slate-300">
            Secure, data-driven decision support for critical state infrastructure. 
            Powered by advanced geospatial analytics and real-time alerts.
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex w-full md:w-1/2 lg:w-2/5 flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white">
        <div className="w-full max-w-sm mx-auto">
          
          <div className="md:hidden flex items-center justify-center space-x-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">InfraShield<span className="text-emerald-600">AI</span></span>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="w-full bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-lg mb-6 border border-rose-100">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center space-x-3 bg-slate-950 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-slate-900/10"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
            ) : (
              <div className="bg-white p-1 rounded-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
            )}
            <span className="font-semibold tracking-wide">Continue with Google</span>
          </button>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              By signing in, you agree to the InfraShield Terms of Service and Privacy Policy.
              Only authorized government personnel may access this system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
