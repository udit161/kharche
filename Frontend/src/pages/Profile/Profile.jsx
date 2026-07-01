import { useState, useEffect } from 'react';
import { Camera, Edit3, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import './Profile.css';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Udit Kumar');
  const [email, setEmail] = useState('');
  const [tempName, setTempName] = useState('Udit Kumar');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setTempName(data.name);
          setEmail(data.email);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-page" id="profile-page">
      <TopBar title="Profile" subtitle="Your personal space 👤" />

      <div className="profile-content">
        <section className="profile-header-card clean-profile animate-in" id="profile-header">
          <div className="profile-cover">
            <div className="cover-pattern" />
          </div>
          <div className="profile-header-body">
            <div className="profile-avatar-section">
              <div className="profile-avatar" id="profile-avatar">
                <div className="avatar-large">
                  <span>{name.charAt(0)}</span>
                </div>
                <button className="avatar-edit-btn" id="avatar-edit-btn" title="Change Photo">
                  <Camera size={14} />
                </button>
              </div>
              
              <div className="profile-name-section">
                {isEditing ? (
                  <div className="profile-name-edit-group">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="profile-name-input"
                      id="profile-name-input"
                      autoFocus
                    />
                    <button className="save-profile-btn" onClick={handleSave} id="save-profile-btn">
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="profile-name-display-group">
                    <h2 className="profile-name">{name}</h2>
                    <button 
                      className="edit-name-btn" 
                      onClick={() => { setTempName(name); setIsEditing(true); }}
                      id="edit-name-btn"
                      title="Edit Name"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-email-section">
                <p className="profile-email">{email || 'Loading...'}</p>
              </div>

              <div className="profile-actions-section">
                <button className="logout-btn" onClick={handleLogout} id="logout-btn">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
