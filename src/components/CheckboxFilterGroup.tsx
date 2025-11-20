// src/components/CheckboxFilterGroup.tsx

import React from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface CheckboxFilterGroupProps {
  options: FilterOption[];
  selectedFilters: string[];
  onToggle: (id: string) => void;
}

export default function CheckboxFilterGroup({
  options,
  selectedFilters,
  onToggle,
}: CheckboxFilterGroupProps) {
  return (
    <div className="space-y-3 pt-1">
      {options.map(option => (
        <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={selectedFilters.includes(option.id)}
            onChange={() => onToggle(option.id)}
            // Applying elegant, tailored styling for the checkbox
            className="w-4 h-4 border-gray-400 rounded-sm appearance-none checked:bg-yellow-600 checked:border-yellow-600 border-2 focus:ring-yellow-600 focus:ring-1 focus:outline-none transition-colors duration-150"
            style={{ 
                // Custom checkmark styling for better control
                backgroundImage: selectedFilters.includes(option.id) 
                    ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` 
                    : 'none',
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
          />
          <span className="text-gray-700 text-sm group-hover:text-yellow-600 transition-colors">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}