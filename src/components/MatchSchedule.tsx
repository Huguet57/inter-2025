import React from 'react';
import Play from 'lucide-react/dist/esm/icons/play';
import { useMatches } from '../context/MatchContext';
import { Match } from '../data/tournament';
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

const getTeamsForMatch = (description: string | undefined, qualifiedTeams: QualifiedTeam[]) => {
  if (!description) return '';
  
  const parts = description.split('-').map(part => part.trim());
  if (parts.length !== 2) return description;

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

export const MatchSchedule: React.FC = () => {
  const { matches, knockoutMatches } = useMatches();
  const qualifiedTeams = getQualifiedTeams(matches);
  const groupsCompleted = matches.every(match => 
    match.score1 !== undefined && match.score2 !== undefined && !match.isPlaying
  );

  const allMatches = {
    groupMatches: matches,
    knockoutMatches
  };

  const getMatchStatus = (match: Match) => {
    if (match.isPlaying) {
      return (
        <div className="flex items-center justify-center text-yellow-500">
          <Play className="w-4 h-4 animate-pulse" />
          <span className="ml-1 font-bold">{match.score1} - {match.score2}</span>
        </div>
      );
    }
    
    if (match.score1 !== undefined && match.score2 !== undefined) {
      return (
        <span className="font-bold">
          {match.score1} - {match.score2}
        </span>
      );
    }

    return <span className="text-gray-500">Per jugar</span>;
  };

  const getMatchTeams = (match: Match) => {
    if (match.team1 && match.team2) {
      return `${match.team1} - ${match.team2}`;
    }
    
    if (match.previousMatchIds && match.previousMatchIds.length > 0) {
      return getTeamNamesFromPreviousMatches(match, allMatches, qualifiedTeams);
    }
    
    if (match.description) {
      return getTeamsForMatch(match.description, qualifiedTeams);
    }
    
    return '';
  };

  // Combine all matches in chronological order
  const allMatchesArray = [
    ...matches.map(match => ({ ...match, phase: 'Fase de Grups' })),
    ...knockoutMatches.roundOf16.map(match => ({ ...match, phase: 'Vuitens de Final' })),
    ...knockoutMatches.quarterFinals.map(match => ({ ...match, phase: 'Quarts de Final' })),
    ...knockoutMatches.semiFinals.map(match => ({ ...match, phase: 'Semifinals' })),
    [{ ...knockoutMatches.thirdPlace, phase: '3r i 4t Lloc' }],
    [{ ...knockoutMatches.final, phase: 'Final' }]
  ].flat().sort((a, b) => {
    // Sort by time (assuming format is consistent)
    const timeA = a.time.split('-')[0]; // Take start time
    const timeB = b.time.split('-')[0];
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Hora</th>
            <th className="px-4 py-2">Pista</th>
            <th className="px-4 py-2">Fase</th>
            <th className="px-4 py-2">Partit</th>
            <th className="px-4 py-2">Resultat</th>
          </tr>
        </thead>
        <tbody>
          {allMatchesArray.map((match, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{match.time}</td>
              <td className="px-4 py-2">Pista {match.field}</td>
              <td className="px-4 py-2">{match.phase}</td>
              <td className="px-4 py-2">
                {match.description && <span className="text-xs text-gray-500 block">{match.description}</span>}
                <span className={!groupsCompleted && (match.description || match.previousMatchIds) ? 'text-yellow-600' : ''}>
                  {getMatchTeams(match)}
                </span>
              </td>
              <td className="px-4 py-2 text-center">{getMatchStatus(match)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};