
import React, { useState } from 'react';
import { UserData } from '../types';
import { AuthService } from '../services/auth';

interface RegistrationPageProps {
  onRegisterSuccess: (data: UserData) => void;
  onGoToLogin: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegisterSuccess, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.register({
        ...formData,
        password
      });

      if (result.success && result.user) {
        onRegisterSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel - Illustration */}
      <div className="md:w-1/2 bg-[#eef3e8] p-6 md:p-8 flex flex-col items-center justify-between text-center min-h-[300px] md:min-h-0">
        <div className="w-full flex justify-start">
           <div className="flex items-center space-x-2">
             <div className="w-10 h-10 md:w-14 md:h-14">
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="50" cy="50" r="45" fill="#f4a7a7" fillOpacity="0.2"/>
                 <path d="M50 30C40 30 32 38 32 48C32 58 50 75 50 75C50 75 68 58 68 48C68 38 60 30 50 30Z" fill="#f4a7a7"/>
                 <circle cx="50" cy="48" r="8" fill="white"/>
               </svg>
             </div>
             <div className="text-left">
               <h1 className="text-lg md:text-xl font-bold text-[#6d8a7c]">MonoSporsho</h1>
               <p className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">Wellness</p>
             </div>
           </div>
        </div>
        
        <div className="flex flex-col items-center flex-1 justify-center py-4">
          <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-white/40 flex items-center justify-center overflow-hidden mb-6 md:mb-8 shadow-inner p-8">
             <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
               <path d="M100 160V100" stroke="#6d8a7c" strokeWidth="6" strokeLinecap="round"/>
               <path d="M100 100C120 80 160 80 160 120C160 160 100 180 100 180C100 180 40 160 40 120C40 80 80 80 100 100Z" fill="#f4a7a7" fillOpacity="0.3" stroke="#f4a7a7" strokeWidth="4"/>
               <path d="M100 100C110 80 130 80 130 100C130 120 100 130 100 130C100 130 70 120 70 100C70 80 90 80 100 100Z" fill="#f4a7a7"/>
               <circle cx="100" cy="60" r="15" fill="#6d8a7c"/>
               <path d="M100 100L140 60" stroke="#6d8a7c" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
               <path d="M100 100L60 60" stroke="#6d8a7c" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
             </svg>
          </div>
          <div className="max-w-md px-4">
            <h2 className="text-xl md:text-3xl font-bold text-gray-700 leading-tight">
              Join MonoSporsho today,
            </h2>
            <h2 className="text-lg md:text-2xl text-gray-500 leading-tight mt-1">
              Start your journey with us.
            </h2>
          </div>
        </div>

        <div className="hidden md:block h-12"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="md:w-1/2 bg-[#faf1f1] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Register</h2>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Name</label>
              <input
                required
                type="text"
                name="name"
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Phone</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  disabled={isLoading}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  disabled={isLoading}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Age</label>
                <input
                  required
                  type="number"
                  name="age"
                  disabled={isLoading}
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Gender</label>
                <input
                  required
                  type="text"
                  name="gender"
                  disabled={isLoading}
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                  className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Password</label>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm pr-12 disabled:opacity-50"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[32px] md:top-[38px] text-gray-400 p-1"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-bold text-xs md:text-sm mb-1 uppercase tracking-wide">Confirm</label>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                disabled={isLoading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm"
                className="w-full p-3 md:p-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#f4a7a7] transition shadow-sm text-sm pr-12 disabled:opacity-50"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[32px] md:top-[38px] text-gray-400 p-1"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f4a7a7] hover:bg-[#ef9393] text-gray-900 font-bold py-3 md:py-4 rounded-xl transition duration-200 shadow-md mt-4 md:mt-6 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-gray-900" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-800">
            Already have an account? <button onClick={onGoToLogin} className="text-[#f4a7a7] font-bold hover:underline">Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
