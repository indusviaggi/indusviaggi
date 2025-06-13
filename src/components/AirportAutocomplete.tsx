import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface AirportAutocompleteProps {
  label: string;
  value: string;
  options: Option[];
  showDropdown: boolean;
  error: string | null;
  empty: boolean;
  onInputChange: (value: string) => void;
  onSelect: (option: Option) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  label,
  value,
  options,
  showDropdown,
  error,
  empty,
  onInputChange,
  onSelect,
  onFocus,
  onBlur,
}) => (
  <div className="relative w-full md:w-40 min-w-[120px]">
    <input
      type="text"
      placeholder={label}
      value={value}
      autoComplete="off"
      onChange={e => onInputChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      className="p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 w-full"
    />
    {showDropdown && (
      <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
        {error && (
          <li className="px-4 py-2 text-red-600">{error}</li>
        )}
        {empty && !error && (
          <li className="px-4 py-2 text-gray-500">Nessun risultato trovato</li>
        )}
        {options.map((option) => (
          <li
            key={option.value}
            className="px-4 py-2 cursor-pointer hover:bg-gold-100"
            onMouseDown={() => onSelect(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default AirportAutocomplete;
