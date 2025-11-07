import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import SmartLinks from './components/QuickLinks';
import Workout from './components/Workout';
import Expenses from './components/Expenses';

function App() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  if (!user.onboardingCompleted) {
    return <OnboardingFlow />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'goals':
        return <Goals />;
      case 'links':
        return <SmartLinks />;
      case 'workout':
        return <Workout />;
      case 'expenses':
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50'
    }`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;