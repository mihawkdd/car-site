import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  images: string[];
  specs: {
    fuelType: string;
  };
  status: 'available' | 'sold';
}

export function Home() {
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Autoutilitare Disponibile</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCars.map((car) => (
            <Link
              key={car.id}
              to={`/cars/${car.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  loop={car.images.length > 1}
                  className="h-full group"
                >
                  {car.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`${image}?width=400&quality=75&format=webp`}
                        srcSet={`
                          ${image}?width=400&quality=75&format=webp 400w,
                          ${image}?width=800&quality=75&format=webp 800w
                        `}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={`${car.title} - Imagine ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{car.title}</h2>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-700">
                    {formatPrice(car.price)}
                  </span>
                  <span className="text-gray-600">{car.year}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{car.mileage.toLocaleString()} km</span>
                  <span className="mx-2">•</span>
                  <span>{car.specs.fuelType}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {availableCars.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            Nu există autoutilitare disponibile în acest moment.
          </p>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <button
                onClick={() => {
                  window.open('https://wa.me/40751614321', '_blank');
                }}
                className="text-green-600 hover:text-green-700 flex items-center"
              >
                <span>Contactează prin WhatsApp</span>
              </button>
              <p>Email: <a href="mailto:autoutilitareneamt@gmail.com" className="text-blue-600 hover:underline">autoutilitareneamt@gmail.com</a></p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Program</h3>
              <p>Luni - Sâmbătă: 09:00 - 18:00</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Locație</h3>
              <a
                href="https://g.co/kgs/qsF1o1f"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <p>Strada Bistritei 83</p>
                <p>Piatra-Neamt, România</p>
                <p>(Langa Lukoil)</p>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} AutoUtilitare Neamt. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}