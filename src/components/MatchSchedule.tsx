import React from 'react';
import Play from 'lucide-react/dist/esm/icons/play';
import { groupMatches } from '../data/tournament';

export const MatchSchedule: React.FC = () => {
  const getMatchStatus = (match: typeof groupMatches[0]) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Hora</th>
            <th className="px-4 py-2">Pista</th>
            <th className="px-4 py-2">Partit</th>
            <th className="px-4 py-2">Resultat</th>
          </tr>
        </thead>
        <tbody>
          {groupMatches.map((match, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{match.time}</td>
              <td className="px-4 py-2">Pista {match.field}</td>
              <td className="px-4 py-2">{match.team1} - {match.team2}</td>
              <td className="px-4 py-2 text-center">{getMatchStatus(match)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};