import React, { useState } from 'react';
import { User, Settings, Moon, Sun, LogOut, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  const isDark = theme === 'dark';

  const handleSave = () => {
    if (user) {
      updateUser({
        name: editedName,
        email: editedEmail
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedEmail(user?.email || '');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 ${
        isDark 
          ? 'bg-slate-800/90 border-slate-700/50' 
          : 'bg-white/90 border-white/20'
      } backdrop-blur-xl rounded-3xl p-8 shadow-2xl border`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="Full name"
                  />
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                    placeholder="Email address"
                  />
                </div>
              ) : (
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user.name}
                  </h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full">
                    Premium User
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`p-2 rounded-xl transition-colors ${
                isDark 
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            </button>
            {isEditing && (
              <button
                onClick={handleCancel}
                className={`p-2 rounded-xl transition-colors ${
                  isDark 
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4 mb-8">
          <div className={`flex items-center justify-between p-4 rounded-xl ${
            isDark ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-3">
              {isDark ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600" />}
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isDark ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isDark ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-xl ${
            isDark ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Settings className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Preferences
              </span>
            </div>
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {user.preferences.favoriteGenres.length + user.preferences.interests.length} items
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;