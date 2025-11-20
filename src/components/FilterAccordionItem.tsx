// src/components/FilterAccordionItem.tsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterAccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean; // Controls initial state
}

const GOLD_COLOR = 'text-yellow-600';

export default function FilterAccordionItem({
  title,
  children,
  defaultOpen = false,
}: FilterAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 py-4">
      {/* Accordion Header (Button) */}
      <button
        className="flex w-full items-center justify-between text-left p-0 transition-colors duration-200"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.toLowerCase().replace(/\s/g, '-')}`}
      >
        <span className="text-sm font-semibold tracking-wider uppercase text-gray-900">
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 ${GOLD_COLOR} transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        id={`accordion-content-${title.toLowerCase().replace(/\s/g, '-')}`}
        role="region"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2">
          {/* Children (Checkboxes, Price Slider, etc.) will render here */}
          {children}
        </div>
      </div>
    </div>
  );
}