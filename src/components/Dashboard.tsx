import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Activity, Calendar, CheckCircle, Zap, ArrowUp, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    goalsCompleted: 0,
    totalGoals: 0,
    monthlySpending: 0,
    workoutsThisWeek: 0,
  });

  useEffect(() => {
    // Load stats from localStorage
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekNumber(new Date());
    
    const monthlyExpenses = expenses.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const weeklyWorkouts = workouts.filter((workout: any) => {
      const workoutDate = new Date(workout.date);
      return getWeekNumber(workoutDate) === currentWeek;
    });
    
    setStats({
      goalsCompleted: goals.filter((goal: any) => goal.completed).length,
      totalGoals: goals.length,
      monthlySpending: monthlyExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0),
      workoutsThisWeek: weeklyWorkouts.length,
    });
  }, []);

  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const statCards = [
    {
      title: 'Goals Progress',
      value: `${stats.goalsCompleted}/${stats.totalGoals}`,
      icon: Target,
      gradient: 'from-blue-500 to-cyan-400',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Monthly Spending',
      value: `$${stats.monthlySpending.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-400',
      change: '-8%',
      trend: 'down',
    },
    {
      title: 'Workouts This Week',
      value: stats.workoutsThisWeek.toString(),
      icon: Activity,
      gradient: 'from-purple-500 to-pink-400',
      change: '+25%',
      trend: 'up',
    },
    {
      title: 'Streak Days',
      value: '7',
      icon: CheckCircle,
      gradient: 'from-orange-500 to-red-400',
      change: '+3',
      trend: 'up',
    },
  ];

  const today = new Date();
  const todayString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="space-y-8 p-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Welcome back, Arihant!
                  </h1>
                </div>
                <p className="text-slate-600 text-lg">{todayString}</p>
                <p className="text-slate-500 mt-1">Ready to conquer your goals today?</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">On track</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 rounded-2xl"></div>
                <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      card.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      <ArrowUp className={`w-4 h-4 ${card.trend === 'down' ? 'rotate-180' : ''}`} />
                      <span>{card.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                    <p className="text-xs text-slate-500 mt-1">from last week</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Focus */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Today's Focus</h3>
              </div>
              <div className="space-y-4">
                {[
                  { text: 'Complete morning workout', color: 'from-blue-500 to-cyan-400', completed: false },
                  { text: 'Review weekly goals', color: 'from-emerald-500 to-teal-400', completed: true },
                  { text: 'Log daily expenses', color: 'from-purple-500 to-pink-400', completed: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <div className={`w-3 h-3 bg-gradient-to-r ${item.color} rounded-full ${item.completed ? 'opacity-50' : 'animate-pulse'}`}></div>
                    <span className={`text-slate-700 ${item.completed ? 'line-through opacity-60' : ''}`}>{item.text}</span>
                    {item.completed && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, label: 'Add Goal', gradient: 'from-blue-500 to-cyan-400' },
                  { icon: DollarSign, label: 'Log Expense', gradient: 'from-emerald-500 to-teal-400' },
                  { icon: Activity, label: 'Start Workout', gradient: 'from-purple-500 to-pink-400' },
                  { icon: Calendar, label: 'Schedule', gradient: 'from-orange-500 to-red-400' },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button key={index} className="group relative overflow-hidden p-4 rounded-xl bg-slate-50/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 block">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Productivity Insights</h3>
              </div>
              <span className="text-sm text-slate-500">Last 7 days</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-2xl font-bold text-blue-600 mb-1">85%</div>
                <div className="text-sm text-slate-600">Goal Completion</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-2xl font-bold text-emerald-600 mb-1">4.2h</div>
                <div className="text-sm text-slate-600">Daily Focus Time</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                <div className="text-sm text-slate-600">Tasks Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;