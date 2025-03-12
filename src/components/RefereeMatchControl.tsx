import React from 'react';
import { Match } from '../data/tournament';
import Play from 'lucide-react/dist/esm/icons/play';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import Loader from 'lucide-react/dist/esm/icons/loader';
import { useMatches } from '../context/MatchContext';
import { groups } from '../data/tournament';
import { calculateGroupStandings, getQualifiedTeamMap, resolveKnockoutMatchTeams } from '../utils/knockoutUtils';

interface MatchControlProps {
  match: Match;
  onUpdate: (updates: Partial<Match>) => void;
  teamMap?: Record<string, string>;
  allMatches?: {
    groupMatches: Match[],
    knockoutMatches: {
      roundOf16: Match[],
      quarterFinals: Match[],
      semiFinals: Match[],
      thirdPlace: Match,
      final: Match
    }
  };
  groupsCompleted?: boolean;
  isKnockoutStage?: boolean;
}

const MatchControl: React.FC<MatchControlProps> = ({ 
  match, 
  onUpdate, 
  teamMap = {}, 
  allMatches,
  groupsCompleted = true,
  isKnockoutStage = false
}) => {
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
    const otherKey = team === 1 ? 'score2' : 'score1';
    let newValue: number;
    
    if (type === 'set') {
      newValue = typeof value === 'string' ? parseInt(value) || 0 : value;
      onUpdate({ [key]: newValue });
    } else {
      const currentValue = match[key] ?? 0;
      newValue = Math.max(0, currentValue + (value as number));
      // If we're incrementing and the other score is undefined, set it to 0
      if (match[otherKey] === undefined) {
        onUpdate({ [key]: newValue, [otherKey]: 0 });
      } else {
        onUpdate({ [key]: newValue });
      }
    }
  };

  const matchState = getMatchState(match);
  
  // Get teams to display
  let matchTeams = '';
  
  if (match.team1 && match.team2) {
    matchTeams = `${match.team1} - ${match.team2}`;
  } else if (allMatches && teamMap) {
    // Intentar resoldre els equips d'aquest partit
    const resolved = resolveKnockoutMatchTeams(match, teamMap, allMatches);
    matchTeams = resolved || match.description || 'Per determinar';

    // Si encara tenim la descripció original, intentar parsejar els equips
    if (matchTeams === match.description && match.description) {
      const descParts = match.description.split('-').map(part => part.trim());
      if (descParts.length === 2) {
        // Intentar substituir les posicions per noms d'equips
        const team1 = teamMap[descParts[0]] || descParts[0];
        const team2 = teamMap[descParts[1]] || descParts[1];
        matchTeams = `${team1} - ${team2}`;
      }
    }
  } else {
    matchTeams = match.description || 'Per determinar';
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">{match.time}</span>
        <span className="text-sm font-medium text-gray-500">Pista {match.field}</span>
      </div>
      
      <div className="text-center space-y-1">
        {match.description && <div className="text-sm text-gray-600">{match.description}</div>}
        <div className={`font-bold ${isKnockoutStage && !groupsCompleted ? 'text-yellow-600' : ''}`}>
          {matchTeams}
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
            placeholder="-"
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
            placeholder="-"
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
          onClick={() => onUpdate({ 
            isPlaying: true,
            score1: match.score1 ?? 0,
            score2: match.score2 ?? 0
          })}
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
          onClick={() => onUpdate({ 
            isPlaying: false,
            score1: match.score1 ?? 0,
            score2: match.score2 ?? 0
          })}
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
  const { matches, updateMatch, knockoutMatches, updateKnockoutMatch, loading } = useMatches();
  const qualifiedTeams = calculateGroupStandings(groups, matches);
  const teamMap = getQualifiedTeamMap(qualifiedTeams);
  
  const allMatches = {
    groupMatches: matches,
    knockoutMatches
  };

  // Comprovar si tots els partits de grups s'han completat
  const groupsCompleted = matches.every(m => 
    m.score1 !== undefined && m.score2 !== undefined && !m.isPlaying
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Carregant dades del torneig...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">Fase de Grups</h2>
        <div className="grid gap-4 grid-cols-1">
          {matches.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateMatch(index, updates)}
              teamMap={teamMap}
              allMatches={allMatches}
              groupsCompleted={groupsCompleted}
              isKnockoutStage={false}
            />
          ))}
        </div>
      </div>

      {!groupsCompleted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            Els equips mostrats a les eliminatòries són una estimació basada en la classificació actual dels grups
          </p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Vuitens de Final</h2>
        <div className="grid gap-4 grid-cols-1">
          {knockoutMatches.roundOf16.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateKnockoutMatch('roundOf16', index, updates)}
              teamMap={teamMap}
              allMatches={allMatches}
              groupsCompleted={groupsCompleted}
              isKnockoutStage={true}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Quarts de Final</h2>
        <div className="grid gap-4 grid-cols-1">
          {knockoutMatches.quarterFinals.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateKnockoutMatch('quarterFinals', index, updates)}
              teamMap={teamMap}
              allMatches={allMatches}
              groupsCompleted={groupsCompleted}
              isKnockoutStage={true}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Semifinals</h2>
        <div className="grid gap-4 grid-cols-1">
          {knockoutMatches.semiFinals.map((match, index) => (
            <MatchControl
              key={index}
              match={match}
              onUpdate={(updates) => updateKnockoutMatch('semiFinals', index, updates)}
              teamMap={teamMap}
              allMatches={allMatches}
              groupsCompleted={groupsCompleted}
              isKnockoutStage={true}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">3r i 4t Lloc</h2>
        <div className="grid gap-4 grid-cols-1">
          <MatchControl
            match={knockoutMatches.thirdPlace}
            onUpdate={(updates) => updateKnockoutMatch('thirdPlace', 0, updates)}
            teamMap={teamMap}
            allMatches={allMatches}
            groupsCompleted={groupsCompleted}
            isKnockoutStage={true}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Final</h2>
        <div className="grid gap-4 grid-cols-1">
          <MatchControl
            match={knockoutMatches.final}
            onUpdate={(updates) => updateKnockoutMatch('final', 0, updates)}
            teamMap={teamMap}
            allMatches={allMatches}
            groupsCompleted={groupsCompleted}
            isKnockoutStage={true}
          />
        </div>
      </div>
    </div>
  );
}; 