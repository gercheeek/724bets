import React, { useState, useEffect } from 'react';
import { LeagueTab, LeagueMatch, LeagueStanding, LeaguePrediction } from '../types';
import { fetchTodaysMatches } from '../utils/sportsApi';

// Icons
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 5.5-3.6 6.3-6 7h16c-2.4-.7-6-1.5-6-7v-2.34" /><path d="M6 9a6 6 0 0 0 12 0V3H6v6z" /></svg>
);

const LEAGUES: (LeagueTab & { bgLogos?: string[] })[] = [
    {
        id: 'premier-league',
        name: 'Premier League',
        logo: 'https://flagcdn.com/w80/gb-eng.png',
        bgLogos: [
            'https://media.api-sports.io/football/teams/33.png', // Man Utd
            'https://media.api-sports.io/football/teams/42.png', // Arsenal
            'https://media.api-sports.io/football/teams/40.png'  // Liverpool
        ]
    },
    {
        id: 'laliga',
        name: 'La Liga',
        logo: 'https://flagcdn.com/w80/es.png',
        bgLogos: [
            'https://media.api-sports.io/football/teams/541.png', // Real Madrid
            'https://media.api-sports.io/football/teams/529.png', // Barcelona
            'https://media.api-sports.io/football/teams/530.png'  // Atletico
        ]
    },
    {
        id: 'super-lig',
        name: 'Super Lig',
        logo: 'https://flagcdn.com/w80/tr.png',
        bgLogos: [
            'https://media.api-sports.io/football/teams/645.png', // Galatasaray
            'https://media.api-sports.io/football/teams/548.png', // Fenerbahce
            'https://media.api-sports.io/football/teams/564.png'  // Besiktas
        ]
    },
    {
        id: 'serie-a',
        name: 'Serie A',
        logo: 'https://flagcdn.com/w80/it.png',
        bgLogos: [
            'https://media.api-sports.io/football/teams/496.png', // Juventus
            'https://media.api-sports.io/football/teams/489.png', // AC Milan
            'https://media.api-sports.io/football/teams/505.png'  // Inter
        ]
    },
    {
        id: 'ligue-1',
        name: 'Ligue 1',
        logo: 'https://flagcdn.com/w80/fr.png',
        bgLogos: [
            'https://media.api-sports.io/football/teams/85.png', // PSG
            'https://media.api-sports.io/football/teams/81.png', // Marseille
            'https://media.api-sports.io/football/teams/79.png'  // Lille
        ]
    },
    {
        id: 'bundesliga',
        name: 'Bundesliga',
        logo: 'https://flagcdn.com/w80/de.png',
        bgLogos: [
            'https://media.api-sports.io/football/teams/157.png', // Bayern
            'https://media.api-sports.io/football/teams/165.png', // Dortmund
            'https://media.api-sports.io/football/teams/168.png'  // Leverkusen
        ]
    },
];

const PREMIER_LEAGUE_UPCOMING: LeagueMatch[] = [
    { id: 'm1', date: '28 Feb 2026', homeTeam: 'Wolverhampton', homeLogo: '', awayTeam: 'A.Villa', awayLogo: '' },
    { id: 'm2', date: '28 Feb 2026', homeTeam: 'Bournemouth', homeLogo: '', awayTeam: 'Sunderland', awayLogo: '' },
    { id: 'm3', date: '28 Feb 2026', homeTeam: 'Burnley', homeLogo: '', awayTeam: 'Brentford', awayLogo: '' },
    { id: 'm4', date: '28 Feb 2026', homeTeam: 'Liverpool', homeLogo: '', awayTeam: 'W.Ham United', awayLogo: '' },
    { id: 'm5', date: '28 Feb 2026', homeTeam: 'N.United', homeLogo: '', awayTeam: 'Everton', awayLogo: '' },
    { id: 'm6', date: '01 Mar 2026', homeTeam: 'L.United', homeLogo: '', awayTeam: 'M.City', awayLogo: '' },
    { id: 'm7', date: '01 Mar 2026', homeTeam: 'B.& Hove Albion', homeLogo: '', awayTeam: 'N.Forest', awayLogo: '' },
    { id: 'm8', date: '01 Mar 2026', homeTeam: 'Fulham', homeLogo: '', awayTeam: 'T.Hotspur', awayLogo: '' },
    { id: 'm9', date: '01 Mar 2026', homeTeam: 'M.United', homeLogo: '', awayTeam: 'C.Palace', awayLogo: '' },
    { id: 'm10', date: '01 Mar 2026', homeTeam: 'Arsenal', homeLogo: '', awayTeam: 'Chelsea', awayLogo: '' },
];

const PREMIER_LEAGUE_RECENT: LeagueMatch[] = [
    { id: 'r1', date: '24 Feb 2026', homeTeam: 'Everton', homeLogo: '', awayTeam: 'M.United', awayLogo: '', homeScore: 0, awayScore: 1 },
    { id: 'r2', date: '22 Feb 2026', homeTeam: 'T.Hotspur', homeLogo: '', awayTeam: 'Arsenal', awayLogo: '', homeScore: 1, awayScore: 4 },
    { id: 'r3', date: '22 Feb 2026', homeTeam: 'C.Palace', homeLogo: '', awayTeam: 'Wolverhampton', awayLogo: '', homeScore: 1, awayScore: 0 },
    { id: 'r4', date: '22 Feb 2026', homeTeam: 'Sunderland', homeLogo: '', awayTeam: 'Fulham', awayLogo: '', homeScore: 1, awayScore: 3 },
    { id: 'r5', date: '22 Feb 2026', homeTeam: 'N.Forest', homeLogo: '', awayTeam: 'Liverpool', awayLogo: '', homeScore: 0, awayScore: 1 },
    { id: 'r6', date: '22 Feb 2026', homeTeam: 'M.City', homeLogo: '', awayTeam: 'N.United', awayLogo: '', homeScore: 2, awayScore: 1 },
    { id: 'r7', date: '22 Feb 2026', homeTeam: 'W.Ham United', homeLogo: '', awayTeam: 'Bournemouth', awayLogo: '', homeScore: 0, awayScore: 0 },
    { id: 'r8', date: '21 Feb 2026', homeTeam: 'Chelsea', homeLogo: '', awayTeam: 'Burnley', awayLogo: '', homeScore: 1, awayScore: 1 },
    { id: 'r9', date: '21 Feb 2026', homeTeam: 'Brentford', homeLogo: '', awayTeam: 'B.& Hove Albion', awayLogo: '', homeScore: 0, awayScore: 2 },
    { id: 'r10', date: '21 Feb 2026', homeTeam: 'A.Villa', homeLogo: '', awayTeam: 'L.United', awayLogo: '', homeScore: 1, awayScore: 1 },
];

