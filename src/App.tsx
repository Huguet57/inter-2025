import React, { useState } from 'react';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Users from 'lucide-react/dist/esm/icons/users';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Flag from 'lucide-react/dist/esm/icons/flag';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Loader from 'lucide-react/dist/esm/icons/loader';
import { GroupStage } from './components/GroupStage';
import { MatchSchedule } from './components/MatchSchedule';
import { KnockoutStage } from './components/KnockoutStage';
import { RefereeMatchControl } from './components/RefereeMatchControl';
import { MatchProvider, useMatches } from './context/MatchContext';

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
    <p className="text-gray-600">Carregant dades del torneig...</p>
  </div>
);

// Content component that shows loading state if needed
const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'schedule' | 'knockout' | 'referee'>('groups');
  const [showDebug, setShowDebug] = useState(false);
  const { loading } = useMatches();

  const handleForceReload = () => {
    // Force a page reload to refresh data from the server
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4 relative">
          <h1 className="text-3xl font-bold text-center">Inter de Marracos 2025</h1>
        </div>
      </header>

      {showDebug && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-sm text-yellow-800">Mode diagnòstic actiu</div>
            <button 
              onClick={handleForceReload}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded"
            >
              Recarregar components
            </button>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'groups'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Grups
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Horari
            </button>
            <button
              onClick={() => setActiveTab('knockout')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'knockout'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Eliminatòries
            </button>
            <button
              onClick={() => setActiveTab('referee')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'referee'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Flag className="w-5 h-5 mr-2" />
              Àrbitre
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            {activeTab === 'groups' && <GroupStage />}
            {activeTab === 'schedule' && <MatchSchedule />}
            {activeTab === 'knockout' && <KnockoutStage />}
            {activeTab === 'referee' && <RefereeMatchControl />}
          </>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <MatchProvider>
      <AppContent />
    </MatchProvider>
  );
}

export default App;