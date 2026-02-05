// Major world cities for autocomplete (includes landmark cities + additional major cities)
// Updated to use Array.from for TypeScript compatibility
// Trigger Vercel deployment
import { landmarks } from './landmarks';

const landmarkCities = Array.from(new Set(landmarks.map(l => l.city)));

const majorCities = [
  'Amsterdam', 'Athens', 'Auckland', 'Bangkok', 'Berlin', 'Boston', 'Brussels',
  'Buenos Aires', 'Cairo', 'Cape Town', 'Chicago', 'Copenhagen', 'Delhi',
  'Dublin', 'Edinburgh', 'Hamburg', 'Hong Kong', 'Istanbul', 'Jakarta',
  'Johannesburg', 'Kuala Lumpur', 'Lisbon', 'Madrid', 'Melbourne', 'Mexico City',
  'Miami', 'Montreal', 'Moscow', 'Mumbai', 'Munich', 'Oslo', 'Philadelphia',
  'Phoenix', 'Portland', 'Prague', 'Reykjavik', 'Seoul', 'Shanghai', 'Singapore',
  'Stockholm', 'Taipei', 'Tel Aviv', 'Tokyo', 'Toronto', 'Vancouver', 'Vienna',
  'Warsaw', 'Washington D.C.', 'Zurich', 'Adelaide', 'Albuquerque', 'Austin',
  'Baltimore', 'Birmingham', 'Bogotá', 'Brisbane', 'Budapest', 'Calgary',
  'Charlotte', 'Cincinnati', 'Colombo', 'Columbus', 'Dallas', 'Denver',
  'Detroit', 'Doha', 'Düsseldorf', 'Frankfurt', 'Geneva', 'Glasgow',
  'Hanoi', 'Helsinki', 'Houston', 'Indianapolis', 'Kansas City', 'Lagos',
  'Las Vegas', 'Lima', 'Lyon', 'Manchester', 'Manila', 'Marseille',
  'Minneapolis', 'Nashville', 'New Orleans', 'Nice', 'Orlando', 'Ottawa',
  'Perth', 'Pittsburgh', 'Porto', 'Quebec City', 'Riyadh', 'Rome',
  'Rotterdam', 'San Diego', 'San Jose', 'Santiago', 'São Paulo', 'Seattle',
  'St. Louis', 'Stuttgart', 'Sydney', 'Tampa', 'Tbilisi', 'Tehran',
  'Tijuana', 'Toulouse', 'Valencia', 'Venice', 'Vienna', 'Winnipeg',
];

export const cities = Array.from(new Set([...landmarkCities, ...majorCities])).sort((a, b) => a.localeCompare(b));
