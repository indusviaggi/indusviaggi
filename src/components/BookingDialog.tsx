import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const BookingDialog = ({ open, onClose, flight }: {
  open: boolean;
  onClose: () => void;
  flight: any;
}) => {
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  if (!flight) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-full p-3 sm:p-8 rounded-lg h-full sm:h-auto overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xs sm:text-2xl">Prenota questo volo</DialogTitle>
        </DialogHeader>
        <div className="p-2 sm:p-4">
          {/* Collapsible Flight Info */}
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs sm:text-base mb-2"
              onClick={() => setShowFlightInfo(v => !v)}
            >
              {showFlightInfo ? 'Nascondi dettagli volo' : 'Mostra dettagli volo'}
            </Button>
            {showFlightInfo && (
              <div>
                <div className="flex flex-wrap gap-4 mb-2 items-center">
                  {flight.travelClass && (
                    <div className="text-xs sm:text-base bg-sky-100 rounded px-2 py-1 font-semibold text-sky-800">Classe: {flight.travelClass}</div>
                  )}
                  {flight.travelers && (
                    <div className="text-xs sm:text-base bg-gold-100 rounded px-2 py-1 font-semibold text-gold-800">Passeggeri: {flight.travelers}</div>
                  )}
                </div>
                <div className="text-xs sm:text-base font-semibold mb-2">Tratte del volo:</div>
                <div className="space-y-2">
                  {flight.departureItinerary?.segments?.map((seg: any, idx: number) => (
                    <div key={idx} className="rounded-lg bg-sky-50 border border-sky-100 p-3 flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs font-bold text-sky-700">Andata</span>
                        <span className="text-lg">🛫</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs sm:text-base font-semibold text-navy-900">{seg.from} <span className="text-gray-400">→</span> {seg.to}</div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="font-semibold">Compagnia:</span> {seg.airlineName || seg.airLine} <span className="ml-2 font-semibold">{seg.flightNumber}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="font-semibold">Partenza:</span> {seg.departureTime ? new Date(seg.departureTime).toLocaleString('it-IT') : ''}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="font-semibold">Arrivo:</span> {seg.arrivalTime ? new Date(seg.arrivalTime).toLocaleString('it-IT') : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                  {flight.returnItinerary?.segments?.map((seg: any, idx: number) => (
                    <div key={"ret-"+idx} className="rounded-lg bg-gold-50 border border-gold-100 p-3 flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs font-bold text-gold-700">Ritorno</span>
                        <span className="text-lg">🛬</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs sm:text-base font-semibold text-navy-900">{seg.from} <span className="text-gray-400">→</span> {seg.to}</div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="font-semibold">Compagnia:</span> {seg.airlineName || seg.airLine} <span className="ml-2 font-semibold">{seg.flightNumber}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="font-semibold">Partenza:</span> {seg.departureTime ? new Date(seg.departureTime).toLocaleString('it-IT') : ''}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="font-semibold">Arrivo:</span> {seg.arrivalTime ? new Date(seg.arrivalTime).toLocaleString('it-IT') : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* User Fields */}
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-base font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-base font-medium mb-1">Cognome</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-base font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-base font-medium mb-1">Telefono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-base"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-white text-xs sm:text-base">Conferma Prenotazione</Button>
          </form>
          <Button onClick={onClose} variant="outline" className="w-full mt-4 text-xs sm:text-base">Annulla</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;