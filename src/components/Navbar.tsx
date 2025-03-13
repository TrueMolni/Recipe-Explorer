import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">Recipe Explorer</span>
          </Link>
          <Link
            to="/favorites"
            className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <Heart className="h-5 w-5" />
            <span>Favorites</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}