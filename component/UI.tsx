//component/UI.tsx

"use client";
import { useState, useEffect } from "react";
import { Clock, ChevronDown, Search } from "lucide-react";

// ============================================================================
// SHARED UI COMPONENT TYPES
// ============================================================================

interface SelectDropdownProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

interface AutocompleteInputProps {
  value: string;
  placeholder?: string;
  suggestions?: string[];
  onChange: (value: string) => void;
}

interface ProductSearchSelectProps {
  products?: string[];
  initialValue?: string;
  onSelect: (value: string) => void;
}

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

export const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white text-left flex items-center justify-between"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="text-black w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm border-b border-gray-100 last:border-0"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const AutocompleteInput = ({
  value,
  onChange,
  placeholder,
  suggestions = [],
}: AutocompleteInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s !== value
  );

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="text-black w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
      />

      {showSuggestions && filteredSuggestions.length > 0 && value && (
        <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-40 overflow-auto">
          {filteredSuggestions.slice(0, 5).map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm flex items-center gap-2 border-b border-gray-100 last:border-0"
            >
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate text-black">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductSearchSelect = ({
  onSelect,
  initialValue = "",
  products = [],
}: ProductSearchSelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<string>(initialValue);

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  const filteredProducts = products.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (product: string) => {
    setSelected(product);
    setSearch("");
    setIsOpen(false);
    onSelect(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      handleSelect(
        filteredProducts.length === 0
          ? search.trim()
          : filteredProducts[0]
      );
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : selected}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or add product..."
          className="text-black w-full px-3 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(product)}
                  className="text-black w-full px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm border-b border-gray-100 last:border-0"
                >
                  {product}
                </button>
              ))
            ) : search.trim() ? (
              <button
                onClick={() => handleSelect(search.trim())}
                className="w-full px-4 py-3 text-left hover:bg-green-50 active:bg-green-100 transition-colors text-sm text-green-600 font-semibold"
              >
                ✓ Add "{search}"
              </button>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                Type to search or add product...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
