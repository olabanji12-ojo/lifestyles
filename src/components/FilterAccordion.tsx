// src/components/FilterAccordion.tsx

import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import FilterAccordionItem from './FilterAccordionItem';
import { CATEGORY_DATA } from '../data/categoryData';

// Constants for URL filtering
const FILTER_PARAM_KEY = 'sub';
const PRICE_PARAM_KEY = 'price';

export default function FilterAccordion() {
  // 1. Get the current main category ID from the URL (expected from the /shop route)
  // We assume the Shop Page URL is structured like /shop?category=fashion
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategoryId = searchParams.get('category') || 'all'; 

  // 2. Find the relevant category data
  const currentCategory = CATEGORY_DATA.find(cat => cat.id === currentCategoryId);
  
  // Get currently active sub-category filter from URL
  const activeSubFilter = searchParams.get(FILTER_PARAM_KEY);

  // --- Filtering Logic ---
  const handleFilterChange = (subId: string) => {
    // If the selected filter is already active, remove it (toggle off)
    if (activeSubFilter === subId) {
      searchParams.delete(FILTER_PARAM_KEY);
    } else {
      // Set the new filter
      searchParams.set(FILTER_PARAM_KEY, subId);
    }
    setSearchParams(searchParams);
  };

  // --- Price Logic (Placeholder for future development) ---
  const handlePriceChange = (min: number, max: number) => {
      // Logic to set the price filter, e.g., price=100-200
      searchParams.set(PRICE_PARAM_KEY, `${min}-${max}`);
      setSearchParams(searchParams);
  };
  

  return (
    <div className="w-full">
      <h3 className="text-xl font-handwritten text-gray-900 mb-6 border-b pb-4">
        Filter Results
      </h3>

      {/* --------------------------------- */}
      {/* 1. Sub-Category Filter (Dynamic)  */}
      {/* --------------------------------- */}
      <FilterAccordionItem title="Sub-Category" defaultOpen={true}>
        {/* If a category is found, map its sub-categories */}
        {currentCategory?.subCategories.map((sub) => (
          <div key={sub.subId} className="flex items-center mb-2">
            <input
              id={`filter-${sub.subId}`}
              type="checkbox"
              // Checked state determined by URL search params
              checked={activeSubFilter === sub.subId}
              onChange={() => handleFilterChange(sub.subId)}
              className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <label
              htmlFor={`filter-${sub.subId}`}
              className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
            >
              {sub.title}
            </label>
          </div>
        ))}
        
        {/* Fallback/Default for "all" products */}
        {!currentCategory && (
            <p className="text-sm text-gray-500">Filters available after selecting a collection.</p>
        )}
      </FilterAccordionItem>


      {/* --------------------------------- */}
      {/* 2. Price Range Filter (Placeholder) */}
      {/* --------------------------------- */}
      <FilterAccordionItem title="Price Range">
        {/* In a real application, this section would contain a dual-handle slider component.
          For now, we use simple buttons/inputs as a placeholder.
        */}
        <div className="space-y-2">
            <button 
                onClick={() => handlePriceChange(0, 50)}
                className="w-full text-left text-sm text-gray-600 hover:text-yellow-600"
            >
                Under $50
            </button>
            <button 
                onClick={() => handlePriceChange(50, 200)}
                className="w-full text-left text-sm text-gray-600 hover:text-yellow-600"
            >
                $50 - $200
            </button>
            <button 
                onClick={() => handlePriceChange(200, 10000)}
                className="w-full text-left text-sm text-gray-600 hover:text-yellow-600"
            >
                $200+
            </button>
        </div>
      </FilterAccordionItem>
      
      {/* Add more filter items here (e.g., Color, Material) */}
      <FilterAccordionItem title="Color">
        <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-full bg-black border border-gray-300 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-white border border-gray-300 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-yellow-600 border border-gray-300 cursor-pointer"></div>
        </div>
      </FilterAccordionItem>
    </div>
  );
}