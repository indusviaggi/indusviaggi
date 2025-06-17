import { useState, useEffect } from 'react';
import apiFetch from '@/utils/apiFetch';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Clock, User, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import PaginationWrapper from '@/components/PaginationWrapper';
import DashboardLoader from '@/components/DashboardLoader';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
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
  // Default dates: first and last day of current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const firstDayStr = formatDateLocal(firstDay);
  const lastDayStr = formatDateLocal(lastDay);
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState(firstDayStr);
  const [dateTo, setDateTo] = useState(lastDayStr);
  // New: Date Type Filter
  const [dateType, setDateType] = useState('createdAt');
  // For staged filter values
  const [pendingStatus, setPendingStatus] = useState('all');
  const [pendingDateFrom, setPendingDateFrom] = useState(firstDayStr);
  const [pendingDateTo, setPendingDateTo] = useState(lastDayStr);
  const [pendingDateType, setPendingDateType] = useState('createdAt');

  // Fetch bookings with filters
  async function fetchBookings({
    status = 'all',
    dateFrom = firstDayStr,
    dateTo = lastDayStr,
    dateType = 'createdAt'
  } = {}) {
    setLoadingBookings(true);
    setErrorBookings(null);
    try {
      const params = new URLSearchParams();
      params.append('status', status);
      params.append('dateFrom', dateFrom);
      params.append('dateTo', dateTo);
      params.append('dateType', dateType); // <-- Send dateType to API
      const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/my?${params.toString()}`);
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

  // Initial fetch on mount with default filters
  useEffect(() => {
    fetchBookings({ status: 'all', dateFrom: firstDayStr, dateTo: lastDayStr, dateType: 'createdAt' });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'booked': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Loader and disable state for status change
  const [statusChangePending, setStatusChangePending] = useState(false);
  const [statusChangeId, setStatusChangeId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Handler for status change
  const handleStatusChange = async (bookingId, newStatus) => {
    setStatusChangePending(true);
    setStatusChangeId(bookingId);
    try {
      const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setBookings(prev => prev.map(b =>
        b.booking._id === bookingId
          ? { ...b, booking: { ...b.booking, status: newStatus } }
          : b
      ));
    } catch (err) {
      alert('Errore durante l\'aggiornamento dello stato');
    }
    setStatusChangePending(false);
    setStatusChangeId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full flex justify-end mb-6">
            <Button 
              onClick={() => navigate('/search')}
              className="bg-gold-500 hover:bg-gold-600 text-white text-lg font-bold shadow-lg px-8 py-3 rounded-full border-2 border-gold-600 transition-all duration-200 w-full sm:w-auto"
              style={{letterSpacing: 1}}
            >
              Prenota nuovo volo
            </Button>
          </div>
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
                <div className="ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 break-words whitespace-normal">Prenotazioni totali</p>
                  <p className="text-xl sm:text-2xl font-bold text-navy-900 break-words whitespace-normal">{bookings.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-sky-100 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-sky-600" />
                </div>
                <div className="ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 break-words whitespace-normal">Viaggi in arrivo</p>
                  <p className="text-xl sm:text-2xl font-bold text-navy-900 break-words whitespace-normal">
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
                <div className="ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 break-words whitespace-normal">Totale Speso</p>
                  <p className="text-xl sm:text-2xl font-bold text-navy-900 break-words whitespace-normal">
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
                <div className="ml-4 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 break-words whitespace-normal">Compagnie Aeree Utilizzate</p>
                  <p className="text-xl sm:text-2xl font-bold text-navy-900 break-words whitespace-normal">
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
                  //{ id: 'profile', label: 'Profilo', icon: User },
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-navy-900">Le tue prenotazioni</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="flex flex-row flex-wrap gap-2 items-center bg-gray-50 p-2 rounded">
                        {/* Status Filter */}
                        <Select value={pendingStatus} onValueChange={setPendingStatus}>
                          <SelectTrigger className="p-2 border border-gray-200 rounded w-32 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500">
                            <SelectValue placeholder="Stato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tutti gli stati</SelectItem>
                            <SelectItem value="paid">paid</SelectItem>
                            <SelectItem value="booked">booked</SelectItem>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="cancelled">cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Date Type Filter */}
                        <Select value={pendingDateType} onValueChange={setPendingDateType}>
                          <SelectTrigger className="p-2 border border-gray-200 rounded w-36 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500">
                            <SelectValue placeholder="Tipo data" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="createdAt">Data creazione</SelectItem>
                            <SelectItem value="departure">Data partenza</SelectItem>
                            <SelectItem value="arrival">Data arrivo</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Date From Filter */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`p-2 border border-gray-200 rounded flex items-center w-32 text-xs ${!pendingDateFrom ? 'text-muted-foreground' : ''}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pendingDateFrom ? pendingDateFrom : <span>Da</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={pendingDateFrom ? new Date(pendingDateFrom) : undefined}
                              onSelect={date => setPendingDateFrom(date ? formatDateLocal(new Date(date)) : '')}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <span className="text-xs">-</span>
                        {/* Date To Filter */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`p-2 border border-gray-200 rounded flex items-center w-32 text-xs ${!pendingDateTo ? 'text-muted-foreground' : ''}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pendingDateTo ? pendingDateTo : <span>A</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={pendingDateTo ? new Date(pendingDateTo) : undefined}
                              onSelect={date => setPendingDateTo(date ? formatDateLocal(date) : '')}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <Button
                          className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-1 text-xs"
                          onClick={async () => {
                            setStatusFilter(pendingStatus);
                            setDateFrom(pendingDateFrom);
                            setDateTo(pendingDateTo);
                            setDateType(pendingDateType);
                            await fetchBookings({
                              status: pendingStatus,
                              dateFrom: pendingDateFrom,
                              dateTo: pendingDateTo,
                              dateType: pendingDateType
                            });
                          }}
                        >
                          Cerca
                        </Button>
                      </div>
                      {/* Prenota nuovo volo button moved to top */}
                    </div>
                  </div>
                  {loadingBookings ? (
                    <div className="py-12">
                      <DashboardLoader />
                    </div>
                  ) : errorBookings ? (
                    <div className="text-center text-red-700 py-8">{errorBookings}</div>
                  ) : bookings.length === 0 ? (
                    <div className="flex justify-center">
                      <div className="bg-white/90 border border-sky-100 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
                        <img src="/airplane.gif" alt="Ricerca" />
                        <div className="text-navy-700 text-lg font-semibold mb-2">Nessuna prenotazione trovata</div>
                        <div className="text-gray-500">Usa i filtri sopra e premi Cerca per visualizzare le tue prenotazioni.</div>
                      </div>
                    </div>
                  ) : (
                    <PaginationWrapper totalItems={bookings.length} pageSize={10}>
                      {({ startIdx, endIdx }) => (
                        <>
                          {bookings.slice(startIdx, endIdx).map((b, idx) => {
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
                                      <span className="font-semibold text-navy-900">{depSeg?.airLine}{flight?.flightNumber || depSeg?.flightNumber}</span>
                                      <span className="text-gray-500 ml-2">{flight?.airlineName || depSeg?.airlineName || depSeg?.airLine}</span>
                                      <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                      </span>
                                      {user?.role === 'admin' && (
                                        <>
                                          <select
                                            className="ml-4 border rounded px-2 py-1 text-xs"
                                            value={booking.status}
                                            disabled={statusChangePending}
                                            onChange={e => handleStatusChange(booking._id, e.target.value)}
                                          >
                                            <option value="booked">Booked</option>
                                            <option value="pending">Pending</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="paid">Paid</option>
                                          </select>
                                          {statusChangePending && statusChangeId === booking._id && (
                                            <span className="ml-2 inline-block align-middle">
                                              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                              </svg>
                                            </span>
                                          )}
                                        </>
                                      )}
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
                                      Passeggeri: {(flight?.adults || 0) + (flight?.children || 0) + (flight?.infants || 0)}
                                      {passenger?.name && ` • ${passenger.name}`} {passenger?.surname && passenger?.surname} {passenger?.email && `• ${passenger.email}`} {passenger?.phone && `• ${passenger.phone}`}
                                    </div>
                                    {(flight?.adults || flight?.children || flight?.infants) && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        <span className="font-semibold">Adulti:</span> {flight?.adults || 0} <span className="font-semibold ml-2">Bambini:</span> {flight?.children || 0} <span className="font-semibold ml-2">Neonati:</span> {flight?.infants || 0}
                                      </div>
                                    )}
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
                          })}
                        </>
                      )}
                    </PaginationWrapper>
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