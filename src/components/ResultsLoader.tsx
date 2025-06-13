import React from 'react';

const ResultsLoader: React.FC = () => (
  <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
    <div className="lg:w-1/4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="lg:w-3/4">
      <div className="space-y-4">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="flex items-center space-x-8">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="md:ml-8 mt-4 md:mt-0 text-center">
                <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ResultsLoader;
