import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Footer } from '../components/Footer';
import { VehicleGrid } from '../components/VehicleGrid';
import { cars } from '../lib/data';
import { Car } from '../types/car';

interface Filters {
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  minMileage: string;
  maxMileage: string;
  fuelType: string;
  minVolume: string;
  maxVolume: string;
}

export function SoldVehicles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
    fuelType: '',
    minVolume: '',
    maxVolume: ''
  });

  const soldCars = cars.filter(car => car.status === 'sold');

  const filterCars = (cars: Car[]) => {
    return cars.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.year.toString().includes(searchQuery) ||
        car.price.toString().includes(searchQuery);

      const matchesYear = (!filters.minYear || car.year >= parseInt(filters.minYear)) &&
        (!filters.maxYear || car.year <= parseInt(filters.maxYear));

      const matchesPrice = (!filters.minPrice || car.price >= parseInt(filters.minPrice)) &&
        (!filters.maxPrice || car.price <= parseInt(filters.maxPrice));

      const matchesMileage = (!filters.minMileage || car.mileage >= parseInt(filters.minMileage)) &&
        (!filters.maxMileage || car.mileage <= parseInt(filters.maxMileage));

      const matchesFuelType = !filters.fuelType || car.fuelType === filters.fuelType;

      const matchesVolume = (!filters.minVolume || car.cargoVolume >= parseInt(filters.minVolume)) &&
        (!filters.maxVolume || car.cargoVolume <= parseInt(filters.maxVolume));

      return matchesSearch && matchesYear && matchesPrice && matchesMileage && matchesFuelType && matchesVolume;
    });
  };

  const filteredCars = filterCars(soldCars);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold mb-8">Autoutilitare Vândute</h1>
        
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Căutați după nume, an sau preț..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-full border-2 border-black bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm md:text-base placeholder-gray-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">An minim</label>
                  <input
                    type="number"
                    value={filters.minYear}
                    onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">An maxim</label>
                  <input
                    type="number"
                    value={filters.maxYear}
                    onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preț minim</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preț maxim</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kilometraj minim</label>
                  <input
                    type="number"
                    value={filters.minMileage}
                    onChange={(e) => setFilters({ ...filters, minMileage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kilometraj maxim</label>
                  <input
                    type="number"
                    value={filters.maxMileage}
                    onChange={(e) => setFilters({ ...filters, maxMileage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tip combustibil</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Toate</option>
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Benzină</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hibrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Volum minim (m³)</label>
                  <input
                    type="number"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({ ...filters, minVolume: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Volum maxim (m³)</label>
                  <input
                    type="number"
                    value={filters.maxVolume}
                    onChange={(e) => setFilters({ ...filters, maxVolume: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <VehicleGrid vehicles={filteredCars} />
      </div>
      <Footer />
    </div>
  );
}