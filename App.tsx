
import React, { useState } from 'react';
import FrontPage from './components/FrontPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import { ViewState, UserData } from './types';
import { AuthService } from './services/auth';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.FRONT);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isInitializing] = useState(false);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    setView(ViewState.DASHBOARD);
  };

  const handleRegister = (data: UserData) => {
    setUserData(data);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUserData(null);
    setView(ViewState.FRONT);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef3e8]">
        <div className="animate-pulse flex flex-col items-center">
          <img src="https://picsum.photos/seed/monosporho/120/120" alt="Logo" className="w-20 h-20 rounded-full mb-4" />
          <p className="text-[#6d8a7c] font-bold tracking-widest uppercase text-xs">MonoSporsho</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {view === ViewState.FRONT && (
        <FrontPage 
          onLogin={() => setView(ViewState.LOGIN)} 
          onSignup={() => setView(ViewState.REGISTER)} 
        />
      )}
      {view === ViewState.LOGIN && (
        <LoginPage 
          onLoginSuccess={handleLogin} 
          onGoToRegister={() => setView(ViewState.REGISTER)} 
        />
      )}
      {view === ViewState.REGISTER && (
        <RegistrationPage 
          onRegisterSuccess={handleRegister} 
          onGoToLogin={() => setView(ViewState.LOGIN)}
        />
      )}
      {view === ViewState.DASHBOARD && (
        <Dashboard user={userData!} onLogout={handleLogout} onUpdateUser={setUserData} />
      )}
    </div>
  );
};

export default App;
