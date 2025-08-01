import { Product } from '../types';

// Sort products by price (lowest to highest)
export const products: Product[] = [
  {
    id: '13',
    name: 'Pokemon Mystery Dungeon: Rescue Team DX',
    price: 5,
    image: '/Pokemon Snap .jpeg',
    description: 'Experience the beloved Pokemon Mystery Dungeon adventure! Transform into a Pokemon and explore mysterious dungeons with friends.',
    console: 'Nintendo Switch',
    generation: 7,
    releaseDate: '2020-03-06',
    category: 'popular',
    inStock: true,
    rating: 4.1,
    features: ['Mystery Dungeon', 'Transform into Pokemon', 'Dungeon Exploration', 'Classic Remake'],
    priceCategory: '$5-$10'
  },
  {
    id: '12',
    name: 'Pokken Tournament DX',
    price: 15,
    image: '/Pokken Tournament DX.jpeg',
    description: 'The ultimate Pokemon fighting game! Battle with your favorite Pokemon in intense 3D combat with enhanced mechanics.',
    console: 'Nintendo Switch',
    generation: 7,
    releaseDate: '2017-09-22',
    category: 'popular',
    inStock: true,
    rating: 4.2,
    features: ['Fighting Game', '3D Combat', 'Tournament Mode', 'Multiple Pokemon'],
    priceCategory: '$10-$20'
  },
  {
    id: '1',
    name: 'Detective Pikachu Returns',
    price: 25,
    image: '/Detective Pikachu Returns.jpeg',
    description: 'Join Detective Pikachu in this thrilling mystery adventure! Solve cases and uncover secrets in Ryme City with your electric partner.',
    console: 'Nintendo Switch',
    generation: 8,
    releaseDate: '2023-10-06',
    category: 'new',
    inStock: true,
    rating: 4.5,
    features: ['Mystery Adventure', 'Detective Gameplay', 'Pikachu Partner', 'Story-Rich Experience'],
    priceCategory: '$20-$30'
  },
  {
    id: '5',
    name: "Pokemon Let's Go Pikachu",
    price: 35,
    image: "/Pokemon Let's Go Pikachu.jpeg",
    description: 'Return to the Kanto region with Pikachu as your partner! Connect with Pokemon GO and enjoy simplified mechanics.',
    console: 'Nintendo Switch',
    generation: 7,
    releaseDate: '2018-11-16',
    category: 'popular',
    inStock: true,
    rating: 4.4,
    features: ['Kanto Region', 'Pokemon GO Integration', 'Simplified Mechanics', 'Co-op Play'],
    priceCategory: '$30-$40'
  },
  {
    id: '14',
    name: "Pokemon Let's Go Eevee",
    price: 35,
    image: "/Pokemon Let's Go Eevee.jpeg",
    description: 'Explore the Kanto region with Eevee as your adorable partner! Connect with Pokemon GO and enjoy simplified catching mechanics.',
    console: 'Nintendo Switch',
    generation: 7,
    releaseDate: '2018-11-16',
    category: 'popular',
    inStock: true,
    rating: 4.4,
    features: ['Kanto Region', 'Eevee Partner', 'Pokemon GO Integration', 'Co-op Play'],
    priceCategory: '$30-$40'
  },
  {
    id: '8',
    name: 'New Pokemon Snap',
    price: 40,
    image: '/Pokemon Snap .jpeg',
    description: 'Capture the perfect Pokemon photos in their natural habitats! Explore beautiful islands and discover Pokemon behaviors.',
    console: 'Nintendo Switch',
    generation: 8,
    releaseDate: '2021-04-30',
    category: 'popular',
    inStock: true,
    rating: 4.5,
    features: ['Photography Gameplay', 'Beautiful Environments', 'Pokemon Behaviors', 'Creative Mode'],
    priceCategory: '$35-$45'
  },
  {
    id: '2',
    name: 'Pokemon Brilliant Diamond',
    price: 45,
    image: '/pokemon brilliant diamond.jpeg',
    description: 'Experience the beloved Sinnoh region like never before! Enhanced graphics and modern features bring this classic to life.',
    console: 'Nintendo Switch',
    generation: 4,
    releaseDate: '2021-11-19',
    category: 'popular',
    inStock: true,
    rating: 4.3,
    features: ['Sinnoh Region', 'Enhanced Graphics', 'Elite Four Challenge', 'Underground Exploration'],
    priceCategory: '$40-$50'
  },
  {
    id: '7',
    name: 'Pokemon Shining Pearl',
    price: 50,
    image: '/Pokemon Shining Pearl.jpeg',
    description: 'The faithful remake of Pokemon Pearl with enhanced visuals and modern Pokemon mechanics!',
    console: 'Nintendo Switch',
    generation: 4,
    releaseDate: '2021-11-19',
    category: 'popular',
    inStock: true,
    rating: 4.3,
    features: ['Sinnoh Remake', 'Enhanced Visuals', 'Modern Mechanics', 'Elite Four'],
    priceCategory: '$45-$55'
  },
  {
    id: '3',
    name: 'Pokemon Legends Arceus',
    price: 55,
    image: '/pokemon legends arceus.jpeg',
    description: 'Discover the origins of the Sinnoh region in this revolutionary Pokemon experience with new catching mechanics!',
    console: 'Nintendo Switch',
    generation: 8,
    releaseDate: '2022-01-28',
    category: 'popular',
    inStock: true,
    rating: 4.7,
    features: ['Ancient Sinnoh', 'New Mechanics', 'Alpha Pokemon', 'Research Focus'],
    priceCategory: '$50-$60'
  },
  {
    id: '9',
    name: 'Pokemon Sword',
    price: 60,
    image: '/Pokemon Sword Switch.jpeg',
    description: 'Begin your journey in the Galar region! Experience Dynamax battles and discover new Pokemon in this epic adventure.',
    console: 'Nintendo Switch',
    generation: 8,
    releaseDate: '2019-11-15',
    category: 'popular',
    inStock: true,
    rating: 4.4,
    features: ['Galar Region', 'Dynamax Battles', 'Wild Area', 'Gym Challenge'],
    priceCategory: '$55-$65'
  },
  {
    id: '6',
    name: 'Pokemon Scarlet',
    price: 65,
    image: '/Pokemon Scarlet.jpeg',
    description: 'Explore the vast Paldea region in this open-world Pokemon adventure with complete freedom to explore!',
    console: 'Nintendo Switch',
    generation: 9,
    releaseDate: '2022-11-18',
    category: 'new',
    inStock: true,
    rating: 4.6,
    features: ['Open World', 'Paldea Region', 'Three Storylines', 'Co-op Multiplayer'],
    priceCategory: '$60-$70'
  },
  {
    id: '11',
    name: 'Pokemon Violet',
    price: 70,
    image: '/pokemon violet.jpeg',
    description: 'Discover the Paldea region in this open-world Pokemon adventure with three unique storylines to explore!',
    console: 'Nintendo Switch',
    generation: 9,
    releaseDate: '2022-11-18',
    category: 'new',
    inStock: true,
    rating: 4.6,
    features: ['Open World', 'Three Stories', 'Paldea Region', 'Multiplayer'],
    priceCategory: '$65-$75'
  },
  {
    id: '4',
    name: 'Pokemon Legends Z-A',
    price: 75,
    image: '/pokemon legends z-a.jpeg',
    description: 'The upcoming Pokemon Legends adventure set in the Kalos region. Pre-order now for the ultimate Pokemon experience!',
    console: 'Nintendo Switch',
    generation: 9,
    releaseDate: '2025-12-31',
    category: 'new',
    inStock: true,
    rating: 5.0,
    features: ['Kalos Region', 'Future Release', 'Legends Series', 'Pre-Order Available'],
    priceCategory: '$70-$80'
  },
  {
    id: '10',
    name: 'Pokemon Violet + The Hidden Treasure of Area Zero',
    price: 95,
    image: '/Pokemon Violet + The Hidden Treasure of Area Zero.jpeg',
    description: 'The complete Pokemon Violet experience with DLC! Explore Paldea and the mysterious Area Zero with additional content.',
    console: 'Nintendo Switch',
    generation: 9,
    releaseDate: '2022-11-18',
    category: 'new',
    inStock: true,
    rating: 4.8,
    features: ['Complete Edition', 'DLC Included', 'Area Zero', 'Extended Story'],
    priceCategory: '$90-$100'
  }
];

export const featuredProducts = products.filter(p => p.category === 'popular' || p.category === 'new').slice(0, 6);
export const newProducts = products.filter(p => p.category === 'new');
export const popularProducts = products.filter(p => p.category === 'popular');

// Debug function to check image paths
export const debugImagePaths = () => {
  console.log('🔍 Product Image Paths:');
  products.forEach(product => {
    console.log(`${product.name}: ${product.image}`);
  });
};