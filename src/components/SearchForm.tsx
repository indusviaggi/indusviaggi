import React from 'react';
import AirportAutocomplete from '@/components/AirportAutocomplete';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Users, User, Baby } from 'lucide-react';

interface Option { label: string; value: string; }

interface SearchFormProps {
  formError: string | null;
  tripType: string;
  setTripType: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  fromValue: string;
  setFromValue: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  toValue: string;
  setToValue: (v: string) => void;
  originOptions: Option[];
  setOriginOptions: (opts: Option[]) => void;
  showOriginDropdown: boolean;
  setShowOriginDropdown: (show: boolean) => void;
  originError: string | null;
  setOriginError: (err: string | null) => void;
  originEmpty: boolean;
  setOriginEmpty: (empty: boolean) => void;
  originTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  destinationOptions: Option[];
  setDestinationOptions: (opts: Option[]) => void;
  showDestinationDropdown: boolean;
  setShowDestinationDropdown: (show: boolean) => void;
  destinationError: string | null;
  setDestinationError: (err: string | null) => void;
  destinationEmpty: boolean;
  setDestinationEmpty: (empty: boolean) => void;
  destinationTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  handleAirportInputChange: (...args: any[]) => void;
  departDate: Date;
  setDepartDate: (d: Date) => void;
  returnDate: Date | null;
  setReturnDate: (d: Date | null) => void;
  adults: number;
  setAdults: (n: number) => void;
  children: number;
  setChildren: (n: number) => void;
  infants: number;
  setInfants: (n: number) => void;
  showTravelers: boolean;
  setShowTravelers: (b: boolean) => void;
  cabinClass: string;
  setCabinClass: (v: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  cabinClasses: { id: string; label: string }[];
}

const SearchForm: React.FC<SearchFormProps> = ({
  formError, tripType, setTripType, from, setFrom, fromValue, setFromValue, to, setTo, toValue, setToValue,
  originOptions, setOriginOptions, showOriginDropdown, setShowOriginDropdown, originError, setOriginError, originEmpty, setOriginEmpty, originTimeout,
  destinationOptions, setDestinationOptions, showDestinationDropdown, setShowDestinationDropdown, destinationError, setDestinationError, destinationEmpty, setDestinationEmpty, destinationTimeout,
  handleAirportInputChange, departDate, setDepartDate, returnDate, setReturnDate, adults, setAdults, children, setChildren, infants, setInfants, showTravelers, setShowTravelers, cabinClass, setCabinClass, loading, handleSubmit, cabinClasses
}) => {
  const totalPassengers = adults + children + infants;
  return (
    <form className="flex flex-col md:flex-row md:flex-wrap items-center gap-2 mb-8 bg-white p-4 rounded-lg shadow-sm" style={{zIndex: 2}} onSubmit={handleSubmit}>
      {formError && (
        <div className="w-full mb-2 p-2 bg-red-100 text-red-700 rounded border border-red-300 text-center text-sm">
          {formError}
        </div>
      )}
      <div className="flex items-center gap-2 flex-1 min-w-[150px]">
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="tripType" value="roundtrip" checked={tripType === 'roundtrip'} onChange={() => setTripType('roundtrip')} className="sr-only" />
          <span className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${tripType === 'roundtrip' ? 'border-gold-500' : 'border-gray-300'}`}>{tripType === 'roundtrip' && <span className="w-2 h-2 rounded-full bg-gold-500" />}</span>
          <span className="text-navy-900 text-sm">Andata e Ritorno</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="tripType" value="oneway" checked={tripType === 'oneway'} onChange={() => setTripType('oneway')} className="sr-only" />
          <span className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${tripType === 'oneway' ? 'border-gold-500' : 'border-gray-300'}`}>{tripType === 'oneway' && <span className="w-2 h-2 rounded-full bg-gold-500" />}</span>
          <span className="text-navy-900 text-sm">Solo Andata</span>
        </label>
      </div>
      {/* From Autocomplete */}
      <AirportAutocomplete
        label="Da"
        value={from}
        options={originOptions}
        showDropdown={showOriginDropdown}
        error={originError}
        empty={originEmpty}
        onInputChange={value => {
          handleAirportInputChange(
            value,
            setFrom,
            setOriginOptions,
            setShowOriginDropdown,
            originTimeout,
            setOriginError,
            setOriginEmpty
          );
          setFromValue('');
        }}
        onSelect={option => {
          setFrom(option.label);
          setFromValue(option.value);
          setShowOriginDropdown(false);
        }}
        onFocus={() => {
          if (originOptions.length > 0) setShowOriginDropdown(true);
        }}
        onBlur={() => setTimeout(() => {
          setShowOriginDropdown(false);
          setOriginEmpty(false);
        }, 200)}
      />
      {/* To Autocomplete */}
      <AirportAutocomplete
        label="A"
        value={to}
        options={destinationOptions}
        showDropdown={showDestinationDropdown}
        error={destinationError}
        empty={destinationEmpty}
        onInputChange={value => {
          handleAirportInputChange(
            value,
            setTo,
            setDestinationOptions,
            setShowDestinationDropdown,
            destinationTimeout,
            setDestinationError,
            setDestinationEmpty
          );
          setToValue('');
        }}
        onSelect={option => {
          setTo(option.label);
          setToValue(option.value);
          setShowDestinationDropdown(false);
        }}
        onFocus={() => {
          if (destinationOptions.length > 0) setShowDestinationDropdown(true);
        }}
        onBlur={() => setTimeout(() => {
          setShowDestinationDropdown(false);
          setDestinationEmpty(false);
        }, 200)}
      />
      {/* Departure Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`p-2 border border-gray-200 rounded flex items-center w-full md:w-40 min-w-[150px] ${!departDate ? 'text-muted-foreground' : ''}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {departDate ? departDate.toLocaleDateString('it-IT') : <span>Partenza</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={departDate}
            onSelect={setDepartDate}
            disabled={date => date < new Date()}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {/* Return Date */}
      {tripType === 'roundtrip' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`p-2 border border-gray-200 rounded flex items-center w-full md:w-40 min-w-[150px] ${!returnDate ? 'text-muted-foreground' : ''}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate ? returnDate.toLocaleDateString('it-IT') : <span>Ritorno</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={setReturnDate}
              disabled={date => date < (departDate || new Date())}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
      {/* Travelers Popover */}
      <Popover open={showTravelers} onOpenChange={setShowTravelers}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="p-2 border border-gray-200 rounded flex items-center w-full md:w-40 min-w-[120px]"
          >
            <Users className="h-5 w-5 mr-2 text-gray-400" />
            <span>{totalPassengers} {totalPassengers === 1 ? 'Passeggero' : 'Passeggeri'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          {/* Adults */}
          <div className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center">
              <User className="h-4 w-4 text-navy-700 mr-2" />
              <span className="font-medium">Adulti</span>
            </div>
            <div className="flex items-center space-x-3">
              <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100" disabled={adults <= 1}>-</button>
              <span className="w-6 text-center">{adults}</span>
              <button type="button" onClick={() => setAdults(Math.min(9, adults + 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100" disabled={adults >= 9}>+</button>
            </div>
          </div>
          {/* Children */}
          <div className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center">
              <Baby className="h-4 w-4 text-navy-700 mr-2" />
              <span className="font-medium">Bambini</span>
            </div>
            <div className="flex items-center space-x-3">
              <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100" disabled={children <= 0}>-</button>
              <span className="w-6 text-center">{children}</span>
              <button type="button" onClick={() => setChildren(Math.min(9, children + 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100" disabled={children >= 9}>+</button>
            </div>
          </div>
          {/* Infants */}
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <Baby className="h-4 w-4 text-navy-700 mr-2" />
              <span className="font-medium">Neonati</span>
            </div>
            <div className="flex items-center space-x-3">
              <button type="button" onClick={() => setInfants(Math.max(0, infants - 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100" disabled={infants <= 0}>-</button>
              <span className="w-6 text-center">{infants}</span>
              <button type="button" onClick={() => setInfants(Math.min(9, infants + 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100" disabled={infants >= 9}>+</button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {/* Cabin Class Select */}
      <Select value={cabinClass} onValueChange={setCabinClass}>
        <SelectTrigger className="p-2 border border-gray-200 rounded w-full md:w-40 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-gold-500">
          <SelectValue placeholder="Classe" />
        </SelectTrigger>
        <SelectContent>
          {cabinClasses.map((cabinClass) => (
            <SelectItem key={cabinClass.id} value={cabinClass.id}>
              {cabinClass.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white px-4 w-full md:w-40 min-w-[120px]" disabled={loading || !fromValue || !toValue}>
        {loading ? 'Attendere...' : 'Cerca'}
      </Button>
    </form>
  );
};

export default SearchForm;
