import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Zap,
  Leaf,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import TopBar from '../../components/TopBar/TopBar';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Initial sample data
const initialRecentExpenses = [
  { id: 1, name: 'Grocery Shopping', amount: 2500, category: 'Food', date: 'Today', icon: '🛒' },
  { id: 2, name: 'Uber Ride', amount: 350, category: 'Transport', date: 'Today', icon: '🚗' },
  { id: 3, name: 'Netflix', amount: 649, category: 'Entertainment', date: 'Yesterday', icon: '🎬' },
  { id: 4, name: 'Coffee', amount: 180, category: 'Food', date: 'Yesterday', icon: '☕' },
  { id: 5, name: 'Electricity Bill', amount: 1200, category: 'Bills', date: '2 days ago', icon: '⚡' },
];

const initialPriorityItems = [
  { id: 1, name: 'Rent Payment', amount: 18000, priority: 'high', due: 'Jul 1', icon: '🏠' },
  { id: 2, name: 'Insurance Premium', amount: 8000, priority: 'high', due: 'Jul 5', icon: '🛡️' },
  { id: 3, name: 'Gym Membership', amount: 1500, priority: 'medium', due: 'Jul 7', icon: '💪' },
  { id: 4, name: 'Book Subscription', amount: 299, priority: 'low', due: 'Jul 15', icon: '📚' },
  { id: 5, name: 'Phone Recharge', amount: 599, priority: 'medium', due: 'Jul 10', icon: '📱' },
];

