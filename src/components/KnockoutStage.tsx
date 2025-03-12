import React from 'react';
import { useMatches } from '../context/MatchContext';
import { calculateTeamStats } from './GroupStage';
import { Match } from '../data/tournament';

interface QualifiedTeam {
  name: string;
  group: number;
  position: number;
}

const areGroupMatchesComplete = (matches: any[]) => {
  return matches.every(match => 
    match.score1 !== undefined && match.score2 !== undefined && !match.isPlaying
  );
};

const getQualifiedTeams = (matches: any[]) => {
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

const getTeamsForMatch = (description: string | undefined, qualifiedTeams: QualifiedTeam[]): string => {
  if (!description) return '';
  
  console.log(`Parsing description: "${description}"`);
  
  const parts = description.split('-').map(part => part.trim());
  if (parts.length !== 2) {
    console.log(`Description does not have exactly two parts: ${parts.length} parts found`);
    return description;
  }

  try {
    const getTeam = (part: string) => {
      console.log(`Processing part: "${part}"`);
      
      // Try to extract position and group numbers
      const positionMatch = part.match(/^(\d+)r/i);
      if (!positionMatch) {
        console.log(`No position number found in "${part}"`);
        return part;
      }
      
      const position = parseInt(positionMatch[1]);
      console.log(`Found position: ${position}`);
      
      const groupMatch = part.match(/Grup (\d+)/i);
      if (!groupMatch) {
        console.log(`No group number found in "${part}"`);
        return part;
      }
      
      const group = parseInt(groupMatch[1]);
      console.log(`Found group: ${group}`);
      
      const team = qualifiedTeams.find(t => t.group === group && t.position === position);
      if (!team) {
        console.log(`No team found for group ${group}, position ${position}`);
        return part;
      }
      
      console.log(`Found team: ${team.name}`);
      return team.name;
    };

    const team1 = getTeam(parts[0]);
    const team2 = getTeam(parts[1]);

    console.log(`Teams for "${description}": "${team1} - ${team2}"`);
    return `${team1} - ${team2}`;
  } catch (error) {
    console.error(`Error parsing description "${description}":`, error);
    return description;
  }
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
  console.log(`Finding match with ID: ${matchId}`);
  
  // Check in group matches
  const groupMatch = allMatches.groupMatches.find(m => m.id === matchId);
  if (groupMatch) {
    console.log(`Found match in group matches: ${groupMatch.team1} vs ${groupMatch.team2}`);
    return groupMatch;
  }
  
  // Check in round of 16
  const r16Match = allMatches.knockoutMatches.roundOf16.find(m => m.id === matchId);
  if (r16Match) {
    console.log(`Found match in round of 16: ${r16Match.team1 || '?'} vs ${r16Match.team2 || '?'}`);
    return r16Match;
  }
  
  // Check in quarter finals
  const qfMatch = allMatches.knockoutMatches.quarterFinals.find(m => m.id === matchId);
  if (qfMatch) {
    console.log(`Found match in quarter finals: ${qfMatch.team1 || '?'} vs ${qfMatch.team2 || '?'}`);
    return qfMatch;
  }
  
  // Check in semi finals
  const sfMatch = allMatches.knockoutMatches.semiFinals.find(m => m.id === matchId);
  if (sfMatch) {
    console.log(`Found match in semi finals: ${sfMatch.team1 || '?'} vs ${sfMatch.team2 || '?'}`);
    return sfMatch;
  }
  
  // Check third place and final
  if (allMatches.knockoutMatches.thirdPlace.id === matchId) {
    console.log(`Found match in third place playoff: ${allMatches.knockoutMatches.thirdPlace.team1 || '?'} vs ${allMatches.knockoutMatches.thirdPlace.team2 || '?'}`);
    return allMatches.knockoutMatches.thirdPlace;
  }
  
  if (allMatches.knockoutMatches.final.id === matchId) {
    console.log(`Found match in final: ${allMatches.knockoutMatches.final.team1 || '?'} vs ${allMatches.knockoutMatches.final.team2 || '?'}`);
    return allMatches.knockoutMatches.final;
  }
  
  console.log(`Match with ID ${matchId} not found`);
  return undefined;
};

// Get the winner and loser teams of a match
const getMatchWinnerAndLoser = (
  match: Match,
  qualifiedTeams?: QualifiedTeam[]
): { winner: string, loser: string } | null => {
  console.log('Getting winner for match:', match);
  
  if (match.score1 === undefined || match.score2 === undefined) {
    console.log('Match scores are undefined');
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
        console.log(`Got team names from description: ${team1} vs ${team2}`);
      }
    }
  }
  
  if (!team1 || !team2) {
    console.log('Unable to determine team names for the match');
    return null; // Can't determine the teams
  }
  
  if (match.score1 > match.score2) {
    console.log(`Winner: ${team1}, Loser: ${team2}`);
    return { winner: team1, loser: team2 };
  } else if (match.score2 > match.score1) {
    console.log(`Winner: ${team2}, Loser: ${team1}`);
    return { winner: team2, loser: team1 };
  }
  
  // In case of a draw (this shouldn't happen in knockout matches, but just in case)
  console.log('Match resulted in a draw');
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
  
  // Debug information in development
  console.log(`Match ID: ${match.id}, Previous match IDs: ${match.previousMatchIds.join(', ')}`);
  console.log('Team1 Match:', team1Match);
  console.log('Team2 Match:', team2Match);
  
  if (!team1Match) {
    return match.description || '';
  }
  
  const team1Result = getMatchWinnerAndLoser(team1Match, qualifiedTeams);
  const team2Result = team2Match ? getMatchWinnerAndLoser(team2Match, qualifiedTeams) : null;
  
  console.log('Team1 Result:', team1Result);
  console.log('Team2 Result:', team2Result);
  
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

