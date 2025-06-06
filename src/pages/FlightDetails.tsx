
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Clock, MapPin, Users, Wifi, Coffee } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock flight details
  const flight = {
    id,
    airline: 'SkyWander Airlines',
    flightNumber: 'SW101',
    aircraft: 'Boeing 777-300ER',
    departure: {
      city: 'New York',
      airport: 'John F. Kennedy International Airport (JFK)',
      time: '08:00',
      date: '2024-06-15'
    },
    arrival: {
      city: 'London',
      airport: 'Heathrow Airport (LHR)',
      time: '20:00',
      date: '2024-06-15'
    },
    duration: '8h 00m',
    price: 599,
    amenities: ['Wi-Fi', 'In-flight Entertainment', 'Meals Included', 'Power Outlets'],
    seatMap: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-navy-900 mb-2">
                  {flight.airline} - {flight.flightNumber}
                </h1>
                <p className="text-gray-600">{flight.aircraft}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-navy-900">${flight.price}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-navy-900 mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-gold-500" />
                  Departure
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{flight.departure.time}</span>
                    <span className="text-gray-500 ml-2">{new Date(flight.departure.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{flight.departure.airport}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-navy-900 mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-gold-500 rotate-45" />
                  Arrival
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{flight.arrival.time}</span>
                    <span className="text-gray-500 ml-2">{new Date(flight.arrival.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{flight.arrival.airport}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-navy-900 mb-4">Flight Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {flight.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="p-2 bg-gold-100 rounded-lg mr-3">
                      {amenity === 'Wi-Fi' && <Wifi className="h-4 w-4 text-gold-600" />}
                      {amenity === 'Meals Included' && <Coffee className="h-4 w-4 text-gold-600" />}
                      {amenity !== 'Wi-Fi' && amenity !== 'Meals Included' && <Users className="h-4 w-4 text-gold-600" />}
                    </div>
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/search')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Results
                </Button>
                <Button 
                  onClick={() => navigate(`/booking/${flight.id}`)}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-white"
                >
                  Book This Flight
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FlightDetails;