export default function Dashboard() {
  const [totalBudget, setTotalBudget] = useState(80000);
  const [budgetInput, setBudgetInput] = useState('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [chartView, setChartView] = useState('weekly');

  // Lists state
  const [expenses, setExpenses] = useState(initialRecentExpenses);
  const [priorities, setPriorities] = useState(initialPriorityItems);

  // Modal states
  const [showAddPriorityModal, setShowAddPriorityModal] = useState(false);
  const [showAddRecentModal, setShowAddRecentModal] = useState(false);

  // New item states
  const [newPriority, setNewPriority] = useState({ name: '', amount: '', priority: 'high', due: '', icon: '🔥' });
  const [newRecent, setNewRecent] = useState({ name: '', amount: '', category: 'Food', date: 'Today', icon: '💸' });

  // Calculations based on dynamic state
  const totalUsed = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalUsed;
  const expenseLimit = 48000;
  const usedPercent = Math.min(Math.round((totalUsed / totalBudget) * 100), 100) || 0;
  const limitPercent = Math.min(Math.round((totalUsed / expenseLimit) * 100), 100) || 0;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Skip if not logged in
        
        const res = await fetch('http://localhost:8000/api/expenses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const priorityItems = data.filter(e => e.priority !== 'none');
          const recentItems = data.filter(e => e.priority === 'none');
          if (data.length > 0) {
            setPriorities(priorityItems);
            setExpenses(recentItems);
          }
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, []);

  const handleBudgetSubmit = () => {
    const val = parseFloat(budgetInput);
    if (val > 0) {
      setTotalBudget(val);
      setBudgetInput('');
      setIsEditingBudget(false);
    }
  };

  const handleAddPriority = async () => {
    if (newPriority.name && newPriority.amount) {
      try {
        const token = localStorage.getItem('token');
        const expenseData = {
          name: newPriority.name,
          amount: parseFloat(newPriority.amount),
          priority: newPriority.priority,
          due: newPriority.due || 'Soon',
          icon: newPriority.icon,
        };

        if (token) {
          const res = await fetch('http://localhost:8000/api/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(expenseData)
          });
          if (res.ok) {
            const savedExpense = await res.json();
            setPriorities([savedExpense, ...priorities]);
          } else {
            setPriorities([{ id: Date.now(), ...expenseData }, ...priorities]);
          }
        } else {
          setPriorities([{ id: Date.now(), ...expenseData }, ...priorities]);
        }
      } catch (error) {
        console.error('Error saving priority expense:', error);
      }
      setNewPriority({ name: '', amount: '', priority: 'high', due: '', icon: '🔥' });
      setShowAddPriorityModal(false);
    }
  };

  const handleAddRecent = async () => {
    if (newRecent.name && newRecent.amount) {
      try {
        const token = localStorage.getItem('token');
        const expenseData = {
          name: newRecent.name,
          amount: parseFloat(newRecent.amount),
          category: newRecent.category,
          date: newRecent.date || 'Today',
          icon: newRecent.icon,
          priority: 'none'
        };

        if (token) {
          const res = await fetch('http://localhost:8000/api/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(expenseData)
          });
          if (res.ok) {
            const savedExpense = await res.json();
            setExpenses([savedExpense, ...expenses]);
          } else {
            setExpenses([{ id: Date.now(), ...expenseData }, ...expenses]);
          }
        } else {
          setExpenses([{ id: Date.now(), ...expenseData }, ...expenses]);
        }
      } catch (error) {
        console.error('Error saving recent expense:', error);
      }
      setNewRecent({ name: '', amount: '', category: 'Food', date: 'Today', icon: '💸' });
      setShowAddRecentModal(false);
    }
  };

  // Weekly chart data
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Spent',
        data: [1200, 1900, 800, 2400, 1600, 3200, 900],
        backgroundColor: [
          'rgba(255, 107, 107, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(78, 205, 196, 0.8)',
          'rgba(255, 99, 146, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(255, 217, 61, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Monthly chart data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Expenses',
        data: [32000, 28000, 38000, 30000, 27000, totalUsed],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Budget',
        data: [80000, 80000, 80000, 80000, 80000, totalBudget],
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.05)',
        fill: true,
        tension: 0,
        borderDash: [8, 4],
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: 'Inter', size: 12 },
          color: '#6B7280',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(45, 45, 58, 0.9)',
        titleFont: { family: 'Outfit', size: 14 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 10,
        displayColors: true,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 12 },
          color: '#9CA3AF',
        },
      },
      y: {
        grid: { color: 'rgba(243, 232, 222, 0.5)' },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#9CA3AF',
          callback: (val) => `₹${(val / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
    },
  };

  // Donut chart data for expense breakdown
  const donutData = {
    labels: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping'],
    datasets: [
      {
        data: [8500, 4200, 6800, 3500, 5500],
        backgroundColor: [
          '#FF6B6B',
          '#4ECDC4',
          '#A78BFA',
          '#FFD93D',
          '#FF6392',
        ],
        borderWidth: 0,
        spacing: 3,
        borderRadius: 6,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { family: 'Inter', size: 12 },
          color: '#6B7280',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(45, 45, 58, 0.9)',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="dashboard" id="dashboard-page">
      <TopBar title="Dashboard" subtitle="Track your kharche wisely ✨" />

      <div className="dashboard-content">
        {/* ===== Budget Input Bar ===== */}
        <section className="budget-bar animate-in" id="budget-input-section">
          <div className="budget-bar-inner">
            <div className="budget-bar-left">
              <div className="budget-icon-wrap">
                <Wallet size={28} />
              </div>
              <div className="budget-info">
                <span className="budget-label">Total Budget</span>
                <span className="budget-amount">₹{totalBudget.toLocaleString()}</span>
              </div>
            </div>
            <div className="budget-bar-right">
              {isEditingBudget ? (
                <div className="budget-edit">
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="Enter total budget"
                    className="budget-input"
                    id="budget-input"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleBudgetSubmit()}
                  />
                  <button className="btn-primary" onClick={handleBudgetSubmit}>
                    Set
                  </button>
                </div>
              ) : (
                <button
                  className="budget-edit-btn"
                  onClick={() => setIsEditingBudget(true)}
                  id="edit-budget-btn"
                >
                  <Plus size={18} />
                  <span>Update Budget</span>
                </button>
              )}
            </div>
          </div>
          <div className="budget-progress-bar">
            <div
              className="budget-progress-fill"
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          <div className="budget-progress-labels">
            <span>₹0</span>
            <span className="budget-progress-used">
              {usedPercent}% used
            </span>
            <span>₹{totalBudget.toLocaleString()}</span>
          </div>
        </section>

        {/* ===== Stats Cards ===== */}
        <section className="stats-grid" id="stats-section">
          {/* Total Expense Used */}
          <div className="stat-card stat-card-coral animate-in animate-in-delay-1" id="total-used-card">
            <div className="stat-icon coral">
              <TrendingDown size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">₹{totalUsed.toLocaleString()}</span>
              <div className="stat-change negative">
                <ArrowUpRight size={14} />
                <span>+12% from last week</span>
              </div>
            </div>
          </div>

          {/* Remaining */}
          <div className="stat-card stat-card-teal animate-in animate-in-delay-2" id="remaining-card">
            <div className="stat-icon teal">
              <PiggyBank size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Remaining</span>
              <span className="stat-value">₹{remaining.toLocaleString()}</span>
              <div className="stat-change positive">
                <ArrowDownRight size={14} />
                <span>{100 - usedPercent}% left this month</span>
              </div>
            </div>
          </div>

          {/* Expense Limit */}
          <div className="stat-card stat-card-sunny animate-in animate-in-delay-3" id="limit-card">
            <div className="stat-icon sunny">
              <AlertTriangle size={22} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Expense Limit</span>
              <span className="stat-value">₹{expenseLimit.toLocaleString()}</span>
              <div className="limit-bar-mini">
                <div
                  className="limit-bar-mini-fill"
                  style={{ width: `${limitPercent}%` }}
                />
              </div>
              <span className="stat-hint">{limitPercent}% of limit reached</span>
            </div>
          </div>
        </section>

        {/* ===== Charts Section ===== */}
        <section className="charts-section" id="charts-section">
          {/* Weekly / Monthly Chart */}
          <div className="chart-card card animate-in animate-in-delay-3">
            <div className="chart-header">
              <h3>Spending Overview</h3>
              <div className="chart-toggle" id="chart-toggle">
                <button
                  className={`toggle-btn ${chartView === 'weekly' ? 'active' : ''}`}
                  onClick={() => setChartView('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`toggle-btn ${chartView === 'monthly' ? 'active' : ''}`}
                  onClick={() => setChartView('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="chart-body">
              {chartView === 'weekly' ? (
                <Bar data={weeklyData} options={barOptions} />
              ) : (
                <Line data={monthlyData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="chart-card card donut-card animate-in animate-in-delay-4">
            <div className="chart-header">
              <h3>By Category</h3>
            </div>
            <div className="chart-body donut-body">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>
        </section>

        {/* ===== Bottom Section: Priority List + Recent ===== */}
        <section className="bottom-section" id="bottom-section">
          {/* Priority List */}
          <div className="priority-card card animate-in animate-in-delay-4">
            <div className="section-header">
              <h3>🔥 Priority Expenses</h3>
              <button className="btn-add-item" onClick={() => setShowAddPriorityModal(true)} id="add-priority-btn">
                <Plus size={14} />
                <span>ADD priority expense</span>
              </button>
            </div>
            <ul className="priority-list" id="priority-list">
              {priorities.map((item) => (
                <li key={item.id} className={`priority-item priority-${item.priority}`}>
                  <div className="priority-left">
                    <span className="priority-emoji">{item.icon}</span>
                    <div className="priority-info">
                      <span className="priority-name">{item.name}</span>
                      <span className="priority-due">Due: {item.due}</span>
                    </div>
                  </div>
                  <div className="priority-right">
                    <span className="priority-amount">₹{item.amount.toLocaleString()}</span>
                    <span className={`badge badge-${item.priority}`}>
                      {item.priority === 'high' && <Flame size={12} />}
                      {item.priority === 'medium' && <Zap size={12} />}
                      {item.priority === 'low' && <Leaf size={12} />}
                      {item.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Expenses */}
          <div className="recent-card card animate-in animate-in-delay-5">
            <div className="section-header">
              <h3>📋 Recent Expenses</h3>
              <button className="btn-add-item" onClick={() => setShowAddRecentModal(true)} id="add-recent-btn">
                <Plus size={14} />
                <span>ADD recent</span>
              </button>
            </div>
            <ul className="recent-list" id="recent-expenses-list">
              {expenses.map((item) => (
                <li key={item.id} className="recent-item">
                  <div className="recent-left">
                    <span className="recent-emoji">{item.icon}</span>
                    <div className="recent-info">
                      <span className="recent-name">{item.name}</span>
                      <span className="recent-category">{item.category} · {item.date}</span>
                    </div>
                  </div>
                  <span className="recent-amount">-₹{item.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Add Priority Modal */}
      {showAddPriorityModal && (
        <div className="modal-overlay" onClick={() => setShowAddPriorityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} id="add-priority-modal">
            <div className="modal-header">
              <h3>Add Priority Expense</h3>
              <button className="modal-close" onClick={() => setShowAddPriorityModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Emoji Icon</label>
                <div className="emoji-picker">
                  {['🏠', '🛡️', '💪', '📚', '📱', '🚗', '🎓', '🏥', '🔌', '🔥'].map((e) => (
                    <button
                      key={e}
                      className={`emoji-btn ${newPriority.icon === e ? 'active' : ''}`}
                      onClick={() => setNewPriority({ ...newPriority, icon: e })}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newPriority.name}
                  onChange={(e) => setNewPriority({ ...newPriority, name: e.target.value })}
                  placeholder="e.g., Rent Payment"
                  id="priority-name-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    value={newPriority.amount}
                    onChange={(e) => setNewPriority({ ...newPriority, amount: e.target.value })}
                    placeholder="e.g., 18000"
                    id="priority-amount-input"
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="text"
                    value={newPriority.due}
                    onChange={(e) => setNewPriority({ ...newPriority, due: e.target.value })}
                    placeholder="e.g., Jul 1"
                    id="priority-due-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select
                  value={newPriority.priority}
                  onChange={(e) => setNewPriority({ ...newPriority, priority: e.target.value })}
                  id="priority-level-select"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <button className="btn-primary modal-submit-btn" onClick={handleAddPriority} id="submit-priority-btn">
                <Plus size={16} />
                Add Priority
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recent Modal */}
      {showAddRecentModal && (
        <div className="modal-overlay" onClick={() => setShowAddRecentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} id="add-recent-modal">
            <div className="modal-header">
              <h3>Add Recent Expense</h3>
              <button className="modal-close" onClick={() => setShowAddRecentModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Emoji Icon</label>
                <div className="emoji-picker">
                  {['🛒', '🚗', '🎬', '☕', '⚡', '🍔', '👕', '🏥', '💈', '💸'].map((e) => (
                    <button
                      key={e}
                      className={`emoji-btn ${newRecent.icon === e ? 'active' : ''}`}
                      onClick={() => setNewRecent({ ...newRecent, icon: e })}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newRecent.name}
                  onChange={(e) => setNewRecent({ ...newRecent, name: e.target.value })}
                  placeholder="e.g., Coffee"
                  id="recent-name-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    value={newRecent.amount}
                    onChange={(e) => setNewRecent({ ...newRecent, amount: e.target.value })}
                    placeholder="e.g., 180"
                    id="recent-amount-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newRecent.category}
                    onChange={(e) => setNewRecent({ ...newRecent, category: e.target.value })}
                    placeholder="e.g., Food"
                    id="recent-category-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="text"
                  value={newRecent.date}
                  onChange={(e) => setNewRecent({ ...newRecent, date: e.target.value })}
                  placeholder="e.g., Today"
                  id="recent-date-input"
                />
              </div>

              <button className="btn-primary modal-submit-btn" onClick={handleAddRecent} id="submit-recent-btn">
                <Plus size={16} />
                Add Recent Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
