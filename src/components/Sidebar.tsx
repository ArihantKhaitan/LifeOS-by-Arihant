import React, { useState } from 'react';
import { Home, Target, Link, Dumbbell, DollarSign, Calendar, User, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import UserProfile from './UserProfile/UserProfile';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'links', label: 'Smart Links', icon: Link },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
  ];

  return (
    <>
      <div className={`fixed left-0 top-0 h-full w-64 shadow-2xl border-r backdrop-blur-xl ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700/50' 
          : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200/50'
      }`}>
        <div className={`p-6 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              LifeOS
            </h1>
            <p className="text-sm text-slate-400">by Arihant</p>
          </div>
        </div>
      </div>
      
        <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 text-left transition-all duration-200 rounded-xl group ${
                activeTab === item.id
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-500/20 shadow-lg shadow-blue-500/5'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 hover:shadow-md'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-200 ${
                activeTab === item.id 
                  ? isDark ? 'text-blue-400' : 'text-blue-600'
                  : isDark 
                    ? 'text-slate-400 group-hover:text-slate-300'
                    : 'text-slate-500 group-hover:text-slate-700'
              }`} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className={`ml-auto w-2 h-2 rounded-full animate-pulse ${
                  isDark ? 'bg-blue-400' : 'bg-blue-600'
                }`}></div>
              )}
            </button>
          );
        })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => setShowProfile(true)}
            className={`w-full rounded-xl p-4 border transition-all duration-200 hover:shadow-lg ${
              isDark 
                ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30 hover:from-slate-700/50 hover:to-slate-600/50' 
                : 'bg-gradient-to-r from-white/80 to-slate-50/80 border-slate-200/50 hover:from-white hover:to-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {user?.name || 'Arihant'}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Premium User
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            </div>
          </button>
        </div>
      </div>
      
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Sidebar;
