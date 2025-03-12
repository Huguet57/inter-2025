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
  time: string;
  field: number;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  isPlaying?: boolean;
}

export const groups: Team[][] = [
  [
    { name: "Trempats 1", group: 1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: "Llunatics 2", group: 1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
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
    { name: "Llunatics 1", group: 6, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
];

export const groupMatches: Match[] = [
  { time: "09:30-09:50", field: 1, team1: "Arreplegats 1", team2: "Ganapies 1", score1: 2, score2: 1 },
  { time: "09:30-09:50", field: 2, team1: "Trempats 1", team2: "Llunàtics 2", score1: 1, score2: 1 },
  { time: "09:50-10:10", field: 1, team1: "Passerells", team2: "Marracos 2", score1: 0, score2: 3 },
  { time: "09:50-10:10", field: 2, team1: "Bergants 2", team2: "Trempats 2", isPlaying: true, score1: 2, score2: 2 },
  { time: "10:10-10:30", field: 1, team1: "Marrantics", team2: "Engrescats 1" },
  { time: "10:10-10:30", field: 2, team1: "Penjats 1", team2: "Marracos 3" },
  { time: "10:30-10:50", field: 1, team1: "Grillats", team2: "Marracos 1" },
  { time: "10:30-10:50", field: 2, team1: "Emboirats", team2: "Pataquers 1" },
  { time: "10:50-11:10", field: 1, team1: "Xoriguers", team2: "Arreplegats 2" },
  { time: "10:50-11:10", field: 2, team1: "Engrescats 2", team2: "Descargolats" },
  { time: "11:10-11:20", field: 1, team1: "Bergants 1", team2: "Ganapies 2" },
  { time: "11:10-11:20", field: 2, team1: "Pataquers 2", team2: "Llunàtics 1" },
  { time: "11:20-12:00", field: 1, team1: "Arreplegats 1", team2: "Emboirats" },
  { time: "11:20-12:00", field: 2, team1: "Trempats 1", team2: "Grillats" },
  { time: "12:00-12:20", field: 1, team1: "Passerells", team2: "Engrescats 2" },
  { time: "12:00-12:20", field: 2, team1: "Bergants 2", team2: "Xoriguers" },
  { time: "12:20-12:40", field: 1, team1: "Marrantics", team2: "Pataquers 2" },
  { time: "12:20-12:40", field: 2, team1: "Penjats 1", team2: "Bergants 1" },
  { time: "12:40-13:00", field: 1, team1: "Llunatics 2", team2: "Marracos 1" },
  { time: "12:40-13:00", field: 2, team1: "Ganapies 1", team2: "Pataquers 1" },
  { time: "13:00-13:20", field: 1, team1: "Trempats 2", team2: "Arreplegats 2" },
  { time: "13:00-13:20", field: 2, team1: "Marracos 2", team2: "Descargolats" },
  { time: "13:20-13:40", field: 1, team1: "Marracos 3", team2: "Ganapies 2" },
  { time: "13:20-13:40", field: 2, team1: "Engrescats 1", team2: "Llunàtics 1" },
  { time: "13:40-14:00", field: 1, team1: "Trempats 1", team2: "Marracos 1" },
  { time: "13:40-14:00", field: 2, team1: "Arreplegats 1", team2: "Pataquers 1" },
  { time: "14:40-15:00", field: 1, team1: "Bergants 2", team2: "Arreplegats 2" },
  { time: "14:40-15:00", field: 2, team1: "Passerells", team2: "Descargolats" },
  { time: "15:00-15:20", field: 1, team1: "Penjats 1", team2: "Ganapies 2" },
  { time: "15:00-15:20", field: 2, team1: "Marrantics", team2: "Llunàtics 1" },
  { time: "15:20-15:40", field: 1, team1: "Llunatics 2", team2: "Grillats" },
  { time: "15:20-15:40", field: 2, team1: "Ganapies 1", team2: "Emboirats" },
  { time: "15:40-16:00", field: 1, team1: "Trempats 2", team2: "Xoriguers" },
  { time: "15:40-16:00", field: 2, team1: "Marracos 2", team2: "Engrescats 2" },
  { time: "16:00-16:20", field: 1, team1: "Marracos 3", team2: "Bergants 1" },
  { time: "16:00-16:20", field: 2, team1: "Engrescats 1", team2: "Pataquers 2" },
];

export const knockoutMatches = {
  roundOf16: [
    { time: "16:20-16:40", field: 1, description: "1r Grup 1- 4t Grup 2" },
    { time: "16:20-16:40", field: 2, description: "2n Grup 3- 3r Grup 4" },
    { time: "16:40-17:00", field: 1, description: "1r Grup 3- 4t Grup 4" },
    { time: "16:40-17:00", field: 2, description: "2n Grup 1- 3r Grup 2" },
    { time: "17:00-17:20", field: 1, description: "3r Grup 1- 2n Grup 2" },
    { time: "17:00-17:20", field: 2, description: "4t Grup 3- 1r Grup 4" },
    { time: "17:20-17:40", field: 1, description: "3r Grup 3- 2n Grup 4" },
    { time: "17:20-17:40", field: 2, description: "4t Grup 1- 1r Grup 2" },
  ],
  quarterFinals: [
    { time: "18:00-18:20", field: 1, description: "Guanyadors encreuaments anteriors" },
    { time: "18:00-18:20", field: 2, description: "Guanyadors encreuaments anteriors" },
    { time: "18:20-18:40", field: 1, description: "Guanyadors encreuaments anteriors" },
    { time: "18:20-18:40", field: 2, description: "Guanyadors encreuaments anteriors" },
  ],
  semiFinals: [
    { time: "19:00-19:30", field: 1, description: "Guanyadors encreuaments anteriors" },
    { time: "19:30-20:00", field: 1, description: "Guanyadors encreuaments anteriors" },
  ],
  thirdPlace: {
    time: "20:15-20:45",
    field: 1,
    description: "3r i 4t LLOC",
  },
  final: {
    time: "21:00-21:30",
    field: 1,
    description: "FINAL",
  },
};