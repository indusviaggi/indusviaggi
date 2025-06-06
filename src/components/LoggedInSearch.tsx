
import { useState } from 'react';
import { Search, MapPin, Euro } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FlightResult {
  id: number;
  route: string;
  departure: string;
  arrival: string;
  price: number;
  airline: string;
}

const LoggedInSearch = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<FlightResult[]>([]);

  const fakeResults: FlightResult[] = [
    { id: 1, route: 'Milano - Roma', departure: '08:00', arrival: '09:30', price: 89, airline: 'Alitalia' },
    { id: 2, route: 'Roma - Napoli', departure: '10:15', arrival: '11:45', price: 65, airline: 'Ryanair' },
    { id: 3, route: 'Milano - Venezia', departure: '14:30', arrival: '15:15', price: 120, airline: 'Air Italy' },
    { id: 4, route: 'Torino - Bari', departure: '16:45', arrival: '18:30', price: 140, airline: 'Vueling' },
    { id: 5, route: 'Firenze - Palermo', departure: '09:20', arrival: '11:10', price: 180, airline: 'EasyJet' },
    { id: 6, route: 'Bologna - Catania', departure: '12:00', arrival: '14:15', price: 160, airline: 'Wizz Air' },
    { id: 7, route: 'Genova - Cagliari', departure: '15:30', arrival: '17:00', price: 130, airline: 'Neos' },
    { id: 8, route: 'Verona - Brindisi', departure: '07:45', arrival: '09:30', price: 155, airline: 'Blue Air' },
    { id: 9, route: 'Pisa - Reggio Calabria', departure: '13:15', arrival: '15:45', price: 170, airline: 'Meridiana' },
    { id: 10, route: 'Trieste - Lampedusa', departure: '11:30', arrival: '13:45', price: 220, airline: 'Air Malta' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setResults(fakeResults);
      setShowResults(true);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h3 className="text-xl font-semibold text-navy-900 mb-4">
        Benvenuto, {user.name}! Cerca i tuoi voli
      </h3>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca destinazione (es. Roma, Milano, Venezia...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <Search className="h-5 w-5" />
          Cerca
        </button>
      </form>

      {showResults && (
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-navy-900 mb-4">Risultati della ricerca:</h4>
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gold-300 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gold-50 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-navy-900">{result.route}</h5>
                    <p className="text-sm text-gray-600">
                      {result.departure} - {result.arrival} • {result.airline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gold-600 font-semibold">
                  <Euro className="h-4 w-4" />
                  <span>{result.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInSearch;
