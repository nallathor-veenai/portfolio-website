import { useState } from 'react';
import { User, MessageCircle, Volume2 } from 'lucide-react';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import VoicePage from './pages/VoicePage';
import './index.css';

type TabType = 'profile' | 'chat' | 'voice';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const renderPage = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage />;
      case 'chat':
        return <ChatPage />;
      case 'voice':
        return <VoicePage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {renderPage()}
      </main>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={24} />
          <span>Profile</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle size={24} />
          <span>Chat</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          <Volume2 size={24} />
          <span>Voice</span>
        </button>
      </nav>
    </div>
  );
}
