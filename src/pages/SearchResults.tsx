import { useState, useRef, useEffect } from 'react';
import apiFetch from '@/utils/apiFetch';
import { formatDateLocal } from '@/utils/formatDateLocal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import ResultsLoader from '@/components/ResultsLoader';
import ResultsList from '@/components/ResultsList';
import { Button } from '@/components/ui/button';

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
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('economy');
  const [showTravelers, setShowTravelers] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Last search state
  const [lastSearch, setLastSearch] = useState<any>(null);
  const [showLastSearch, setShowLastSearch] = useState(false);

  // On mount, check for last search in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('last_search');
    if (saved) {
      setLastSearch(JSON.parse(saved));
      setShowLastSearch(true);
    }
  }, []);

  // Handler to restore last search
  const handleRestoreLastSearch = () => {
    if (!lastSearch) return;
    setFrom(lastSearch.from || '');
    setFromValue(lastSearch.fromValue || '');
    setTo(lastSearch.to || '');
    setToValue(lastSearch.toValue || '');
    setTripType(lastSearch.tripType || 'roundtrip');
    setDepartDate(lastSearch.departDate ? new Date(lastSearch.departDate) : new Date());
    setReturnDate(lastSearch.returnDate ? new Date(lastSearch.returnDate) : null);
    setAdults(lastSearch.adults || 1);
    setChildren(lastSearch.children || 0);
    setInfants(lastSearch.infants || 0);
    setCabinClass(lastSearch.cabinClass || 'economy');
    setShowLastSearch(false);
  };

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
      const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/amadeus/locations/search?type=AIRPORT&keyword=${encodeURIComponent(keyword)}`);
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
    if (!fromValue || !toValue || !from.trim() || !to.trim() || !departDate || (tripType === 'roundtrip' && !returnDate)) {
      setFormError('Per favore compila tutti i campi del form.');
      return;
    }
    if (fromValue === toValue) {
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
      departureDate: formatDateLocal(departDate),
      adults,
      children,
      infants,
      travelClass: cabinClass.toUpperCase(),
    };
    if (tripType === 'roundtrip' && returnDate) {
      payload.returnDate =  formatDateLocal(returnDate);
    }
    try {
      const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/amadeus/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setFormError('Errore durante la ricerca voli, riprova.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
      // Save search to localStorage
      localStorage.setItem('last_search', JSON.stringify({
        from, fromValue, to, toValue, tripType, departDate, returnDate, adults, children, infants, cabinClass
      }));
      setShowLastSearch(false);
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
          {/* Last Search Button */}
          {showLastSearch && lastSearch && (
            <div className="mb-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={handleRestoreLastSearch}>
                Usa ultima ricerca: {lastSearch.from} → {lastSearch.to} ({lastSearch.departDate ? new Date(lastSearch.departDate).toLocaleDateString() : ''})
              </Button>
            </div>
          )}
          {/* Short Search Form */}
          <SearchForm
            formError={formError}
            tripType={tripType}
            setTripType={setTripType}
            from={from}
            setFrom={setFrom}
            fromValue={fromValue}
            setFromValue={setFromValue}
            to={to}
            setTo={setTo}
            toValue={toValue}
            setToValue={setToValue}
            originOptions={originOptions}
            setOriginOptions={setOriginOptions}
            showOriginDropdown={showOriginDropdown}
            setShowOriginDropdown={setShowOriginDropdown}
            originError={originError}
            setOriginError={setOriginError}
            originEmpty={originEmpty}
            setOriginEmpty={setOriginEmpty}
            originTimeout={originTimeout}
            destinationOptions={destinationOptions}
            setDestinationOptions={setDestinationOptions}
            showDestinationDropdown={showDestinationDropdown}
            setShowDestinationDropdown={setShowDestinationDropdown}
            destinationError={destinationError}
            setDestinationError={setDestinationError}
            destinationEmpty={destinationEmpty}
            setDestinationEmpty={setDestinationEmpty}
            destinationTimeout={destinationTimeout}
            handleAirportInputChange={handleAirportInputChange}
            departDate={departDate}
            setDepartDate={setDepartDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
            infants={infants}
            setInfants={setInfants}
            showTravelers={showTravelers}
            setShowTravelers={setShowTravelers}
            cabinClass={cabinClass}
            setCabinClass={setCabinClass}
            loading={loading}
            handleSubmit={handleSubmit}
            cabinClasses={cabinClasses}
          />
          {/* Airplane prompt box */}
          {(!loading && !result) && (
            <div className="flex justify-center">
              <div className="bg-white/90 border border-sky-100 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
                <img src="/public/airplane.gif" alt="Airplane" />
                <h2 className="text-xl font-bold text-navy-900 mb-2 flex items-center gap-2">
                  <span>✈️</span> Pronto a partire?
                </h2>
                <p className="text-navy-700 text-center mb-2">Imposta le date, la destinazione e i passeggeri per trovare il tuo volo ideale!</p>
                <p className="text-xs text-gray-500">Compila il modulo qui sopra e premi cerca.</p>
              </div>
            </div>
          )}
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
          {/* Ghost loader while loading */}
          {loading && (
            <ResultsLoader />
          )}

          {/* No results or error message */}
          {(!loading && result && result.data && Array.isArray(result.data) && result.data.length === 0) && (
            <div className="text-center text-navy-700 py-12 text-lg">Nessun risultato trovato.</div>
          )}
          {(!loading && formError) && (
            <div className="text-center text-red-700 py-12 text-lg">{formError}</div>
          )}

          {/* Show sort and results only when search is finished */}
          {(!loading && result && result.data && Array.isArray(result.data) && result.data.length > 0) && (
            <ResultsList results={result.data} cabinClasses={cabinClasses} cabinClass={cabinClass} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
