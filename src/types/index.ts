export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  console: string;
  generation: number;
  releaseDate: string;
  category: 'new' | 'popular';
  inStock: boolean;
  rating: number;
  features: string[];
  priceCategory: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterOptions {
  priceRange: string[];
  generation: number[];
  category: string[];
  inStock: boolean;
}