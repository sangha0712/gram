import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';

function AppContent() {
  const [view, setView] = useState<'home' | 'profile'>('home');
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleNavigate = (newView: 'home' | 'profile', userId?: string) => {
    setView(newView);
    if (userId) setProfileUserId(userId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout currentView={view} onNavigate={handleNavigate} onOpenCreate={() => setIsCreateOpen(true)}>
      {view === 'home' && <Feed onUserClick={(id) => handleNavigate('profile', id)} />}
      {view === 'profile' && profileUserId && <Profile userId={profileUserId} />}
      {isCreateOpen && <CreatePostModal onClose={() => setIsCreateOpen(false)} />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
