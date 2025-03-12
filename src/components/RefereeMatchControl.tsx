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

const getQualifiedTeams = (matches: Match[]) => {
  const calculatedGroups = calculateTeamStats(matches);
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

// Find a match by its ID across all tournaments rounds
const findMatchById = (
  matchId: string,
  allMatches: {
    groupMatches: Match[],
    knockoutMatches: {
      roundOf16: Match[],
      quarterFinals: Match[],
      semiFinals: Match[],
      thirdPlace: Match,
      final: Match
    }
  }
): Match | undefined => {
  // Check in group matches
  const groupMatch = allMatches.groupMatches.find(m => m.id === matchId);
  if (groupMatch) return groupMatch;
  
  // Check in round of 16
  const r16Match = allMatches.knockoutMatches.roundOf16.find(m => m.id === matchId);
  if (r16Match) return r16Match;
  
  // Check in quarter finals
  const qfMatch = allMatches.knockoutMatches.quarterFinals.find(m => m.id === matchId);
  if (qfMatch) return qfMatch;
  
  // Check in semi finals
  const sfMatch = allMatches.knockoutMatches.semiFinals.find(m => m.id === matchId);
  if (sfMatch) return sfMatch;
  
  // Check third place and final
  if (allMatches.knockoutMatches.thirdPlace.id === matchId) return allMatches.knockoutMatches.thirdPlace;
  if (allMatches.knockoutMatches.final.id === matchId) return allMatches.knockoutMatches.final;
  
  return undefined;
};

// Get the winner and loser teams of a match
const getMatchWinnerAndLoser = (
  match: Match,
  qualifiedTeams?: QualifiedTeam[]
): { winner: string, loser: string } | null => {
  if (match.score1 === undefined || match.score2 === undefined) {
    return null; // Match hasn't been played yet
  }
  
  let team1 = match.team1;
  let team2 = match.team2;
  
  // If the match doesn't have team1/team2 explicitly set, but has a description,
  // try to get the team names from the description
  if ((!team1 || !team2) && match.description && qualifiedTeams) {
    const teamsFromDescription = getTeamsForMatch(match.description, qualifiedTeams);
    if (teamsFromDescription) {
      const parts = teamsFromDescription.split(' - ');
      if (parts.length === 2) {
        team1 = parts[0];
        team2 = parts[1];
      }
    }
  }
  
  if (!team1 || !team2) {
    return null; // Can't determine the teams
  }
  
  if (match.score1 > match.score2) {
    return { winner: team1, loser: team2 };
  } else if (match.score2 > match.score1) {
    return { winner: team2, loser: team1 };
  }
  
  // In case of a draw (this shouldn't happen in knockout matches, but just in case)
  return null;
};

// Get team names for a match based on previousMatchIds
const getTeamNamesFromPreviousMatches = (
  match: Match, 
  allMatches: {
    groupMatches: Match[],
    knockoutMatches: {
      roundOf16: Match[],
      quarterFinals: Match[],
      semiFinals: Match[],
      thirdPlace: Match,
      final: Match
    }
  },
  qualifiedTeams: QualifiedTeam[]
): string => {
  if (!match.previousMatchIds || match.previousMatchIds.length === 0) {
    return match.team1 && match.team2 ? `${match.team1} - ${match.team2}` : match.description || '';
  }
  
  // For the third place match, we need the losers of the previous matches
  const isThirdPlaceMatch = match.id === 'TP-1';
  
  // Find the previous matches and get their winners/losers
  const team1Match = findMatchById(match.previousMatchIds[0], allMatches);
  const team2Match = match.previousMatchIds.length > 1 ? findMatchById(match.previousMatchIds[1], allMatches) : undefined;
  
  if (!team1Match) {
    return match.description || '';
  }
  
  const team1Result = getMatchWinnerAndLoser(team1Match, qualifiedTeams);
  const team2Result = team2Match ? getMatchWinnerAndLoser(team2Match, qualifiedTeams) : null;
  
  if (!team1Result) {
    return match.description || ''; // First match is a draw or hasn't been played
  }
  
  if (team2Match && !team2Result) {
    return match.description || ''; // Second match is a draw or hasn't been played
  }
  
  // For third place match, use losers instead of winners
  const team1 = isThirdPlaceMatch ? team1Result.loser : team1Result.winner;
  const team2 = team2Result ? (isThirdPlaceMatch ? team2Result.loser : team2Result.winner) : '';
  
  return team2 ? `${team1} - ${team2}` : team1;
};

interface MatchControlProps {
  match: Match;
  onUpdate: (updates: Partial<Match>) => void;
  qualifiedTeams?: QualifiedTeam[];
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
}

const MatchControl: React.FC<MatchControlProps> = ({ match, onUpdate, qualifiedTeams, allMatches }) => {
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
  
  if (match.previousMatchIds && match.previousMatchIds.length > 0 && allMatches && qualifiedTeams) {
    matchTeams = getTeamNamesFromPreviousMatches(match, allMatches, qualifiedTeams);
  } else if (match.description && qualifiedTeams) {
    matchTeams = getTeamsForMatch(match.description, qualifiedTeams) || '';
  } else if (match.team1 && match.team2) {
    matchTeams = `${match.team1} vs ${match.team2}`;
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
        <div className="font-bold">
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
  const { matches, updateMatch, knockoutMatches, updateKnockoutMatch } = useMatches();
  const qualifiedTeams = getQualifiedTeams(matches);
  
  const allMatches = {
    groupMatches: matches,
    knockoutMatches
  };

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
              allMatches={allMatches}
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
              allMatches={allMatches}
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
            allMatches={allMatches}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Final</h2>
          <MatchControl
            match={knockoutMatches.final}
            onUpdate={(updates) => updateKnockoutMatch('final', 0, updates)}
            qualifiedTeams={qualifiedTeams}
            allMatches={allMatches}
          />
        </div>
      </div>
    </div>
  );
}; 