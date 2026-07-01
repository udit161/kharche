import { useState, useEffect } from 'react';
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

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', price: '', cycle: 'monthly', emoji: '📱' });

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/subscriptions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.map(sub => ({ ...sub, id: sub._id })));
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };
    fetchSubs();
  }, []);

  const monthlyCost = subscriptions.reduce((sum, sub) => {
    return sum + (sub.cycle === 'yearly' ? Math.round(sub.price / 12) : sub.price);
  }, 0);

  const yearlyCost = subscriptions.reduce((sum, sub) => {
    return sum + (sub.cycle === 'yearly' ? sub.price : sub.price * 12);
  }, 0);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`/api/subscriptions/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleAdd = async () => {
    if (newSub.name && newSub.price) {
      const colors = ['#FF6B6B', '#4ECDC4', '#A78BFA', '#FFD93D', '#FF6392', '#38BDF8'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const subData = {
        name: newSub.name,
        price: parseFloat(newSub.price),
        cycle: newSub.cycle,
        nextBill: 'N/A',
        color: randomColor,
        emoji: newSub.emoji,
        category: 'Custom',
      };

      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(subData)
          });
          if (res.ok) {
            const savedSub = await res.json();
            savedSub.id = savedSub._id;
            setSubscriptions([...subscriptions, savedSub]);
          } else {
             setSubscriptions([...subscriptions, { ...subData, id: Date.now() }]);
          }
        } else {
          setSubscriptions([...subscriptions, { ...subData, id: Date.now() }]);
        }
      } catch (error) {
         console.error('Error saving subscription:', error);
      }
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
