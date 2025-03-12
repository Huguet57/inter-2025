export interface Team {
  name: string;
  group: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Match {
  id?: string;
  time: string;
  field: number;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  isPlaying?: boolean;
  description?: string;
  previousMatchIds?: string[];
}

export const groups: Team[][] = [
  [
    { name: "Trempats 1", group: 1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Llunàtics 2", group: 1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Grillats", group: 1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Maracos 1", group: 1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
  [
    { name: "Arreplegats 1", group: 2, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Ganapies 1", group: 2, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Emboirats", group: 2, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Pataquers 1", group: 2, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
  [
    { name: "Bergants 2", group: 3, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Trempats 2", group: 3, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Xoriguers", group: 3, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Arreplegats 2", group: 3, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
  [
    { name: "Passerells", group: 4, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Marracos 2", group: 4, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Engrescats 2", group: 4, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Descargolats", group: 4, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
  [
    { name: "Penjats 1", group: 5, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Marracos 3", group: 5, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Bergants 1", group: 5, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Ganapies 2", group: 5, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
  [
    { name: "Marrantics", group: 6, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Engrescats 1", group: 6, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Pataquers 2", group: 6, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Llunàtics 1", group: 6, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
];

export const groupMatches: Match[] = [
  { id: "G1", time: "09:30-09:50", field: 1, team1: "Arreplegats 1", team2: "Ganapies 1", score1: 2, score2: 1 },
  { id: "G2", time: "09:30-09:50", field: 2, team1: "Trempats 1", team2: "Llunàtics 2", score1: 1, score2: 1 },
  { id: "G3", time: "09:50-10:10", field: 1, team1: "Passerells", team2: "Marracos 2", score1: 0, score2: 3 },
  { id: "G4", time: "09:50-10:10", field: 2, team1: "Bergants 2", team2: "Trempats 2", score1: 2, score2: 2 },
  { id: "G5", time: "10:10-10:30", field: 1, team1: "Marrantics", team2: "Engrescats 1", score1: 2, score2: 0 },
  { id: "G6", time: "10:10-10:30", field: 2, team1: "Penjats 1", team2: "Marracos 3", score1: 1, score2: 3 },
  { id: "G7", time: "10:30-10:50", field: 1, team1: "Grillats", team2: "Marracos 1", score1: 0, score2: 2 },
  { id: "G8", time: "10:30-10:50", field: 2, team1: "Emboirats", team2: "Pataquers 1", score1: 1, score2: 1 },
  { id: "G9", time: "10:50-11:10", field: 1, team1: "Xoriguers", team2: "Arreplegats 2", score1: 3, score2: 1 },
  { id: "G10", time: "10:50-11:10", field: 2, team1: "Engrescats 2", team2: "Descargolats", score1: 2, score2: 2 },
  { id: "G11", time: "11:10-11:20", field: 1, team1: "Bergants 1", team2: "Ganapies 2", score1: 1, score2: 0 },
  { id: "G12", time: "11:10-11:20", field: 2, team1: "Pataquers 2", team2: "Llunàtics 1", score1: 0, score2: 3 },
  { id: "G13", time: "11:20-12:00", field: 1, team1: "Arreplegats 1", team2: "Emboirats", score1: 2, score2: 1 },
  { id: "G14", time: "11:20-12:00", field: 2, team1: "Trempats 1", team2: "Grillats", score1: 3, score2: 0 },
  { id: "G15", time: "12:00-12:20", field: 1, team1: "Passerells", team2: "Engrescats 2", score1: 1, score2: 2 },
  { id: "G16", time: "12:00-12:20", field: 2, team1: "Bergants 2", team2: "Xoriguers", score1: 0, score2: 0 },
  { id: "G17", time: "12:20-12:40", field: 1, team1: "Marrantics", team2: "Pataquers 2", score1: 4, score2: 1 },
  { id: "G18", time: "12:20-12:40", field: 2, team1: "Penjats 1", team2: "Bergants 1", score1: 2, score2: 2 },
  { id: "G19", time: "12:40-13:00", field: 1, team1: "Llunàtics 2", team2: "Marracos 1", score1: 1, score2: 3 },
  { id: "G20", time: "12:40-13:00", field: 2, team1: "Ganapies 1", team2: "Pataquers 1", score1: 0, score2: 1 },
  { id: "G21", time: "13:00-13:20", field: 1, team1: "Trempats 2", team2: "Arreplegats 2", score1: 2, score2: 0 },
  { id: "G22", time: "13:00-13:20", field: 2, team1: "Marracos 2", team2: "Descargolats", score1: 3, score2: 1 },
  { id: "G23", time: "13:20-13:40", field: 1, team1: "Marracos 3", team2: "Ganapies 2", score1: 1, score2: 1 },
  { id: "G24", time: "13:20-13:40", field: 2, team1: "Engrescats 1", team2: "Llunàtics 1", score1: 2, score2: 3 },
  { id: "G25", time: "13:40-14:00", field: 1, team1: "Trempats 1", team2: "Marracos 1", score1: 1, score2: 0 },
  { id: "G26", time: "13:40-14:00", field: 2, team1: "Arreplegats 1", team2: "Pataquers 1", score1: 2, score2: 2 },
  { id: "G27", time: "14:40-15:00", field: 1, team1: "Bergants 2", team2: "Arreplegats 2", score1: 1, score2: 3 },
  { id: "G28", time: "14:40-15:00", field: 2, team1: "Passerells", team2: "Descargolats", score1: 0, score2: 2 },
  { id: "G29", time: "15:00-15:20", field: 1, team1: "Penjats 1", team2: "Ganapies 2", score1: 3, score2: 0 },
  { id: "G30", time: "15:00-15:20", field: 2, team1: "Marrantics", team2: "Llunàtics 1", score1: 1, score2: 2 },
  { id: "G31", time: "15:20-15:40", field: 1, team1: "Llunàtics 2", team2: "Grillats", score1: 2, score2: 1 },
  { id: "G32", time: "15:20-15:40", field: 2, team1: "Ganapies 1", team2: "Emboirats", score1: 1, score2: 0 },
  { id: "G33", time: "15:40-16:00", field: 1, team1: "Trempats 2", team2: "Xoriguers", score1: 0, score2: 3 },
  { id: "G34", time: "15:40-16:00", field: 2, team1: "Marracos 2", team2: "Engrescats 2", score1: 2, score2: 1 },
  { id: "G35", time: "16:00-16:20", field: 1, team1: "Marracos 3", team2: "Bergants 1", score1: 1, score2: 2 },
  { id: "G36", time: "16:00-16:20", field: 2, team1: "Engrescats 1", team2: "Pataquers 2", score1: 3, score2: 0 },
];

export const knockoutMatches = {
  roundOf16: [
    { id: "R16-1", time: "16:20-16:40", field: 1, description: "1r Grup 1 - 4t Grup 2", score1: 0, score2: 4 },
    { id: "R16-2", time: "16:20-16:40", field: 2, description: "2n Grup 3 - 3r Grup 4", score1: 3, score2: 0 },
    { id: "R16-3", time: "16:40-17:00", field: 1, description: "1r Grup 3 - 4t Grup 4", score1: 0, score2: 2 },
    { id: "R16-4", time: "16:40-17:00", field: 2, description: "2n Grup 1 - 3r Grup 2", score1: 1, score2: 0 },
    { id: "R16-5", time: "17:00-17:20", field: 1, description: "3r Grup 1 - 2n Grup 2", score1: 1, score2: 0 },
    { id: "R16-6", time: "17:00-17:20", field: 2, description: "4t Grup 3 - 1r Grup 4", score1: 3, score2: 0 },
    { id: "R16-7", time: "17:20-17:40", field: 1, description: "3r Grup 3 - 2n Grup 4", score1: 2, score2: 0 },
    { id: "R16-8", time: "17:20-17:40", field: 2, description: "4t Grup 1 - 1r Grup 2", score1: 0, score2: 3 },
  ],
  quarterFinals: [
    { id: "QF-1", time: "18:00-18:20", field: 1, description: "Guanyadors encreuaments anteriors", previousMatchIds: ["R16-1", "R16-2"] },
    { id: "QF-2", time: "18:00-18:20", field: 2, description: "Guanyadors encreuaments anteriors", previousMatchIds: ["R16-3", "R16-4"] },
    { id: "QF-3", time: "18:20-18:40", field: 1, description: "Guanyadors encreuaments anteriors", previousMatchIds: ["R16-5", "R16-6"] },
    { id: "QF-4", time: "18:20-18:40", field: 2, description: "Guanyadors encreuaments anteriors", previousMatchIds: ["R16-7", "R16-8"] },
  ],
  semiFinals: [
    { id: "SF-1", time: "19:00-19:30", field: 1, description: "Guanyadors encreuaments anteriors", previousMatchIds: ["QF-1", "QF-2"] },
    { id: "SF-2", time: "19:30-20:00", field: 1, description: "Guanyadors encreuaments anteriors", previousMatchIds: ["QF-3", "QF-4"] },
  ],
  thirdPlace: {
    id: "TP-1",
    time: "20:15-20:45",
    field: 1,
    description: "3r i 4t LLOC",
    previousMatchIds: ["SF-1", "SF-2"]
  },
  final: {
    id: "F-1",
    time: "21:00-21:30",
    field: 1,
    description: "FINAL",
    previousMatchIds: ["SF-1", "SF-2"]
  },
};