import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';
import DirectMessages from './components/DirectMessages';
import InitialSetup from './components/InitialSetup';
import PhoneSimulationOverlay from './components/PhoneSimulationOverlay';
import NotificationContainer from './components/NotificationContainer';

function AppContent() {
  const [view, setView] = useState<'home' | 'profile' | 'dm'>('home');
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    localStorage.removeItem('insta_setup_complete');
    const setupStatus = sessionStorage.getItem('insta_setup_complete');
    if (setupStatus === 'true') {
      setHasCompletedSetup(true);
    } else {
      setHasCompletedSetup(false);
    }
  }, []);

  const handleSetupComplete = () => {
    sessionStorage.setItem('insta_setup_complete', 'true');
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
      <NotificationContainer />
      <PhoneSimulationOverlay />
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
