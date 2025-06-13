import React from 'react';
import FilterResults from '@/components/FilterResults';

interface ResultsListProps {
  results: any[];
  cabinClasses: { id: string; label: string }[];
  cabinClass: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, cabinClasses, cabinClass }) => (
  <div className="flex flex-col lg:flex-row gap-8">
    <div className="lg:w-1/4">
      <FilterResults />
    </div>
    <div className="lg:w-3/4">
      <div className="space-y-4">
        {results.map((flight, idx) => {
          const depSegs = flight.departureItinerary?.segments || [];
          const retSegs = flight.returnItinerary?.segments || [];
          const depFirst = depSegs[0];
          const depLast = depSegs[depSegs.length-1];
          const retFirst = retSegs[0];
          const retLast = retSegs[retSegs.length-1];
          return (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  <button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded">Select Flight</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default ResultsList;
