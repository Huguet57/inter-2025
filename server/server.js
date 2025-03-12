const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data storage path
const DATA_PATH = path.join(__dirname, 'data');
const MATCHES_FILE = path.join(DATA_PATH, 'matches.json');
const KNOCKOUT_FILE = path.join(DATA_PATH, 'knockout.json');

// Initialize data files if they don't exist
const initializeData = async () => {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    
    // Check if matches file exists
    try {
      await fs.access(MATCHES_FILE);
      console.log('Matches data file exists');
    } catch (error) {
      console.log('Matches data file not found, run "node initData.js" to create it');
      throw new Error('Matches data file not found');
    }
    
    // Check if knockout file exists
    try {
      await fs.access(KNOCKOUT_FILE);
      console.log('Knockout data file exists');
    } catch (error) {
      console.log('Knockout data file not found, run "node initData.js" to create it');
      throw new Error('Knockout data file not found');
    }
  } catch (error) {
    console.error('Error checking data files:', error);
    process.exit(1);
  }
};

// API Endpoints

// Get all group matches
app.get('/api/matches', async (req, res) => {
  try {
    const data = await fs.readFile(MATCHES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading matches:', error);
    res.status(500).json({ error: 'Failed to read matches' });
  }
});

// Update a group match
app.put('/api/matches/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const updates = req.body;
    
    const data = await fs.readFile(MATCHES_FILE, 'utf8');
    const matches = JSON.parse(data);
    
    if (index < 0 || index >= matches.length) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Check if we should explicitly clear scores
    // This handles both cases:
    // 1. When isPlaying is false and scores are missing from updates
    // 2. When scores are explicitly set to null or undefined in the request
    if ((updates.isPlaying === false && !('score1' in updates) && !('score2' in updates)) ||
        updates.score1 === null || updates.score2 === null) {
      updates.score1 = null;
      updates.score2 = null;
    }
    
    matches[index] = { ...matches[index], ...updates };
    
    // Clean up null values if we still need to preserve them in the data file
    if (matches[index].score1 === null) matches[index].score1 = undefined;
    if (matches[index].score2 === null) matches[index].score2 = undefined;
    
    await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2));
    
    res.json(matches[index]);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

// Get all knockout matches
app.get('/api/knockout', async (req, res) => {
  try {
    const data = await fs.readFile(KNOCKOUT_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading knockout matches:', error);
    res.status(500).json({ error: 'Failed to read knockout matches' });
  }
});

// Update a knockout match
app.put('/api/knockout/:round/:index', async (req, res) => {
  try {
    const { round, index } = req.params;
    const updates = req.body;
    const idx = parseInt(index);
    
    const data = await fs.readFile(KNOCKOUT_FILE, 'utf8');
    const knockoutMatches = JSON.parse(data);
    
    // Check if we should explicitly clear scores
    // This handles both cases:
    // 1. When isPlaying is false and scores are missing from updates
    // 2. When scores are explicitly set to null or undefined in the request
    if ((updates.isPlaying === false && !('score1' in updates) && !('score2' in updates)) ||
        updates.score1 === null || updates.score2 === null) {
      updates.score1 = null;
      updates.score2 = null;
    }
    
    if (round === 'thirdPlace' || round === 'final') {
      knockoutMatches[round] = { ...knockoutMatches[round], ...updates };
      
      // Clean up null values
      if (knockoutMatches[round].score1 === null) knockoutMatches[round].score1 = undefined;
      if (knockoutMatches[round].score2 === null) knockoutMatches[round].score2 = undefined;
    } else {
      if (!knockoutMatches[round] || idx < 0 || idx >= knockoutMatches[round].length) {
        return res.status(404).json({ error: 'Match not found' });
      }
      knockoutMatches[round][idx] = { ...knockoutMatches[round][idx], ...updates };
      
      // Clean up null values
      if (knockoutMatches[round][idx].score1 === null) knockoutMatches[round][idx].score1 = undefined;
      if (knockoutMatches[round][idx].score2 === null) knockoutMatches[round][idx].score2 = undefined;
    }
    
    await fs.writeFile(KNOCKOUT_FILE, JSON.stringify(knockoutMatches, null, 2));
    
    res.json(knockoutMatches);
  } catch (error) {
    console.error('Error updating knockout match:', error);
    res.status(500).json({ error: 'Failed to update knockout match' });
  }
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Initialize data and start server
initializeData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize server:', err);
  }); 