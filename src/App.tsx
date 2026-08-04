import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';
import DirectMessages from './components/DirectMessages';
import InitialSetup from './components/InitialSetup';

function AppContent() {
  const [view, setView] = useState<'home' | 'profile' | 'dm'>('home');
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(true);

  useEffect(() => {
    const setupStatus = localStorage.getItem('insta_setup_complete');
    if (!setupStatus) {
      setHasCompletedSetup(false);
    }
  }, []);

  const handleSetupComplete = () => {
    localStorage.setItem('insta_setup_complete', 'true');
    setHasCompletedSetup(true);
  };

  const handleNavigate = (newView: 'home' | 'profile' | 'dm', userId?: string) => {
    setView(newView);
    if (userId) setProfileUserId(userId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Layout currentView={view} onNavigate={handleNavigate} onOpenCreate={() => setIsCreateOpen(true)}>
        {view === 'home' && <Feed onUserClick={(id) => handleNavigate('profile', id)} />}
        {view === 'profile' && profileUserId && <Profile userId={profileUserId} />}
        {view === 'dm' && <DirectMessages onUserClick={(id) => handleNavigate('profile', id)} />}
        {isCreateOpen && <CreatePostModal onClose={() => setIsCreateOpen(false)} />}
      </Layout>
      {!hasCompletedSetup && <InitialSetup onComplete={handleSetupComplete} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
