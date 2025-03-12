import React, { useState } from 'react';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Users from 'lucide-react/dist/esm/icons/users';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Flag from 'lucide-react/dist/esm/icons/flag';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { GroupStage } from './components/GroupStage';
import { MatchSchedule } from './components/MatchSchedule';
import { KnockoutStage } from './components/KnockoutStage';
import { RefereeMatchControl } from './components/RefereeMatchControl';
import { MatchProvider } from './context/MatchContext';

function App() {
  const [activeTab, setActiveTab] = useState<'groups' | 'schedule' | 'knockout' | 'referee'>('groups');
  const [showDebug, setShowDebug] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleForceReload = () => {
    // Forçar una recàrrega completa del component
    console.log('Forçant recàrrega dels components...');
    setReloadKey(prev => prev + 1);
  };

  return (
    <MatchProvider key={reloadKey}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white py-6">
          <div className="container mx-auto px-4 relative">
            <h1 className="text-3xl font-bold text-center">Torneig de Futbol</h1>
            
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100"
              title="Opcions de diagnòstic"
            >
              <AlertCircle className="w-5 h-5" />
            </button>
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
          {activeTab === 'groups' && <GroupStage key={`groups-${reloadKey}`} />}
          {activeTab === 'schedule' && <MatchSchedule key={`schedule-${reloadKey}`} />}
          {activeTab === 'knockout' && <KnockoutStage key={`knockout-${reloadKey}`} />}
          {activeTab === 'referee' && <RefereeMatchControl key={`referee-${reloadKey}`} />}
        </main>
      </div>
    </MatchProvider>
  );
}

export default App;