export const KnockoutStage: React.FC = () => {
  const { matches, knockoutMatches } = useMatches();
  const qualifiedTeams = getQualifiedTeams(matches);
  const groupsCompleted = areGroupMatchesComplete(matches);
  
  const allMatches = {
    groupMatches: matches,
    knockoutMatches
  };
  
  const getMatchStatus = (match: Match) => {
    if (match.isPlaying) {
      return (
        <span className="text-yellow-500 font-bold">
          {match.score1} - {match.score2}
        </span>
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
  
  return (
    <div className="space-y-8">
      {!groupsCompleted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-700">
            Els equips mostrats són una estimació basada en la classificació actual dels grups
          </p>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold mb-4">Vuitens de final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knockoutMatches.roundOf16.map((match, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{match.time}</p>
              <p>Pista {match.field}</p>
              <p className="text-sm text-gray-600">{match.description}</p>
              <p className={`font-medium ${!groupsCompleted ? 'text-yellow-600' : ''}`}>
                {getTeamsForMatch(match.description, qualifiedTeams)}
              </p>
              <p className="mt-2">{getMatchStatus(match)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Quarts de final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knockoutMatches.quarterFinals.map((match, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{match.time}</p>
              <p>Pista {match.field}</p>
              <p className="text-sm text-gray-600">{match.description}</p>
              <p className="font-medium">
                {getTeamNamesFromPreviousMatches(match, allMatches, qualifiedTeams) || 'Per determinar'}
              </p>
              <p className="mt-2">{getMatchStatus(match)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Semifinals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knockoutMatches.semiFinals.map((match, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{match.time}</p>
              <p>Pista {match.field}</p>
              <p className="text-sm text-gray-600">{match.description}</p>
              <p className="font-medium">
                {getTeamNamesFromPreviousMatches(match, allMatches, qualifiedTeams) || 'Per determinar'}
              </p>
              <p className="mt-2">{getMatchStatus(match)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-4">3r i 4t lloc</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-semibold">{knockoutMatches.thirdPlace.time}</p>
            <p>Pista {knockoutMatches.thirdPlace.field}</p>
            <p className="text-sm text-gray-600">{knockoutMatches.thirdPlace.description}</p>
            <p className="font-medium">
              {getTeamNamesFromPreviousMatches(knockoutMatches.thirdPlace, allMatches, qualifiedTeams) || 'Per determinar'}
            </p>
            <p className="mt-2">{getMatchStatus(knockoutMatches.thirdPlace)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Final</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-semibold">{knockoutMatches.final.time}</p>
            <p>Pista {knockoutMatches.final.field}</p>
            <p className="text-sm text-gray-600">{knockoutMatches.final.description}</p>
            <p className="font-medium">
              {getTeamNamesFromPreviousMatches(knockoutMatches.final, allMatches, qualifiedTeams) || 'Per determinar'}
            </p>
            <p className="mt-2">{getMatchStatus(knockoutMatches.final)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};