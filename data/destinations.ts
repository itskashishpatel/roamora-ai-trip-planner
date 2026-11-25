
export interface Destination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  bestTime: string;
  bestFor: string[];
  highlights: string[];
  images: string[];
}

export const destinations: Destination[] = [
  {
    slug: "jaipur",
    name: "Jaipur",
    country: "India",
    tagline: "The Pink City of royal heritage",
    description:
      "Discover magnificent forts, royal palaces, colourful bazaars and authentic Rajasthani culture.",
    bestTime: "October to March",
    bestFor: ["Heritage", "Architecture", "Culture", "Shopping"],
    highlights: [
      "Amber Fort",
      "Hawa Mahal",
      "City Palace",
      "Jantar Mantar",
      "Johari Bazaar",
    ],
    images: [
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    tagline: "Coastal escapes and laid-back days",
    description:
      "Explore beautiful beaches, Portuguese architecture, lively markets and memorable coastal experiences.",
    bestTime: "November to February",
    bestFor: ["Beaches", "Food", "Nightlife", "Relaxation"],
    highlights: [
      "Baga Beach",
      "Palolem Beach",
      "Fort Aguada",
      "Old Goa",
      "Anjuna Flea Market",
    ],
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "manali",
    name: "Manali",
    country: "India",
    tagline: "Find your escape in the Himalayas",
    description:
      "Experience mountain landscapes, pine forests, scenic valleys and adventurous outdoor activities.",
    bestTime: "March to June and December to February",
    bestFor: ["Mountains", "Adventure", "Nature", "Snow"],
    highlights: [
      "Solang Valley",
      "Old Manali",
      "Hadimba Temple",
      "Atal Tunnel",
      "Jogini Waterfall",
    ],
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    tagline: "Tropical beauty, temples and island life",
    description:
      "Discover lush rice terraces, ancient temples, tropical beaches and Bali's vibrant café culture.",
    bestTime: "April to October",
    bestFor: ["Beaches", "Culture", "Nature", "Couples"],
    highlights: [
      "Uluwatu Temple",
      "Ubud Rice Terraces",
      "Mount Batur",
      "Nusa Penida",
      "Seminyak",
    ],
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    tagline: "Whitewashed villages and Aegean sunsets",
    description:
      "Wander through beautiful villages, enjoy seaside dining and admire spectacular sunset views.",
    bestTime: "April to October",
    bestFor: ["Couples", "Photography", "Beaches", "Luxury"],
    highlights: [
      "Oia",
      "Fira",
      "Red Beach",
      "Akrotiri",
      "Skaros Rock",
    ],
    images: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    tagline: "A timeless journey through Japanese culture",
    description:
      "Explore traditional streets, peaceful gardens, bamboo forests and historic Japanese shrines.",
    bestTime: "March to May and October to November",
    bestFor: ["Culture", "History", "Photography", "Nature"],
    highlights: [
      "Fushimi Inari Shrine",
      "Arashiyama Bamboo Grove",
      "Kinkaku-ji",
      "Gion District",
      "Kiyomizu-dera",
    ],
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    tagline: "Iconic landmarks and endless discoveries",
    description:
      "Explore world-famous landmarks, royal parks, fascinating museums and an extraordinary food scene.",
    bestTime: "May to September",
    bestFor: ["City breaks", "History", "Shopping", "Food"],
    highlights: [
      "Big Ben",
      "Tower Bridge",
      "Buckingham Palace",
      "Hyde Park",
      "British Museum",
    ],
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    tagline: "Alpine villages, lakes and mountain adventures",
    description:
      "Experience dramatic mountain scenery, crystal-clear lakes, scenic railways and picturesque villages.",
    bestTime: "June to September and December to March",
    bestFor: ["Mountains", "Adventure", "Nature", "Photography"],
    highlights: [
      "Jungfraujoch",
      "Lauterbrunnen",
      "Grindelwald",
      "Lake Brienz",
      "Matterhorn",
    ],
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    tagline: "An island escape surrounded by turquoise waters",
    description:
      "Relax on white-sand beaches, explore coral reefs and enjoy peaceful island experiences.",
    bestTime: "November to April",
    bestFor: ["Beaches", "Couples", "Luxury", "Relaxation"],
    highlights: [
      "Malé",
      "Maafushi",
      "Banana Reef",
      "Vaadhoo Island",
      "South Ari Atoll",
    ],
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    tagline: "Where cultures and continents come together",
    description:
      "Discover historic mosques, lively bazaars, beautiful architecture and Bosphorus waterfront views.",
    bestTime: "April to May and September to November",
    bestFor: ["History", "Culture", "Food", "Architecture"],
    highlights: [
      "Hagia Sophia",
      "Blue Mosque",
      "Grand Bazaar",
      "Topkapi Palace",
      "Bosphorus",
    ],
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    tagline: "A colourful world of souks and courtyards",
    description:
      "Explore vibrant markets, intricate architecture, traditional courtyards and Moroccan cuisine.",
    bestTime: "March to May and September to November",
    bestFor: ["Culture", "Shopping", "Food", "Photography"],
    highlights: [
      "Jemaa el-Fnaa",
      "Bahia Palace",
      "Majorelle Garden",
      "Medina",
      "Koutoubia Mosque",
    ],
    images: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    tagline: "Harbour views and spectacular coastal walks",
    description:
      "Admire iconic harbour landmarks, relax on famous beaches and discover beautiful coastal trails.",
    bestTime: "September to November and March to May",
    bestFor: ["Beaches", "City breaks", "Nature", "Food"],
    highlights: [
      "Sydney Opera House",
      "Bondi Beach",
      "Harbour Bridge",
      "Royal Botanic Garden",
      "Manly Beach",
    ],
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1523428096881-5bd79d043006?auto=format&fit=crop&w=1600&q=85",
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find(
    (destination) => destination.slug === slug.toLowerCase(),
  );
}
