import React from 'react';
import { useMatches } from '../context/MatchContext';
import { groups } from '../data/tournament';
import { calculateGroupStandings, getQualifiedTeamMap, resolveKnockoutMatchTeams } from '../utils/knockoutUtils';

export const KnockoutStage: React.FC = () => {
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
  
  // Helper function to get name of previous match
  const getPreviousMatchNames = (previousMatchIds: string[]) => {
    if (!previousMatchIds || previousMatchIds.length === 0) return '';
    
    const matchNames = previousMatchIds.map(id => {
      const match = knockoutMatches.roundOf16.find(m => m.id === id);
      if (match && match.description) {
        return match.description;
      }
      return id;
    });
    
    return matchNames.join(' vs ');
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
                {resolveKnockoutMatchTeams(match, teamMap, allMatches)}
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
                {resolveKnockoutMatchTeams(match, teamMap, allMatches) || 'Per determinar'}
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
                {resolveKnockoutMatchTeams(match, teamMap, allMatches) || 'Per determinar'}
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
              {resolveKnockoutMatchTeams(knockoutMatches.thirdPlace, teamMap, allMatches) || 'Per determinar'}
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
              {resolveKnockoutMatchTeams(knockoutMatches.final, teamMap, allMatches) || 'Per determinar'}
            </p>
            <p className="mt-2">{getMatchStatus(knockoutMatches.final)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};