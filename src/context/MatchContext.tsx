import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Match, groupMatches as initialGroupMatches, knockoutMatches as initialKnockoutMatches } from '../data/tournament';

interface MatchContextType {
  matches: Match[];
  knockoutMatches: {
    roundOf16: Match[];
    quarterFinals: Match[];
    semiFinals: Match[];
    thirdPlace: Match;
    final: Match;
  };
  updateMatch: (index: number, updates: Partial<Match>) => void;
  updateKnockoutMatch: (round: 'roundOf16' | 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final', index: number, updates: Partial<Match>) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(initialGroupMatches);
  const [knockoutMatches, setKnockoutMatches] = useState({
    roundOf16: initialKnockoutMatches.roundOf16.map(m => ({ ...m, team1: '', team2: '' })),
    quarterFinals: initialKnockoutMatches.quarterFinals.map(m => ({ ...m, team1: '', team2: '' })),
    semiFinals: initialKnockoutMatches.semiFinals.map(m => ({ ...m, team1: '', team2: '' })),
    thirdPlace: { ...initialKnockoutMatches.thirdPlace, team1: '', team2: '' },
    final: { ...initialKnockoutMatches.final, team1: '', team2: '' }
  });

  const updateMatch = (index: number, updates: Partial<Match>) => {
    const newMatches = [...matches];
    newMatches[index] = { ...newMatches[index], ...updates };
    setMatches(newMatches);
    // Here you would typically make an API call to persist the changes
  };

  const updateKnockoutMatch = (
    round: 'roundOf16' | 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final',
    index: number,
    updates: Partial<Match>
  ) => {
    setKnockoutMatches(prev => {
      if (round === 'thirdPlace' || round === 'final') {
        return {
          ...prev,
          [round]: { ...prev[round], ...updates }
        };
      }
      
      const newRound = [...prev[round]];
      newRound[index] = { ...newRound[index], ...updates };
      return {
        ...prev,
        [round]: newRound
      };
    });
  };

  return (
    <MatchContext.Provider value={{ matches, knockoutMatches, updateMatch, updateKnockoutMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
}; 