
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// Mock flight data
const mockFlights = [
  {
    id: '1',
    airline: 'Indus Viaggi Airlines',
    flightNumber: 'SW101',
    departure: { city: 'New York', airport: 'JFK', time: '08:00' },
    arrival: { city: 'London', airport: 'LHR', time: '20:00' },
    duration: '8h 00m',
    price: 599,
    stops: 0,
    aircraft: 'Boeing 777'
  },
  {
    id: '2',
    airline: 'Global Wings',
    flightNumber: 'GW205',
    departure: { city: 'New York', airport: 'JFK', time: '14:30' },
    arrival: { city: 'London', airport: 'LHR', time: '02:30+1' },
    duration: '8h 00m',
    price: 749,
    stops: 0,
    aircraft: 'Airbus A350'
  },
  {
    id: '3',
    airline: 'Economy Express',
    flightNumber: 'EE302',
    departure: { city: 'New York', airport: 'JFK', time: '11:15' },
    arrival: { city: 'London', airport: 'LHR', time: '05:45+1' },
    duration: '10h 30m',
    price: 459,
    stops: 1,
    aircraft: 'Boeing 737'
  }
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('price');

  const from = searchParams.get('from') || 'New York';
  const to = searchParams.get('to') || 'London';
  const departDate = searchParams.get('departDate') || new Date().toISOString().split('T')[0];

  const sortedFlights = [...mockFlights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    return a.departure.time.localeCompare(b.departure.time);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              {from} to {to}
            </h1>
            <p className="text-navy-600">
              {new Date(departDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {mockFlights.length} flights found
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-navy-900 mb-4">Sort by</h3>
                <div className="space-y-2">
                  {[
                    { value: 'price', label: 'Price (Low to High)' },
                    { value: 'duration', label: 'Duration' },
                    { value: 'departure', label: 'Departure Time' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Flight Results */}
            <div className="lg:w-3/4">
              <div className="space-y-4">
                {sortedFlights.map((flight) => (
                  <div key={flight.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <Plane className="h-5 w-5 text-gold-500 mr-2" />
                          <span className="font-semibold text-navy-900">{flight.airline}</span>
                          <span className="text-gray-500 ml-2">{flight.flightNumber}</span>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-navy-900">{flight.departure.time}</div>
                            <div className="text-sm text-gray-500">{flight.departure.city}</div>
                            <div className="text-xs text-gray-400">{flight.departure.airport}</div>
                          </div>
                          
                          <div className="flex-1 text-center">
                            <div className="flex items-center justify-center mb-1">
                              <div className="h-0.5 bg-gray-300 flex-1"></div>
                              <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                              <div className="h-0.5 bg-gray-300 flex-1"></div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center justify-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {flight.duration}
                            </div>
                            {flight.stops > 0 && (
                              <div className="text-xs text-gray-400">{flight.stops} stop</div>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-navy-900">{flight.arrival.time}</div>
                            <div className="text-sm text-gray-500">{flight.arrival.city}</div>
                            <div className="text-xs text-gray-400">{flight.arrival.airport}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:ml-8 mt-4 md:mt-0 text-center">
                        <div className="text-3xl font-bold text-navy-900 mb-2">${flight.price}</div>
                        <Button 
                          onClick={() => navigate(`/flight/${flight.id}`)}
                          className="bg-gold-500 hover:bg-gold-600 text-white px-6"
                        >
                          Select Flight
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
