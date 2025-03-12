import React from 'react';
import { Match } from '../data/tournament';
import Play from 'lucide-react/dist/esm/icons/play';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import { useMatches } from '../context/MatchContext';

export const RefereeMatchControl: React.FC = () => {
  const { matches, updateMatch } = useMatches();

  const getMatchState = (match: Match) => {
    if (match.isPlaying) return 'playing';
    if (match.score1 !== undefined || match.score2 !== undefined) return 'finished';
    return 'pending';
  };

  const handleScoreChange = (
    index: number,
    team: 1 | 2,
    value: number | string,
    type: 'set' | 'increment'
  ) => {
    const key = team === 1 ? 'score1' : 'score2';
    let newValue: number;
    
    if (type === 'set') {
      newValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    } else {
      const currentValue = matches[index][key] ?? 0;
      newValue = Math.max(0, currentValue + (value as number));
    }
    
    updateMatch(index, { [key]: newValue });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Control d'Àrbitre</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => {
          const matchState = getMatchState(match);
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">{match.time}</span>
                <span className="text-sm font-medium text-gray-500">Pista {match.field}</span>
              </div>
              
              <div className="text-center font-bold">
                {match.team1} vs {match.team2}
              </div>

              <div className="flex justify-center items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleScoreChange(index, 1, -1, 'increment')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <input
                    type="number"
                    min="0"
                    value={match.score1 ?? ''}
                    onChange={(e) => handleScoreChange(index, 1, e.target.value, 'set')}
                    className="w-16 text-center border rounded-md py-2 text-lg font-medium"
                    placeholder="0"
                  />
                  
                  <button
                    onClick={() => handleScoreChange(index, 1, 1, 'increment')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="font-bold text-xl">-</span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleScoreChange(index, 2, -1, 'increment')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <input
                    type="number"
                    min="0"
                    value={match.score2 ?? ''}
                    onChange={(e) => handleScoreChange(index, 2, e.target.value, 'set')}
                    className="w-16 text-center border rounded-md py-2 text-lg font-medium"
                    placeholder="0"
                  />
                  
                  <button
                    onClick={() => handleScoreChange(index, 2, 1, 'increment')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => updateMatch(index, { 
                    isPlaying: false,
                    score1: undefined,
                    score2: undefined
                  })}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                    matchState === 'pending'
                      ? 'bg-gray-800 text-white ring-2 ring-gray-800 shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Per jugar</span>
                </button>
                
                <button
                  onClick={() => updateMatch(index, { isPlaying: true })}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                    matchState === 'playing'
                      ? 'bg-yellow-500 text-white ring-2 ring-yellow-500 shadow-md'
                      : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>En joc</span>
                </button>
                
                <button
                  onClick={() => updateMatch(index, { isPlaying: false })}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                    matchState === 'finished'
                      ? 'bg-green-600 text-white ring-2 ring-green-600 shadow-md'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Acabat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 