import { useState, useRef } from 'react';
import { validateEmail, validatePhone } from '@/utils/validation';
import { formatDateLocal } from '@/utils/formatDateLocal';
import apiFetch from '@/utils/apiFetch';
import API_BASE_URL from '@/utils/apiBase';
import { Plane, CalendarIcon, Users, Search, User, Baby } from 'lucide-react';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TabProps {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const Tab = ({ title, icon, active, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-300",
      active 
        ? "bg-white text-navy-900 shadow-sm" 
        : "text-navy-600 hover:bg-white/50 hover:text-navy-900"
    )}
  >
    {icon}
    <span>{title}</span>
  </button>
);

const FlightSearch = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('roundtrip');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('economy');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  // Autocomplete state
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

  // Fetch airport options
  const fetchAirportOptions = async (keyword: string) => {
    if (keyword.length < 3) return { data: [], error: null, empty: false };
    try {
      const res = await apiFetch(`${API_BASE_URL}/amadeus/locations/search?keyword=${encodeURIComponent(keyword)}`);
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

  // Generic handler for airport input changes
  const handleAirportInputChange = (
    value: string,
    setValue: (v: string) => void,
    setOptions: (opts: any[]) => void,
    setShowDropdown: (show: boolean) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    setValue(value);
    setShowDropdown(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (value.length >= 3) {
      timeoutRef.current = setTimeout(async () => {
        const { data, error, empty } = await fetchAirportOptions(value);
        setOptions(data);
        setShowDropdown(data.length > 0 || !!error || empty);
        if (setOptions === setOriginOptions) {
          setOriginError(error);
          setOriginEmpty(empty);
        } else {
          setDestinationError(error);
          setDestinationEmpty(empty);
        }
      }, 300);
    } else {
      setOptions([]);
      setShowDropdown(false);
      if (setOptions === setOriginOptions) {
        setOriginError(null);
        setOriginEmpty(false);
      } else {
        setDestinationError(null);
        setDestinationEmpty(false);
      }
    }
  };
  
  const tabs = [
    { id: 'flights', title: 'Voli', icon: <Plane className="h-4 w-4" /> },
  ];
  
  const tripTypes = [
    { id: 'roundtrip', label: 'Andata e Ritorno' },
    { id: 'oneway', label: 'Solo Andata' },
  ];

  const cabinClasses = [
    { id: 'economy', label: 'Economy' },
    { id: 'premium_economy', label: 'Premium Economy' },
    { id: 'business', label: 'Business' },
    { id: 'first', label: 'Prima Classe' },
  ];

  const handleIncrement = (type: 'adults' | 'children' | 'infants') => {
    if (type === 'adults' && adults < 9) setAdults(adults + 1);
    if (type === 'children' && children < 9) setChildren(children + 1);
    if (type === 'infants' && infants < 9) setInfants(infants + 1);
  };

  const handleDecrement = (type: 'adults' | 'children' | 'infants') => {
    if (type === 'adults' && adults > 1) setAdults(adults - 1);
    if (type === 'children' && children > 0) setChildren(children - 1);
    if (type === 'infants' && infants > 0) setInfants(infants - 1);
  };

  const totalPassengers = adults + children + infants;

  // Form validation
  const validateForm = () => {
    if (!origin.trim() || !destination.trim() || !departureDate || (tripType === 'roundtrip' && !returnDate) || !contact.trim()) {
      return 'Per favore compila tutti i campi obbligatori.';
    }
    if (origin.trim() === destination.trim()) {
      return 'La partenza e la destinazione non possono essere uguali.';
    }
    const now = new Date();
    if (departureDate && departureDate < new Date(now.setHours(0,0,0,0))) {
      return 'La data di partenza non può essere nel passato.';
    }
    if (tripType === 'roundtrip' && returnDate) {
      if (returnDate < departureDate) {
        return 'La data di ritorno deve essere dopo la partenza.';
      }
    }
    if (!validateEmail(contact.trim()) && !validatePhone(contact.trim())) {
      return "Inserisci un'email o un numero di telefono valido";
    }
    return null;
  };

  // Reset form fields
  const resetForm = () => {
    setTripType('roundtrip');
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setCabinClass('economy');
    setDepartureDate(undefined);
    setReturnDate(undefined);
    setOrigin('');
    setDestination('');
    setContact('');
    setOriginOptions([]);
    setDestinationOptions([]);
  };

  const handleSearch = async () => {
    const error = validateForm();
    if (error) {
      toast({
        title: "Attenzione",
        description: error,
        variant: "default",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/mail/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          origin,
          destination,
          departureDate: departureDate ? formatDateLocal(departureDate) : '',
          returnDate: tripType === 'roundtrip' && returnDate ? formatDateLocal(returnDate) : null,
          tripType,
          adults,
          children,
          infants,
          cabinClass,
          contact,
        }),
      });
      if (!res.ok) {
        toast({
          title: "Errore di invio",
          description: "Si è verificato un errore durante l'invio della richiesta. Riprova più tardi.",
          variant: "destructive",
        });
        return;
      }
      const data = await res.json();
      if (data && data.success === false) {
        toast({
          title: "Errore di invio",
          description: data.message || "Si è verificato un errore durante l'invio della richiesta.",
          variant: "destructive",
        });
        return;
      }
      setShowSearchDialog(true);
    } catch (error) {
      toast({
        title: "Errore di rete",
        description: "Impossibile inviare la richiesta. Controlla la connessione e riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-sky-50">
    <div id="flights" className="section-container pt-24 pb-8 bg-sky-50">
      <div className="text-center mb-12">
        <span className="text-sm uppercase tracking-wider text-gold-500 font-medium mb-2 inline-block">
          Prenota Adesso
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
          Trova il Tuo Volo Perfetto
        </h2>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card">
          {/* Tabs */}
          <div className="flex space-x-2 px-4 pt-4">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                title={tab.title}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
          
          {/* Search Form */}
          <div className="bg-white p-6 rounded-b-2xl">
            {/* Trip Type Selection */}
            <div className="flex space-x-6 mb-6">
              {tripTypes.map((type) => (
                <label key={type.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value={type.id}
                    checked={tripType === type.id}
                    onChange={() => setTripType(type.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full border mr-2 flex items-center justify-center",
                      tripType === type.id
                        ? "border-gold-500"
                        : "border-gray-300"
                    )}
                  >
                    {tripType === type.id && (
                      <span className="w-2 h-2 rounded-full bg-gold-500" />
                    )}
                  </span>
                  <span className="text-navy-900">{type.label}</span>
                </label>
              ))}
            </div>
            
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-navy-700 mb-1">Da *</label>
                  <Input
                    type="text"
                    placeholder="Città o Aeroporto"
                    value={origin}
                    autoComplete="off"
                    onChange={e =>
                      handleAirportInputChange(
                        e.target.value,
                        setOrigin,
                        setOriginOptions,
                        setShowOriginDropdown,
                        originTimeout
                      )
                    }
                    onFocus={() => {
                      if (originOptions.length > 0) setShowOriginDropdown(true);
                    }}
                    onBlur={() => setTimeout(() => {
                      setShowOriginDropdown(false);
                      setOriginEmpty(false);
                    }, 200)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
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
                            setOrigin(option.label);
                            setShowOriginDropdown(false);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-navy-700 mb-1">Partenza *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full p-3 border border-gray-200 rounded-lg justify-start text-left font-normal focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent",
                          !departureDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? formatDateLocal(departureDate) : <span>Aggiungi Data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-navy-700 mb-1">A *</label>
                  <Input
                    type="text"
                    placeholder="Città o Aeroporto"
                    value={destination}
                    autoComplete="off"
                    onChange={e =>
                      handleAirportInputChange(
                        e.target.value,
                        setDestination,
                        setDestinationOptions,
                        setShowDestinationDropdown,
                        destinationTimeout
                      )
                    }
                    onFocus={() => {
                      if (destinationOptions.length > 0) setShowDestinationDropdown(true);
                    }}
                    onBlur={() => setTimeout(() => {
                      setShowDestinationDropdown(false);
                      setDestinationEmpty(false);
                    }, 200)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
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
                            setDestination(option.label);
                            setShowDestinationDropdown(false);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {tripType === 'roundtrip' && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-navy-700 mb-1">Ritorno *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full p-3 border border-gray-200 rounded-lg justify-start text-left font-normal focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? formatDateLocal(returnDate) : <span>Aggiungi Data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          disabled={(date) => date < (departureDate || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
            
            {/* Travelers, Cabin Class, and Contact */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Travelers */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy-700 mb-1">Viaggiatori *</label>
                <div className="w-full p-3 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer relative group">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{totalPassengers} {totalPassengers === 1 ? 'Passeggero' : 'Passeggeri'}</span>
                  </div>
                  
                  {/* Dropdown for travelers selection */}
                  <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-lg rounded-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    {/* Adults */}
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-navy-700 mr-2" />
                          <span className="font-medium">Adulti</span>
                        </div>
                        <p className="text-xs text-gray-500">12+ anni</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleDecrement('adults')}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100"
                          disabled={adults <= 1}
                        >
                          <span className="text-xl font-medium">-</span>
                        </button>
                        <span className="w-6 text-center">{adults}</span>
                        <button 
                          onClick={() => handleIncrement('adults')}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100"
                          disabled={adults >= 9}
                        >
                          <span className="text-xl font-medium">+</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Children */}
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="flex items-center">
                          <Baby className="h-4 w-4 text-navy-700 mr-2" />
                          <span className="font-medium">Bambini</span>
                        </div>
                        <p className="text-xs text-gray-500">2-11 anni</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleDecrement('children')}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100"
                          disabled={children <= 0}
                        >
                          <span className="text-xl font-medium">-</span>
                        </button>
                        <span className="w-6 text-center">{children}</span>
                        <button 
                          onClick={() => handleIncrement('children')}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100"
                          disabled={children >= 9}
                        >
                          <span className="text-xl font-medium">+</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Infants */}
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="flex items-center">
                          <Baby className="h-4 w-4 text-navy-700 mr-2" />
                          <span className="font-medium">Neonati</span>
                        </div>
                        <p className="text-xs text-gray-500">Sotto i 2 anni</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleDecrement('infants')}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100"
                          disabled={infants <= 0}
                        >
                          <span className="text-xl font-medium">-</span>
                        </button>
                        <span className="w-6 text-center">{infants}</span>
                        <button 
                          onClick={() => handleIncrement('infants')}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100"
                          disabled={infants >= 9}
                        >
                          <span className="text-xl font-medium">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cabin Class */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy-700 mb-1">Classe *</label>
                <Select defaultValue={cabinClass} onValueChange={(value) => setCabinClass(value)}>
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                    <SelectValue placeholder="Seleziona Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {cabinClasses.map((cabinClass) => (
                      <SelectItem key={cabinClass.id} value={cabinClass.id}>
                        {cabinClass.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-navy-700 mb-1">Contatto *</label>
                <Input
                  type="text"
                  placeholder="Email o Telefono"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            
            <button 
              onClick={handleSearch}
              className="w-full btn-accent flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? <Loader /> : <Search className="h-5 w-5" />}
              <span>{loading ? 'Attendere...' : 'Invia Richiesta'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={(open) => {
        setShowSearchDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gold-50 via-white to-sky-50 border-2 border-gold-400 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gold-600 flex items-center justify-center gap-2">
              <span>🎉</span> Richiesta Info Voli
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-white/90 p-4 rounded-lg border border-gold-200 shadow">
                <h3 className="font-semibold mb-2 text-navy-900">Dettagli Ricerca:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium text-navy-700">Da:</span> {origin}</div>
                  <div><span className="font-medium text-navy-700">A:</span> {destination}</div>
                  <div><span className="font-medium text-navy-700">Partenza:</span> {departureDate ? formatDateLocal(departureDate, 'IT') : ''}</div>
                  {tripType === 'roundtrip' && returnDate && (
                    <div><span className="font-medium text-navy-700">Ritorno:</span> {formatDateLocal(returnDate, 'IT')}</div>
                  )}
                  <div><span className="font-medium text-navy-700">Passeggeri:</span> {totalPassengers}</div>
                  <div><span className="font-medium text-navy-700">Classe:</span> {cabinClasses.find(c => c.id === cabinClass)?.label}</div>
                </div>
              </div>
              <div className="text-center text-gold-700">
                <p className="font-semibold text-lg flex items-center justify-center gap-2">
                  <span>✅</span> Abbiamo ricevuto la tua richiesta!
                </p>
                <p className="text-sm mt-2 text-navy-700">Verrai contattato da un nostro operatore in giornata.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </section>
  );
};

export default FlightSearch;
