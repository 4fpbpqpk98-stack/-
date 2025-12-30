import React, { useState } from 'react';
import { Icons } from './Icons';
import { Category } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, activeCategory, onCategoryChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Top Row: Logo & Search */}
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onCategoryChange(Category.ALL)}>
            <div className="bg-gradient-to-tr from-teal-500 to-emerald-600 text-white p-2 rounded-lg">
              <Icons.Sparkles size={24} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight hidden sm:block">
              心理学<span className="text-teal-600">放送局</span>
            </h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="知りたい心理学トピック (例: 先延ばし癖 直し方)"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            <Icons.Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </form>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden">
            <Icons.Menu size={24} />
          </button>
        </div>

        {/* Bottom Row: Navigation (Scrollable) */}
        <nav className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide gap-1">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-teal-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};