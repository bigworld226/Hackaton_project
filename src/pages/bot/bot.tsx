import  { useEffect } from 'react';

interface DevBadgeToastProps {
  badgeName: string;
  onClose: () => void;
}

import './bot.css';

interface DevBadgeToastProps {
  badgeName: string;
  onClose: () => void;
}

export default function DevBadgeToast({ badgeName, onClose }: DevBadgeToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // 10000 ms = 10 secondes

    // Nettoyage du timer si le composant est démonté avant
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="dev-badge-floating-wrapper">
      {/* La bulle de dialogue avec le message type code */}
      <div className="dev-speech-bubble">
        <div style={{ color: '#f38ba8', fontWeight: 'bold', marginBottom: '4px' }}>
          alert("réussite +1 🚀");
        </div>
        <div>
          Vous avez obtenu un nouveau badge <span style={{ color: '#a6e3a1' }}>dev</span> : <strong>{badgeName}</strong> !
        </div>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '4px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: '#6c7086',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* L'avatar Bottts Neutral exact chargé directement depuis l'API */}
      <img 
        src="https://api.dicebear.com/10.x/bottts-neutral/svg?scale=1.25&backgroundColor=978d87,8f8f8f,879198,448ef4&seed=85zntz0q" 
        alt="Bottts Neutral Dev Bot"
        className="dev-bot-icon"
      />
    </div>
  );
}

//        src="https://api.dicebear.com/10.x/bottts-neutral/svg?scale=1.25&backgroundColor=978d87,8f8f8f,879198,448ef4&seed=85zntz0q" 
