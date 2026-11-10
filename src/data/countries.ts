export interface City {
  id: string
  name: string
  members: number
}

export interface Country {
  code: string
  name: string
  cities: City[]
  members: number
}

export const countries: Country[] = [
  {
    code: 'PT',
    name: 'Portugal',
    members: 18400,
    cities: [
      { id: 'lisbon', name: 'Lisbonne', members: 6800 },
      { id: 'porto', name: 'Porto', members: 4100 },
      { id: 'coimbra', name: 'Coimbra', members: 1600 },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    members: 42300,
    cities: [
      { id: 'paris', name: 'Paris', members: 18500 },
      { id: 'lyon', name: 'Lyon', members: 6200 },
      { id: 'marseille', name: 'Marseille', members: 3900 },
    ],
  },
  {
    code: 'SN',
    name: 'Sénégal',
    members: 9700,
    cities: [
      { id: 'dakar', name: 'Dakar', members: 5400 },
      { id: 'saint-louis', name: 'Saint-Louis', members: 920 },
    ],
  },
  {
    code: 'CI',
    name: "Côte d’Ivoire",
    members: 8100,
    cities: [
      { id: 'abidjan', name: 'Abidjan', members: 5300 },
      { id: 'bouake', name: 'Bouaké', members: 860 },
    ],
  },
  {
    code: 'MA',
    name: 'Maroc',
    members: 14600,
    cities: [
      { id: 'casablanca', name: 'Casablanca', members: 6200 },
      { id: 'rabat', name: 'Rabat', members: 3700 },
    ],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    members: 32700,
    cities: [
      { id: 'lagos', name: 'Lagos', members: 15800 },
      { id: 'abuja', name: 'Abuja', members: 6400 },
    ],
  },
  {
    code: 'KE',
    name: 'Kenya',
    members: 13200,
    cities: [
      { id: 'nairobi', name: 'Nairobi', members: 8900 },
      { id: 'mombasa', name: 'Mombasa', members: 1900 },
    ],
  },
  {
    code: 'ZA',
    name: 'Afrique du Sud',
    members: 21900,
    cities: [
      { id: 'cape-town', name: 'Le Cap', members: 8500 },
      { id: 'johannesburg', name: 'Johannesburg', members: 7900 },
    ],
  },
  {
    code: 'BR',
    name: 'Brésil',
    members: 38600,
    cities: [
      { id: 'sao-paulo', name: 'São Paulo', members: 17200 },
      { id: 'rio', name: 'Rio de Janeiro', members: 8300 },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    members: 28500,
    cities: [
      { id: 'montreal', name: 'Montréal', members: 9700 },
      { id: 'toronto', name: 'Toronto', members: 11200 },
    ],
  },
]
