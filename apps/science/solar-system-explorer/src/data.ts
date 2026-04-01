export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon';
  distanceAU: string;
  distanceKm: string;
  mass: string;
  gradient: string;
  size: number;
  description: string;
  moons?: CelestialBody[];
  totalKnownMoons?: number;
}

export const solarSystem: CelestialBody[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    distanceAU: '0',
    distanceKm: '0',
    mass: '333,000 Earths',
    gradient: 'from-yellow-300 via-yellow-500 to-orange-600',
    size: 280,
    description: 'The big hot star at the center of our solar system! It gives us light and keeps us warm.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    distanceAU: '0.39',
    distanceKm: '57.9 million',
    mass: '0.05 Earths',
    gradient: 'from-gray-300 to-gray-600',
    size: 120,
    description: 'The smallest planet and the closest to the Sun. It zooms around very fast!',
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    distanceAU: '0.72',
    distanceKm: '108.2 million',
    mass: '0.81 Earths',
    gradient: 'from-orange-200 to-orange-400',
    size: 160,
    description: 'The hottest planet! It is covered in thick, yellowish clouds.',
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    distanceAU: '1.00',
    distanceKm: '149.6 million',
    mass: '1 Earth',
    gradient: 'from-blue-400 via-blue-500 to-green-500',
    size: 165,
    description: 'Our home! It has water, air, and lots of life.',
    totalKnownMoons: 1,
    moons: [
      {
        id: 'moon',
        name: 'The Moon',
        type: 'moon',
        distanceAU: '1.00',
        distanceKm: '149.6 million',
        mass: '0.01 Earths',
        gradient: 'from-gray-200 to-gray-400',
        size: 80,
        description: "Earth's only natural satellite. We can see it shining at night!",
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    distanceAU: '1.52',
    distanceKm: '227.9 million',
    mass: '0.11 Earths',
    gradient: 'from-red-400 to-red-700',
    size: 140,
    description: 'The Red Planet! It has huge volcanoes and deep canyons.',
    totalKnownMoons: 2,
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        type: 'moon',
        distanceAU: '1.52',
        distanceKm: '227.9 million',
        mass: 'Tiny! (Like a mountain)',
        gradient: 'from-stone-400 to-stone-600',
        size: 60,
        description: "The larger and closer of Mars' two tiny moons.",
      },
      {
        id: 'deimos',
        name: 'Deimos',
        type: 'moon',
        distanceAU: '1.52',
        distanceKm: '227.9 million',
        mass: 'Tiny! (Like a hill)',
        gradient: 'from-stone-300 to-stone-500',
        size: 50,
        description: 'The smaller and outer moon of Mars.',
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    distanceAU: '5.20',
    distanceKm: '778.5 million',
    mass: '318 Earths',
    gradient: 'from-orange-300 via-amber-600 to-orange-800',
    size: 240,
    description: 'The biggest planet! It is a giant ball of gas with a Great Red Spot.',
    totalKnownMoons: 95,
    moons: [
      {
        id: 'io',
        name: 'Io',
        type: 'moon',
        distanceAU: '5.20',
        distanceKm: '778.5 million',
        mass: '0.015 Earths',
        gradient: 'from-yellow-200 to-yellow-500',
        size: 90,
        description: 'A moon covered in active volcanoes!',
      },
      {
        id: 'europa',
        name: 'Europa',
        type: 'moon',
        distanceAU: '5.20',
        distanceKm: '778.5 million',
        mass: '0.008 Earths',
        gradient: 'from-blue-100 to-blue-300',
        size: 85,
        description: 'An icy moon that might have a hidden ocean underneath.',
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        type: 'moon',
        distanceAU: '5.20',
        distanceKm: '778.5 million',
        mass: '0.025 Earths',
        gradient: 'from-gray-300 to-gray-500',
        size: 100,
        description: 'The largest moon in the whole solar system!',
      },
      {
        id: 'callisto',
        name: 'Callisto',
        type: 'moon',
        distanceAU: '5.20',
        distanceKm: '778.5 million',
        mass: '0.018 Earths',
        gradient: 'from-stone-400 to-stone-700',
        size: 95,
        description: 'A very old moon covered in lots and lots of craters.',
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    distanceAU: '9.58',
    distanceKm: '1.43 billion',
    mass: '95 Earths',
    gradient: 'from-yellow-100 to-yellow-400',
    size: 220,
    description: 'Famous for its beautiful, big rings made of ice and rock!',
    totalKnownMoons: 146,
    moons: [
      {
        id: 'titan',
        name: 'Titan',
        type: 'moon',
        distanceAU: '9.58',
        distanceKm: '1.43 billion',
        mass: '0.022 Earths',
        gradient: 'from-orange-200 to-orange-500',
        size: 100,
        description: 'A huge moon with a thick, hazy atmosphere.',
      },
      {
        id: 'enceladus',
        name: 'Enceladus',
        type: 'moon',
        distanceAU: '9.58',
        distanceKm: '1.43 billion',
        mass: 'Tiny! (Like a small country)',
        gradient: 'from-white to-blue-100',
        size: 70,
        description: 'An icy moon that shoots water out into space!',
      },
      {
        id: 'mimas',
        name: 'Mimas',
        type: 'moon',
        distanceAU: '9.58',
        distanceKm: '1.43 billion',
        mass: 'Tiny! (Like a mountain)',
        gradient: 'from-gray-300 to-gray-400',
        size: 65,
        description: 'A moon with a giant crater that makes it look like the Death Star!',
      },
      {
        id: 'iapetus',
        name: 'Iapetus',
        type: 'moon',
        distanceAU: '9.58',
        distanceKm: '1.43 billion',
        mass: '0.0003 Earths',
        gradient: 'from-stone-200 to-stone-800',
        size: 80,
        description: 'A two-toned moon that is light on one side and dark on the other.',
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    distanceAU: '19.22',
    distanceKm: '2.87 billion',
    mass: '14.5 Earths',
    gradient: 'from-cyan-200 to-cyan-500',
    size: 190,
    description: 'An ice giant that spins on its side like a rolling barrel!',
    totalKnownMoons: 28,
    moons: [
      {
        id: 'titania',
        name: 'Titania',
        type: 'moon',
        distanceAU: '19.22',
        distanceKm: '2.87 billion',
        mass: '0.0005 Earths',
        gradient: 'from-gray-300 to-gray-500',
        size: 80,
        description: 'The largest moon of Uranus.',
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    distanceAU: '30.05',
    distanceKm: '4.50 billion',
    mass: '17 Earths',
    gradient: 'from-blue-500 to-blue-800',
    size: 185,
    description: 'The farthest planet! It is very dark, cold, and windy.',
    totalKnownMoons: 16,
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        type: 'moon',
        distanceAU: '30.05',
        distanceKm: '4.50 billion',
        mass: '0.003 Earths',
        gradient: 'from-teal-100 to-teal-300',
        size: 85,
        description: 'A cold moon that orbits backwards compared to the planet!',
      }
    ]
  }
];
