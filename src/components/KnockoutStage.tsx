import React from 'react';
import { knockoutMatches } from '../data/tournament';

export const KnockoutStage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Vuitens de final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knockoutMatches.roundOf16.map((match, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{match.time}</p>
              <p>Pista {match.field}</p>
              <p>{match.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Quarts de final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knockoutMatches.quarterFinals.map((match, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{match.time}</p>
              <p>Pista {match.field}</p>
              <p>{match.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Semifinals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knockoutMatches.semiFinals.map((match, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{match.time}</p>
              <p>Pista {match.field}</p>
              <p>{match.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-4">3r i 4t lloc</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-semibold">{knockoutMatches.thirdPlace.time}</p>
            <p>Pista {knockoutMatches.thirdPlace.field}</p>
            <p>{knockoutMatches.thirdPlace.description}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Final</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="font-semibold">{knockoutMatches.final.time}</p>
            <p>Pista {knockoutMatches.final.field}</p>
            <p>{knockoutMatches.final.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};