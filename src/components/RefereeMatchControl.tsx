import React from 'react';
import { Match } from '../data/tournament';
import Play from 'lucide-react/dist/esm/icons/play';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import { useMatches } from '../context/MatchContext';
import { calculateTeamStats } from './GroupStage';

interface QualifiedTeam {
  name: string;
  group: number;
  position: number;
}

const getQualifiedTeams = () => {
  const calculatedGroups = calculateTeamStats();
  const qualifiedTeams: QualifiedTeam[] = [];

  calculatedGroups.forEach((group, groupIndex) => {
    group.forEach((team, position) => {
      qualifiedTeams.push({
        name: team.name,
        group: groupIndex + 1,
        position: position + 1
      });
    });
  });

  return qualifiedTeams;
};

const getTeamsForMatch = (description: string, qualifiedTeams: QualifiedTeam[]) => {
  const parts = description.split('-').map(part => part.trim());
  if (parts.length !== 2) return null;

  const getTeam = (part: string) => {
    const position = parseInt(part[0]);
    const group = parseInt(part.match(/Grup (\d+)/)?.[1] || '0');
    
    const team = qualifiedTeams.find(t => t.group === group && t.position === position);
    return team ? team.name : part;
  };

  const team1 = getTeam(parts[0]);
  const team2 = getTeam(parts[1]);

  return `${team1} - ${team2}`;
};

interface MatchControlProps {
  match: Match;
  onUpdate: (updates: Partial<Match>) => void;
  qualifiedTeams?: QualifiedTeam[];
}

const MatchControl: React.FC<MatchControlProps> = ({ match, onUpdate, qualifiedTeams }) => {
  const getMatchState = (match: Match) => {
    if (match.isPlaying) return 'playing';
    if (match.score1 !== undefined || match.score2 !== undefined) return 'finished';
    return 'pending';
  };

  const handleScoreChange = (
    team: 1 | 2,
    value: number | string,
    type: 'set' | 'increment'
  ) => {
    const key = team === 1 ? 'score1' : 'score2';
    let newValue: number;
    
    if (type === 'set') {
      newValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    } else {
      const currentValue = match[key] ?? 0;
      newValue = Math.max(0, currentValue + (value as number));
    }
    
    onUpdate({ [key]: newValue });
  };

  const matchState = getMatchState(match);
  const qualifiedTeamsMatch = match.description && qualifiedTeams ? getTeamsForMatch(match.description, qualifiedTeams) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">{match.time}</span>
        <span className="text-sm font-medium text-gray-500">Pista {match.field}</span>
      </div>
      
      <div className="text-center space-y-1">
        {match.description && <div className="text-sm text-gray-600">{match.description}</div>}
        <div className="font-bold">
          {qualifiedTeamsMatch || `${match.team1 || '?'} vs ${match.team2 || '?'}`}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScoreChange(1, -1, 'increment')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <input
            type="number"
            min="0"
            value={match.score1 ?? ''}
            onChange={(e) => handleScoreChange(1, e.target.value, 'set')}
            className="w-16 text-center border rounded-md py-2 text-lg font-medium"
            placeholder="0"
          />
          
          <button
            onClick={() => handleScoreChange(1, 1, 'increment')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <span className="font-bold text-xl">-</span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScoreChange(2, -1, 'increment')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <input
            type="number"
            min="0"
            value={match.score2 ?? ''}
            onChange={(e) => handleScoreChange(2, e.target.value, 'set')}
            className="w-16 text-center border rounded-md py-2 text-lg font-medium"
            placeholder="0"
          />
          
          <button
            onClick={() => handleScoreChange(2, 1, 'increment')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={() => onUpdate({ 
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
          onClick={() => onUpdate({ isPlaying: true })}
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
          onClick={() => onUpdate({ isPlaying: false })}
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
};

export const RefereeMatchControl: React.FC = () => {
  const { matches, updateMatch, knockoutMatches, updateKnockoutMatch } = useMatches();
  const qualifiedTeams = getQualifiedTeams();

  return (
    <div className="space-y-8">
      {!matches.every(m => m.score1 !== undefined && m.score2 !== undefined && !m.isPlaying) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            Els equips mostrats a les eliminatòries són una estimació basada en la classificació actual dels grups
          </p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Fase de Grups</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateMatch(index, updates)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Vuitens de Final</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {knockoutMatches.roundOf16.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateKnockoutMatch('roundOf16', index, updates)}
              qualifiedTeams={qualifiedTeams}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Quarts de Final</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {knockoutMatches.quarterFinals.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateKnockoutMatch('quarterFinals', index, updates)}
              qualifiedTeams={qualifiedTeams}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Semifinals</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {knockoutMatches.semiFinals.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateKnockoutMatch('semiFinals', index, updates)}
              qualifiedTeams={qualifiedTeams}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">3r i 4t Lloc</h2>
          <MatchControl
            match={knockoutMatches.thirdPlace}
            onUpdate={(updates) => updateKnockoutMatch('thirdPlace', 0, updates)}
            qualifiedTeams={qualifiedTeams}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Final</h2>
          <MatchControl
            match={knockoutMatches.final}
            onUpdate={(updates) => updateKnockoutMatch('final', 0, updates)}
            qualifiedTeams={qualifiedTeams}
          />
        </div>
      </div>
    </div>
  );
}; 