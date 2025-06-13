import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, MapPin, Clock, User, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    flightNumber: 'SW101',
    airline: 'Indus Viaggi Airlines',
    route: 'New York → Londra',
    date: '2024-06-15',
    time: '08:00 - 20:00',
    status: 'confermato',
    price: 599,
    seat: '12A'
  },
  {
    id: '2',
    flightNumber: 'GW205',
    airline: 'Global Wings',
    route: 'Londra → Parigi',
    date: '2024-06-20',
    time: '14:30 - 16:00',
    status: 'in attesa',
    price: 249,
    seat: '15C'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confermato': return 'text-green-600 bg-green-100';
      case 'in attesa': return 'text-yellow-600 bg-yellow-100';
      case 'cancellato': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">
              Bentornato, {user?.name}!
            </h1>
            <p className="text-navy-600">
              Gestisci le tue prenotazioni e le impostazioni dell'account
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-gold-100 rounded-lg">
                  <Plane className="h-6 w-6 text-gold-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Prenotazioni totali</p>
                  <p className="text-2xl font-bold text-navy-900">{mockBookings.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-sky-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-sky-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Viaggi in arrivo</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {mockBookings.filter(b => new Date(b.date) > new Date()).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Paesi visitati</p>
                  <p className="text-2xl font-bold text-navy-900">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Miglia accumulate</p>
                  <p className="text-2xl font-bold text-navy-900">25.420</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'bookings', label: 'Le mie prenotazioni', icon: Plane },
                  { id: 'profile', label: 'Profilo', icon: User },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-gold-500 text-gold-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-navy-900">Le tue prenotazioni</h3>
                    <Button 
                      onClick={() => navigate('/search')}
                      className="bg-gold-500 hover:bg-gold-600 text-white"
                    >
                      Prenota nuovo volo
                    </Button>
                  </div>
                  
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-navy-900">{booking.flightNumber}</span>
                            <span className="text-gray-500 ml-2">{booking.airline}</span>
                            <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="text-gray-600 mb-1">{booking.route}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString('it-IT')} • {booking.time} • Posto {booking.seat}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-xl font-bold text-navy-900">€{booking.price}</div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Dettagli
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-md">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Informazioni profilo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                      <input 
                        type="text" 
                        value={user?.name || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <Button className="bg-gold-500 hover:bg-gold-600 text-white">
                      Modifica profilo
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Metodi di pagamento</h3>
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Nessun metodo di pagamento aggiunto</p>
                    <Button className="bg-gold-500 hover:bg-gold-600 text-white">
                      Aggiungi metodo di pagamento
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;