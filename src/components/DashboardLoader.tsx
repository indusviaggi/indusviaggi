import React from 'react';

const DashboardLoader: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, idx) => (
      <div key={idx+'load'} className="border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="h-4 w-32 bg-gray-200 rounded mr-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded mr-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-56 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 md:mt-0 text-right flex flex-col items-end">
            <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default DashboardLoader;
