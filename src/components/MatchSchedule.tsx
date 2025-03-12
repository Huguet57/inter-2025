import React from 'react';
import Play from 'lucide-react/dist/esm/icons/play';
import { useMatches } from '../context/MatchContext';
import { groups } from '../data/tournament';
import { calculateGroupStandings, getQualifiedTeamMap, resolveKnockoutMatchTeams } from '../utils/knockoutUtils';

export const MatchSchedule: React.FC = () => {
  const { matches, knockoutMatches } = useMatches();
  const qualifiedTeams = calculateGroupStandings(groups, matches);
  const teamMap = getQualifiedTeamMap(qualifiedTeams);
  const groupsCompleted = matches.every(match => 
    match.score1 !== undefined && match.score2 !== undefined && !match.isPlaying
  );

  const allMatches = {
    groupMatches: matches,
    knockoutMatches
  };

  const getMatchStatus = (match: any) => {
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

  const getMatchTeams = (match: any) => {
    if (match.team1 && match.team2) {
      return `${match.team1} - ${match.team2}`;
    }
    
    return resolveKnockoutMatchTeams(match, teamMap, allMatches);
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

  // Find the index of the first knockout match
  const firstKnockoutIndex = allMatchesArray.findIndex(match => match.phase !== 'Fase de Grups');

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="min-w-full bg-white rounded-lg shadow-md border-b w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 whitespace-nowrap">Hora</th>
            <th className="px-4 py-3 whitespace-nowrap">Pista</th>
            <th className="px-4 py-3 whitespace-nowrap">Fase</th>
            <th className="px-4 py-3 whitespace-nowrap w-full">Partit</th>
            <th className="px-4 py-3 whitespace-nowrap">Resultat</th>
          </tr>
        </thead>
        <tbody>
          {allMatchesArray.map((match, index) => {
            // Add notification banner before the first knockout match
            const showBanner = !groupsCompleted && index === firstKnockoutIndex;
            
            return (
              <>
                {showBanner && (
                  <tr>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                        <p className="text-yellow-700 text-center text-sm sm:text-base">
                          Els equips mostrats a sota són una estimació basada en la classificació actual dels grups
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                <tr key={index} className="border-t border-b hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{match.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap">Pista {match.field}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{match.phase}</td>
                  <td className="px-4 py-3">
                    {match.description && <span className="text-xs text-gray-500 block">{match.description}</span>}
                    <span className={!groupsCompleted && (match.description || match.previousMatchIds) ? 'text-yellow-600' : ''}>
                      {getMatchTeams(match)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">{getMatchStatus(match)}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};