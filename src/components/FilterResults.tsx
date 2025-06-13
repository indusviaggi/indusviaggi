import React from 'react';

interface FilterResultsProps {
  results: any[];
  price: number;
  setPrice: (v: number) => void;
  maxPrice: number;
  stops: string[];
  setStops: (v: string[]) => void;
  flightDuration: string;
  setFlightDuration: (v: string) => void;
  layoverDuration: string;
  setLayoverDuration: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}

const PRICE_MIN = 0;
const PRICE_STEP = 10;

const FilterResults: React.FC<FilterResultsProps> = ({
  results,
  price,
  setPrice,
  maxPrice,
  stops,
  setStops,
  flightDuration,
  setFlightDuration,
  layoverDuration,
  setLayoverDuration,
  sort,
  setSort,
}) => {
  const handleStopsChange = (stop: string) => {
    setStops(
      stops.includes(stop)
        ? stops.filter(s => s !== stop)
        : [...stops, stop]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold text-navy-900 mb-4">Ordina per</h3>
        <div className="space-y-2">
          <label className="flex items-center"><input type="radio" name="sort" value="price" checked={sort === 'price'} onChange={() => setSort('price')} className="mr-2" />Prezzo (dal più basso)</label>
          <label className="flex items-center"><input type="radio" name="sort" value="duration" checked={sort === 'duration'} onChange={() => setSort('duration')} className="mr-2" />Durata</label>
          <label className="flex items-center"><input type="radio" name="sort" value="departure" checked={sort === 'departure'} onChange={() => setSort('departure')} className="mr-2" />Orario di partenza</label>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-navy-900 mb-2">Prezzo massimo (€)</h4>
        <div className="flex flex-col items-center space-y-2">
          <input
            type="range"
            min={PRICE_MIN}
            max={maxPrice}
            step={PRICE_STEP}
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between w-full text-xs text-gray-700">
            <span>€{PRICE_MIN}</span>
            <span>Selezionato: <span className="font-semibold">€{price}</span></span>
            <span>€{maxPrice}</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-navy-900 mb-2">Scali</h4>
        <div className="space-y-1">
          <label className="flex items-center"><input type="checkbox" checked={stops.includes('direct')} onChange={() => handleStopsChange('direct')} className="mr-2" />Diretto</label>
          <label className="flex items-center"><input type="checkbox" checked={stops.includes('1')} onChange={() => handleStopsChange('1')} className="mr-2" />1 scalo</label>
          <label className="flex items-center"><input type="checkbox" checked={stops.includes('2+')} onChange={() => handleStopsChange('2+')} className="mr-2" />2+ scali</label>
        </div>
      </div>
    </div>
  );
};

export default FilterResults;