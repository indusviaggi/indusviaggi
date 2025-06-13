import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const FlightDetailsDialog = ({ open, onClose, flight, onBook }: {
  open: boolean;
  onClose: () => void;
  flight: any;
  onBook?: (flight: any) => void;
}) => {
  if (!flight) return null;

  const depSegs = flight.departureItinerary?.segments || [];
  const retSegs = flight.returnItinerary?.segments || [];
  const depFirst = depSegs[0];
  const depLast = depSegs[depSegs.length-1];
  const retFirst = retSegs[0];
  const retLast = retSegs[retSegs.length-1];

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl w-full mb-4 mr-4 p-0 sm:p-8 rounded-lg h-full sm:h-auto overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xs sm:text-2xl">Dettagli Volo</DialogTitle>
        </DialogHeader>
        <div className="p-3 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className="font-semibold text-navy-900 text-xs sm:text-lg">{depFirst?.airlineName || depFirst?.airLine}</span>
                <span className="text-gray-500 ml-2 text-xs sm:text-sm">{depFirst?.flightNumber}</span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-base sm:text-2xl font-bold text-navy-900">{depFirst ? new Date(depFirst.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{depFirst?.from}</div>
                  <div className="text-xs text-gray-400 break-words">{depFirst?.airLine}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="h-0.5 bg-gray-300 flex-1"></div>
                    <span className="mx-2">→</span>
                    <div className="h-0.5 bg-gray-300 flex-1"></div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center break-words">
                    {flight.departureItinerary?.totalDuration}
                  </div>
                  {depSegs.length > 1 && (
                    <div className="text-xs text-gray-400">{depSegs.length - 1} stop</div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-2xl font-bold text-navy-900">{depLast ? new Date(depLast.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{depLast?.to}</div>
                  <div className="text-xs text-gray-400 break-words">{depLast?.airLine}</div>
                </div>
              </div>
              {/* Return Itinerary */}
              {retSegs.length > 0 && (
                <div className="flex items-center space-x-8 mt-4">
                  <div className="text-center">
                    <div className="text-base sm:text-2xl font-bold text-navy-900">{retFirst ? new Date(retFirst.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{retFirst?.from}</div>
                    <div className="text-xs text-gray-400 break-words">{retFirst?.airLine}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="h-0.5 bg-gray-300 flex-1"></div>
                      <span className="mx-2">→</span>
                      <div className="h-0.5 bg-gray-300 flex-1"></div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center break-words">
                      {flight.returnItinerary?.totalDuration}
                    </div>
                    {retSegs.length > 1 && (
                      <div className="text-xs text-gray-400">{retSegs.length - 1} stop</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-2xl font-bold text-navy-900">{retLast ? new Date(retLast.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{retLast?.to}</div>
                    <div className="text-xs text-gray-400 break-words">{retLast?.airLine}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="md:ml-8 mt-4 md:mt-0 text-center">
              <div className="text-base sm:text-3xl font-bold text-navy-900 mb-2">€{flight.price}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-8">
            {flight.travelClass && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Classe:</span> {flight.travelClass}</div>
            )}
            {flight.ticketType && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Tipo biglietto:</span> {flight.ticketType}</div>
            )}
            {flight.bookedTickets && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Biglietti prenotati:</span> {flight.bookedTickets}</div>
            )}
            {flight.baggage && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Bagagli:</span> {Array.isArray(flight.baggage) ? flight.baggage.join(', ') : flight.baggage}</div>
            )}
            {flight.cabinBags && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Bagagli a mano:</span> {Array.isArray(flight.cabinBags) ? flight.cabinBags.join(', ') : flight.cabinBags}</div>
            )}
            {flight.amenities && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Servizi:</span> {Array.isArray(flight.amenities) ? flight.amenities.join(', ') : flight.amenities}</div>
            )}
            {flight.stay && (
              <div className="text-xs sm:text-base"><span className="font-semibold">Soggiorno:</span> {typeof flight.stay === 'object' ? JSON.stringify(flight.stay) : flight.stay}</div>
            )}
          </div>
          <h2 className="text-xs sm:text-lg font-semibold text-navy-900 mb-4">Dettagli Andata</h2>
          <div className="space-y-2 sm:space-y-4">
            {depSegs.map((seg, i) => (
              <div key={i} className="p-2 sm:p-4 border rounded-lg bg-sky-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-navy-900 text-xs sm:text-base">{seg.airlineName || seg.airLine} {seg.flightNumber}</div>
                    <div className="text-xs sm:text-sm text-gray-700">{seg.from} → {seg.to}</div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-2 md:mt-0 break-words">
                    Partenza: {new Date(seg.departureTime).toLocaleString()}<br />
                    Arrivo: {new Date(seg.arrivalTime).toLocaleString()}<br />
                    Durata: {seg.segmentDuration}
                  </div>
                </div>
                {seg.layoverDuration && i > 0 && (
                  <div className="text-xs text-gray-500 mt-2">Layover: {Math.round(seg.layoverDuration/60)}h {seg.layoverDuration%60}m</div>
                )}
              </div>
            ))}
          </div>
          {retSegs.length > 0 && (
            <>
              <h2 className="text-xs sm:text-lg font-semibold text-navy-900 mt-8 mb-4">Dettagli Ritorno</h2>
              <div className="space-y-2 sm:space-y-4">
                {retSegs.map((seg, i) => (
                  <div key={i} className="p-2 sm:p-4 border rounded-lg bg-sky-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-navy-900 text-xs sm:text-base">{seg.airlineName || seg.airLine} {seg.flightNumber}</div>
                        <div className="text-xs sm:text-sm text-gray-700">{seg.from} → {seg.to}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-2 md:mt-0 break-words">
                        Partenza: {new Date(seg.departureTime).toLocaleString()}<br />
                        Arrivo: {new Date(seg.arrivalTime).toLocaleString()}<br />
                        Durata: {seg.segmentDuration}
                      </div>
                    </div>
                    {seg.layoverDuration && i > 0 && (
                      <div className="text-xs text-gray-500 mt-2">Layover: {Math.round(seg.layoverDuration/60)}h {seg.layoverDuration%60}m</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 text-xs sm:text-base"
            >
              Chiudi
            </Button>
            <Button 
              onClick={() => onBook && onBook(flight)}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white text-xs sm:text-base"
            >
              Prenota questo volo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlightDetailsDialog;