
import { useState } from 'react';
import { Plane, CalendarIcon, Users, Search, User, Briefcase, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
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
  const [promoCode, setPromoCode] = useState('');
  
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

  const handleSearch = () => {
    if (!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate)) {
      return;
    }
    setShowSearchDialog(true);
  };

  return (
    <section id="flights" className="section-container pt-24 pb-8">
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
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
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
                        {departureDate ? format(departureDate, "PPP") : <span>Aggiungi Data</span>}
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
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    required
                  />
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
                          {returnDate ? format(returnDate, "PPP") : <span>Aggiungi Data</span>}
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
            
            {/* Travelers, Cabin Class, and Promo Code */}
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
                <label className="block text-sm font-medium text-navy-700 mb-1">Codice Promo</label>
                <Input
                  type="text"
                  placeholder="Hai un codice?"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button 
              onClick={handleSearch}
              className="w-full btn-accent flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Cerca Voli</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Ricerca Voli</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Dettagli Ricerca:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Da:</span> {origin}</div>
                  <div><span className="font-medium">A:</span> {destination}</div>
                  <div><span className="font-medium">Partenza:</span> {departureDate ? format(departureDate, "dd/MM/yyyy") : ''}</div>
                  {tripType === 'roundtrip' && returnDate && (
                    <div><span className="font-medium">Ritorno:</span> {format(returnDate, "dd/MM/yyyy")}</div>
                  )}
                  <div><span className="font-medium">Passeggeri:</span> {totalPassengers}</div>
                  <div><span className="font-medium">Classe:</span> {cabinClasses.find(c => c.id === cabinClass)?.label}</div>
                </div>
              </div>
              <div className="text-center text-gray-600">
                <p>Stiamo cercando i migliori voli per te...</p>
                <p className="text-sm mt-2">I risultati della ricerca saranno disponibili a breve.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FlightSearch;
