import { Match, Team } from '../data/tournament';

// Types for clarity
export interface QualifiedTeam {
  name: string;
  group: number;
  position: number;
}

// Calculate group standings
export const calculateGroupStandings = (teams: Team[][], matches: Match[]): QualifiedTeam[] => {
  // Create a deep copy of teams
  const updatedTeams = teams.map(group => group.map(team => ({ ...team })));
  
  // Process each match to update team stats
  matches.forEach(match => {
    if (match.score1 !== undefined && match.score2 !== undefined) {
      // Find teams in our groups
      updatedTeams.forEach(group => {
        group.forEach(team => {
          if (team.name === match.team1) {
            // Update team1 stats
            team.played++;
            team.goalsFor += match.score1;
            team.goalsAgainst += match.score2;
            
            if (match.score1 > match.score2) {
              team.won++;
              team.points += 3;
            } else if (match.score1 === match.score2) {
              team.drawn++;
              team.points += 1;
            } else {
              team.lost++;
            }
          }
          
          if (team.name === match.team2) {
            // Update team2 stats
            team.played++;
            team.goalsFor += match.score2;
            team.goalsAgainst += match.score1;
            
            if (match.score2 > match.score1) {
              team.won++;
              team.points += 3;
            } else if (match.score1 === match.score2) {
              team.drawn++;
              team.points += 1;
            } else {
              team.lost++;
            }
          }
        });
      });
    }
  });

  // Sort each group and collect qualified teams
  const qualifiedTeams: QualifiedTeam[] = [];
  
  updatedTeams.forEach((group, groupIndex) => {
    // Sort by points, goal difference, then goals scored
    const sortedGroup = [...group].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b.goalsFor - a.goalsFor;
    });
    
    // Add each team with its position in the group
    sortedGroup.forEach((team, position) => {
      qualifiedTeams.push({
        name: team.name,
        group: groupIndex + 1,
        position: position + 1
      });
    });
  });
  
  return qualifiedTeams;
};

// Get a map of qualified team placements for quick lookup
export const getQualifiedTeamMap = (qualifiedTeams: QualifiedTeam[]): Record<string, string> => {
  const teamMap: Record<string, string> = {};
  
  // Generate multiple possible key formats for each position
  qualifiedTeams.forEach(team => {
    // Format 1: "1r Grup 1" (standard format)
    teamMap[`${team.position}r Grup ${team.group}`] = team.name;
    
    // Format 2: "1r Grup 1-" (with dash suffix)
    teamMap[`${team.position}r Grup ${team.group}-`] = team.name;
    
    // Format 3: "1r Grup 1 -" (with space dash suffix)
    teamMap[`${team.position}r Grup ${team.group} -`] = team.name;
    
    // Format 4: Simple position and group "1 1"
    teamMap[`${team.position} ${team.group}`] = team.name;
    
    // Also add formats for different position spellings
    const positionNames = {
      1: ['1r', '1er', 'Primer'],
      2: ['2n', '2on', 'Segon'],
      3: ['3r', '3er', 'Tercer'],
      4: ['4t', '4rt', 'Quart']
    };
    
    const variations = positionNames[team.position as 1|2|3|4] || [];
    variations.forEach(posVar => {
      teamMap[`${posVar} Grup ${team.group}`] = team.name;
      teamMap[`${posVar} G${team.group}`] = team.name;
    });
  });
  
  return teamMap;
};

// Parse a team description string to find the team name
const parseTeamDescription = (description: string, teamMap: Record<string, string>): string => {
  // Try direct lookup first
  if (teamMap[description]) {
    return teamMap[description];
  }
  
  // Try to extract position and group using regex patterns
  const positionPattern = /(\d+)(?:r|er|on|rt|t|è)/i; // Matches 1r, 2n, 3r, 4t, etc.
  const groupPattern = /Grup (\d+)/i; // Matches Grup 1, Grup 2, etc.
  
  const positionMatch = description.match(positionPattern);
  const groupMatch = description.match(groupPattern);
  
  if (positionMatch && groupMatch) {
    const position = parseInt(positionMatch[1]);
    const group = parseInt(groupMatch[1]);
    
    // Try to find a team with this position and group
    const key = `${position}r Grup ${group}`;
    return teamMap[key] || description;
  }
  
  return description;
};

