import { useState } from 'react';
import { Camera, Edit3, Save } from 'lucide-react';
import TopBar from '../../components/TopBar/TopBar';
import './Profile.css';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Udit Kumar');
  const [tempName, setTempName] = useState('Udit Kumar');

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
