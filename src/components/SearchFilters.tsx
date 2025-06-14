import React, { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, RotateCcw } from 'lucide-react';

interface SearchFiltersProps {
  onSearchChange: (search: string) => void;
  onFiltersChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearchChange, onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceCategories, setSelectedPriceCategories] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const priceCategories = [
    '$5-$9', '$10-$19', '$20-$29', '$30-$39', '$40-$49', 
    '$50-$59', '$60-$69', '$70-$79', '$80-$89', '$90-$99'
  ];
  const generations = [4, 7, 8, 9];
  const categories = ['new', 'popular'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handlePriceCategoryToggle = (priceCategory: string) => {
    const updated = selectedPriceCategories.includes(priceCategory)
      ? selectedPriceCategories.filter(c => c !== priceCategory)
      : [...selectedPriceCategories, priceCategory];
    setSelectedPriceCategories(updated);
    updateFilters({ priceCategories: updated });
  };

  const handleGenerationToggle = (gen: number) => {
    const updated = selectedGenerations.includes(gen)
      ? selectedGenerations.filter(g => g !== gen)
      : [...selectedGenerations, gen];
    setSelectedGenerations(updated);
    updateFilters({ generation: updated });
  };

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    updateFilters({ category: updated });
  };

  const updateFilters = (newFilters: any) => {
    onFiltersChange({
      priceCategories: selectedPriceCategories,
      generation: selectedGenerations,
      category: selectedCategories,
      ...newFilters
    });
  };

  const clearFilters = () => {
    setSelectedPriceCategories([]);
    setSelectedGenerations([]);
    setSelectedCategories([]);
    setSearchTerm('');
    onSearchChange('');
    onFiltersChange({
      priceCategories: [],
      generation: [],
      category: []
    });
  };

  const activeFiltersCount = selectedPriceCategories.length + selectedGenerations.length + selectedCategories.length;

  return (
    <div className="bg-gray-800 comic-border rounded-2xl p-4 md:p-6 comic-shadow mb-8 
                    transform hover:scale-[1.02] transition-transform duration-300">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Pokemon games by name or description..."
          className="w-full px-4 py-3 pr-12 rounded-full comic-border 
                   comic-text font-bold text-lg focus:outline-none 
                   focus:ring-4 focus:ring-pokemon-yellow transition-all duration-300
                   bg-gray-700 text-white placeholder-gray-300"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 
                   bg-pokemon-yellow hover:bg-yellow-400 p-2 rounded-full 
                   comic-border transition-all duration-300 hover:scale-110"
        >
          <Search className="w-5 h-5 text-black" />
        </button>
      </form>

      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-pokemon-yellow hover:bg-yellow-400 
                   text-black font-bold py-2 px-4 rounded-full comic-border 
                   comic-text transition-all duration-300 hover:scale-105"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'} 
          {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 bg-pokemon-red hover:bg-red-600 
                     text-white font-bold py-2 px-4 rounded-full comic-border 
                     comic-text transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-6 border-t-2 border-pokemon-yellow pt-6 animate-bounce-in">
          {/* Price Categories */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-pokemon-red" />
              <h3 className="comic-text font-bold text-lg text-white">Price Range</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {priceCategories.map((priceCategory) => (
                <button
                  key={priceCategory}
                  onClick={() => handlePriceCategoryToggle(priceCategory)}
                  className={`px-3 py-2 rounded-full comic-border comic-text font-bold 
                           text-sm transition-all duration-300 hover:scale-105
                           ${selectedPriceCategories.includes(priceCategory)
                             ? 'bg-pokemon-yellow text-black animate-pulse'
                             : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  {priceCategory}
                </button>
              ))}
            </div>
          </div>

          {/* Generation Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-pokemon-yellow" />
              <h3 className="comic-text font-bold text-lg text-white">Generation</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {generations.map((gen) => (
                <button
                  key={gen}
                  onClick={() => handleGenerationToggle(gen)}
                  className={`w-12 h-12 rounded-full comic-border comic-text font-bold 
                           transition-all duration-300 hover:scale-105
                           ${selectedGenerations.includes(gen)
                             ? 'bg-pokemon-red text-white animate-pulse'
                             : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="comic-text font-bold text-lg mb-3 text-white">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-full comic-border comic-text font-bold 
                           text-sm transition-all duration-300 hover:scale-105 capitalize
                           ${selectedCategories.includes(category)
                             ? 'bg-pokemon-blue text-white animate-pulse'
                             : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  {category === 'new' ? '🆕 New' : '⭐ Popular'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;