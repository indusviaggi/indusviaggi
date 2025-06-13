import React, { useState, useMemo } from 'react';
import FilterResults from '@/components/FilterResults';
import FlightDetailsDialog from '@/components/FlightDetailsDialog';
import BookingDialog from '@/components/BookingDialog';

interface ResultsListProps {
  results: any[];
  cabinClasses: { id: string; label: string }[];
  cabinClass: string;
  onFilteredCountChange?: (count: number) => void;
}

const RESULTS_PER_PAGE = 10;
const PRICE_MIN = 0;
const PRICE_STEP = 10;

const ResultsList: React.FC<ResultsListProps> = ({ results, cabinClasses, cabinClass, onFilteredCountChange }) => {
  // Compute max price from results
  const maxPrice = useMemo(() => {
    if (!results || results.length === 0) return 2000;
    return Math.max(...results.map(r => Number(r.price) || 0));
  }, [results]);

  // Filter state
  const [price, setPrice] = useState(maxPrice);
  const [stops, setStops] = useState<string[]>([]);
  const [flightDuration, setFlightDuration] = useState('');
  const [layoverDuration, setLayoverDuration] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  // Update price if maxPrice changes
  React.useEffect(() => {
    setPrice(maxPrice);
  }, [maxPrice]);

  // Filtering logic
  const filteredResults = useMemo(() => {
    let filtered = results.filter(flight => {
      // Price filter
      if (Number(flight.price) > price) return false;
      // Stops filter
      if (stops.length > 0) {
        const depSegs = flight.departureItinerary?.segments || [];
        const numStops = depSegs.length - 1;
        let stopType = '';
        if (numStops === 0) stopType = 'direct';
        else if (numStops === 1) stopType = '1';
        else if (numStops >= 2) stopType = '2+';
        if (!stops.includes(stopType)) return false;
      }
      // Flight duration filter (in hours)
      if (flightDuration) {
        const depDuration = flight.departureItinerary?.totalDuration;
        if (depDuration) {
          // Assume depDuration is in format 'Xh Ym' or 'Xh'
          const match = depDuration.match(/(\d+)h(?:\s*(\d+)m)?/);
          if (match) {
            const hours = parseInt(match[1], 10);
            if (hours > Number(flightDuration)) return false;
          }
        }
      }
      // Layover duration filter (in hours, for any layover)
      if (layoverDuration) {
        const depSegs = flight.departureItinerary?.segments || [];
        for (let i = 1; i < depSegs.length; i++) {
          const layover = depSegs[i].layoverDuration; // assume in minutes
          if (layover && (layover / 60) > Number(layoverDuration)) return false;
        }
      }
      return true;
    });
    // Sorting
    if (sort === 'price') {
      filtered = filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'duration') {
      filtered = filtered.sort((a, b) => {
        const aDur = a.departureItinerary?.totalDuration || '';
        const bDur = b.departureItinerary?.totalDuration || '';
        const aMatch = aDur.match(/(\d+)h(?:\s*(\d+)m)?/);
        const bMatch = bDur.match(/(\d+)h(?:\s*(\d+)m)?/);
        const aHours = aMatch ? parseInt(aMatch[1], 10) : 0;
        const bHours = bMatch ? parseInt(bMatch[1], 10) : 0;
        return aHours - bHours;
      });
    } else if (sort === 'departure') {
      filtered = filtered.sort((a, b) => {
        const aTime = a.departureItinerary?.segments?.[0]?.departureTime ? new Date(a.departureItinerary.segments[0].departureTime).getTime() : 0;
        const bTime = b.departureItinerary?.segments?.[0]?.departureTime ? new Date(b.departureItinerary.segments[0].departureTime).getTime() : 0;
        return aTime - bTime;
      });
    }
    return filtered;
  }, [results, price, stops, flightDuration, layoverDuration, sort]);

  // Notify parent of filtered count
  React.useEffect(() => {
    if (onFilteredCountChange) {
      onFilteredCountChange(filteredResults.length);
    }
  }, [filteredResults.length, onFilteredCountChange]);

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const paginatedResults = filteredResults.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  // Pagination logic for 5 buttons: First, Prev, Current, Next, Last (with arrows)
  const getPageButtons = () => {
    const buttons = [];
    if (page > 1) {
      buttons.push(
        <button
          key="first"
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gold-100"
          onClick={() => setPage(1)}
          aria-label="First page"
        >
          «
        </button>
      );
    }
    if (page > 2) {
      buttons.push(
        <button
          key="prevPage"
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gold-100"
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>
      );
    }
    buttons.push(
      <button
        key="current"
        className="px-3 py-1 rounded border border-gray-300 bg-gold-500 text-white"
        disabled
      >
        {page}
      </button>
    );
    if (page < totalPages) {
      buttons.push(
        <button
          key="nextPage"
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gold-100"
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      );
    }
    if (page < totalPages) {
      buttons.push(
        <button
          key="last"
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gold-100"
          onClick={() => setPage(totalPages)}
          aria-label="Last page"
        >
          »
        </button>
      );
    }
    return buttons;
  };

  const Pagination = () => (
    totalPages > 1 ? (
      <div className="flex justify-end my-6">
        <div className="w-full max-w-2xl mx-auto flex justify-end space-x-2">
          {getPageButtons()}
        </div>
      </div>
    ) : null
  );

  // Dialog state for flight details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  return (
    <div>
      <FlightDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        flight={selectedFlight}
        onBook={(flight) => {
          setDialogOpen(false);
          setBookingDialogOpen(true);
        }}
      />
      <BookingDialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        flight={selectedFlight}
      />
      <div className="flex justify-end">
        <Pagination />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <FilterResults
            results={results}
            price={price}
            setPrice={setPrice}
            maxPrice={maxPrice}
            stops={stops}
            setStops={setStops}
            flightDuration={flightDuration}
            setFlightDuration={setFlightDuration}
            layoverDuration={layoverDuration}
            setLayoverDuration={setLayoverDuration}
            sort={sort}
            setSort={setSort}
          />
        </div>
        <div className="lg:w-3/4">
          <div className="space-y-4">
            {paginatedResults.map((flight, idx) => {
              const depSegs = flight.departureItinerary?.segments || [];
              const retSegs = flight.returnItinerary?.segments || [];
              const depFirst = depSegs[0];
              const depLast = depSegs[depSegs.length-1];
              const retFirst = retSegs[0];
              const retLast = retSegs[retSegs.length-1];
              // Use flight.id if available, otherwise fallback to idx + (page-1)*RESULTS_PER_PAGE
              const flightId = flight.id || (idx + (page-1)*RESULTS_PER_PAGE);
              return (
                <div key={flightId} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className="font-semibold text-navy-900">{depFirst?.airlineName || depFirst?.airLine}</span>
                        <span className="text-gray-500 ml-2">{depFirst?.flightNumber}</span>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-navy-900">{depFirst ? new Date(depFirst.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                          <div className="text-sm text-gray-500">{depFirst?.from}</div>
                          <div className="text-xs text-gray-400">{depFirst?.airLine}</div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <div className="h-0.5 bg-gray-300 flex-1"></div>
                            <span className="mx-2">→</span>
                            <div className="h-0.5 bg-gray-300 flex-1"></div>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center justify-center">
                            {flight.departureItinerary?.totalDuration}
                          </div>
                          {depSegs.length > 1 && (
                            <div className="text-xs text-gray-400">{depSegs.length - 1} stop</div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-navy-900">{depLast ? new Date(depLast.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                          <div className="text-sm text-gray-500">{depLast?.to}</div>
                          <div className="text-xs text-gray-400">{depLast?.airLine}</div>
                        </div>
                      </div>
                      {/* Return Itinerary */}
                      {retSegs.length > 0 && (
                        <div className="flex items-center space-x-8 mt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-navy-900">{retFirst ? new Date(retFirst.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                            <div className="text-sm text-gray-500">{retFirst?.from}</div>
                            <div className="text-xs text-gray-400">{retFirst?.airLine}</div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="flex items-center justify-center mb-1">
                              <div className="h-0.5 bg-gray-300 flex-1"></div>
                              <span className="mx-2">→</span>
                              <div className="h-0.5 bg-gray-300 flex-1"></div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center justify-center">
                              {flight.returnItinerary?.totalDuration}
                            </div>
                            {retSegs.length > 1 && (
                              <div className="text-xs text-gray-400">{retSegs.length - 1} stop</div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-navy-900">{retLast ? new Date(retLast.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                            <div className="text-sm text-gray-500">{retLast?.to}</div>
                            <div className="text-xs text-gray-400">{retLast?.airLine}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:ml-8 mt-4 md:mt-0 text-center">
                      <div className="text-3xl font-bold text-navy-900 mb-2">€{flight.price}</div>
                      <button
                        className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded"
                        onClick={() => {
                          setSelectedFlight(flight);
                          setDialogOpen(true);
                        }}
                      >Seleziona volo</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Pagination />
      </div>
    </div>
  );
};

export default ResultsList;
