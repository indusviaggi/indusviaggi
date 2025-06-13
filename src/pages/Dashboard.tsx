import { useState, useEffect } from 'react';
import apiFetch from '@/utils/apiFetch';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, MapPin, Clock, User, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import FlightDetailsDialog from '@/components/FlightDetailsDialog';
import { formatDateLocal } from '@/utils/formatDateLocal';

// Bookings state from API

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoadingBookings(true);
      setErrorBookings(null);
      try {
        const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/my`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        } else {
          setErrorBookings('Errore nel recupero delle prenotazioni');
        }
      } catch (err) {
        setErrorBookings('Errore di rete');
      }
      setLoadingBookings(false);
    }
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
      case 'confermato': return 'text-green-600 bg-green-100';
      case 'pending':
      case 'in attesa': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
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
                  <p className="text-2xl font-bold text-navy-900">{bookings.length}</p>
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
                    {bookings.filter(b => {
                      const depSeg = b.flight?.departureItinerary?.segments?.[0];
                      return depSeg && new Date(depSeg.departureTime) > new Date();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Totale Speso */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Totale Speso</p>
                  <p className="text-2xl font-bold text-navy-900">
                    €{bookings.reduce((sum, b) => {
                      const flight = b.flight || b.booking?.flight;
                      const price = Number(flight?.price) || 0;
                      return sum + price;
                    }, 0).toLocaleString('it-IT')}
                  </p>
                </div>
              </div>
            </div>
            {/* Compagnie Aeree Utilizzate */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Plane className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Compagnie Aeree Utilizzate</p>
                  <p className="text-2xl font-bold text-navy-900">
                    {Array.from(new Set(bookings.map(b => {
                      const flight = b.flight || b.booking?.flight;
                      return flight?.airlineName || flight?.departureItinerary?.segments?.[0]?.airlineName || flight?.departureItinerary?.segments?.[0]?.airLine;
                    }).filter(Boolean))).length}
                  </p>
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
                  
                  {loadingBookings ? (
                    <div className="text-center text-navy-700 py-8">Caricamento prenotazioni...</div>
                  ) : errorBookings ? (
                    <div className="text-center text-red-700 py-8">{errorBookings}</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center text-navy-700 py-8">Nessuna prenotazione trovata.</div>
                  ) : (
                    bookings.map((b, idx) => {
                      const booking = b.booking;
                      const flight = b.flight || booking.flight;
                      const passenger = (b.passengers && b.passengers[0]) || b.passenger;
                      const depSeg = flight?.departureItinerary?.segments?.[0];
                      const retSeg = flight?.returnItinerary?.segments?.[0];
                      return (
                        <div key={booking._id || idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="font-semibold text-navy-900">{flight?.flightNumber || depSeg?.flightNumber}</span>
                                <span className="text-gray-500 ml-2">{flight?.airlineName || depSeg?.airlineName || depSeg?.airLine}</span>
                                <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="text-gray-600 mb-1">
                                {depSeg?.from} → {depSeg?.to} {retSeg ? ` / ${retSeg.from} → ${retSeg.to}` : ''}
                              </div>
                              <div className="text-sm text-gray-500">
                                {depSeg && formatDateLocal(new Date(depSeg.departureTime), 'IT')}
                                {retSeg && (
                                  <>
                                    {' '}↔{' '}
                                    {formatDateLocal(new Date(retSeg.departureTime), 'IT')}
                                  </>
                                )}
                                {' • '}Classe {flight?.travelClass} • {flight?.ticketType}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Passeggeri: {Array.isArray(b.passengers) ? b.passengers.length : 1}
                                {passenger?.name && ` • ${passenger.name}`} {passenger?.surname && passenger?.surname} {passenger?.email && `• ${passenger.email}`} {passenger?.phone && `• ${passenger.phone}`}
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                              <div className="text-xl font-bold text-navy-900">€{flight?.price}</div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setSelectedFlight(flight);
                                  setDetailsDialogOpen(true);
                                }}
                              >
                                Dettagli
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
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
      
      <FlightDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        flight={selectedFlight}
        showBookButton={false}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;