// Resolve a knockout match's teams based on format
export const resolveKnockoutMatchTeams = (
  match: Match,
  teamMap: Record<string, string>,
  allMatches: {
    groupMatches: Match[],
    knockoutMatches: {
      roundOf16: Match[],
      quarterFinals: Match[],
      semiFinals: Match[],
      thirdPlace: Match,
      final: Match
    }
  }
): string => {
  // Case 1: Match already has team names
  if (match.team1 && match.team2) {
    return `${match.team1} - ${match.team2}`;
  }
  
  // Case 2: Match has a description referring to group positions
  if (match.description && !match.previousMatchIds) {
    const parts = match.description.split('-').map(part => part.trim());
    if (parts.length === 2) {
      const team1 = parseTeamDescription(parts[0], teamMap);
      const team2 = parseTeamDescription(parts[1], teamMap);
      return `${team1} - ${team2}`;
    }
    return match.description;
  }
  
  // Case 3: Match depends on previous matches
  if (match.previousMatchIds && match.previousMatchIds.length > 0) {
    const isThirdPlaceMatch = match.id === 'TP-1';
    
    // Helper to find a match by ID
    const findMatch = (id: string): Match | undefined => {
      // Check in group matches
      const groupMatch = allMatches.groupMatches.find(m => m.id === id);
      if (groupMatch) return groupMatch;
      
      // Check in knockout stages
      const r16Match = allMatches.knockoutMatches.roundOf16.find(m => m.id === id);
      if (r16Match) return r16Match;
      
      const qfMatch = allMatches.knockoutMatches.quarterFinals.find(m => m.id === id);
      if (qfMatch) return qfMatch;
      
      const sfMatch = allMatches.knockoutMatches.semiFinals.find(m => m.id === id);
      if (sfMatch) return sfMatch;
      
      if (allMatches.knockoutMatches.thirdPlace.id === id) return allMatches.knockoutMatches.thirdPlace;
      if (allMatches.knockoutMatches.final.id === id) return allMatches.knockoutMatches.final;
      
      return undefined;
    };
    
    // Helper to get the winner or loser of a match
    const getTeamFromMatch = (matchId: string, wantLoser: boolean): string => {
      const previousMatch = findMatch(matchId);
      if (!previousMatch) return '';
      
      // Match must have scores to determine winner/loser
      if (previousMatch.score1 === undefined || previousMatch.score2 === undefined) {
        return '';
      }
      
      // Get team names (might need to be resolved recursively)
      let teams: string[];
      
      // If the match already has team1 and team2 defined, use those
      if (previousMatch.team1 && previousMatch.team2) {
        teams = [previousMatch.team1, previousMatch.team2];
      } else {
        // Otherwise, recursively resolve team names
        const resolved = resolveKnockoutMatchTeams(previousMatch, teamMap, allMatches);
        teams = resolved.split(' - ');
      }
      
      if (teams.length !== 2) return '';
      
      // Determine winner/loser
      if (previousMatch.score1 > previousMatch.score2) {
        return wantLoser ? teams[1] : teams[0];
      } else if (previousMatch.score2 > previousMatch.score1) {
        return wantLoser ? teams[0] : teams[1];
      }
      
      return ''; // Draw case (shouldn't happen in knockout)
    };
    
    // Get teams from previous matches
    const team1 = getTeamFromMatch(match.previousMatchIds[0], isThirdPlaceMatch);
    const team2 = match.previousMatchIds.length > 1 
      ? getTeamFromMatch(match.previousMatchIds[1], isThirdPlaceMatch) 
      : '';
    
    if (team1 && team2) {
      return `${team1} - ${team2}`;
    } else if (team1) {
      return team1;
    }
  }
  
  return match.description || 'Per determinar';
}; 