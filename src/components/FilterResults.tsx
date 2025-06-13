import React from 'react';

const FilterResults: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="font-semibold text-navy-900 mb-4">Sort by</h3>
    <div className="space-y-2">
      <label className="flex items-center"><input type="radio" name="sort" value="price" className="mr-2" />Price (Low to High)</label>
      <label className="flex items-center"><input type="radio" name="sort" value="duration" className="mr-2" />Duration</label>
      <label className="flex items-center"><input type="radio" name="sort" value="departure" className="mr-2" />Departure Time</label>
    </div>
  </div>
);

export default FilterResults;
