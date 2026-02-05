# 🗺️ Landmark - Daily Landmark Guessing Game

A daily guessing game similar to Worldle and Globle, where players try to identify a landmark's home country and city based on its name and image.

## Features

- **Daily Challenge**: A new landmark is selected each day
- **Unlimited Guesses**: Take as many guesses as you need, but try to get it in as few as possible!
- **Hint System**: Get a hint revealing the continent the landmark is located in
- **Bonus Question**: After guessing the country correctly, try to identify the city
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## How to Play

1. A landmark is displayed with its name and image
2. Guess which country the landmark is located in
3. Use the hint button to reveal the continent (optional)
4. Once you guess the country correctly, a bonus question appears
5. Try to guess which city the landmark is in
6. Your total number of guesses is tracked

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - React components for the game
- `data/` - Landmark data and daily selection logic
- `types/` - TypeScript type definitions

## Adding More Landmarks

Edit `data/landmarks.ts` to add more landmarks to the database. Each landmark needs:
- `id`: Unique identifier
- `name`: Landmark name
- `country`: Country name
- `city`: City name
- `continent`: Continent name
- `imageUrl`: URL to the landmark image
- `description`: Optional description

## Technologies

- Next.js 14
- React 18
- TypeScript
- CSS Modules
