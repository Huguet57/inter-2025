import React, { useState } from 'react';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Users from 'lucide-react/dist/esm/icons/users';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Flag from 'lucide-react/dist/esm/icons/flag';
import { GroupStage } from './components/GroupStage';
import { MatchSchedule } from './components/MatchSchedule';
import { KnockoutStage } from './components/KnockoutStage';
import { RefereeMatchControl } from './components/RefereeMatchControl';
import { MatchProvider } from './context/MatchContext';

function App() {
  const [activeTab, setActiveTab] = useState<'groups' | 'schedule' | 'knockout' | 'referee'>('groups');

  return (
    <MatchProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center">Torneig de Futbol</h1>
          </div>
        </header>

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
          {activeTab === 'groups' && <GroupStage />}
          {activeTab === 'schedule' && <MatchSchedule />}
          {activeTab === 'knockout' && <KnockoutStage />}
          {activeTab === 'referee' && <RefereeMatchControl />}
        </main>
      </div>
    </MatchProvider>
  );
}

export default App;