
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ScraperView } from './components/ScraperView';
import { SettingsView } from './components/SettingsView';
import { Platform } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scraper' | 'settings'>('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.INSTAGRAM);

  const navigateToScraper = (platform: Platform) => {
    setSelectedPlatform(platform);
    setActiveTab('scraper');
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard onPlatformSelect={navigateToScraper} />}
      {activeTab === 'scraper' && <ScraperView platform={selectedPlatform} />}
      {activeTab === 'settings' && <SettingsView />}
    </Layout>
  );
};

export default App;
