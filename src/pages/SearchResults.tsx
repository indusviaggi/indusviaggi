import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Users, User, Baby } from 'lucide-react';

const cabinClasses = [
  { id: 'economy', label: 'Economy' },
  { id: 'premium_economy', label: 'Premium Economy' },
  { id: 'business', label: 'Business' },
  { id: 'first', label: 'Prima Classe' },
];

const SearchResults = () => {
  // Form state
  const [from, setFrom] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [to, setTo] = useState('');
  const [toValue, setToValue] = useState('');
  const [tripType, setTripType] = useState('roundtrip');
  const [departDate, setDepartDate] = useState(new Date('2025-06-12'));
  const [returnDate, setReturnDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('economy');
  const [showTravelers, setShowTravelers] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Airport autocomplete state and logic
  const [originOptions, setOriginOptions] = useState<any[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<any[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [originError, setOriginError] = useState<string | null>(null);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [originEmpty, setOriginEmpty] = useState(false);
  const [destinationEmpty, setDestinationEmpty] = useState(false);
  const originTimeout = useRef<NodeJS.Timeout | null>(null);
  const destinationTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchAirportOptions = async (keyword: string) => {
    if (keyword.length < 3) return { data: [], error: null, empty: false };
    try {
      // Replace with your real API endpoint
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/amadeus/locations/search?type=AIRPORT&keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) {
        return { data: [], error: `Errore di ricerca`, empty: false };
      }
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.data) && data.data.length === 0) {
          return { data: [], error: null, empty: true };
        }
        return { data: data.data, error: null, empty: false };
      } else {
        return { data: [], error: data.message || 'Errore di ricerca', empty: false };
      }
    } catch (e) {
      return { data: [], error: 'Errore di rete', empty: false };
    }
  };

  const handleAirportInputChange = (
    value: string,
    setValue: (v: string) => void,
    setOptions: (opts: any[]) => void,
    setShowDropdown: (show: boolean) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
    setError: (err: string | null) => void,
    setEmpty: (empty: boolean) => void
  ) => {
    setValue(value);
    setShowDropdown(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (value.length >= 3) {
      timeoutRef.current = setTimeout(async () => {
        const { data, error, empty } = await fetchAirportOptions(value);
        setOptions(data);
        setShowDropdown(data.length > 0 || !!error || empty);
        setError(error);
        setEmpty(empty);
      }, 300);
    } else {
      setOptions([]);
      setShowDropdown(false);
      setError(null);
      setEmpty(false);
    }
  };

  const totalPassengers = adults + children + infants;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    // Validation checks
    if (!from.trim() || !to.trim() || !departDate || (tripType === 'roundtrip' && !returnDate)) {
      setFormError('Per favore compila tutti i campi obbligatori.');
      return;
    }
    if (from.trim() === to.trim()) {
      setFormError('La partenza e la destinazione non possono essere uguali.');
      return;
    }
    const now = new Date();
    if (departDate && departDate < new Date(now.setHours(0,0,0,0))) {
      setFormError('La data di partenza non può essere nel passato.');
      return;
    }
    if (tripType === 'roundtrip' && returnDate) {
      if (returnDate < departDate) {
        setFormError('La data di ritorno deve essere dopo la partenza.');
        return;
      }
    }
    setFormError(null);
    setLoading(true);
    setResult(null);
    // Prepare payload
    const payload: any = {
      originLocationCode: fromValue,
      destinationLocationCode: toValue,
      departureDate: departDate instanceof Date ? departDate.toISOString().split('T')[0] : departDate,
      adults,
      children,
      infants,
      travelClass: cabinClass.toUpperCase(),
    };
    if (tripType === 'roundtrip' && returnDate) {
      payload.returnDate = returnDate instanceof Date ? returnDate.toISOString().split('T')[0] : returnDate;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/amadeus/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setFormError('Errore durante la ricerca voli.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setFormError('Errore di rete.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Short Search Form */}
          <form className="flex flex-col md:flex-row md:flex-wrap items-center gap-2 mb-8 bg-white p-4 rounded-lg shadow-sm" style={{zIndex: 2}} onSubmit={handleSubmit}>
            {formError && (
              <div className="w-full mb-2 p-2 bg-red-100 text-red-700 rounded border border-red-300 text-center text-sm">
                {formError}
              </div>
            )}
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="tripType" value="roundtrip" checked={tripType === 'roundtrip'} onChange={() => setTripType('roundtrip')} className="sr-only" />
                <span className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${tripType === 'roundtrip' ? 'border-gold-500' : 'border-gray-300'}`}>
                  {tripType === 'roundtrip' && <span className="w-2 h-2 rounded-full bg-gold-500" />}
                </span>
                <span className="text-navy-900 text-sm">Andata e Ritorno</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="tripType" value="oneway" checked={tripType === 'oneway'} onChange={() => setTripType('oneway')} className="sr-only" />
                <span className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${tripType === 'oneway' ? 'border-gold-500' : 'border-gray-300'}`}>
                  {tripType === 'oneway' && <span className="w-2 h-2 rounded-full bg-gold-500" />}
                </span>
                <span className="text-navy-900 text-sm">Solo Andata</span>
              </label>
            </div>
            {/* From Autocomplete */}
            <div className="relative w-full md:w-40 min-w-[120px]">
              <input
                type="text"
                placeholder="Da"
                value={from}
                autoComplete="off"
                onChange={e => handleAirportInputChange(
                  e.target.value,
                  setFrom,
                  setOriginOptions,
                  setShowOriginDropdown,
                  originTimeout,
                  setOriginError,
                  setOriginEmpty
                )}
                onFocus={() => {
                  if (originOptions.length > 0) setShowOriginDropdown(true);
                }}
                onBlur={() => setTimeout(() => {
                  setShowOriginDropdown(false);
                  setOriginEmpty(false);
                }, 200)}
                className="p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 w-full"
                required
              />
              {showOriginDropdown && (
                <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                  {originError && (
                    <li className="px-4 py-2 text-red-600">{originError}</li>
                  )}
                  {originEmpty && !originError && (
                    <li className="px-4 py-2 text-gray-500">Nessun risultato trovato</li>
                  )}
                  {originOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 cursor-pointer hover:bg-gold-100"
                      onMouseDown={() => {
                        setFrom(option.label);
                        setFromValue(option.value);
                        setShowOriginDropdown(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* To Autocomplete */}
            <div className="relative w-full md:w-40 min-w-[120px]">
              <input
                type="text"
                placeholder="A"
                value={to}
                autoComplete="off"
                onChange={e => handleAirportInputChange(
                  e.target.value,
                  setTo,
                  setDestinationOptions,
                  setShowDestinationDropdown,
                  destinationTimeout,
                  setDestinationError,
                  setDestinationEmpty
                )}
                onFocus={() => {
                  if (destinationOptions.length > 0) setShowDestinationDropdown(true);
                }}
                onBlur={() => setTimeout(() => {
                  setShowDestinationDropdown(false);
                  setDestinationEmpty(false);
                }, 200)}
                className="p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 w-full"
                required
              />
              {showDestinationDropdown && (
                <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                  {destinationError && (
                    <li className="px-4 py-2 text-red-600">{destinationError}</li>
                  )}
                  {destinationEmpty && !destinationError && (
                    <li className="px-4 py-2 text-gray-500">Nessun risultato trovato</li>
                  )}
                  {destinationOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 cursor-pointer hover:bg-gold-100"
                      onMouseDown={() => {
                        setTo(option.label);
                        setToValue(option.value);
                        setShowDestinationDropdown(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
            <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white px-4 w-full md:w-40 min-w-[120px]" disabled={loading}>
              {loading ? 'Attendere...' : 'Cerca'}
            </Button>
          </form>
           {(!loading && result) && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              Da <span className="font-semibold">{from}</span> a <span className="font-semibold">{to}</span>
            </h1>
            <p className="text-navy-600">
              <span className="font-semibold">{departDate.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {tripType === 'roundtrip' && returnDate && (
                <>
                  {' '}–{' '}
                  <span className="font-semibold">{returnDate && typeof returnDate !== 'string' ? returnDate.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                </>
              )}
              {' • '}<span className="font-semibold">{adults + children + infants} {adults + children + infants === 1 ? 'passeggero' : 'passeggeri'}</span>
              {' • '}<span className="font-semibold">{cabinClasses.find(c => c.id === cabinClass)?.label}</span>
              {' • '}<span className="font-semibold">{result.data.length} voli trovati</span>
            </p>
          </div>)}
          {/* Show sort and results only when search is finished */}
          {(!loading && result && result.data && Array.isArray(result.data)) && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-navy-900 mb-4">Sort by</h3>
                  <div className="space-y-2">
                    <label className="flex items-center"><input type="radio" name="sort" value="price" className="mr-2" />Price (Low to High)</label>
                    <label className="flex items-center"><input type="radio" name="sort" value="duration" className="mr-2" />Duration</label>
                    <label className="flex items-center"><input type="radio" name="sort" value="departure" className="mr-2" />Departure Time</label>
                  </div>
                </div>
              </div>
              <div className="lg:w-3/4">
                <div className="space-y-4">
                  {result.data.map((flight, idx) => {
                    // Get first and last segment for departure and return
                    const depSegs = flight.departureItinerary?.segments || [];
                    const retSegs = flight.returnItinerary?.segments || [];
                    const depFirst = depSegs[0];
                    const depLast = depSegs[depSegs.length-1];
                    const retFirst = retSegs[0];
                    const retLast = retSegs[retSegs.length-1];
                    return (
                      <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-4">
                              <span className="font-semibold text-navy-900">{depFirst?.airlineName || depFirst?.airLine}</span>
                              <span className="text-gray-500 ml-2">{depFirst?.flightNumber}</span>
                            </div>
                            <div className="flex items-center space-x-8">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-navy-900">{depFirst ? new Date(depFirst.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                                <div className="text-sm text-gray-500">{depFirst?.from}</div>
                                <div className="text-xs text-gray-400">{depFirst?.airLine}</div>
                              </div>
                              <div className="flex-1 text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <div className="h-0.5 bg-gray-300 flex-1"></div>
                                  <span className="mx-2">→</span>
                                  <div className="h-0.5 bg-gray-300 flex-1"></div>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center justify-center">
                                  {flight.departureItinerary?.totalDuration}
                                </div>
                                {depSegs.length > 1 && (
                                  <div className="text-xs text-gray-400">{depSegs.length - 1} stop</div>
                                )}
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-navy-900">{depLast ? new Date(depLast.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                                <div className="text-sm text-gray-500">{depLast?.to}</div>
                                <div className="text-xs text-gray-400">{depLast?.airLine}</div>
                              </div>
                            </div>
                            {/* Return Itinerary */}
                            {retSegs.length > 0 && (
                              <div className="flex items-center space-x-8 mt-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-navy-900">{retFirst ? new Date(retFirst.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                                  <div className="text-sm text-gray-500">{retFirst?.from}</div>
                                  <div className="text-xs text-gray-400">{retFirst?.airLine}</div>
                                </div>
                                <div className="flex-1 text-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <div className="h-0.5 bg-gray-300 flex-1"></div>
                                    <span className="mx-2">→</span>
                                    <div className="h-0.5 bg-gray-300 flex-1"></div>
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center justify-center">
                                    {flight.returnItinerary?.totalDuration}
                                  </div>
                                  {retSegs.length > 1 && (
                                    <div className="text-xs text-gray-400">{retSegs.length - 1} stop</div>
                                  )}
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-navy-900">{retLast ? new Date(retLast.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                                  <div className="text-sm text-gray-500">{retLast?.to}</div>
                                  <div className="text-xs text-gray-400">{retLast?.airLine}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="md:ml-8 mt-4 md:mt-0 text-center">
                            <div className="text-3xl font-bold text-navy-900 mb-2">€{flight.price}</div>
                            <button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded">Select Flight</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
