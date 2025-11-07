import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingDown, TrendingUp, PieChart, Trash2, Calendar } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'expense' | 'income',
  });

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare',
    'Education', 'Travel', 'Groceries', 'Rent', 'Utilities', 'Insurance', 'Other'
  ];

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(savedExpenses);
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
  };

  const addExpense = () => {
    if (newExpense.amount <= 0) return;

    const expense: Expense = {
      id: Date.now().toString(),
      ...newExpense,
    };

    saveExpenses([...expenses, expense]);
    setNewExpense({
      amount: 0,
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    });
    setShowAddForm(false);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(updatedExpenses);
  };

  const getCurrentMonthStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalExpenses = monthlyExpenses
      .filter(expense => expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalIncome = monthlyExpenses
      .filter(expense => expense.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalExpenses,
      totalIncome,
      balance: totalIncome - totalExpenses,
      transactions: monthlyExpenses.length,
    };
  };

  const getCategoryStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear &&
             expense.type === 'expense';
    });

    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food': 'bg-red-100 text-red-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Bills': 'bg-yellow-100 text-yellow-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Travel': 'bg-orange-100 text-orange-800',
      'Groceries': 'bg-emerald-100 text-emerald-800',
      'Rent': 'bg-teal-100 text-teal-800',
      'Utilities': 'bg-cyan-100 text-cyan-800',
      'Insurance': 'bg-slate-100 text-slate-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const monthlyStats = getCurrentMonthStats();
  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600">Monitor your spending and income</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${monthlyStats.totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${monthlyStats.totalIncome.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${monthlyStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyStats.balance.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.transactions}</p>
            </div>
            <PieChart className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newExpense.type}
                onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value as 'expense' | 'income' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What was this for?"
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={addExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Transaction
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {categoryStats.map(({ category, amount }) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      expense.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {expense.type === 'expense' ? (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description || expense.category}</p>
                      <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${
                      expense.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {expense.type === 'expense' ? '-' : '+'}${expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Transactions</h3>
        <div className="space-y-3">
          {expenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    expense.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {expense.type === 'expense' ? (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{expense.description || expense.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-lg font-bold ${
                    expense.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {expense.type === 'expense' ? '-' : '+'}${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Expenses;