import { Match, Team } from '../data/tournament';

// Types for clarity
export interface QualifiedTeam {
  name: string;
  group: number;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

// Funció auxiliar per normalitzar noms d'equips (eliminar accents)
const normalizeTeamName = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina accents
    .trim(); // Elimina espais extra
};

// Calculate group standings
export const calculateGroupStandings = (teams: Team[][], matches: Match[]): QualifiedTeam[] => {
  console.log('Calculant classificacions amb', teams.length, 'grups i', matches.length, 'partits');
  
  // Create a deep copy of teams to no modificar els originals
  const updatedTeams = teams.map(group => 
    group.map(team => ({ 
      ...team, 
      played: 0, won: 0, drawn: 0, lost: 0, 
      goalsFor: 0, goalsAgainst: 0, points: 0 
    }))
  );
  
  // Crear un mapa d'equips normalitzats per cerca més ràpida i robusta
  const teamMap: Map<string, {team: Team, groupIndex: number}> = new Map();
  updatedTeams.forEach((group, groupIndex) => {
    group.forEach(team => {
      // Guardem tant el nom original com el normalitzat
      teamMap.set(normalizeTeamName(team.name), {team, groupIndex});
      
      // També guardem versions alternatives comunes (amb i sense accents)
      if (team.name.includes('à')) {
        teamMap.set(normalizeTeamName(team.name.replace('à', 'a')), {team, groupIndex});
      }
      if (team.name.includes('a') && !team.name.includes('à')) {
        teamMap.set(normalizeTeamName(team.name.replace('a', 'à')), {team, groupIndex});
      }
    });
  });
  
  console.log('Equips registrats:', Array.from(teamMap.keys()));
  
  // Processar cada partit per actualitzar estadístiques
  matches.forEach(match => {
    if (match.score1 !== undefined && match.score2 !== undefined) {
      const normalizedTeam1 = normalizeTeamName(match.team1);
      const normalizedTeam2 = normalizeTeamName(match.team2);
      
      console.log(`Processant partit: ${match.team1} (${normalizedTeam1}) vs ${match.team2} (${normalizedTeam2}) - ${match.score1}:${match.score2}`);
      
      const team1Entry = teamMap.get(normalizedTeam1);
      const team2Entry = teamMap.get(normalizedTeam2);
      
      if (!team1Entry) {
        console.warn(`Equip no trobat: ${match.team1} (${normalizedTeam1})`);
      }
      
      if (!team2Entry) {
        console.warn(`Equip no trobat: ${match.team2} (${normalizedTeam2})`);
      }
      
      if (team1Entry) {
        // Actualitzar estadístiques equip 1
        team1Entry.team.played++;
        team1Entry.team.goalsFor += match.score1;
        team1Entry.team.goalsAgainst += match.score2;
        
        if (match.score1 > match.score2) {
          team1Entry.team.won++;
          team1Entry.team.points += 3;
        } else if (match.score1 === match.score2) {
          team1Entry.team.drawn++;
          team1Entry.team.points += 1;
        } else {
          team1Entry.team.lost++;
        }
      }
      
      if (team2Entry) {
        // Actualitzar estadístiques equip 2
        team2Entry.team.played++;
        team2Entry.team.goalsFor += match.score2;
        team2Entry.team.goalsAgainst += match.score1;
        
        if (match.score2 > match.score1) {
          team2Entry.team.won++;
          team2Entry.team.points += 3;
        } else if (match.score1 === match.score2) {
          team2Entry.team.drawn++;
          team2Entry.team.points += 1;
        } else {
          team2Entry.team.lost++;
        }
      }
    }
  });
  
  // Per propòsits de debugging, revisem els equips actualitzats
  updatedTeams.forEach((group, index) => {
    console.log(`Grup ${index + 1}:`);
    group.forEach(team => {
      console.log(`  ${team.name}: ${team.points}pts (${team.played}j, ${team.won}g, ${team.drawn}e, ${team.lost}p, ${team.goalsFor}:${team.goalsAgainst})`);
    });
  });

  // Ordenar cada grup i recollir els equips classificats
  const qualifiedTeams: QualifiedTeam[] = [];
  
  updatedTeams.forEach((group, groupIndex) => {
    // Ordenar per punts, diferència de gols, i després gols a favor
    const sortedGroup = [...group].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b.goalsFor - a.goalsFor;
    });
    
    // Afegir cada equip amb la seva posició al grup i les seves estadístiques actualitzades
    sortedGroup.forEach((team, position) => {
      qualifiedTeams.push({
        name: team.name,
        group: groupIndex + 1,
        position: position + 1,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        points: team.points
      });
    });
  });
  
  console.log('Resultats de la classificació:', qualifiedTeams);
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
  
  // Find and rank all third-placed teams
  const thirdPlacedTeams = qualifiedTeams.filter(team => team.position === 3);
  
  // Sort third-placed teams by points, goal difference, goals for
  const rankedThirdPlacedTeams = [...thirdPlacedTeams].sort((a, b) => {
    // First sort by points
    if (b.points !== a.points) return b.points - a.points;
    
    // Then by goal difference
    const goalDiffA = a.goalsFor - a.goalsAgainst;
    const goalDiffB = b.goalsFor - b.goalsAgainst;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    
    // Then by goals scored
    return b.goalsFor - a.goalsFor;
  });
  
  // Add entries for best third-placed teams
  const positionNames = {
    1: ['1r', '1er', 'Primer'],
    2: ['2n', '2on', 'Segon'],
    3: ['3r', '3er', 'Tercer'],
    4: ['4t', '4rt', 'Quart'],
    5: ['5è', '5e', 'Cinquè'],
    6: ['6è', '6e', 'Sisè']
  };
  
  // Add all variations of "Millor 3r" patterns
  rankedThirdPlacedTeams.forEach((team, index) => {
    const position = index + 1;
    const variations = positionNames[position as 1|2|3|4|5|6] || [];
    
    // Standard format
    teamMap[`${position}r Millor 3r`] = team.name;
    
    // All position variations
    variations.forEach(posVar => {
      teamMap[`${posVar} Millor 3r`] = team.name;
      
      // With dash suffix
      teamMap[`${posVar} Millor 3r-`] = team.name;
      teamMap[`${posVar} Millor 3r -`] = team.name;
    });
  });
  
  // Debug logging for third-placed teams
  console.log('Ranked third-placed teams:');
  rankedThirdPlacedTeams.forEach((team, index) => {
    console.log(`${index + 1}. ${team.name} (Group ${team.group}): ${team.points}pts, GD: ${team.goalsFor - team.goalsAgainst}, GF: ${team.goalsFor}`);
  });
  
  // Log "Millor 3r" entries in team map
  console.log('Millor 3r entries in team map:');
  Object.entries(teamMap)
    .filter(([key]) => key.includes('Millor 3r'))
    .forEach(([key, value]) => {
      console.log(`${key} -> ${value}`);
    });
  
  return teamMap;
};

// Parse a team description string to find the team name
const parseTeamDescription = (description: string, teamMap: Record<string, string>): string => {
  // Try direct lookup first
  if (teamMap[description]) {
    return teamMap[description];
  }
  
  // Try to match the "Millor 3r" pattern
  const bestThirdPattern = /(\d+)(?:r|er|on|rt|t|è)\s+Millor\s+3r/i;
  const bestThirdMatch = description.match(bestThirdPattern);
  
  if (bestThirdMatch) {
    const position = parseInt(bestThirdMatch[1]);
    // Try standard format
    const key = `${position}r Millor 3r`;
    return teamMap[key] || description;
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