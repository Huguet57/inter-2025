import React from 'react';
import { groups, Team } from '../data/tournament';
import { useMatches } from '../context/MatchContext';
import { Match } from '../data/tournament';

export const calculateTeamStats = (matches: Match[]) => {
  // Create a deep copy of groups to avoid mutating the original data
  const updatedGroups = groups.map(group => group.map(team => ({ ...team })));
  
  // Process each match to update team stats
  matches.forEach(match => {
    if (match.score1 !== undefined && match.score2 !== undefined) {
      // Find teams in our groups
      let team1: Team | undefined;
      let team2: Team | undefined;
      
      updatedGroups.forEach(group => {
        group.forEach(team => {
          if (team.name === match.team1) team1 = team;
          if (team.name === match.team2) team2 = team;
        });
      });

      if (team1 && team2) {
        // Update matches played
        team1.played++;
        team2.played++;

        // Update goals
        team1.goalsFor += match.score1;
        team1.goalsAgainst += match.score2;
        team2.goalsFor += match.score2;
        team2.goalsAgainst += match.score1;

        // Update win/draw/loss and points
        if (match.score1 > match.score2) {
          team1.won++;
          team2.lost++;
          team1.points += 3;
        } else if (match.score2 > match.score1) {
          team2.won++;
          team1.lost++;
          team2.points += 3;
        } else {
          team1.drawn++;
          team2.drawn++;
          team1.points += 1;
          team2.points += 1;
        }
      }
    }
  });

  // Sort each group by points (and goal difference as tiebreaker)
  return updatedGroups.map(group => {
    return group.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b.goalsFor - a.goalsFor;
    });
  });
};

export const GroupStage: React.FC = () => {
  const { matches } = useMatches();
  const calculatedGroups = calculateTeamStats(matches);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {calculatedGroups.map((group, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2">
            <h3 className="text-lg font-bold">GRUP {index + 1}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-xs">
                  <th className="px-4 py-2 text-left">Equip</th>
                  <th className="px-2 py-2 text-center">PJ</th>
                  <th className="px-2 py-2 text-center">PG</th>
                  <th className="px-2 py-2 text-center">PE</th>
                  <th className="px-2 py-2 text-center">PP</th>
                  <th className="px-2 py-2 text-center">GF</th>
                  <th className="px-2 py-2 text-center">GC</th>
                  <th className="px-2 py-2 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.map((team, teamIndex) => (
                  <tr 
                    key={team.name} 
                    className={`
                      ${teamIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-gray-100 transition-colors
                    `}
                  >
                    <td className="px-4 py-2 text-sm font-medium">{team.name}</td>
                    <td className="px-2 py-2 text-center text-sm">{team.played}</td>
                    <td className="px-2 py-2 text-center text-sm">{team.won}</td>
                    <td className="px-2 py-2 text-center text-sm">{team.drawn}</td>
                    <td className="px-2 py-2 text-center text-sm">{team.lost}</td>
                    <td className="px-2 py-2 text-center text-sm">{team.goalsFor}</td>
                    <td className="px-2 py-2 text-center text-sm">{team.goalsAgainst}</td>
                    <td className="px-2 py-2 text-center text-sm font-bold">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};