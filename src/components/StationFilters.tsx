
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterOptions {
  type: string[];
  minAvailability: number;
  maxDistance: number;
  minRating: number;
}

interface StationFiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  types: string[];
}

const StationFilters: React.FC<StationFiltersProps> = ({ 
  filterOptions, 
  onFilterChange,
  types 
}) => {
  const handleTypeChange = (type: string, checked: boolean) => {
    let newTypes = [...filterOptions.type];
    
    if (checked) {
      newTypes.push(type);
    } else {
      newTypes = newTypes.filter(t => t !== type);
    }
    
    onFilterChange({ ...filterOptions, type: newTypes });
  };
  
  const handleSliderChange = (key: keyof Omit<FilterOptions, 'type'>, value: number[]) => {
    onFilterChange({ ...filterOptions, [key]: value[0] });
  };
  
  const resetFilters = () => {
    onFilterChange({
      type: [],
      minAvailability: 0,
      maxDistance: 100,
      minRating: 0
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filter Stations</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Charger Type Filter */}
        <div>
          <h4 className="font-medium text-sm mb-2">Charger Type</h4>
          <div className="space-y-2">
            {types.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filterOptions.type.includes(type)}
                  onCheckedChange={(checked) => handleTypeChange(type, checked === true)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Availability Filter */}
        <div>
          <h4 className="font-medium text-sm mb-3">Minimum Availability</h4>
          <div className="px-2">
            <Slider 
              defaultValue={[filterOptions.minAvailability]} 
              max={10} 
              step={1}
              onValueChange={(value) => handleSliderChange('minAvailability', value)} 
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">Current: {filterOptions.minAvailability}</span>
              <span className="text-xs text-gray-500">10</span>
            </div>
          </div>
        </div>
        
        {/* Distance Filter */}
        <div>
          <h4 className="font-medium text-sm mb-3">Maximum Distance (miles)</h4>
          <div className="px-2">
            <Slider 
              defaultValue={[filterOptions.maxDistance]} 
              max={100} 
              step={5}
              onValueChange={(value) => handleSliderChange('maxDistance', value)} 
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">Current: {filterOptions.maxDistance}</span>
              <span className="text-xs text-gray-500">100</span>
            </div>
          </div>
        </div>
        
        {/* Rating Filter */}
        <div>
          <h4 className="font-medium text-sm mb-3">Minimum Rating</h4>
          <div className="px-2">
            <Slider 
              defaultValue={[filterOptions.minRating]} 
              max={5} 
              step={0.5}
              onValueChange={(value) => handleSliderChange('minRating', value)} 
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">Current: {filterOptions.minRating}</span>
              <span className="text-xs text-gray-500">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationFilters;
