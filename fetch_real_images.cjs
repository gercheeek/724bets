const fs = require('fs');
const https = require('https');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'games.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Simple regex to match game objects
const gameRegex = /{\s*"id":\s*(\d+),\s*"name":\s*"([^"]+)",\s*"provider":\s*"([^"]+)",[^}]+}/g;

let matches;
const games = [];

// Since data/games.ts is exported as an array, let's just parse it directly
const { ALL_GAMES } = require('./data/games_temp.js'); // We will temporarily write it as a JS module to parse