const PREMIER_LEAGUE_STANDINGS: LeagueStanding[] = [
    { rank: 1, team: 'Arsenal', played: 28, won: 18, drawn: 7, lost: 3, goalDiff: '+35', goalsFor: 56, goalsAgainst: 21, points: 61, form: ['W', 'W', 'D', 'D', 'W'], zone: 'champions-league' },
    { rank: 2, team: 'Manchester City', played: 27, won: 17, drawn: 5, lost: 5, goalDiff: '+31', goalsFor: 56, goalsAgainst: 25, points: 56, form: ['W', 'D', 'W', 'W', 'W'], zone: 'champions-league' },
    { rank: 3, team: 'Aston Villa', played: 27, won: 15, drawn: 6, lost: 6, goalDiff: '+10', goalsFor: 38, goalsAgainst: 28, points: 51, form: ['W', 'L', 'D', 'W', 'D'], zone: 'champions-league' },
    { rank: 4, team: 'Manchester United', played: 27, won: 13, drawn: 9, lost: 5, goalDiff: '+11', goalsFor: 48, goalsAgainst: 37, points: 48, form: ['W', 'W', 'W', 'D', 'W'], zone: 'champions-league' },
    { rank: 5, team: 'Chelsea', played: 27, won: 12, drawn: 9, lost: 6, goalDiff: '+17', goalsFor: 48, goalsAgainst: 31, points: 45, form: ['W', 'W', 'W', 'D', 'D'], zone: 'europa-league' },
    { rank: 6, team: 'Liverpool', played: 27, won: 13, drawn: 6, lost: 8, goalDiff: '+7', goalsFor: 42, goalsAgainst: 35, points: 45, form: ['L', 'W', 'L', 'W', 'W'] },
    { rank: 7, team: 'Brentford', played: 27, won: 12, drawn: 4, lost: 11, goalDiff: '+3', goalsFor: 40, goalsAgainst: 37, points: 40, form: ['L', 'W', 'W', 'D', 'L'] },
    { rank: 8, team: 'Bournemouth', played: 27, won: 9, drawn: 11, lost: 7, goalDiff: '-2', goalsFor: 43, goalsAgainst: 45, points: 38, form: ['W', 'W', 'D', 'W', 'D'] },
    { rank: 9, team: 'Everton', played: 27, won: 10, drawn: 7, lost: 10, goalDiff: '-2', goalsFor: 29, goalsAgainst: 31, points: 37, form: ['D', 'D', 'W', 'L', 'L'] },
    { rank: 10, team: 'Fulham', played: 27, won: 11, drawn: 4, lost: 12, goalDiff: '-3', goalsFor: 38, goalsAgainst: 41, points: 37, form: ['W', 'L', 'L', 'L', 'W'] },
    { rank: 11, team: 'Newcastle United', played: 27, won: 10, drawn: 6, lost: 11, goalDiff: '-1', goalsFor: 38, goalsAgainst: 39, points: 36, form: ['L', 'L', 'L', 'W', 'L'] },
    { rank: 12, team: 'Sunderland', played: 27, won: 9, drawn: 9, lost: 9, goalDiff: '-5', goalsFor: 28, goalsAgainst: 33, points: 36, form: ['L', 'W', 'L', 'L', 'L'] },
    { rank: 13, team: 'Crystal Palace', played: 27, won: 9, drawn: 8, lost: 10, goalDiff: '-3', goalsFor: 29, goalsAgainst: 32, points: 35, form: ['L', 'D', 'W', 'L', 'W'] },
    { rank: 14, team: 'Brighton & Hove Albion', played: 27, won: 8, drawn: 10, lost: 9, goalDiff: '+2', goalsFor: 36, goalsAgainst: 34, points: 34, form: ['L', 'D', 'L', 'L', 'W'] },
    { rank: 15, team: 'Leeds United', played: 27, won: 7, drawn: 10, lost: 10, goalDiff: '-9', goalsFor: 37, goalsAgainst: 46, points: 31, form: ['D', 'L', 'W', 'D', 'D'] },
    { rank: 16, team: 'Tottenham Hotspur', played: 27, won: 7, drawn: 8, lost: 12, goalDiff: '-4', goalsFor: 37, goalsAgainst: 41, points: 29, form: ['D', 'D', 'L', 'L', 'L'] },
    { rank: 17, team: 'Nottingham Forest', played: 27, won: 7, drawn: 6, lost: 14, goalDiff: '-14', goalsFor: 25, goalsAgainst: 39, points: 27, form: ['W', 'D', 'L', 'D', 'L'] },
    { rank: 18, team: 'West Ham United', played: 27, won: 6, drawn: 7, lost: 14, goalDiff: '-17', goalsFor: 32, goalsAgainst: 49, points: 25, form: ['W', 'L', 'W', 'D', 'D'], zone: 'relegation' },
    { rank: 19, team: 'Burnley', played: 27, won: 4, drawn: 7, lost: 16, goalDiff: '-23', goalsFor: 29, goalsAgainst: 52, points: 19, form: ['D', 'L', 'L', 'W', 'D'], zone: 'relegation' },
    { rank: 20, team: 'Wolverhampton', played: 28, won: 1, drawn: 7, lost: 20, goalDiff: '-33', goalsFor: 18, goalsAgainst: 51, points: 10, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
];

const PREMIER_LEAGUE_PREDICTIONS: LeaguePrediction[] = [
    { id: 'p1', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Wolverhampton', homeLogo: '', awayTeam: 'Aston Villa', awayLogo: '', dateStr: '28.02 / 03:00', resultPrediction: '2', awayPrediction: '+1.5', scorePrediction: '0-3 | 1-3 | 1-2 | 0-2' },
    { id: 'p2', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Bournemouth', homeLogo: '', awayTeam: 'Sunderland', awayLogo: '', dateStr: '28.02 / 19:30', resultPrediction: 'x1', homePrediction: '+1.5', scorePrediction: '2-0 | 2-0 | 2-1 | 2-2' },
    { id: 'p3', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Burnley', homeLogo: '', awayTeam: 'Brentford', awayLogo: '', dateStr: '28.02 / 22:00', resultPrediction: 'x2', awayPrediction: '+1.5', scorePrediction: '1-2 | 2-2 | 0-2 | 1-3' },
    { id: 'p4', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Liverpool', homeLogo: '', awayTeam: 'West Ham United', awayLogo: '', dateStr: '28.02 / 22:00', resultPrediction: '1', homePrediction: '+1.5', scorePrediction: '3-1 | 2-0 | 2-1 | 2-0' },
    { id: 'p5', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Newcastle United', homeLogo: '', awayTeam: 'Everton', awayLogo: '', dateStr: '28.02 / 22:00', bttsPrediction: 'Var', scorePrediction: '2-2 | 1-2 | 1-1 | 2-1' },
    { id: 'p6', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Leeds United', homeLogo: '', awayTeam: 'Manchester City', awayLogo: '', dateStr: '01.03 / 00:30', resultPrediction: '2', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', awayPrediction: '+1.5', scorePrediction: '1-3 | 1-3 | 1-2 | 1-2' },
    { id: 'p7', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Brighton & Hove Albion', homeLogo: '', awayTeam: 'Nottingham Forest', awayLogo: '', dateStr: '01.03 / 21:00', totalGoalsPrediction: '-2.5', scorePrediction: '1-0 | 1-1 | 2-0 | 0-1' },
    { id: 'p8', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Fulham', homeLogo: '', awayTeam: 'Tottenham Hotspur', awayLogo: '', dateStr: '01.03 / 21:00', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '4-2 | 2-1 | 1-3 | 2-2' },
    { id: 'p9', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Manchester United', homeLogo: '', awayTeam: 'Crystal Palace', awayLogo: '', dateStr: '01.03 / 21:00', resultPrediction: '1', totalGoalsPrediction: '-3.5', scorePrediction: '2-1 | 2-0 | 1-0 | 3-0' },
    { id: 'p10', leagueSlug: 'PREMIER LEAGUE', homeTeam: 'Arsenal', homeLogo: '', awayTeam: 'Chelsea', awayLogo: '', dateStr: '01.03 / 23:30', resultPrediction: 'x1', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', homePrediction: '+1.5', scorePrediction: '2-1 | 2-1 | 3-1 | 2-2' },
];

const PREMIER_LEAGUE_STATS = {
    topScorers: [
        { name: 'E. Haaland', goals: 22 },
        { name: 'I. Thiago', goals: 17 },
        { name: 'A. Semenyo', goals: 13 },
    ],
    topAssists: [
        { name: 'B. Fernandes', assists: 12 },
        { name: 'E. Haaland', assists: 7 },
        { name: 'R. Cherki', assists: 7 },
    ],
    seasonStats: { redCards: 32, yellowCards: 1024, totalGoals: 747 }
};

const SUPER_LIG_UPCOMING: LeagueMatch[] = [
    { id: 'su1', date: '28 Feb 2026', homeTeam: 'Kasımpaşa', homeLogo: '', awayTeam: 'Ç.Rizespor', awayLogo: '' },
    { id: 'su2', date: '28 Feb 2026', homeTeam: 'Kocaelispor', homeLogo: '', awayTeam: 'Beşiktaş JK', awayLogo: '' },
    { id: 'su3', date: '01 Mar 2026', homeTeam: 'Göztepe', homeLogo: '', awayTeam: 'Eyüpspor', awayLogo: '' },
    { id: 'su4', date: '01 Mar 2026', homeTeam: 'Galatasaray', homeLogo: '', awayTeam: 'Alanyaspor', awayLogo: '' },
    { id: 'su5', date: '01 Mar 2026', homeTeam: 'Gençlerbirliği', homeLogo: '', awayTeam: 'Kayserispor', awayLogo: '' },
    { id: 'su6', date: '02 Mar 2026', homeTeam: 'Antalyaspor', homeLogo: '', awayTeam: 'Fenerbahçe', awayLogo: '' },
    { id: 'su7', date: '02 Mar 2026', homeTeam: 'Samsunspor', homeLogo: '', awayTeam: 'G.FK', awayLogo: '' },
];

const SUPER_LIG_RECENT: LeagueMatch[] = [
    { id: 'sr1', date: '24 Feb 2026', homeTeam: 'Fenerbahçe', homeLogo: '', awayTeam: 'Kasımpaşa', awayLogo: '', homeScore: 1, awayScore: 1 },
    { id: 'sr2', date: '23 Feb 2026', homeTeam: 'F.Karagümrük', homeLogo: '', awayTeam: 'Samsunspor', awayLogo: '', homeScore: 0, awayScore: 0 },
    { id: 'sr3', date: '23 Feb 2026', homeTeam: 'Beşiktaş JK', homeLogo: '', awayTeam: 'Göztepe', awayLogo: '', homeScore: 4, awayScore: 0 },
    { id: 'sr4', date: '22 Feb 2026', homeTeam: 'G.FK', homeLogo: '', awayTeam: 'Trabzonspor', awayLogo: '', homeScore: 1, awayScore: 2 },
    { id: 'sr5', date: '22 Feb 2026', homeTeam: 'Kayserispor', homeLogo: '', awayTeam: 'Antalyaspor', awayLogo: '', homeScore: 1, awayScore: 0 },
    { id: 'sr6', date: '22 Feb 2026', homeTeam: 'Konyaspor', homeLogo: '', awayTeam: 'Galatasaray', awayLogo: '', homeScore: 2, awayScore: 0 },
    { id: 'sr7', date: '21 Feb 2026', homeTeam: 'Alanyaspor', homeLogo: '', awayTeam: 'B.FK', awayLogo: '', homeScore: 1, awayScore: 2 },
    { id: 'sr8', date: '21 Feb 2026', homeTeam: 'Eyüpspor', homeLogo: '', awayTeam: 'Gençlerbirliği', awayLogo: '', homeScore: 1, awayScore: 0 },
    { id: 'sr9', date: '21 Feb 2026', homeTeam: 'Ç.Rizespor', homeLogo: '', awayTeam: 'Kocaelispor', awayLogo: '', homeScore: 2, awayScore: 0 },
    { id: 'sr10', date: '17 Feb 2026', homeTeam: 'Kasımpaşa', homeLogo: '', awayTeam: 'F.Karagümrük', awayLogo: '', homeScore: 3, awayScore: 2 },
];

const SUPER_LIG_STANDINGS: LeagueStanding[] = [
    { rank: 1, team: 'Galatasaray', played: 23, won: 17, drawn: 4, lost: 2, goalDiff: '+38', goalsFor: 55, goalsAgainst: 17, points: 55, form: ['W', 'W', 'W', 'W', 'L'], zone: 'champions-league' },
    { rank: 2, team: 'Fenerbahçe', played: 23, won: 15, drawn: 8, lost: 0, goalDiff: '+31', goalsFor: 52, goalsAgainst: 21, points: 53, form: ['D', 'W', 'W', 'W', 'D'], zone: 'champions-league' },
    { rank: 3, team: 'Trabzonspor', played: 23, won: 14, drawn: 6, lost: 3, goalDiff: '+18', goalsFor: 45, goalsAgainst: 27, points: 48, form: ['W', 'D', 'W', 'L', 'W'], zone: 'europa-league' },
    { rank: 4, team: 'Beşiktaş JK', played: 23, won: 12, drawn: 7, lost: 4, goalDiff: '+15', goalsFor: 44, goalsAgainst: 29, points: 43, form: ['D', 'W', 'D', 'W', 'W'], zone: 'europa-league' },
    { rank: 5, team: 'Göztepe', played: 23, won: 11, drawn: 8, lost: 4, goalDiff: '+11', goalsFor: 27, goalsAgainst: 16, points: 41, form: ['D', 'W', 'D', 'D', 'L'] },
    { rank: 6, team: 'Başakşehir FK', played: 23, won: 10, drawn: 6, lost: 7, goalDiff: '+14', goalsFor: 40, goalsAgainst: 26, points: 36, form: ['W', 'D', 'W', 'L', 'W'] },
    { rank: 7, team: 'Samsunspor', played: 23, won: 7, drawn: 10, lost: 6, goalDiff: '-2', goalsFor: 25, goalsAgainst: 27, points: 31, form: ['D', 'W', 'L', 'L', 'D'] },
    { rank: 8, team: 'Kocaelispor', played: 23, won: 8, drawn: 6, lost: 9, goalDiff: '-3', goalsFor: 21, goalsAgainst: 24, points: 30, form: ['D', 'L', 'W', 'W', 'L'] },
    { rank: 9, team: 'Gaziantep FK', played: 23, won: 7, drawn: 7, lost: 9, goalDiff: '-10', goalsFor: 30, goalsAgainst: 40, points: 28, form: ['D', 'L', 'W', 'L', 'L'] },
    { rank: 10, team: 'Alanyaspor', played: 23, won: 5, drawn: 11, lost: 7, goalDiff: '-2', goalsFor: 25, goalsAgainst: 27, points: 26, form: ['D', 'L', 'D', 'W', 'L'] },
    { rank: 11, team: 'Çaykur Rizespor', played: 23, won: 5, drawn: 9, lost: 9, goalDiff: '-7', goalsFor: 28, goalsAgainst: 35, points: 24, form: ['D', 'D', 'L', 'D', 'W'] },
    { rank: 12, team: 'Gençlerbirliği', played: 23, won: 6, drawn: 5, lost: 12, goalDiff: '-6', goalsFor: 28, goalsAgainst: 34, points: 23, form: ['L', 'W', 'L', 'D', 'L'] },
    { rank: 13, team: 'Konyaspor', played: 23, won: 5, drawn: 8, lost: 10, goalDiff: '-8', goalsFor: 27, goalsAgainst: 35, points: 23, form: ['D', 'L', 'D', 'L', 'W'] },
    { rank: 14, team: 'Antalyaspor', played: 23, won: 6, drawn: 5, lost: 12, goalDiff: '-14', goalsFor: 22, goalsAgainst: 36, points: 23, form: ['W', 'D', 'L', 'W', 'L'] },
    { rank: 15, team: 'Eyüpspor', played: 23, won: 5, drawn: 6, lost: 12, goalDiff: '-16', goalsFor: 19, goalsAgainst: 35, points: 21, form: ['D', 'W', 'L', 'L', 'W'] },
    { rank: 16, team: 'Kasımpaşa', played: 23, won: 4, drawn: 8, lost: 11, goalDiff: '-12', goalsFor: 20, goalsAgainst: 32, points: 20, form: ['L', 'L', 'L', 'W', 'D'], zone: 'relegation' },
    { rank: 17, team: 'Kayserispor', played: 23, won: 3, drawn: 10, lost: 10, goalDiff: '-25', goalsFor: 18, goalsAgainst: 43, points: 19, form: ['L', 'L', 'L', 'D', 'W'], zone: 'relegation' },
    { rank: 18, team: 'Fatih Karagümrük', played: 23, won: 3, drawn: 4, lost: 16, goalDiff: '-22', goalsFor: 20, goalsAgainst: 42, points: 13, form: ['L', 'L', 'W', 'L', 'D'], zone: 'relegation' },
];

const SUPER_LIG_PREDICTIONS: LeaguePrediction[] = [
    { id: 'sp1', leagueSlug: 'SÜPER LİG', homeTeam: 'Kasımpaşa', homeLogo: '', awayTeam: 'Çaykur Rizespor', awayLogo: '', dateStr: '28.02 / 17:30', bttsPrediction: 'Var', scorePrediction: '2-2 | 1-2 | 2-1 | 1-1' },
    { id: 'sp2', leagueSlug: 'SÜPER LİG', homeTeam: 'Kocaelispor', homeLogo: '', awayTeam: 'Beşiktaş JK', awayLogo: '', dateStr: '28.02 / 20:00', resultPrediction: 'x2', awayPrediction: '+1.5', scorePrediction: '2-2 | 0-2 | 1-2 | 0-2' },
    { id: 'sp3', leagueSlug: 'SÜPER LİG', homeTeam: 'Göztepe', homeLogo: '', awayTeam: 'Eyüpspor', awayLogo: '', dateStr: '01.03 / 00:00', resultPrediction: '1', homePrediction: '+1.5', scorePrediction: '3-0 | 3-1 | 2-1 | 2-0' },
    { id: 'sp4', leagueSlug: 'SÜPER LİG', homeTeam: 'Galatasaray', homeLogo: '', awayTeam: 'Alanyaspor', awayLogo: '', dateStr: '01.03 / 00:00', resultPrediction: '1', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', homePrediction: '+1.5', scorePrediction: '2-1 | 4-2 | 3-2 | 3-1' },
    { id: 'sp5', leagueSlug: 'SÜPER LİG', homeTeam: 'Gençlerbirliği', homeLogo: '', awayTeam: 'Kayserispor', awayLogo: '', dateStr: '01.03 / 20:00', bttsPrediction: 'Var', scorePrediction: '2-2 | 1-2 | 2-1 | 1-1' },
    { id: 'sp6', leagueSlug: 'SÜPER LİG', homeTeam: 'Antalyaspor', homeLogo: '', awayTeam: 'Fenerbahçe', awayLogo: '', dateStr: '02.03 / 00:00', resultPrediction: '2', totalGoalsPrediction: '-3.5', scorePrediction: '1-2 | 0-1 | 0-2 | 0-1' },
    { id: 'sp7', leagueSlug: 'SÜPER LİG', homeTeam: 'Samsunspor', homeLogo: '', awayTeam: 'Gaziantep FK', awayLogo: '', dateStr: '02.03 / 00:00', resultPrediction: 'x1', bttsPrediction: 'Var', scorePrediction: '2-2 | 2-1 | 2-1 | 1-1' },
];

const SUPER_LIG_STATS = {
    topScorers: [
        { name: 'P. Onuachu', goals: 17 },
        { name: 'E. Shomurodov', goals: 16 },
        { name: 'A. Talisca', goals: 13 },
    ],
    topAssists: [
        { name: 'B. A. Yılmaz', assists: 9 },
        { name: 'M. Asensio', assists: 8 },
        { name: 'A. Maxim', assists: 7 },
    ],
    seasonStats: { redCards: 46, yellowCards: 972, totalGoals: 546 }
};

const LA_LIGA_UPCOMING: LeagueMatch[] = [
    { id: 'llu1', date: '28 Feb 2026', homeTeam: 'Levante UD', homeLogo: '', awayTeam: 'Deportivo Alavés', awayLogo: '' },
    { id: 'llu2', date: '28 Feb 2026', homeTeam: 'Rayo Vallecano', homeLogo: '', awayTeam: 'Athletic Club', awayLogo: '' },
    { id: 'llu3', date: '28 Feb 2026', homeTeam: 'Barcelona', homeLogo: '', awayTeam: 'Villarreal', awayLogo: '' },
    { id: 'llu4', date: '01 Mar 2026', homeTeam: 'Mallorca', homeLogo: '', awayTeam: 'Real Sociedad', awayLogo: '' },
    { id: 'llu5', date: '01 Mar 2026', homeTeam: 'Real Oviedo', homeLogo: '', awayTeam: 'Atlético Madrid', awayLogo: '' },
    { id: 'llu6', date: '01 Mar 2026', homeTeam: 'Elche', homeLogo: '', awayTeam: 'Espanyol', awayLogo: '' },
    { id: 'llu7', date: '01 Mar 2026', homeTeam: 'Valencia', homeLogo: '', awayTeam: 'Osasuna', awayLogo: '' },
    { id: 'llu8', date: '02 Mar 2026', homeTeam: 'Real Betis', homeLogo: '', awayTeam: 'Sevilla', awayLogo: '' },
    { id: 'llu9', date: '02 Mar 2026', homeTeam: 'Girona FC', homeLogo: '', awayTeam: 'Celta Vigo', awayLogo: '' },
    { id: 'llu10', date: '03 Mar 2026', homeTeam: 'Real Madrid', homeLogo: '', awayTeam: 'Getafe', awayLogo: '' },
];

const LA_LIGA_RECENT: LeagueMatch[] = [
    { id: 'llr1', date: '24 Feb 2026', homeTeam: 'Deportivo Alavés', homeLogo: '', awayTeam: 'Girona FC', awayLogo: '', homeScore: 2, awayScore: 2 },
    { id: 'llr2', date: '23 Feb 2026', homeTeam: 'Villarreal', homeLogo: '', awayTeam: 'Valencia', awayLogo: '', homeScore: 2, awayScore: 1 },
    { id: 'llr3', date: '23 Feb 2026', homeTeam: 'Celta Vigo', homeLogo: '', awayTeam: 'Mallorca', awayLogo: '', homeScore: 2, awayScore: 0 },
    { id: 'llr4', date: '22 Feb 2026', homeTeam: 'Barcelona', homeLogo: '', awayTeam: 'Levante UD', awayLogo: '', homeScore: 3, awayScore: 0 },
    { id: 'llr5', date: '22 Feb 2026', homeTeam: 'Getafe', homeLogo: '', awayTeam: 'Sevilla', awayLogo: '', homeScore: 0, awayScore: 1 },
    { id: 'llr6', date: '22 Feb 2026', homeTeam: 'Atlético Madrid', homeLogo: '', awayTeam: 'Espanyol', awayLogo: '', homeScore: 4, awayScore: 2 },
    { id: 'llr7', date: '22 Feb 2026', homeTeam: 'Osasuna', homeLogo: '', awayTeam: 'Real Madrid', awayLogo: '', homeScore: 2, awayScore: 1 },
    { id: 'llr8', date: '21 Feb 2026', homeTeam: 'Real Betis', homeLogo: '', awayTeam: 'Rayo Vallecano', awayLogo: '', homeScore: 1, awayScore: 1 },
    { id: 'llr9', date: '21 Feb 2026', homeTeam: 'Real Sociedad', homeLogo: '', awayTeam: 'Real Oviedo', awayLogo: '', homeScore: 3, awayScore: 3 },
    { id: 'llr10', date: '21 Feb 2026', homeTeam: 'Athletic Club', homeLogo: '', awayTeam: 'Elche', awayLogo: '', homeScore: 2, awayScore: 1 },
];

const LA_LIGA_STANDINGS: LeagueStanding[] = [
    { rank: 1, team: 'Barcelona', played: 25, won: 20, drawn: 1, lost: 4, goalDiff: '+42', goalsFor: 67, goalsAgainst: 25, points: 61, form: ['W', 'W', 'W', 'L', 'W'], zone: 'champions-league' },
    { rank: 2, team: 'Real Madrid', played: 25, won: 19, drawn: 3, lost: 3, goalDiff: '+33', goalsFor: 54, goalsAgainst: 21, points: 60, form: ['W', 'W', 'W', 'W', 'L'], zone: 'champions-league' },
    { rank: 3, team: 'Villarreal', played: 25, won: 16, drawn: 3, lost: 6, goalDiff: '+20', goalsFor: 47, goalsAgainst: 27, points: 51, form: ['D', 'W', 'L', 'W', 'W'], zone: 'champions-league' },
    { rank: 4, team: 'Atlético Madrid', played: 25, won: 14, drawn: 6, lost: 5, goalDiff: '+19', goalsFor: 42, goalsAgainst: 23, points: 48, form: ['W', 'D', 'L', 'L', 'W'], zone: 'champions-league' },
    { rank: 5, team: 'Real Betis', played: 25, won: 11, drawn: 9, lost: 5, goalDiff: '+10', goalsFor: 40, goalsAgainst: 30, points: 42, form: ['L', 'W', 'W', 'W', 'D'], zone: 'europa-league' },
    { rank: 6, team: 'Celta Vigo', played: 25, won: 9, drawn: 10, lost: 6, goalDiff: '+7', goalsFor: 34, goalsAgainst: 27, points: 37, form: ['L', 'D', 'L', 'D', 'W'], zone: 'conference-league' },
    { rank: 7, team: 'Espanyol', played: 25, won: 10, drawn: 5, lost: 10, goalDiff: '-6', goalsFor: 31, goalsAgainst: 37, points: 35, form: ['L', 'L', 'L', 'D', 'L'] },
    { rank: 8, team: 'Athletic Club', played: 25, won: 10, drawn: 4, lost: 11, goalDiff: '-6', goalsFor: 29, goalsAgainst: 35, points: 34, form: ['L', 'D', 'W', 'W', 'W'] },
    { rank: 9, team: 'Osasuna', played: 25, won: 9, drawn: 6, lost: 10, goalDiff: '+1', goalsFor: 30, goalsAgainst: 29, points: 33, form: ['W', 'D', 'W', 'D', 'W'] },
    { rank: 10, team: 'Real Sociedad', played: 25, won: 8, drawn: 8, lost: 9, goalDiff: '-1', goalsFor: 37, goalsAgainst: 38, points: 32, form: ['W', 'D', 'W', 'L', 'D'] },
    { rank: 11, team: 'Girona FC', played: 25, won: 7, drawn: 9, lost: 9, goalDiff: '-14', goalsFor: 26, goalsAgainst: 40, points: 30, form: ['D', 'L', 'D', 'W', 'D'] },
    { rank: 12, team: 'Sevilla', played: 25, won: 8, drawn: 5, lost: 12, goalDiff: '-7', goalsFor: 32, goalsAgainst: 39, points: 29, form: ['W', 'L', 'D', 'D', 'W'] },
    { rank: 13, team: 'Getafe', played: 25, won: 8, drawn: 5, lost: 12, goalDiff: '-9', goalsFor: 20, goalsAgainst: 29, points: 29, form: ['D', 'D', 'W', 'W', 'L'] },
    { rank: 14, team: 'Deportivo Alavés', played: 25, won: 7, drawn: 6, lost: 12, goalDiff: '-9', goalsFor: 23, goalsAgainst: 32, points: 27, form: ['W', 'W', 'L', 'D', 'D'] },
    { rank: 15, team: 'Rayo Vallecano', played: 24, won: 6, drawn: 8, lost: 10, goalDiff: '-9', goalsFor: 22, goalsAgainst: 31, points: 26, form: ['L', 'L', 'L', 'W', 'D'] },
    { rank: 16, team: 'Valencia', played: 25, won: 6, drawn: 8, lost: 11, goalDiff: '-13', goalsFor: 26, goalsAgainst: 39, points: 26, form: ['W', 'L', 'L', 'W', 'L'] },
    { rank: 17, team: 'Elche', played: 25, won: 5, drawn: 10, lost: 10, goalDiff: '-5', goalsFor: 32, goalsAgainst: 37, points: 25, form: ['L', 'L', 'L', 'D', 'L'] },
    { rank: 18, team: 'Mallorca', played: 25, won: 6, drawn: 6, lost: 13, goalDiff: '-12', goalsFor: 29, goalsAgainst: 41, points: 24, form: ['L', 'W', 'L', 'L', 'L'], zone: 'relegation' },
    { rank: 19, team: 'Levante UD', played: 25, won: 4, drawn: 6, lost: 15, goalDiff: '-18', goalsFor: 26, goalsAgainst: 44, points: 18, form: ['D', 'L', 'L', 'L', 'L'], zone: 'relegation' },
    { rank: 20, team: 'Real Oviedo', played: 24, won: 3, drawn: 8, lost: 13, goalDiff: '-23', goalsFor: 16, goalsAgainst: 39, points: 17, form: ['L', 'L', 'W', 'L', 'D'], zone: 'relegation' },
];

const LA_LIGA_PREDICTIONS: LeaguePrediction[] = [
    { id: 'llp1', leagueSlug: 'LALİGA', homeTeam: 'Levante UD', homeLogo: '', awayTeam: 'Deportivo Alavés', awayLogo: '', dateStr: '28.02 / 03:00', totalGoalsPrediction: '-2.5', scorePrediction: '0-1 | 0-0 | 2-0 | 1-1' },
    { id: 'llp2', leagueSlug: 'LALİGA', homeTeam: 'Rayo Vallecano', homeLogo: '', awayTeam: 'Athletic Club', awayLogo: '', dateStr: '28.02 / 20:00', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '2-1 | 2-2 | 2-3 | 1-2' },
    { id: 'llp3', leagueSlug: 'LALİGA', homeTeam: 'Barcelona', homeLogo: '', awayTeam: 'Villarreal', awayLogo: '', dateStr: '28.02 / 22:15', resultPrediction: '1', homePrediction: '+1.5', scorePrediction: '2-1 | 2-0 | 2-1 | 3-0' },
    { id: 'llp4', leagueSlug: 'LALİGA', homeTeam: 'Mallorca', homeLogo: '', awayTeam: 'Real Sociedad', awayLogo: '', dateStr: '01.03 / 00:30', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '2-2 | 3-1 | 3-2 | 1-2' },
    { id: 'llp5', leagueSlug: 'LALİGA', homeTeam: 'Real Oviedo', homeLogo: '', awayTeam: 'Atlético Madrid', awayLogo: '', dateStr: '01.03 / 03:00', resultPrediction: '2', awayPrediction: '+1.5', scorePrediction: '1-3 | 0-2 | 1-2 | 0-2' },
    { id: 'llp6', leagueSlug: 'LALİGA', homeTeam: 'Elche', homeLogo: '', awayTeam: 'Espanyol', awayLogo: '', dateStr: '01.03 / 20:00', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '1-2 | 2-3 | 2-2 | 2-1' },
    { id: 'llp7', leagueSlug: 'LALİGA', homeTeam: 'Valencia', homeLogo: '', awayTeam: 'Osasuna', awayLogo: '', dateStr: '01.03 / 22:15', totalGoalsPrediction: '-2.5', scorePrediction: '0-2 | 1-1 | 0-1 | 2-0' },
    { id: 'llp8', leagueSlug: 'LALİGA', homeTeam: 'Real Betis', homeLogo: '', awayTeam: 'Sevilla', awayLogo: '', dateStr: '02.03 / 00:30', resultPrediction: 'x1', bttsPrediction: 'Var', scorePrediction: '1-1 | 2-2 | 2-1 | 3-1' },
    { id: 'llp9', leagueSlug: 'LALİGA', homeTeam: 'Girona FC', homeLogo: '', awayTeam: 'Celta Vigo', awayLogo: '', dateStr: '02.03 / 03:00', bttsPrediction: 'Var', scorePrediction: '1-1 | 1-3 | 2-1 | 3-2' },
    { id: 'llp10', leagueSlug: 'LALİGA', homeTeam: 'Real Madrid', homeLogo: '', awayTeam: 'Getafe', awayLogo: '', dateStr: '03.03 / 03:00', resultPrediction: '1', totalGoalsPrediction: '-3.5', scorePrediction: '2-1 | 2-0 | 1-0 | 3-0' },
];

const LA_LIGA_STATS = {
    topScorers: [
        { name: 'K. Mbappé', goals: 23 },
        { name: 'V. Muriqi', goals: 16 },
        { name: 'A. Budimir', goals: 12 },
    ],
    topAssists: [
        { name: 'L. Yamal', assists: 9 },
        { name: 'L. Milla', assists: 8 },
        { name: 'F. Valverde', assists: 7 },
    ],
    seasonStats: { redCards: 73, yellowCards: 1092, totalGoals: 663 }
};

const SERIE_A_UPCOMING: LeagueMatch[] = [
    { id: 'sau1', date: '28 Feb 2026', homeTeam: 'Parma', homeLogo: '', awayTeam: 'Cagliari', awayLogo: '' },
    { id: 'sau2', date: '28 Feb 2026', homeTeam: 'Como', homeLogo: '', awayTeam: 'Lecce', awayLogo: '' },
    { id: 'sau3', date: '01 Mar 2026', homeTeam: 'Hellas Verona', homeLogo: '', awayTeam: 'Napoli', awayLogo: '' },
    { id: 'sau4', date: '01 Mar 2026', homeTeam: 'Inter', homeLogo: '', awayTeam: 'Genoa', awayLogo: '' },
    { id: 'sau5', date: '01 Mar 2026', homeTeam: 'Cremonese', homeLogo: '', awayTeam: 'Milan', awayLogo: '' },
    { id: 'sau6', date: '01 Mar 2026', homeTeam: 'Sassuolo', homeLogo: '', awayTeam: 'Atalanta', awayLogo: '' },
    { id: 'sau7', date: '02 Mar 2026', homeTeam: 'Torino', homeLogo: '', awayTeam: 'Lazio', awayLogo: '' },
    { id: 'sau8', date: '02 Mar 2026', homeTeam: 'Roma', homeLogo: '', awayTeam: 'Juventus', awayLogo: '' },
    { id: 'sau9', date: '03 Mar 2026', homeTeam: 'Pisa', homeLogo: '', awayTeam: 'Bologna', awayLogo: '' },
    { id: 'sau10', date: '03 Mar 2026', homeTeam: 'Udinese', homeLogo: '', awayTeam: 'Fiorentina', awayLogo: '' },
];

const SERIE_A_RECENT: LeagueMatch[] = [
    { id: 'sar1', date: '24 Feb 2026', homeTeam: 'Bologna', homeLogo: '', awayTeam: 'Udinese', awayLogo: '', homeScore: 1, awayScore: 0 },
    { id: 'sar2', date: '24 Feb 2026', homeTeam: 'Fiorentina', homeLogo: '', awayTeam: 'Pisa', awayLogo: '', homeScore: 1, awayScore: 0 },
    { id: 'sar3', date: '23 Feb 2026', homeTeam: 'Roma', homeLogo: '', awayTeam: 'Cremonese', awayLogo: '', homeScore: 3, awayScore: 0 },
    { id: 'sar4', date: '23 Feb 2026', homeTeam: 'Milan', homeLogo: '', awayTeam: 'Parma', awayLogo: '', homeScore: 0, awayScore: 1 },
    { id: 'sar5', date: '22 Feb 2026', homeTeam: 'Atalanta', homeLogo: '', awayTeam: 'Napoli', awayLogo: '', homeScore: 2, awayScore: 1 },
    { id: 'sar6', date: '22 Feb 2026', homeTeam: 'Genoa', homeLogo: '', awayTeam: 'Torino', awayLogo: '', homeScore: 3, awayScore: 0 },
    { id: 'sar7', date: '22 Feb 2026', homeTeam: 'Cagliari', homeLogo: '', awayTeam: 'Lazio', awayLogo: '', homeScore: 0, awayScore: 0 },
    { id: 'sar8', date: '22 Feb 2026', homeTeam: 'Lecce', homeLogo: '', awayTeam: 'Inter', awayLogo: '', homeScore: 0, awayScore: 2 },
    { id: 'sar9', date: '21 Feb 2026', homeTeam: 'Juventus', homeLogo: '', awayTeam: 'Como', awayLogo: '', homeScore: 0, awayScore: 2 },
    { id: 'sar10', date: '21 Feb 2026', homeTeam: 'Sassuolo', homeLogo: '', awayTeam: 'Hellas Verona', awayLogo: '', homeScore: 3, awayScore: 0 },
];

const SERIE_A_STANDINGS: LeagueStanding[] = [
    { rank: 1, team: 'Inter', played: 26, won: 21, drawn: 1, lost: 4, goalDiff: '+41', goalsFor: 62, goalsAgainst: 21, points: 64, form: ['W', 'W', 'W', 'W', 'W'], zone: 'champions-league' },
    { rank: 2, team: 'Milan', played: 26, won: 15, drawn: 9, lost: 2, goalDiff: '+21', goalsFor: 41, goalsAgainst: 20, points: 54, form: ['D', 'W', 'W', 'D', 'L'], zone: 'champions-league' },
    { rank: 3, team: 'Roma', played: 26, won: 16, drawn: 2, lost: 8, goalDiff: '+18', goalsFor: 34, goalsAgainst: 16, points: 50, form: ['D', 'L', 'W', 'D', 'W'], zone: 'champions-league' },
    { rank: 4, team: 'Napoli', played: 26, won: 15, drawn: 5, lost: 6, goalDiff: '+12', goalsFor: 39, goalsAgainst: 27, points: 50, form: ['L', 'W', 'W', 'D', 'L'], zone: 'champions-league' },
    { rank: 5, team: 'Juventus', played: 26, won: 13, drawn: 7, lost: 6, goalDiff: '+18', goalsFor: 43, goalsAgainst: 25, points: 46, form: ['W', 'W', 'D', 'L', 'L'], zone: 'europa-league' },
    { rank: 6, team: 'Como', played: 26, won: 12, drawn: 9, lost: 5, goalDiff: '+22', goalsFor: 41, goalsAgainst: 19, points: 45, form: ['W', 'D', 'L', 'D', 'W'], zone: 'conference-league' },
    { rank: 7, team: 'Atalanta', played: 26, won: 12, drawn: 9, lost: 5, goalDiff: '+14', goalsFor: 36, goalsAgainst: 22, points: 45, form: ['W', 'D', 'W', 'W', 'W'], zone: 'conference-league' },
    { rank: 8, team: 'Bologna', played: 26, won: 10, drawn: 6, lost: 10, goalDiff: '+3', goalsFor: 35, goalsAgainst: 32, points: 36, form: ['L', 'L', 'L', 'W', 'W'] },
    { rank: 9, team: 'Sassuolo', played: 26, won: 10, drawn: 5, lost: 11, goalDiff: '-3', goalsFor: 32, goalsAgainst: 35, points: 35, form: ['W', 'W', 'L', 'W', 'W'] },
    { rank: 10, team: 'Lazio', played: 26, won: 8, drawn: 10, lost: 8, goalDiff: '+1', goalsFor: 26, goalsAgainst: 25, points: 34, form: ['D', 'W', 'D', 'L', 'D'] },
    { rank: 11, team: 'Udinese', played: 26, won: 9, drawn: 5, lost: 12, goalDiff: '-11', goalsFor: 28, goalsAgainst: 39, points: 32, form: ['W', 'W', 'L', 'L', 'L'] },
    { rank: 12, team: 'Parma', played: 26, won: 8, drawn: 8, lost: 10, goalDiff: '-12', goalsFor: 19, goalsAgainst: 31, points: 32, form: ['L', 'L', 'W', 'W', 'W'] },
    { rank: 13, team: 'Cagliari', played: 26, won: 7, drawn: 8, lost: 11, goalDiff: '-7', goalsFor: 28, goalsAgainst: 35, points: 29, form: ['W', 'W', 'L', 'L', 'D'] },
    { rank: 14, team: 'Genoa', played: 26, won: 6, drawn: 9, lost: 11, goalDiff: '-5', goalsFor: 32, goalsAgainst: 37, points: 27, form: ['W', 'L', 'L', 'D', 'W'] },
    { rank: 15, team: 'Torino', played: 26, won: 7, drawn: 6, lost: 13, goalDiff: '-22', goalsFor: 25, goalsAgainst: 47, points: 27, form: ['L', 'W', 'D', 'L', 'L'] },
    { rank: 16, team: 'Fiorentina', played: 26, won: 5, drawn: 9, lost: 12, goalDiff: '-9', goalsFor: 30, goalsAgainst: 39, points: 24, form: ['L', 'L', 'D', 'W', 'W'] },
    { rank: 17, team: 'Cremonese', played: 26, won: 5, drawn: 9, lost: 12, goalDiff: '-15', goalsFor: 21, goalsAgainst: 36, points: 24, form: ['L', 'L', 'L', 'D', 'L'] },
    { rank: 18, team: 'Lecce', played: 26, won: 6, drawn: 6, lost: 14, goalDiff: '-16', goalsFor: 17, goalsAgainst: 33, points: 24, form: ['D', 'L', 'W', 'W', 'L'], zone: 'relegation' },
    { rank: 19, team: 'Pisa', played: 26, won: 1, drawn: 12, lost: 13, goalDiff: '-23', goalsFor: 20, goalsAgainst: 43, points: 15, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
    { rank: 20, team: 'Hellas Verona', played: 26, won: 2, drawn: 9, lost: 15, goalDiff: '-27', goalsFor: 19, goalsAgainst: 46, points: 15, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
];

const SERIE_A_PREDICTIONS: LeaguePrediction[] = [
    { id: 'sap1', leagueSlug: 'SERIE A', homeTeam: 'Parma', homeLogo: '', awayTeam: 'Cagliari', awayLogo: '', dateStr: '28.02 / 02:45', resultPrediction: 'x1', totalGoalsPrediction: '-2.5', scorePrediction: '2-0 | 1-0 | 1-0 | 1-1' },
    { id: 'sap2', leagueSlug: 'SERIE A', homeTeam: 'Como', homeLogo: '', awayTeam: 'Lecce', awayLogo: '', dateStr: '28.02 / 21:00', resultPrediction: '1', homePrediction: '+1.5', scorePrediction: '3-0 | 3-1 | 2-1 | 2-0' },
    { id: 'sap3', leagueSlug: 'SERIE A', homeTeam: 'Hellas Verona', homeLogo: '', awayTeam: 'Napoli', awayLogo: '', dateStr: '01.03 / 00:00', resultPrediction: '2', awayPrediction: '+1.5', scorePrediction: '0-2 | 1-2 | 1-2 | 0-2' },
    { id: 'sap4', leagueSlug: 'SERIE A', homeTeam: 'Inter', homeLogo: '', awayTeam: 'Genoa', awayLogo: '', dateStr: '01.03 / 02:45', resultPrediction: '1', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', homePrediction: '+1.5', scorePrediction: '2-1 | 2-1 | 3-2 | 3-1' },
    { id: 'sap5', leagueSlug: 'SERIE A', homeTeam: 'Cremonese', homeLogo: '', awayTeam: 'Milan', awayLogo: '', dateStr: '01.03 / 18:30', resultPrediction: '2', bttsPrediction: 'Yok', scorePrediction: '0-1 | 0-3 | 0-1 | 0-2' },
    { id: 'sap6', leagueSlug: 'SERIE A', homeTeam: 'Sassuolo', homeLogo: '', awayTeam: 'Atalanta', awayLogo: '', dateStr: '01.03 / 21:00', resultPrediction: 'x2', bttsPrediction: 'Var', scorePrediction: '1-2 | 1-3 | 2-2 | 1-1' },
    { id: 'sap7', leagueSlug: 'SERIE A', homeTeam: 'Torino', homeLogo: '', awayTeam: 'Lazio', awayLogo: '', dateStr: '02.03 / 00:00', resultPrediction: 'x2', totalGoalsPrediction: '-2.5', scorePrediction: '0-0 | 0-1 | 1-1 | 0-2' },
    { id: 'sap8', leagueSlug: 'SERIE A', homeTeam: 'Roma', homeLogo: '', awayTeam: 'Juventus', awayLogo: '', dateStr: '02.03 / 02:45', resultPrediction: 'x1', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', homePrediction: '+1.5', scorePrediction: '2-1 | 4-2 | 2-2 | 3-2' },
    { id: 'sap9', leagueSlug: 'SERIE A', homeTeam: 'Pisa', homeLogo: '', awayTeam: 'Bologna', awayLogo: '', dateStr: '03.03 / 00:30', resultPrediction: 'x2', bttsPrediction: 'Var', scorePrediction: '1-2 | 1-1 | 1-3 | 1-2' },
    { id: 'sap10', leagueSlug: 'SERIE A', homeTeam: 'Udinese', homeLogo: '', awayTeam: 'Fiorentina', awayLogo: '', dateStr: '03.03 / 02:45', resultPrediction: 'x2', bttsPrediction: 'Var', scorePrediction: '2-2 | 1-2 | 1-2 | 1-1' },
];

const SERIE_A_STATS = {
    topScorers: [
        { name: 'L. Martínez', goals: 14 },
        { name: 'N. Paz', goals: 9 },
        { name: 'K. Yıldız', goals: 8 },
    ],
    topAssists: [
        { name: 'F. Dimarco', assists: 13 },
        { name: 'N. Paz', assists: 6 },
        { name: 'J. Rodriguez', assists: 6 },
    ],
    seasonStats: {
        redCards: 44,
        yellowCards: 992,
        totalGoals: 628,
    }
};

const LIGUE_1_PREDICTIONS: LeaguePrediction[] = [
    { id: 'l1p1', leagueSlug: 'LIGUE 1', homeTeam: 'RC Strasbourg', homeLogo: '', awayTeam: 'RC Lens', awayLogo: '', dateStr: '28.02 / 02:45', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '2-2 | 1-2 | 2-1 | 1-3' },
    { id: 'l1p2', leagueSlug: 'LIGUE 1', homeTeam: 'Stade Rennais', homeLogo: '', awayTeam: 'Toulouse', awayLogo: '', dateStr: '28.02 / 23:00', resultPrediction: 'x1', bttsPrediction: 'Var', scorePrediction: '2-2 | 3-2 | 1-1 | 2-1' },
    { id: 'l1p3', leagueSlug: 'LIGUE 1', homeTeam: 'AS Monaco', homeLogo: '', awayTeam: 'Angers', awayLogo: '', dateStr: '01.03 / 01:00', resultPrediction: '1', bttsPrediction: 'Yok', scorePrediction: '1-0 | 1-0 | 2-0 | 3-0' },
    { id: 'l1p4', leagueSlug: 'LIGUE 1', homeTeam: 'Le Havre', homeLogo: '', awayTeam: 'Paris Saint-Germain', awayLogo: '', dateStr: '01.03 / 03:05', resultPrediction: '2', awayPrediction: '+1.5', scorePrediction: '0-2 | 1-2 | 1-2 | 0-2' },
    { id: 'l1p5', leagueSlug: 'LIGUE 1', homeTeam: 'Paris FC', homeLogo: '', awayTeam: 'Nice', awayLogo: '', dateStr: '01.03 / 21:00', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '2-1 | 3-1 | 2-2 | 1-2' },
    { id: 'l1p6', leagueSlug: 'LIGUE 1', homeTeam: 'Lorient', homeLogo: '', awayTeam: 'Auxerre', awayLogo: '', dateStr: '01.03 / 23:15', resultPrediction: 'x1', totalGoalsPrediction: '-2.5', scorePrediction: '1-1 | 0-0 | 1-0 | 2-0' },
    { id: 'l1p7', leagueSlug: 'LIGUE 1', homeTeam: 'Metz', homeLogo: '', awayTeam: 'Stade Brestois', awayLogo: '', dateStr: '01.03 / 23:15', bttsPrediction: 'Var', scorePrediction: '2-1 | 2-2 | 1-1 | 1-2' },
    { id: 'l1p8', leagueSlug: 'LIGUE 1', homeTeam: 'Lille', homeLogo: '', awayTeam: 'Nantes', awayLogo: '', dateStr: '01.03 / 23:15', resultPrediction: '1', homePrediction: '+1.5', scorePrediction: '3-1 | 2-0 | 2-1 | 2-0' },
    { id: 'l1p9', leagueSlug: 'LIGUE 1', homeTeam: 'Olympique de Marseille', homeLogo: '', awayTeam: 'Olympique Lyonnais', awayLogo: '', dateStr: '02.03 / 02:45', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '2-2 | 1-2 | 2-1 | 1-3' },
];

const LIGUE_1_UPCOMING: LeagueMatch[] = [
    { id: 'l1u1', date: '28 Feb 2026', homeTeam: 'RC Strasbourg', homeLogo: '', awayTeam: 'RC Lens', awayLogo: '' },
    { id: 'l1u2', date: '28 Feb 2026', homeTeam: 'Stade Rennais', homeLogo: '', awayTeam: 'Toulouse', awayLogo: '' },
    { id: 'l1u3', date: '01 Mar 2026', homeTeam: 'AS Monaco', homeLogo: '', awayTeam: 'Angers', awayLogo: '' },
    { id: 'l1u4', date: '01 Mar 2026', homeTeam: 'Le Havre', homeLogo: '', awayTeam: 'Paris Saint-Germain', awayLogo: '' },
    { id: 'l1u5', date: '01 Mar 2026', homeTeam: 'Paris FC', homeLogo: '', awayTeam: 'Nice', awayLogo: '' },
    { id: 'l1u6', date: '01 Mar 2026', homeTeam: 'Lorient', homeLogo: '', awayTeam: 'Auxerre', awayLogo: '' },
    { id: 'l1u7', date: '01 Mar 2026', homeTeam: 'Metz', homeLogo: '', awayTeam: 'Stade Brestois', awayLogo: '' },
    { id: 'l1u8', date: '01 Mar 2026', homeTeam: 'Lille', homeLogo: '', awayTeam: 'Nantes', awayLogo: '' },
    { id: 'l1u9', date: '02 Mar 2026', homeTeam: 'Olympique de Marseille', homeLogo: '', awayTeam: 'Olympique Lyonnais', awayLogo: '' },
];
const LIGUE_1_RECENT: LeagueMatch[] = [
    { id: 'l1r1', date: '24 Feb 2026', homeTeam: 'Paris Saint-Germain', homeLogo: '', awayTeam: 'Lille', awayLogo: '', homeScore: 3, awayScore: 1 },
    { id: 'l1r2', date: '24 Feb 2026', homeTeam: 'AS Monaco', homeLogo: '', awayTeam: 'RC Lens', awayLogo: '', homeScore: 2, awayScore: 0 },
    { id: 'l1r3', date: '23 Feb 2026', homeTeam: 'Olympique Lyonnais', homeLogo: '', awayTeam: 'AS Monaco', awayLogo: '', homeScore: 1, awayScore: 2 },
    { id: 'l1r4', date: '23 Feb 2026', homeTeam: 'RC Lens', homeLogo: '', awayTeam: 'Stade Rennais', awayLogo: '', homeScore: 1, awayScore: 1 },
    { id: 'l1r5', date: '22 Feb 2026', homeTeam: 'Nice', homeLogo: '', awayTeam: 'Lorient', awayLogo: '', homeScore: 0, awayScore: 0 },
];
const LIGUE_1_STANDINGS: LeagueStanding[] = [
    { rank: 1, team: 'Paris Saint-Germain', played: 24, won: 18, drawn: 4, lost: 2, goalDiff: '+35', goalsFor: 56, goalsAgainst: 21, points: 58, form: ['W', 'W', 'D', 'W', 'W'], zone: 'champions-league' },
    { rank: 2, team: 'AS Monaco', played: 24, won: 15, drawn: 5, lost: 4, goalDiff: '+20', goalsFor: 44, goalsAgainst: 24, points: 50, form: ['W', 'W', 'D', 'L', 'W'], zone: 'champions-league' },
    { rank: 3, team: 'Olympique de Marseille', played: 24, won: 13, drawn: 6, lost: 5, goalDiff: '+14', goalsFor: 38, goalsAgainst: 24, points: 45, form: ['W', 'D', 'W', 'W', 'D'], zone: 'champions-league' },
    { rank: 4, team: 'Lille', played: 24, won: 12, drawn: 7, lost: 5, goalDiff: '+11', goalsFor: 36, goalsAgainst: 25, points: 43, form: ['L', 'W', 'W', 'D', 'D'], zone: 'europa-league' },
    { rank: 5, team: 'RC Lens', played: 24, won: 11, drawn: 8, lost: 5, goalDiff: '+9', goalsFor: 30, goalsAgainst: 21, points: 41, form: ['L', 'D', 'W', 'L', 'W'], zone: 'conference-league' },
    { rank: 6, team: 'Nice', played: 24, won: 11, drawn: 7, lost: 6, goalDiff: '+6', goalsFor: 25, goalsAgainst: 19, points: 40, form: ['D', 'W', 'L', 'W', 'D'] },
    { rank: 7, team: 'Stade Rennais', played: 24, won: 9, drawn: 8, lost: 7, goalDiff: '+4', goalsFor: 35, goalsAgainst: 31, points: 35, form: ['D', 'D', 'W', 'L', 'W'] },
    { rank: 8, team: 'Olympique Lyonnais', played: 24, won: 10, drawn: 5, lost: 9, goalDiff: '+5', goalsFor: 33, goalsAgainst: 28, points: 35, form: ['L', 'W', 'W', 'L', 'L'] },
    { rank: 9, team: 'Stade Brestois', played: 24, won: 8, drawn: 7, lost: 9, goalDiff: '-3', goalsFor: 28, goalsAgainst: 31, points: 31, form: ['W', 'D', 'L', 'D', 'L'] },
    { rank: 10, team: 'RC Strasbourg', played: 24, won: 7, drawn: 7, lost: 10, goalDiff: '-8', goalsFor: 24, goalsAgainst: 32, points: 28, form: ['D', 'L', 'D', 'W', 'W'] },
    { rank: 11, team: 'Toulouse', played: 24, won: 6, drawn: 8, lost: 10, goalDiff: '-6', goalsFor: 26, goalsAgainst: 32, points: 26, form: ['W', 'D', 'D', 'L', 'L'] },
    { rank: 12, team: 'Nantes', played: 24, won: 7, drawn: 4, lost: 13, goalDiff: '-12', goalsFor: 22, goalsAgainst: 34, points: 25, form: ['L', 'W', 'L', 'L', 'D'] },
    { rank: 13, team: 'Montpellier', played: 24, won: 5, drawn: 8, lost: 11, goalDiff: '-11', goalsFor: 26, goalsAgainst: 37, points: 23, form: ['D', 'L', 'L', 'D', 'L'] },
    { rank: 14, team: 'Le Havre', played: 24, won: 5, drawn: 7, lost: 12, goalDiff: '-14', goalsFor: 20, goalsAgainst: 34, points: 22, form: ['L', 'D', 'L', 'W', 'L'] },
    { rank: 15, team: 'Metz', played: 24, won: 5, drawn: 5, lost: 14, goalDiff: '-19', goalsFor: 19, goalsAgainst: 38, points: 20, form: ['L', 'L', 'W', 'L', 'D'] },
    { rank: 16, team: 'FC Lorient', played: 24, won: 4, drawn: 7, lost: 13, goalDiff: '-22', goalsFor: 25, goalsAgainst: 47, points: 19, form: ['D', 'D', 'L', 'L', 'L'], zone: 'relegation' },
    { rank: 17, team: 'Angers', played: 24, won: 3, drawn: 5, lost: 16, goalDiff: '-35', goalsFor: 18, goalsAgainst: 53, points: 14, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
    { rank: 18, team: 'Auxerre', played: 24, won: 3, drawn: 4, lost: 17, goalDiff: '-38', goalsFor: 15, goalsAgainst: 53, points: 13, form: ['L', 'L', 'L', 'L', 'D'], zone: 'relegation' },
];
const LIGUE_1_STATS = {
    topScorers: [
        { name: 'M. Greenwood', goals: 14 },
        { name: 'J. Panichelli', goals: 13 },
        { name: 'E. Lepaul', goals: 12 },
    ],
    topAssists: [
        { name: 'Vitinha', assists: 7 },
        { name: 'L. Ajorque', assists: 7 },
        { name: 'M. Udol', assists: 6 },
    ],
    seasonStats: { redCards: 59, yellowCards: 806, totalGoals: 587 }
};

const BUNDESLIGA_UPCOMING: LeagueMatch[] = [
    { id: 'bu1', date: '28 Feb 2026', homeTeam: 'FC Augsburg', homeLogo: '', awayTeam: '1. FC Köln', awayLogo: '' },
    { id: 'bu2', date: '28 Feb 2026', homeTeam: 'Bayer 04 Leverkusen', homeLogo: '', awayTeam: '1. FSV Mainz 05', awayLogo: '' },
    { id: 'bu3', date: '28 Feb 2026', homeTeam: 'TSG Hoffenheim', homeLogo: '', awayTeam: 'FC St. Pauli', awayLogo: '' },
    { id: 'bu4', date: '28 Feb 2026', homeTeam: 'Borussia M\'gladbach', homeLogo: '', awayTeam: '1. FC Union Berlin', awayLogo: '' },
    { id: 'bu5', date: '28 Feb 2026', homeTeam: 'SV Werder Bremen', homeLogo: '', awayTeam: '1. FC Heidenheim', awayLogo: '' },
    { id: 'bu6', date: '01 Mar 2026', homeTeam: 'Borussia Dortmund', homeLogo: '', awayTeam: 'FC Bayern München', awayLogo: '' },
    { id: 'bu7', date: '01 Mar 2026', homeTeam: 'VfB Stuttgart', homeLogo: '', awayTeam: 'VfL Wolfsburg', awayLogo: '' },
    { id: 'bu8', date: '01 Mar 2026', homeTeam: 'Eintracht Frankfurt', homeLogo: '', awayTeam: 'SC Freiburg', awayLogo: '' },
    { id: 'bu9', date: '02 Mar 2026', homeTeam: 'Hamburger SV', homeLogo: '', awayTeam: 'RB Leipzig', awayLogo: '' },
];
const BUNDESLIGA_RECENT: LeagueMatch[] = [
    { id: 'br1', date: '23 Feb 2026', homeTeam: '1. FC Heidenheim', homeLogo: '', awayTeam: 'VfB Stuttgart', awayLogo: '', homeScore: 3, awayScore: 3 },
    { id: 'br2', date: '22 Feb 2026', homeTeam: 'FC St. Pauli', homeLogo: '', awayTeam: 'SV Werder Bremen', awayLogo: '', homeScore: 2, awayScore: 1 },
    { id: 'br3', date: '22 Feb 2026', homeTeam: 'SC Freiburg', homeLogo: '', awayTeam: 'Borussia M\'gladbach', awayLogo: '', homeScore: 2, awayScore: 1 },
    { id: 'br4', date: '22 Feb 2026', homeTeam: 'RB Leipzig', homeLogo: '', awayTeam: 'Borussia Dortmund', awayLogo: '', homeScore: 2, awayScore: 2 },
    { id: 'br5', date: '21 Feb 2026', homeTeam: 'FC Bayern München', homeLogo: '', awayTeam: 'Eintracht Frankfurt', awayLogo: '', homeScore: 3, awayScore: 2 },
    { id: 'br6', date: '21 Feb 2026', homeTeam: '1. FC Köln', homeLogo: '', awayTeam: 'TSG Hoffenheim', awayLogo: '', homeScore: 2, awayScore: 2 },
    { id: 'br7', date: '21 Feb 2026', homeTeam: 'VfL Wolfsburg', homeLogo: '', awayTeam: 'FC Augsburg', awayLogo: '', homeScore: 2, awayScore: 3 },
    { id: 'br8', date: '21 Feb 2026', homeTeam: '1. FC Union Berlin', homeLogo: '', awayTeam: 'Bayer 04 Leverkusen', awayLogo: '', homeScore: 1, awayScore: 0 },
    { id: 'br9', date: '21 Feb 2026', homeTeam: '1. FSV Mainz 05', homeLogo: '', awayTeam: 'Hamburger SV', awayLogo: '', homeScore: 1, awayScore: 1 },
];
const BUNDESLIGA_STANDINGS: LeagueStanding[] = [
    { rank: 1, team: 'Bayer Leverkusen', played: 24, won: 20, drawn: 4, lost: 0, goalDiff: '+45', goalsFor: 61, goalsAgainst: 16, points: 64, form: ['W', 'W', 'W', 'W', 'D'], zone: 'champions-league' },
    { rank: 2, team: 'Bayern Munich', played: 24, won: 17, drawn: 4, lost: 3, goalDiff: '+40', goalsFor: 65, goalsAgainst: 25, points: 55, form: ['D', 'W', 'W', 'L', 'W'], zone: 'champions-league' },
    { rank: 3, team: 'VfB Stuttgart', played: 24, won: 16, drawn: 2, lost: 6, goalDiff: '+25', goalsFor: 55, goalsAgainst: 30, points: 50, form: ['W', 'D', 'W', 'W', 'W'], zone: 'champions-league' },
    { rank: 4, team: 'Borussia Dortmund', played: 24, won: 12, drawn: 8, lost: 4, goalDiff: '+14', goalsFor: 44, goalsAgainst: 30, points: 44, form: ['L', 'W', 'D', 'W', 'W'], zone: 'champions-league' },
    { rank: 5, team: 'RB Leipzig', played: 24, won: 13, drawn: 4, lost: 7, goalDiff: '+20', goalsFor: 50, goalsAgainst: 30, points: 43, form: ['W', 'L', 'W', 'D', 'W'], zone: 'europa-league' },
    { rank: 6, team: 'Eintracht Frankfurt', played: 24, won: 9, drawn: 10, lost: 5, goalDiff: '+6', goalsFor: 35, goalsAgainst: 29, points: 37, form: ['W', 'D', 'D', 'D', 'D'], zone: 'conference-league' },
    { rank: 7, team: 'Hoffenheim', played: 24, won: 9, drawn: 6, lost: 9, goalDiff: '-3', goalsFor: 40, goalsAgainst: 43, points: 33, form: ['W', 'L', 'W', 'D', 'L'] },
    { rank: 8, team: 'SV Werder Bremen', played: 24, won: 8, drawn: 6, lost: 10, goalDiff: '-3', goalsFor: 32, goalsAgainst: 35, points: 30, form: ['D', 'W', 'L', 'W', 'D'] },
    { rank: 9, team: 'SC Freiburg', played: 24, won: 8, drawn: 6, lost: 10, goalDiff: '-9', goalsFor: 30, goalsAgainst: 39, points: 30, form: ['D', 'L', 'L', 'W', 'W'] },
    { rank: 10, team: 'FC Heidenheim', played: 24, won: 7, drawn: 7, lost: 10, goalDiff: '-8', goalsFor: 32, goalsAgainst: 40, points: 28, form: ['W', 'L', 'D', 'D', 'L'] },
    { rank: 11, team: 'FC Augsburg', played: 24, won: 6, drawn: 8, lost: 10, goalDiff: '-7', goalsFor: 35, goalsAgainst: 42, points: 26, form: ['L', 'D', 'L', 'L', 'W'] },
    { rank: 12, team: 'VfL Wolfsburg', played: 24, won: 6, drawn: 7, lost: 11, goalDiff: '-7', goalsFor: 30, goalsAgainst: 37, points: 25, form: ['D', 'L', 'D', 'D', 'W'] },
    { rank: 13, team: 'Union Berlin', played: 24, won: 7, drawn: 4, lost: 13, goalDiff: '-16', goalsFor: 22, goalsAgainst: 38, points: 25, form: ['D', 'W', 'W', 'L', 'D'] },
    { rank: 14, team: 'VfL Bochum', played: 24, won: 5, drawn: 10, lost: 9, goalDiff: '-15', goalsFor: 29, goalsAgainst: 44, points: 25, form: ['L', 'L', 'W', 'D', 'D'] },
    { rank: 15, team: 'Borussia M.Gladbach', played: 24, won: 5, drawn: 9, lost: 10, goalDiff: '-8', goalsFor: 40, goalsAgainst: 48, points: 24, form: ['D', 'L', 'L', 'L', 'W'] },
    { rank: 16, team: '1. FC Köln', played: 24, won: 3, drawn: 8, lost: 13, goalDiff: '-22', goalsFor: 18, goalsAgainst: 40, points: 17, form: ['L', 'D', 'L', 'L', 'D'], zone: 'relegation' },
    { rank: 17, team: 'Mainz 05', played: 24, won: 2, drawn: 10, lost: 12, goalDiff: '-18', goalsFor: 18, goalsAgainst: 36, points: 16, form: ['D', 'L', 'W', 'L', 'L'], zone: 'relegation' },
    { rank: 18, team: 'Darmstadt 98', played: 24, won: 2, drawn: 7, lost: 15, goalDiff: '-33', goalsFor: 25, goalsAgainst: 58, points: 13, form: ['L', 'D', 'L', 'L', 'D'], zone: 'relegation' },
];
const BUNDESLIGA_PREDICTIONS: LeaguePrediction[] = [
    { id: 'bp1', leagueSlug: 'BUNDESLIGA', homeTeam: 'FC Augsburg', homeLogo: '', awayTeam: '1. FC Köln', awayLogo: '', dateStr: '28.02 / 02:30', resultPrediction: 'x1', totalGoalsPrediction: '-2.5', scorePrediction: '0-0 | 1-0 | 1-1 | 2-0' },
    { id: 'bp2', leagueSlug: 'BUNDESLIGA', homeTeam: 'Bayer 04 Leverkusen', homeLogo: '', awayTeam: '1. FSV Mainz 05', awayLogo: '', dateStr: '28.02 / 21:30', resultPrediction: 'x1', awayPrediction: '+1.5', scorePrediction: '2-1 | 2-0 | 2-0 | 2-2' },
    { id: 'bp3', leagueSlug: 'BUNDESLIGA', homeTeam: 'TSG Hoffenheim', homeLogo: '', awayTeam: 'FC St. Pauli', awayLogo: '', dateStr: '28.02 / 21:30', resultPrediction: '1', awayPrediction: '+1.5', scorePrediction: '3-1 | 2-0 | 2-0 | 2-1' },
    { id: 'bp4', leagueSlug: 'BUNDESLIGA', homeTeam: 'Borussia M\'gladbach', homeLogo: '', awayTeam: '1. FC Union Berlin', awayLogo: '', dateStr: '28.02 / 21:30', resultPrediction: 'x1', bttsPrediction: 'Var', scorePrediction: '3-1 | 2-1 | 1-1 | 2-2' },
    { id: 'bp5', leagueSlug: 'BUNDESLIGA', homeTeam: 'SV Werder Bremen', homeLogo: '', awayTeam: '1. FC Heidenheim', awayLogo: '', dateStr: '28.02 / 21:30', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '2-1 | 3-1 | 2-2 | 1-2' },
    { id: 'bp6', leagueSlug: 'BUNDESLIGA', homeTeam: 'Borussia Dortmund', homeLogo: '', awayTeam: 'FC Bayern München', awayLogo: '', dateStr: '01.03 / 00:30', totalGoalsPrediction: '+2.5', bttsPrediction: 'Var', scorePrediction: '1-2 | 2-2 | 2-1 | 3-2' },
    { id: 'bp7', leagueSlug: 'BUNDESLIGA', homeTeam: 'VfB Stuttgart', homeLogo: '', awayTeam: 'VfL Wolfsburg', awayLogo: '', dateStr: '01.03 / 21:30', resultPrediction: '1', totalGoalsPrediction: '+2.5', awayPrediction: '+1.5', scorePrediction: '2-1 | 2-1 | 3-0 | 3-1' },
    { id: 'bp8', leagueSlug: 'BUNDESLIGA', homeTeam: 'Eintracht Frankfurt', homeLogo: '', awayTeam: 'SC Freiburg', awayLogo: '', dateStr: '01.03 / 23:30', resultPrediction: 'x1', bttsPrediction: 'Var', scorePrediction: '2-1 | 3-1 | 1-1 | 2-2' },
    { id: 'bp9', leagueSlug: 'BUNDESLIGA', homeTeam: 'Hamburger SV', homeLogo: '', awayTeam: 'RB Leipzig', awayLogo: '', dateStr: '02.03 / 01:30', resultPrediction: 'x1', bttsPrediction: 'Var', scorePrediction: '2-1 | 3-1 | 2-2 | 1-1' },
];
const BUNDESLIGA_STATS = {
    topScorers: [
        { name: 'H. Kane', goals: 28 },
        { name: 'L. Díaz', goals: 13 },
        { name: 'D. Undav', goals: 13 },
    ],
    topAssists: [
        { name: 'M. Olise', assists: 16 },
        { name: 'J. Ryerson', assists: 11 },
        { name: 'L. Díaz', assists: 10 },
    ],
    seasonStats: { redCards: 34, yellowCards: 806, totalGoals: 661 }
};

export const INITIAL_LEAGUE_DATA: Record<string, { upcoming: LeagueMatch[], recent: LeagueMatch[], standings: LeagueStanding[], predictions: LeaguePrediction[], stats?: any }> = {
    'premier-league': {
        upcoming: PREMIER_LEAGUE_UPCOMING,
        recent: PREMIER_LEAGUE_RECENT,
        standings: PREMIER_LEAGUE_STANDINGS,
        predictions: PREMIER_LEAGUE_PREDICTIONS,
        stats: PREMIER_LEAGUE_STATS
    },
    'super-lig': {
        upcoming: SUPER_LIG_UPCOMING,
        recent: SUPER_LIG_RECENT,
        standings: SUPER_LIG_STANDINGS,
        predictions: SUPER_LIG_PREDICTIONS,
        stats: SUPER_LIG_STATS
    },
    'laliga': {
        upcoming: LA_LIGA_UPCOMING,
        recent: LA_LIGA_RECENT,
        standings: LA_LIGA_STANDINGS,
        predictions: LA_LIGA_PREDICTIONS,
        stats: LA_LIGA_STATS
    },
    'serie-a': {
        upcoming: SERIE_A_UPCOMING,
        recent: SERIE_A_RECENT,
        standings: SERIE_A_STANDINGS,
        predictions: SERIE_A_PREDICTIONS,
        stats: SERIE_A_STATS
    },
    'ligue-1': {
        upcoming: LIGUE_1_UPCOMING,
        recent: LIGUE_1_RECENT,
        standings: LIGUE_1_STANDINGS,
        predictions: LIGUE_1_PREDICTIONS,
        stats: LIGUE_1_STATS
    },
    'bundesliga': {
        upcoming: BUNDESLIGA_UPCOMING,
        recent: BUNDESLIGA_RECENT,
        standings: BUNDESLIGA_STANDINGS,
        predictions: BUNDESLIGA_PREDICTIONS,
        stats: BUNDESLIGA_STATS
    }
};

interface PopularLeaguesProps {
    leagueData?: Record<string, { upcoming: LeagueMatch[], recent: LeagueMatch[], standings: LeagueStanding[], predictions: LeaguePrediction[], stats?: any }>;
    isLoggedIn?: boolean;
    onLoginRequired?: () => void;
}

const PopularLeagues: React.FC<PopularLeaguesProps> = ({ leagueData = INITIAL_LEAGUE_DATA, isLoggedIn = false, onLoginRequired }) => {
    const [activeLeague, setActiveLeague] = useState<string>('premier-league');
    const [activeTab, setActiveTab] = useState<'fikstur' | 'puan-durumu' | 'tahminler' | 'istatistikler'>('tahminler');
    const [liveMatches, setLiveMatches] = useState<Record<string, LeagueMatch[]>>({});
    const [isLoadingLive, setIsLoadingLive] = useState(false);

    useEffect(() => {
        const loadLiveMatches = async () => {
            // Only fetch for soccer leagues by default. In a real scenario, you'd map the league ID to a specific API ID.
            if (activeTab === 'istatistikler' && !liveMatches[activeLeague]) {
                setIsLoadingLive(true);
                const events = await fetchTodaysMatches('Soccer');
                
                // Transform SportsEvent to LeagueMatch
                const transformed: LeagueMatch[] = events.map(e => ({
                    id: e.idEvent,
                    date: e.strTime ? `${e.strTime.substring(0, 5)}` : (e.dateEvent || 'TBD'),
                    homeTeam: e.strHomeTeam,
                    homeLogo: e.strHomeTeamBadge || '',
                    awayTeam: e.strAwayTeam,
                    awayLogo: e.strAwayTeamBadge || '',
                    homeScore: e.intHomeScore ? parseInt(e.intHomeScore) : undefined,
                    awayScore: e.intAwayScore ? parseInt(e.intAwayScore) : undefined
                }));

                setLiveMatches(prev => ({
                    ...prev,
                    [activeLeague]: transformed
                }));
                setIsLoadingLive(false);
            }
        };

        loadLiveMatches();
    }, [activeLeague, activeTab]);

    // Helper for form badge color
    const getFormBadgeColor = (result: 'W' | 'D' | 'L') => {
        switch (result) {
            case 'W': return 'bg-green-500 text-white';
            case 'D': return 'bg-yellow-500 text-white';
            case 'L': return 'bg-red-500 text-white';
        }
    };

    // Helper for table row background based on zone
    const getRowBgClass = (zone?: string) => {
        switch (zone) {
            case 'champions-league': return 'bg-blue-100/10 border-l-4 border-l-blue-500';
            case 'europa-league': return 'bg-purple-100/10 border-l-4 border-l-purple-500';
            case 'conference-league': return 'bg-green-100/10 border-l-4 border-l-green-500 border-opacity-70 text-emerald-100/80';
            case 'relegation': return 'bg-red-100/10 border-l-4 border-l-red-500';
            default: return 'hover:bg-zinc-800/50';
        }
    };

    // Merge live data with static data. If we have live data, show it first, then mock.
    const baseData = leagueData[activeLeague];
    const activeData = baseData ? {
        ...baseData,
        upcoming: liveMatches[activeLeague] && liveMatches[activeLeague].length > 0 
            ? liveMatches[activeLeague] 
            : baseData.upcoming
    } : undefined;

    return (
        <section id="popular-leagues-section" className="brands-section relative z-10 py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="brands-header mb-12 animate-fade-in-up text-center w-full">
                    <h2 className="text-[32px] md:text-[40px] font-black text-theme-primary italic uppercase tracking-tighter flex items-center justify-center gap-3">
                        <TrophyIcon /> EN POPÜLER <span className="text-[#FFC107]">LİGLER</span>
                    </h2>
                    <div className="h-1 w-20 bg-[#FFC107] mx-auto mt-4 mb-6 shadow-[0_0_15px_rgba(255,193,7,0.4)]" />
                </div>

                {/* League Selector Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-12">
                    {LEAGUES.map(league => (
                        <div
                            key={league.id}
                            onClick={() => setActiveLeague(league.id)}
                            className={`
                group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between
                ${activeLeague === league.id
                                    ? 'border-[#f0b90b] bg-theme-card shadow-[inset_0_0_15px_rgba(240,185,11,0.03)] z-10'
                                    : 'border-theme-subtle bg-theme-main hover:border-zinc-700 hover:bg-theme-card'}
              `}
                        >
                            <div className="p-5 flex flex-col items-center justify-center gap-3 relative z-10 mt-2">
                                <img
                                    src={league.logo}
                                    alt={league.name}
                                    className={`w-12 h-12 object-cover rounded-full border border-zinc-800 transition-all duration-300 relative z-10 ${activeLeague === league.id ? 'border-zinc-600 shadow-lg' : 'grayscale-[0.5] group-hover:grayscale-0'}`}
                                />
                                <span className={`font-black text-[13px] tracking-wide transition-colors duration-300 ${activeLeague === league.id ? 'text-theme-primary' : 'text-theme-muted group-hover:text-theme-secondary'}`}>{league.name}</span>
                            </div>

                            <div className="flex bg-theme-elevated divide-x border-t border-theme-subtle text-[10px] md:text-xs">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveLeague(league.id); setActiveTab('tahminler'); }}
                                    className={`flex-1 py-3 text-center transition-colors font-bold ${activeLeague === league.id && activeTab === 'tahminler' ? 'text-[#f0b90b] bg-white/[0.02]' : 'text-theme-muted hover:text-theme-secondary hover:bg-white/[0.02]'}`}
                                >
                                    Tahminler
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveLeague(league.id); setActiveTab('puan-durumu'); }}
                                    className={`flex-1 py-3 text-center transition-colors font-bold ${activeLeague === league.id && activeTab === 'puan-durumu' ? 'text-[#f0b90b] bg-white/[0.02]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'}`}
                                >
                                    Puan Durumu
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveLeague(league.id); setActiveTab('istatistikler'); }}
                                    className={`flex-1 py-3 text-center transition-colors font-bold ${activeLeague === league.id && activeTab === 'istatistikler' ? 'text-[#f0b90b] bg-white/[0.02]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'}`}
                                >
                                    İstatistikler
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-theme-card rounded-2xl border border-theme-subtle p-6 shadow-card min-h-[500px]">
                    {!activeData ? (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                            <TrophyIcon />
                            <p className="mt-4 text-lg">Bu lig için veriler henüz yüklenmedi.</p>
                            <p className="text-sm">Şu an Premier League, La Liga, Serie A, Ligue 1 ve Süper Lig verileri aktiftir.</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in">

                            {/* ISTATISTIKLER TAB (Moved to include upcoming/recent/stats) */}
                            {activeTab === 'istatistikler' && (
                                <div className="space-y-10">
                                    {/* Sonuçlar / Fikstür */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Yaklaşan Maçlar */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Yaklaşan (Bugün) <span className="text-sm text-zinc-500 font-normal">({activeData.upcoming?.length || 0})</span></h3>
                                            <div className="bg-theme-main rounded-xl border border-theme-subtle overflow-hidden divide-y divide-theme-subtle">
                                                {isLoadingLive ? (
                                                    <div className="p-8 text-center text-zinc-400 flex flex-col items-center">
                                                        <div className="w-6 h-6 border-2 border-zinc-500 border-t-[#f0b90b] rounded-full animate-spin mb-3"></div>
                                                        Canlı veriler yükleniyor...
                                                    </div>
                                                ) : activeData.upcoming?.map(match => (
                                                    <div key={match.id} className="p-4 hover:bg-white/5 transition-colors">
                                                        <div className="text-center text-xs text-[#f0b90b] font-bold mb-2 tracking-wider flex items-center justify-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {match.date}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 flex-1 justify-end">
                                                                <span className="font-bold text-sm">{match.homeTeam}</span>
                                                            </div>
                                                            <div className="px-4 py-1 mx-2 bg-indigo-600 rounded text-xs font-bold w-12 text-center text-white shrink-0">VS</div>
                                                            <div className="flex items-center gap-2 flex-1 justify-start">
                                                                <span className="font-bold text-sm">{match.awayTeam}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!activeData.upcoming || activeData.upcoming.length === 0) && (
                                                    <div className="p-4 text-center text-zinc-500">Mevcut yaklaşan karşılaşma yok.</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Son Sonuçlar */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Son Sonuçlar <span className="text-sm text-zinc-500 font-normal">({activeData.recent?.length || 0})</span></h3>
                                            <div className="bg-theme-main rounded-xl border border-theme-subtle overflow-hidden divide-y divide-theme-subtle">
                                                {activeData.recent?.map(match => (
                                                    <div key={match.id} className="p-4 hover:bg-white/5 transition-colors">
                                                        <div className="text-center text-xs text-zinc-500 mb-2">{match.date}</div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 flex-1 justify-end">
                                                                <span className="font-bold text-sm">{match.homeTeam}</span>
                                                            </div>
                                                            <div className="px-3 mx-2 bg-[#7C3AED] rounded py-1 text-sm font-bold w-14 text-center text-white shrink-0">
                                                                {match.homeScore}-{match.awayScore}
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-1 justify-start">
                                                                <span className="font-bold text-sm">{match.awayTeam}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!activeData.recent || activeData.recent.length === 0) && (
                                                    <div className="p-4 text-center text-zinc-500">Mevcut son karşılaşma sonucu yok.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Oyun İstatistikleri (Sezon/Oyuncu) */}
                                    {activeData.stats && (
                                        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
                                            {/* Gol Kralları */}
                                            <div>
                                                <h3 className="text-lg font-bold mb-4 border-b border-zinc-800 pb-2">Gol Kralları</h3>
                                                <ul className="space-y-4">
                                                    {activeData.stats.topScorers.map((scorer: any, idx: number) => (
                                                        <li key={idx} className="flex justify-between items-center bg-theme-main p-3 rounded-xl border border-theme-subtle">
                                                            <span className="font-bold text-theme-primary">{scorer.name}</span>
                                                            <span className="text-zinc-400">Goller <span className="text-blue-500 font-bold ml-1">{scorer.goals}</span></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* Asist Kralları */}
                                            <div>
                                                <h3 className="text-lg font-bold mb-4 border-b border-zinc-800 pb-2">Asist Kralları</h3>
                                                <ul className="space-y-4">
                                                    {activeData.stats.topAssists.map((assister: any, idx: number) => (
                                                        <li key={idx} className="flex justify-between items-center bg-theme-main p-3 rounded-xl border border-theme-subtle">
                                                            <span className="font-bold text-theme-primary">{assister.name}</span>
                                                            <span className="text-zinc-400">Asist <span className="text-blue-500 font-bold ml-1">{assister.assists}</span></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* Sezon İstatistikleri */}
                                            <div>
                                                <h3 className="text-lg font-bold mb-4 border-b border-zinc-800 pb-2">Sezon İstatistikleri</h3>
                                                <ul className="space-y-4">
                                                    <li className="flex items-center gap-4 bg-theme-main p-3 rounded-xl border border-theme-subtle">
                                                        <div className="w-6 h-8 bg-red-500 rounded-sm"></div>
                                                        <span className="font-bold text-lg w-10 text-center text-theme-primary">{activeData.stats.seasonStats.redCards}</span>
                                                        <span className="text-theme-primary font-semibold flex-1">Kırmızı Kart</span>
                                                    </li>
                                                    <li className="flex items-center gap-4 bg-theme-main p-3 rounded-xl border border-theme-subtle">
                                                        <div className="w-6 h-8 bg-yellow-400 rounded-sm"></div>
                                                        <span className="font-bold text-lg w-10 text-center text-theme-primary">{activeData.stats.seasonStats.yellowCards}</span>
                                                        <span className="text-theme-primary font-semibold flex-1">Sarı Kart</span>
                                                    </li>
                                                    <li className="flex items-center gap-4 bg-theme-main p-3 rounded-xl border border-theme-subtle">
                                                        <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-theme-subtle">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="m11 19.93-3.64-2.65-.63-4.39 3.16-3.15 4.22.63 2.65 3.64-1.26 4.22-3.16 3.15z" /></svg>
                                                        </div>
                                                        <span className="font-bold text-lg w-10 text-center text-theme-primary">{activeData.stats.seasonStats.totalGoals}</span>
                                                        <span className="text-theme-primary font-semibold flex-1">Goller</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PUAN DURUMU TAB */}
                            {activeTab === 'puan-durumu' && (
                                <div>
                                    <div className="flex flex-wrap gap-4 mb-6 text-sm">
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500 block"></span> Champions League</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500 block"></span> UEFA Europa League</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/70 block"></span> Conference League Qualification</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500 block"></span> Relegation</div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left align-middle border-collapse">
                                            <thead className="text-xs uppercase bg-theme-elevated text-theme-muted border-b border-theme-subtle">
                                                <tr>
                                                    <th className="px-4 py-3 w-10 text-center">Pos</th>
                                                    <th className="px-4 py-3">Takım</th>
                                                    <th className="px-2 py-3 text-center">MP</th>
                                                    <th className="px-2 py-3 text-center">W</th>
                                                    <th className="px-2 py-3 text-center">D</th>
                                                    <th className="px-2 py-3 text-center">L</th>
                                                    <th className="px-2 py-3 text-center">GD</th>
                                                    <th className="px-2 py-3 text-center">GF</th>
                                                    <th className="px-2 py-3 text-center">GA</th>
                                                    <th className="px-2 py-3 text-center font-bold">Pts</th>
                                                    <th className="px-4 py-3 text-center">Form</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y border-theme-subtle">
                                                {activeData.standings?.map((row) => (
                                                    <tr key={row.rank} className={getRowBgClass(row.zone)}>
                                                        <td className="px-4 py-3 text-center font-bold">{row.rank}</td>
                                                        <td className="px-4 py-3 font-semibold text-theme-primary">{row.team}</td>
                                                        <td className="px-2 py-3 text-center text-zinc-400">{row.played}</td>
                                                        <td className="px-2 py-3 text-center text-zinc-400">{row.won}</td>
                                                        <td className="px-2 py-3 text-center text-zinc-400">{row.drawn}</td>
                                                        <td className="px-2 py-3 text-center text-zinc-400">{row.lost}</td>
                                                        <td className={`px-2 py-3 text-center font-medium ${row.goalDiff.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{row.goalDiff}</td>
                                                        <td className="px-2 py-3 text-center text-zinc-400">{row.goalsFor}</td>
                                                        <td className="px-2 py-3 text-center text-zinc-400">{row.goalsAgainst}</td>
                                                        <td className="px-2 py-3 text-center font-bold text-theme-primary bg-white/5">{row.points}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {row.form.map((f, i) => (
                                                                    <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${getFormBadgeColor(f)}`}>{f}</span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAHMİNLER TAB (Predictions) */}
                            {activeTab === 'tahminler' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-center align-middle border-collapse bg-theme-main rounded-xl overflow-hidden border border-theme-subtle/50">
                                        <thead className="text-[10px] sm:text-xs font-black bg-[#7289da] text-white uppercase tracking-widest">
                                            <tr>
                                                <th className="px-2 py-3 border-r border-[#8498df]"></th>
                                                <th className="px-4 py-3 border-r border-[#8498df]">LİG</th>
                                                <th className="px-4 py-3 text-left border-r border-[#8498df]">TAKIMLAR</th>
                                                <th className="px-4 py-3 border-r border-[#8498df]">TARİH & SAAT</th>
                                                <th className="px-3 py-3 border-r border-[#8498df]">SONUÇ</th>
                                                <th className="px-3 py-3 border-r border-[#8498df]">T.GOL</th>
                                                <th className="px-3 py-3 border-r border-[#8498df]">KG</th>
                                                <th className="px-3 py-3 border-r border-[#8498df]">EV SAHİBİ</th>
                                                <th className="px-3 py-3 border-r border-[#8498df]">DEPLASMAN</th>
                                                <th className="px-4 py-3 border-r border-[#8498df]">SKOR</th>
                                                <th className="px-4 py-3">DETAY</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y border-theme-subtle/30">
                                            {activeData.predictions?.map((pred, i) => {
                                                const isLocked = !isLoggedIn && i >= 3;
                                                if (isLocked) {
                                                    return (
                                                        <tr key={pred.id} className="relative">
                                                            <td colSpan={11} className="px-4 py-3 border-b border-zinc-800/50">
                                                                <div className="relative">
                                                                    {/* Blurred fake row */}
                                                                    <div className="flex items-center gap-4 opacity-30" style={{ filter: 'blur(4px)', userSelect: 'none' }}>
                                                                        <span className="text-zinc-500 text-xs font-black w-16">{pred.leagueSlug}</span>
                                                                         <span className="text-theme-primary text-sm font-black">{pred.homeTeam} - {pred.awayTeam}</span>
                                                                        <span className="text-zinc-400 text-xs">{pred.dateStr}</span>
                                                                        <span className="text-white font-black">{pred.resultPrediction}</span>
                                                                        <span className="text-green-500 font-bold text-xs">{pred.totalGoalsPrediction}</span>
                                                                    </div>
                                                                    {/* Overlay */}
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <button
                                                                            onClick={onLoginRequired}
                                                                            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#f0b90b] text-black font-black text-[10px] rounded-full uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_15px_rgba(240,185,11,0.3)]"
                                                                        >
                                                                            🔒 Üye Ol, Tüm Tahminleri Gör
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return (
                                                    <tr key={pred.id} className="hover:bg-theme-elevated transition-colors group">
                                                        <td className="px-2 py-3 border-r border-zinc-800/80">
                                                            <div className="flex flex-col items-center text-zinc-600 transition-colors group-hover:text-[#7289da]">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 border-r border-zinc-800/80 font-bold text-[#7289da] text-[11px] whitespace-nowrap">
                                                            {pred.leagueSlug}
                                                        </td>
                                                        <td className="px-4 py-3 text-left border-r border-zinc-800/80">
                                                            <div className="flex flex-col gap-1.5 text-[13px]">
                                                                 <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-theme-primary transition-colors group-hover:text-[#7289da]">{pred.homeTeam}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-theme-primary transition-colors group-hover:text-[#7289da]">{pred.awayTeam}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 border-r border-zinc-800/80 font-mono text-zinc-300 text-xs whitespace-nowrap">
                                                            {pred.dateStr}
                                                        </td>
                                                        <td className="px-3 py-3 border-r border-theme-subtle/30 font-black text-theme-primary text-sm">
                                                            {pred.resultPrediction}
                                                        </td>
                                                        <td className={`px-3 py-3 border-r border-zinc-800/80 font-bold text-xs ${pred.totalGoalsPrediction?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                            {pred.totalGoalsPrediction}
                                                        </td>
                                                        <td className={`px-3 py-3 border-r border-zinc-800/80 font-bold text-xs ${pred.bttsPrediction === 'Var' ? 'text-green-500' : 'text-zinc-500'}`}>
                                                            {pred.bttsPrediction}
                                                        </td>
                                                        <td className="px-3 py-3 border-r border-zinc-800/80 font-bold text-green-500 text-xs">
                                                            {pred.homePrediction}
                                                        </td>
                                                        <td className="px-3 py-3 border-r border-zinc-800/80 font-bold text-green-500 text-xs">
                                                            {pred.awayPrediction}
                                                        </td>
                                                        <td className="px-4 py-3 border-r border-zinc-800/80 font-mono text-[10px] text-zinc-400">
                                                            {pred.scorePrediction}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button className="bg-[#7289da] hover:bg-[#5b6eae] text-white px-4 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-colors shadow-sm">
                                                                Detay
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PopularLeagues;
