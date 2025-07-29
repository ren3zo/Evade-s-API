import React from 'react';
import { Users, Plus } from 'lucide-react';

// Credits data
const CREDITS = [
  {
    name: 'ren3zo',
    userId: '785306533050974259',
    role: 'Developer'
  },
  {
    name: 'Phineas',
    userId: '94490510688792576',
    role: 'Designer'
  }
];

interface CreditsProps {
  onAddUser: (userId: string) => void;
}

const getAvatarUrl = (userId: string): string => {
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
};

const Credits: React.FC<CreditsProps> = ({ onAddUser }) => {
  return (
    <div className="glass-card credits-card animate-fade-in">
      <div className="credits-header">
        <h3 className="credits-title">
          <Users size={20} />
          Credits & Contributors
        </h3>
        <p className="credits-description">
          Meet the amazing people who made this website possible
        </p>
      </div>
      
      <div className="credits-grid">
        {CREDITS.map((credit, index) => (
          <div key={credit.userId} className="credit-item animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="credit-avatar">
              <img 
                src={getAvatarUrl(credit.userId)}
                alt={`${credit.name}'s avatar`}
                className="credit-avatar-img"
              />
            </div>
            <div className="credit-info">
              <h4 className="credit-name">{credit.name}</h4>
              <p className="credit-role">{credit.role}</p>
              <p className="credit-userid">ID: {credit.userId}</p>
            </div>
            <button 
              className="add-now-button"
              onClick={() => onAddUser(credit.userId)}
            >
              <Plus size={16} />
              Add Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits; 