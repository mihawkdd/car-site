import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { Footer } from '../components/Footer';
import { Search, Filter } from 'lucide-react';

interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  cargoVolume: number;
  images: string[];
  status?: 'available' | 'sold';
}

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

export function Inventory() {
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

  const [availableCars] = useState<Car[]>([
    {
      id: '1',
      title: 'Mercedes-Benz Sprinter Van',
      price: 35999,
      year: 2022,
      mileage: 45000,
      fuelType: 'Diesel',
      cargoVolume: 11,
      status: 'available',
      images: ['https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=2000']
    },
    // ... other cars
  ]);

  const filterCars = (cars: Car[]) => {
    return cars.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.year.toString().includes(searchQuery) ||
        formatPrice(car.price).includes(searchQuery);

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

  const filteredCars = filterCars(availableCars);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 pt-4">
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
                  <label className="block text-sm font-medium mb-1">An fabricație</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minYear}
                      onChange={(e) => setFilters({...filters, minYear: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxYear}
                      onChange={(e) => setFilters({...filters, maxYear: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preț (EUR)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kilometraj</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minMileage}
                      onChange={(e) => setFilters({...filters, minMileage: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxMileage}
                      onChange={(e) => setFilters({...filters, maxMileage: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Volum (m³)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minVolume}
                      onChange={(e) => setFilters({...filters, minVolume: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxVolume}
                      onChange={(e) => setFilters({...filters, maxVolume: e.target.value})}
                      className="w-full px-3 py-1 border rounded"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Combustibil</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                    className="w-full px-3 py-1 border rounded"
                  >
                    <option value="">Toate</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Benzină">Benzină</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({
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
                  }}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Resetează filtrele
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredCars.map((car) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link to={`/cars/${car.id}`} className="block">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base md:text-lg font-semibold mb-2 text-black line-clamp-1">{car.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base font-bold text-[#0C3C01]">{formatPrice(car.price)}</span>
                    <span className="text-sm text-black">{car.year}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}