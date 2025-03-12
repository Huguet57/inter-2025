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

export const MatchSchedule: React.FC = () => {
  const { matches, knockoutMatches } = useMatches();
  const qualifiedTeams = getQualifiedTeams(matches);
  const groupsCompleted = matches.every(match => 
    match.score1 !== undefined && match.score2 !== undefined && !match.isPlaying
  );

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
    
    if (match.description) {
      return getTeamsForMatch(match.description, qualifiedTeams);
    }
    
    return '';
  };

  // Combine all matches in chronological order
  const allMatches = [
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
          {allMatches.map((match, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{match.time}</td>
              <td className="px-4 py-2">Pista {match.field}</td>
              <td className="px-4 py-2">{match.phase}</td>
              <td className="px-4 py-2">
                {match.description && <span className="text-xs text-gray-500 block">{match.description}</span>}
                <span className={!groupsCompleted && match.description ? 'text-yellow-600' : ''}>
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