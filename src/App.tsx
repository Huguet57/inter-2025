import { useState, useEffect } from 'react';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Users from 'lucide-react/dist/esm/icons/users';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Flag from 'lucide-react/dist/esm/icons/flag';
import Loader from 'lucide-react/dist/esm/icons/loader';
import { GroupStage } from './components/GroupStage';
import { MatchSchedule } from './components/MatchSchedule';
import { KnockoutStage } from './components/KnockoutStage';
import { RefereeMatchControl } from './components/RefereeMatchControl';
import { MatchProvider, useMatches } from './context/MatchContext';
import { AuthProvider } from './context/AuthContext';

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-pink-300 mb-4" />
    <p className="text-gray-600">Carregant dades del torneig...</p>
  </div>
);

// Content component that shows loading state if needed
const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'schedule' | 'knockout' | 'referee'>(() => {
    // Get the saved tab from localStorage, defaulting to 'groups' if not found or invalid
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab === 'groups' || savedTab === 'schedule' || savedTab === 'knockout' || savedTab === 'referee') {
      return savedTab;
    }
    return 'groups';
  });
  
  const { loading } = useMatches();

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-pink-300 text-white py-6">
        <div className="container mx-auto px-4 relative">
          <h1 className="text-3xl font-bold text-center">Inter de Marracos 2025</h1>
        </div>
      </header>

      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-6 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'groups'
                  ? 'text-pink-300 border-b-2 border-pink-300'
                  : 'text-gray-500 hover:text-pink-300'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Grups
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'schedule'
                  ? 'text-pink-300 border-b-2 border-pink-300'
                  : 'text-gray-500 hover:text-pink-300'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Horari
            </button>
            <button
              onClick={() => setActiveTab('knockout')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'knockout'
                  ? 'text-pink-300 border-b-2 border-pink-300'
                  : 'text-gray-500 hover:text-pink-300'
              }`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Eliminatòries
            </button>
            <button
              onClick={() => setActiveTab('referee')}
              className={`flex items-center px-4 py-3 font-medium ${
                activeTab === 'referee'
                  ? 'text-pink-300 border-b-2 border-pink-300'
                  : 'text-gray-500 hover:text-pink-300'
              }`}
            >
              <Flag className="w-5 h-5 mr-2" />
              Àrbitre
            </button>
          </div>
        </div>
      </nav>

      <main className={`container mx-auto ${activeTab === 'schedule' ? 'px-0 py-2' : 'px-2 sm:px-4 py-8'}`}>
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
    <AuthProvider>
      <MatchProvider>
        <AppContent />
      </MatchProvider>
    </AuthProvider>
  );
}

export default App;