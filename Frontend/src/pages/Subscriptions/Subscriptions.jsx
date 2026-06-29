import { useState } from 'react';
import {
  Plus,
  Calendar,
  DollarSign,
  Trash2,
  ExternalLink,
  CreditCard,
  TrendingUp,
  X,
} from 'lucide-react';
import TopBar from '../../components/TopBar/TopBar';
import './Subscriptions.css';

const initialSubscriptions = [
  {
    id: 1,
    name: 'Spotify',
    price: 119,
    cycle: 'monthly',
    nextBill: 'Jul 15',
    color: '#1DB954',
    emoji: '🎵',
    category: 'Music',
  },
  {
    id: 2,
    name: 'Netflix',
    price: 649,
    cycle: 'monthly',
    nextBill: 'Jul 8',
    color: '#E50914',
    emoji: '🎬',
    category: 'Streaming',
  },
  {
    id: 3,
    name: 'YouTube Premium',
    price: 129,
    cycle: 'monthly',
    nextBill: 'Jul 20',
    color: '#FF0000',
    emoji: '▶️',
    category: 'Streaming',
  },
  {
    id: 4,
    name: 'Amazon Prime',
    price: 1499,
    cycle: 'yearly',
    nextBill: 'Dec 1',
    color: '#FF9900',
    emoji: '📦',
    category: 'Shopping',
  },
  {
    id: 5,
    name: 'iCloud+',
    price: 75,
    cycle: 'monthly',
    nextBill: 'Jul 3',
    color: '#007AFF',
    emoji: '☁️',
    category: 'Storage',
  },
  {
    id: 6,
    name: 'Notion',
    price: 96,
    cycle: 'monthly',
    nextBill: 'Jul 12',
    color: '#2D2D2D',
    emoji: '📝',
    category: 'Productivity',
  },
  {
    id: 7,
    name: 'Disney+ Hotstar',
    price: 299,
    cycle: 'monthly',
    nextBill: 'Jul 25',
    color: '#113CCF',
    emoji: '✨',
    category: 'Streaming',
  },
  {
    id: 8,
    name: 'ChatGPT Plus',
    price: 1680,
    cycle: 'monthly',
    nextBill: 'Jul 5',
    color: '#10A37F',
    emoji: '🤖',
    category: 'AI',
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', price: '', cycle: 'monthly', emoji: '📱' });

  const monthlyCost = subscriptions.reduce((sum, sub) => {
    return sum + (sub.cycle === 'yearly' ? Math.round(sub.price / 12) : sub.price);
  }, 0);

  const yearlyCost = subscriptions.reduce((sum, sub) => {
    return sum + (sub.cycle === 'yearly' ? sub.price : sub.price * 12);
  }, 0);

  const handleDelete = (id) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const handleAdd = () => {
    if (newSub.name && newSub.price) {
      const colors = ['#FF6B6B', '#4ECDC4', '#A78BFA', '#FFD93D', '#FF6392', '#38BDF8'];
      setSubscriptions([
        ...subscriptions,
        {
          id: Date.now(),
          name: newSub.name,
          price: parseFloat(newSub.price),
          cycle: newSub.cycle,
          nextBill: 'N/A',
          color: colors[Math.floor(Math.random() * colors.length)],
          emoji: newSub.emoji,
          category: 'Custom',
        },
      ]);
      setNewSub({ name: '', price: '', cycle: 'monthly', emoji: '📱' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="subscriptions-page" id="subscriptions-page">
      <TopBar title="Subscriptions" subtitle="Manage your recurring payments 💳" />

      <div className="subscriptions-content">
        {/* Summary Cards */}
        <section className="sub-summary animate-in" id="sub-summary">
          <div className="sub-summary-card sub-summary-monthly">
            <div className="sub-summary-icon">
              <CreditCard size={22} />
            </div>
            <div className="sub-summary-info">
              <span className="sub-summary-label">Monthly Cost</span>
              <span className="sub-summary-value">₹{monthlyCost.toLocaleString()}</span>
            </div>
          </div>
          <div className="sub-summary-card sub-summary-yearly">
            <div className="sub-summary-icon yearly-icon">
              <TrendingUp size={22} />
            </div>
            <div className="sub-summary-info">
              <span className="sub-summary-label">Yearly Cost</span>
              <span className="sub-summary-value">₹{yearlyCost.toLocaleString()}</span>
            </div>
          </div>
          <div className="sub-summary-card sub-summary-count">
            <div className="sub-summary-icon count-icon">
              <DollarSign size={22} />
            </div>
            <div className="sub-summary-info">
              <span className="sub-summary-label">Active Subs</span>
              <span className="sub-summary-value">{subscriptions.length}</span>
            </div>
          </div>
        </section>

        {/* Add Button */}
        <div className="sub-actions">
          <button
            className="add-sub-btn"
            onClick={() => setShowAddModal(true)}
            id="add-subscription-btn"
          >
            <Plus size={18} />
            Add Subscription
          </button>
        </div>

        {/* Subscriptions Grid */}
        <section className="sub-grid" id="sub-grid">
          {subscriptions.map((sub, i) => (
            <div
              key={sub.id}
              className={`sub-card animate-in animate-in-delay-${Math.min(i + 1, 5)}`}
              style={{ '--sub-color': sub.color }}
            >
              <div className="sub-card-header">
                <div className="sub-card-badge" style={{ background: sub.color }}>
                  <span className="sub-emoji">{sub.emoji}</span>
                </div>
                <button
                  className="sub-delete-btn"
                  onClick={() => handleDelete(sub.id)}
                  title="Remove subscription"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="sub-name">{sub.name}</h4>
              <span className="sub-category">{sub.category}</span>

              <div className="sub-price-row">
                <span className="sub-price">₹{sub.price.toLocaleString()}</span>
                <span className="sub-cycle">/{sub.cycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <div className="sub-next-bill">
                <Calendar size={13} />
                <span>Next: {sub.nextBill}</span>
              </div>

              <div
                className="sub-color-strip"
                style={{ background: sub.color }}
              />
            </div>
          ))}
        </section>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} id="add-sub-modal">
            <div className="modal-header">
              <h3>Add Subscription</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Emoji</label>
                <div className="emoji-picker">
                  {['🎵', '🎬', '📦', '☁️', '📝', '🎮', '📱', '💻', '🤖', '📚'].map((e) => (
                    <button
                      key={e}
                      className={`emoji-btn ${newSub.emoji === e ? 'active' : ''}`}
                      onClick={() => setNewSub({ ...newSub, emoji: e })}
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
                  value={newSub.name}
                  onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  placeholder="e.g., Spotify"
                  id="sub-name-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={newSub.price}
                    onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
                    placeholder="e.g., 199"
                    id="sub-price-input"
                  />
                </div>
                <div className="form-group">
                  <label>Cycle</label>
                  <select
                    value={newSub.cycle}
                    onChange={(e) => setNewSub({ ...newSub, cycle: e.target.value })}
                    id="sub-cycle-select"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary modal-submit-btn" onClick={handleAdd} id="submit-sub-btn">
                <Plus size={16} />
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
