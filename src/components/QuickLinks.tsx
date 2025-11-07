import React, { useState, useEffect } from 'react';
import { ExternalLink, Plus, Trash2, Globe, Sparkles, Calendar, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';

interface QuickLink {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
}

const SmartLinks: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [links, setLinks] = useState<QuickLink[]>([
    {
      id: '1',
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      description: 'AI Assistant',
      category: 'AI/Productivity',
    },
    {
      id: '2',
      name: 'Perplexity',
      url: 'https://perplexity.ai',
      description: 'AI Search Engine',
      category: 'AI/Productivity',
    },
    {
      id: '3',
      name: 'Instagram',
      url: 'https://instagram.com',
      description: 'Social Media',
      category: 'Social',
    },
    {
      id: '4',
      name: 'YouTube',
      url: 'https://youtube.com',
      description: 'Video Platform',
      category: 'Entertainment',
    },
    {
      id: '5',
      name: 'Apple TV',
      url: 'https://tv.apple.com',
      description: 'Streaming Service',
      category: 'Entertainment',
    },
    {
      id: '6',
      name: 'Prime Video',
      url: 'https://primevideo.com',
      description: 'Amazon Streaming',
      category: 'Entertainment',
    },
    {
      id: '7',
      name: 'WhatsApp',
      url: 'https://web.whatsapp.com',
      description: 'Messaging',
      category: 'Communication',
    },
    {
      id: '8',
      name: 'Gmail',
      url: 'https://gmail.com',
      description: 'Email Service',
      category: 'Communication',
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    description: '',
    category: 'Other',
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'movie' as 'movie' | 'show' | 'workout' | 'goal' | 'other',
    category: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('lifeos_tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('lifeos_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const addLink = () => {
    if (!newLink.name || !newLink.url) return;

    const link: QuickLink = {
      id: Date.now().toString(),
      ...newLink,
    };

    setLinks([...links, link]);
    setNewLink({
      name: '',
      url: '',
      description: '',
      category: 'Other',
    });
    setShowAddForm(false);
  };

  const addTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      type: 'movie',
      category: '',
      dueDate: '',
      priority: 'medium',
    });
    setShowTaskForm(false);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };

  const categories = [...new Set(links.map(link => link.category))];
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI/Productivity': 'bg-blue-100 text-blue-800',
      'Social': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Communication': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
      case 'show':
        return Play;
      case 'workout':
        return Calendar;
      default:
        return Sparkles;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return isDark ? 'text-red-400' : 'text-red-600';
      case 'medium': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'low': return isDark ? 'text-green-400' : 'text-green-600';
      default: return isDark ? 'text-slate-400' : 'text-slate-600';
    }
  };

  return (
    <div className={`min-h-screen p-8 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDark 
              ? 'bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'
          }`}>
            Smart Links & Tasks
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Access your favorite websites and manage your entertainment tasks
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Tasks Section */}
      {activeTasks.length > 0 && (
        <div className={`${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-white/20'
        } backdrop-blur-xl rounded-2xl p-6 border shadow-xl`}>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Upcoming Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTasks.map(task => {
              const Icon = getTaskTypeIcon(task.type);
              return (
                <div key={task.id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700' 
                    : 'bg-white/50 border-slate-200/50 hover:bg-white'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {task.type}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`p-1 rounded transition-colors ${
                          isDark 
                            ? 'hover:bg-slate-600 text-slate-400 hover:text-green-400' 
                            : 'hover:bg-slate-100 text-slate-500 hover:text-green-600'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`p-1 rounded transition-colors ${
                          isDark 
                            ? 'hover:bg-slate-600 text-slate-400 hover:text-red-400' 
                            : 'hover:bg-slate-100 text-slate-500 hover:text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {task.title}
                  </h4>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority} priority
                    </span>
                    {task.dueDate && (
                      <span className={`${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Form */}
      {showTaskForm && (
        <div className={`${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-white/20'
        } backdrop-blur-xl rounded-2xl p-6 border shadow-xl`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Add New Task
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                placeholder="Watch Inception"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Type
              </label>
              <select
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              >
                <option value="movie">Movie</option>
                <option value="show">TV Show</option>
                <option value="workout">Workout</option>
                <option value="goal">Goal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Description
            </label>
            <input
              type="text"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              placeholder="Christopher Nolan masterpiece"
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Add Task
            </button>
            <button
              onClick={() => setShowTaskForm(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Link Form */}
      {showAddForm && (
        <div className={`${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/80 border-white/20'
        } backdrop-blur-xl rounded-2xl p-6 border shadow-xl`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Add New Link
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Name
              </label>
              <input
                type="text"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                URL
              </label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Category
              </label>
              <select
                value={newLink.category}
                onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              >
                <option value="AI/Productivity">AI/Productivity</option>
                <option value="Social">Social</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Communication">Communication</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Description
              </label>
              <input
                type="text"
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                placeholder="Short description"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={addLink}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add Link
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links Section */}
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h3 className={`text-xl font-semibold flex items-center space-x-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Globe className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>{category}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {links
                .filter(link => link.category === category)
                .map(link => (
                  <div key={link.id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' 
                      : 'bg-white/80 border-white/20 hover:bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {link.name}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {link.description}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className={`transition-colors opacity-0 group-hover:opacity-100 ${
                          isDark 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-red-500 hover:text-red-700'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-1 transition-colors ${
                          isDark 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-800'
                        }`}
                      >
                        <span className="text-sm">Open</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className={`${
          isDark 
            ? 'bg-slate-800/30 border-slate-700/30' 
            : 'bg-white/60 border-white/30'
        } backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Completed Tasks
          </h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg opacity-60 ${
                isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <Sparkles className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`line-through ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className={`p-1 rounded transition-colors ${
                    isDark 
                      ? 'hover:bg-slate-600 text-slate-500 hover:text-red-400' 
                      : 'hover:bg-slate-100 text-slate-400 hover:text-red-600'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartLinks;