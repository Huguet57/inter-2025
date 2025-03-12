import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  // Fetch data from API on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch group matches
        const matchesResponse = await fetch('/api/matches');
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          if (Array.isArray(matchesData)) {
            setMatches(matchesData);
          }
        }
        
        // Fetch knockout matches
        const knockoutResponse = await fetch('/api/knockout');
        if (knockoutResponse.ok) {
          const knockoutData = await knockoutResponse.json();
          if (knockoutData) {
            setKnockoutMatches({
              roundOf16: Array.isArray(knockoutData.roundOf16) ? knockoutData.roundOf16 : initialKnockoutMatches.roundOf16,
              quarterFinals: Array.isArray(knockoutData.quarterFinals) ? knockoutData.quarterFinals : initialKnockoutMatches.quarterFinals,
              semiFinals: Array.isArray(knockoutData.semiFinals) ? knockoutData.semiFinals : initialKnockoutMatches.semiFinals,
              thirdPlace: knockoutData.thirdPlace || initialKnockoutMatches.thirdPlace,
              final: knockoutData.final || initialKnockoutMatches.final
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update a group match
  const updateMatch = async (index: number, updates: Partial<Match>) => {
    try {
      // Optimistically update UI
      const newMatches = [...matches];
      newMatches[index] = { ...newMatches[index], ...updates };
      setMatches(newMatches);
      
      // Send update to API
      const response = await fetch(`/api/matches/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        console.error('Failed to update match');
        // Revert to original state if API update fails
        setMatches(matches);
      }
    } catch (error) {
      console.error('Error updating match:', error);
      // Revert to original state on error
      setMatches(matches);
    }
  };

  // Update a knockout match
  const updateKnockoutMatch = async (
    round: 'roundOf16' | 'quarterFinals' | 'semiFinals' | 'thirdPlace' | 'final',
    index: number,
    updates: Partial<Match>
  ) => {
    try {
      // Optimistically update UI
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
      
      // Send update to API
      const response = await fetch(`/api/knockout/${round}/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        console.error('Failed to update knockout match');
        // You could revert the state here if needed
      }
    } catch (error) {
      console.error('Error updating knockout match:', error);
      // You could revert the state here if needed
    }
  };

  return (
    <MatchContext.Provider value={{ matches, knockoutMatches, updateMatch, updateKnockoutMatch, loading }}>
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