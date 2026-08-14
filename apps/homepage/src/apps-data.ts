import numberBusImg from './assets/number-bus.png';
import bingoBuddyImg from './assets/bingo-buddy.png';
import numberPlatePopImg from './assets/number-plate-pop.png';
import periodicExplorerImg from './assets/periodic-explorer.png';
import littleEmotesMatchImg from './assets/little-emotes-match.png';
import christmasCountdownImg from './assets/christmas-countdown-preview.png';
import patternPlaytimeImg from './assets/pattern-playtime.png';
import solarSystemExplorerImg from './assets/solar-system-explorer.png';
import simpleSumsImg from './assets/simple-sums.png';
import polyRizzemsImg from './assets/poly-rizzems.png';
import shuffleBusImg from './assets/shuffle-bus.png';
import xandersGoodChoicesImg from './assets/xanders-good-choices.png';

export interface AppInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  image?: string;
}

export const appsData: AppInfo[] = [
  {
    id: "number-bus-london",
    title: "Number Bus London",
    category: "Letters and Numbers",
    description: "A simple educational game for toddlers where they identify and type numbers on a moving London bus.",
    url: "/apps/letters-and-numbers/NumberBus/index.html",
    image: numberBusImg
  },
  {
    id: "bingo-buddy",
    title: "Bingo Buddy",
    category: "Letters and Numbers",
    description: "A colorful and interactive Bingo caller app for children with animations and voice announcements.",
    url: "/apps/letters-and-numbers/bingo-buddy/index.html",
    image: bingoBuddyImg
  },
  {
    id: "number-plate-pop",
    title: "Number Plate Pop",
    category: "Letters and Numbers",
    description: "A fun and simple number plate matching game designed for toddlers.",
    url: "/apps/letters-and-numbers/number-plate-pop/index.html",
    image: numberPlatePopImg
  },
  {
    id: "periodic-explorer",
    title: "Periodic Explorer",
    category: "Science",
    description: "An interactive periodic table explorer with detailed element information and smooth navigation.",
    url: "/apps/science/periodic-explorer/index.html",
    image: periodicExplorerImg
  },
  {
    id: "little-emotes-match",
    title: "Little Emotes Match",
    category: "Games",
    description: "A fun and simple emoji matching game for kids to help identify feelings and objects.",
    url: "/apps/games/little-emotes-match/index.html",
    image: littleEmotesMatchImg
  },
  {
    id: "christmas-countdown",
    title: "Christmas Countdown",
    category: "Games",
    description: "A festive advent calendar game where you find and type numbers in the run-up to Christmas.",
    url: "/apps/christmas/christmas-countdown/index.html",
    image: christmasCountdownImg
  },
  {
    id: "pattern-playtime",
    title: "Pattern Playtime",
    category: "Maths & Logic",
    description: "A fun and educational pattern completion game for kids featuring colorful shapes and logical puzzles.",
    url: "/apps/logic/pattern-playtime/index.html",
    image: patternPlaytimeImg
  },
  {
    id: "solar-system-explorer",
    title: "Solar System Explorer",
    category: "Science",
    description: "An educational and interactive journey through our solar system, exploring planets and moons.",
    url: "/apps/science/solar-system-explorer/index.html",
    image: solarSystemExplorerImg
  },
  {
    id: "simple-sums",
    title: "Simple Sums",
    category: "Maths & Logic",
    description: "An interactive and playful math game for kids to practice simple addition with fun shapes and colors.",
    url: "/apps/maths/simple-sums/index.html",
    image: simpleSumsImg
  },
  {
    id: "poly-rizzems",
    title: "POLYRIZZEMS",
    category: "Music",
    description: "An interactive polyrhythm visualizer with glowing bouncing faces and customizable sounds.",
    url: "/apps/music/poly-rizzems/index.html",
    image: polyRizzemsImg
  },
  {
    id: "shuffle-bus",
    title: "Shuffle Bus",
    category: "Games",
    description: "A colourful bus puzzle where kids drive matching-colour buses off the grid to board waiting passengers.",
    url: "/apps/games/shuffle-bus/index.html",
    image: shuffleBusImg
  },
  {
    id: "xanders-good-choices",
    title: "Xander's Good Choices",
    category: "Games",
    description: "An interactive decision-making quiz game for toddlers to learn good vs bad choices with fun illustrated scenarios.",
    url: "/apps/games/xanders-good-choices/index.html",
    image: xandersGoodChoicesImg
  }
];

