
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, User, Plane } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Booking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Mock flight data
  const flight = {
    id,
    airline: 'SkyWander Airlines',
    flightNumber: 'SW101',
    route: 'New York → London',
    date: '2024-06-15',
    time: '08:00 - 20:00',
    price: 599
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Booking Confirmed!",
      description: "Your flight has been booked successfully. Check your email for confirmation.",
    });
    
    setIsProcessing(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Complete Your Booking</h1>
            <p className="text-navy-600">You're just one step away from your journey!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Passenger Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gold-500" />
                    Passenger Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={passengerInfo.firstName}
                        onChange={(e) => setPassengerInfo({...passengerInfo, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={passengerInfo.lastName}
                        onChange={(e) => setPassengerInfo({...passengerInfo, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={passengerInfo.email}
                        onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={passengerInfo.phone}
                        onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gold-500" />
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3"
                >
                  {isProcessing ? 'Processing...' : `Complete Booking - $${flight.price}`}
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-gold-500" />
                  Booking Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-navy-900">{flight.flightNumber}</div>
                    <div className="text-sm text-gray-600">{flight.airline}</div>
                  </div>
                  <div>
                    <div className="font-medium">{flight.route}</div>
                    <div className="text-sm text-gray-600">{flight.date}</div>
                    <div className="text-sm text-gray-600">{flight.time}</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span>Flight Price</span>
                      <span>${flight.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxes & Fees</span>
                      <span>$89</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>${flight.price + 89}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;
