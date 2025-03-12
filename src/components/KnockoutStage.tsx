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

export const KnockoutStage: React.FC = () => {
  const { matches, knockoutMatches } = useMatches();
  const qualifiedTeams = getQualifiedTeams(matches);
  const groupsCompleted = areGroupMatchesComplete(matches);
  
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
              <p>{match.description}</p>
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
              <p>{match.description}</p>
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
            <p>{knockoutMatches.thirdPlace.description}</p>
            <p className="mt-2">{getMatchStatus(knockoutMatches.thirdPlace)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Final</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-semibold">{knockoutMatches.final.time}</p>
            <p>Pista {knockoutMatches.final.field}</p>
            <p>{knockoutMatches.final.description}</p>
            <p className="mt-2">{getMatchStatus(knockoutMatches.final)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};