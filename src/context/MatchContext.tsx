import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Match, groupMatches as initialGroupMatches } from '../data/tournament';

interface MatchContextType {
  matches: Match[];
  updateMatch: (index: number, updates: Partial<Match>) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(initialGroupMatches);

  const updateMatch = (index: number, updates: Partial<Match>) => {
    const newMatches = [...matches];
    newMatches[index] = { ...newMatches[index], ...updates };
    setMatches(newMatches);
    // Here you would typically make an API call to persist the changes
  };

  return (
    <MatchContext.Provider value={{ matches, updateMatch }}>
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