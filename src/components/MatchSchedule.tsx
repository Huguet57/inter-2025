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
          <Play className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
          <span className="ml-0.5 font-bold text-2xs sm:text-xs md:text-base">{match.score1} - {match.score2}</span>
        </div>
      );
    }
    
    if (match.score1 !== undefined && match.score2 !== undefined) {
      return (
        <span className="font-bold text-2xs sm:text-xs md:text-base">
          {match.score1} - {match.score2}
        </span>
      );
    }

    return <span className="text-gray-500 text-2xs sm:text-xs md:text-base">Per jugar</span>;
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

  const isCurrentMatch = (matchTime: string) => {
    const now = new Date();
    const [startTime, endTime] = matchTime.split('-');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const _now = new Date();
    const matchStart = new Date(_now.setHours(startHour, startMinute, 0));
    const matchEnd = new Date(_now.setHours(endHour, endMinute, 0));
    
    return now >= matchStart && now <= matchEnd;
  };

  return (
    <div className="overflow-x-auto sm:-mx-2 md:mx-0 flex justify-center">
      <table className="w-[95%] bg-white rounded-lg shadow-md table-fixed">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-1 sm:px-4 py-0.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-left w-[25%] sm:w-auto">Hora</th>
            <th className="px-1 sm:px-4 py-0.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-left w-[15%] sm:w-auto">Pista</th>
            <th className="px-1 sm:px-4 py-0.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-left w-[45%] sm:w-auto">Partit</th>
            <th className="px-1 sm:px-4 py-0.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-center w-[15%] sm:w-auto">Resultat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {allMatchesArray.map((match, index) => {
            // Add notification banner before the first knockout match
            const showBanner = !groupsCompleted && index === firstKnockoutIndex;
            
            return (
              <>
                {showBanner && (
                  <tr>
                    <td colSpan={4} className="px-1 sm:px-4 py-1 sm:py-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1 sm:p-3 md:p-4">
                        <p className="text-yellow-700 text-center text-xs sm:text-sm">
                          Els equips mostrats a sota són una estimació basada en la classificació actual dels grups
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                <tr key={index} className="hover:bg-gray-50">
                  <td className={`px-1 sm:px-4 py-0.5 sm:py-3 whitespace-nowrap text-xs sm:text-base leading-tight ${isCurrentMatch(match.time) ? 'font-bold' : ''}`}>{match.time}</td>
                  <td className={`px-1 sm:px-4 py-0.5 sm:py-3 whitespace-nowrap text-xs sm:text-base leading-tight ${isCurrentMatch(match.time) ? 'font-bold' : ''}`}>Pista {match.field}</td>
                  <td className={`px-1 sm:px-4 py-0.5 sm:py-3 leading-tight truncate ${isCurrentMatch(match.time) ? 'font-bold' : ''}`}>
                    {match.description && <span className="text-xs text-gray-500 block leading-none">{match.description}</span>}
                    <span className={`text-2xs sm:text-xs md:text-base ${!groupsCompleted && (match.description || match.previousMatchIds) ? 'text-yellow-600' : ''}`}>
                      {getMatchTeams(match)}
                    </span>
                    <span className="text-2xs text-gray-500 leading-none block">{match.phase}</span>
                  </td>
                  <td className="px-1 sm:px-4 py-0.5 sm:py-3 text-center whitespace-nowrap text-xs sm:text-base leading-tight">{getMatchStatus(match)}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};