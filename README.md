# Torneig Futbol - Tournament Management App

A tournament management application for tracking matches, scores, and tournament progress. The application now includes a simple REST API to maintain data across all visitors.

## Features

- Group stage match tracking
- Knockout stage progression
- Real-time score updates
- Persistent data storage via API
- Multiple concurrent users can view and update match data

## Project Structure

- `/src` - React frontend application
- `/server` - Express API server for data persistence

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Running the Application

You need to run both the frontend and the API server:

#### Start the API server:

```bash
# From the project root directory
cd server
npm run dev
```

The server will start on port 3001.

#### Start the frontend development server:

```bash
# From the project root directory (in a separate terminal)
npm run dev
```

The frontend will start on port 5173 and automatically proxy API requests to the server.

## API Endpoints

The application uses the following API endpoints:

- `GET /api/matches` - Get all group matches
- `PUT /api/matches/:index` - Update a group match
- `GET /api/knockout` - Get all knockout matches
- `PUT /api/knockout/:round/:index` - Update a knockout match

## Development

The application uses:

- React with TypeScript
- Vite for the development environment
- Express for the API server
- File-based storage for persistence

## License

MIT 