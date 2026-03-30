
import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { UserData } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserData) => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await AuthService.login(phone, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel - Illustration */}
      <div className="md:w-1/2 bg-[#eef3e8] p-6 md:p-8 flex flex-col items-center justify-between text-center min-h-[350px] md:min-h-0">
        <div className="w-full flex justify-start">
           <div className="flex items-center space-x-2">
             <div className="w-12 h-12 md:w-16 md:h-16">
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="50" cy="50" r="45" fill="#f4a7a7" fillOpacity="0.2"/>
                 <path d="M50 30C40 30 32 38 32 48C32 58 50 75 50 75C50 75 68 58 68 48C68 38 60 30 50 30Z" fill="#f4a7a7"/>
                 <circle cx="50" cy="48" r="8" fill="white"/>
               </svg>
             </div>
             <div className="text-left">
               <h1 className="text-lg md:text-xl font-bold text-[#6d8a7c]">MonoSporsho</h1>
               <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">Mental Health & Wellness</p>
             </div>
           </div>
        </div>
        
        <div className="flex flex-col items-center flex-1 justify-center py-4">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-white/40 flex items-center justify-center overflow-hidden mb-6 md:mb-8 shadow-inner p-8">
             <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
               <circle cx="100" cy="100" r="80" fill="#f4a7a7" fillOpacity="0.1"/>
               <path d="M100 140C130 140 150 120 150 90C150 60 130 40 100 40C70 40 50 60 50 90C50 120 70 140 100 140Z" stroke="#6d8a7c" strokeWidth="4" strokeLinecap="round"/>
               <circle cx="100" cy="85" r="15" fill="#6d8a7c"/>
               <path d="M70 115C80 105 120 105 130 115" stroke="#6d8a7c" strokeWidth="4" strokeLinecap="round"/>
               <rect x="40" y="80" width="10" height="20" rx="5" fill="#f4a7a7" className="animate-bounce" style={{animationDelay: '0.2s'}}/>
               <rect x="150" y="70" width="12" height="24" rx="6" fill="#f4a7a7" className="animate-bounce" style={{animationDelay: '0.5s'}}/>
               <circle cx="160" cy="130" r="5" fill="#6d8a7c" opacity="0.4"/>
               <circle cx="30" cy="60" r="8" fill="#6d8a7c" opacity="0.2"/>
             </svg>
          </div>
          <div className="max-w-sm px-4">
            <h2 className="text-xl md:text-3xl font-bold text-gray-700 leading-tight">
              Your health our priority,
            </h2>
            <h2 className="text-xl md:text-3xl font-bold text-gray-700 leading-tight">
              Welcome to MonoSporsho
            </h2>
          </div>
        </div>

        <div className="hidden md:block h-12"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="md:w-1/2 bg-[#faf1f1] p-6 sm:p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10">Log in</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-gray-900 font-bold text-xs md:text-sm mb-1.5 md:mb-2 uppercase tracking-wide">Phone Number</label>
              <input
                required
                type="tel"
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone Number"
                className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm md:text-base placeholder:text-gray-300 disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-900 font-bold text-xs md:text-sm mb-1.5 md:mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm md:text-base pr-12 placeholder:text-gray-300 disabled:opacity-50"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.666-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f4a7a7] hover:bg-[#ef9393] text-gray-900 font-bold py-3 md:py-4 rounded-xl transition duration-200 shadow-md mt-2 md:mt-4 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-gray-900" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Verifying...' : 'Log in'}
            </button>
          </form>

          <div className="mt-8 md:mt-12 text-center space-y-3">
            <p className="text-gray-800 text-xs md:text-sm">
              Don't have an account? <button onClick={onGoToRegister} className="text-[#f4a7a7] font-bold hover:underline">Register</button>
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed px-4">
              By continuing, I agree to the <button className="text-[#f4a7a7] hover:underline font-semibold">Terms & Conditions</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
