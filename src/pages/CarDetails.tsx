import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase, retryableQuery } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { ArrowLeft, MapPin, MessageSquare, Calendar, Gauge, Fuel, Box, Settings, X, Flag, Power } from 'lucide-react';

interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  images: string[];
  country_of_origin: string;
  engine_power: number;
  specs: {
    engine: string;
    transmission: string;
    fuelType: string;
    payload: string;
    cargoSpace: string;
  };
  status: 'available' | 'sold';
}

export function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [car]);

  useEffect(() => {
    if (id) {
      fetchCar();
      fetchRelatedCars();
    }
  }, [id]);

  async function fetchCar() {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await retryableQuery(() => 
        supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single()
      );

      if (error) throw error;
      if (data) {
        setCar(data);
        // Reset scroll position
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError('Could not load vehicle details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchRelatedCars() {
    try {
      const { data, error } = await retryableQuery(() =>
        supabase
          .from('cars')
          .select('*')
          .neq('id', id)
          .eq('status', 'available')
          .limit(3)
      );

      if (error) throw error;
      if (data) {
        setRelatedCars(data);
      }
    } catch (error) {
      console.error('Error:', error);
      // Don't show error for related cars as they're not critical
    }
  }

  function handleImageClick(image: string, index: number) {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!car) return;
    
    if (e.key === 'ArrowLeft') {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
      setSelectedImage(car.images[(currentImageIndex - 1 + car.images.length) % car.images.length]);
    } else if (e.key === 'ArrowRight') {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
      setSelectedImage(car.images[(currentImageIndex + 1) % car.images.length]);
    } else if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  }

  useEffect(() => {
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage, currentImageIndex]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Bună ziua, sunt interesat de ${car?.title}. Aș dori mai multe informații.`);
    window.open(`https://wa.me/40751614321?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchCar()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-lg mb-4">Vehiculul nu a fost găsit</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12" ref={detailsRef}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Înapoi
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="relative">
              <img
                src={`${car.images[currentImageIndex]}?width=800&quality=80&format=webp`}
                alt={car.title}
                className="w-full rounded-lg cursor-pointer"
                onClick={() => handleImageClick(car.images[currentImageIndex], currentImageIndex)}
                loading="eager"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-4">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                  className={`aspect-square rounded-md overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={`${image}?width=100&quality=80&format=webp`}
                    alt={`${car.title} vedere ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{car.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl font-bold text-green-700">{formatPrice(car.price)}</span>
              {car.status === 'sold' && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  Vândut
                </span>
              )}
            </div>

            <div className="space-y-6">
              <p className="text-gray-700">{car.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">An fabricație</dt>
                    <dd className="font-semibold">{car.year}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Kilometraj</dt>
                    <dd className="font-semibold">{car.mileage.toLocaleString()} km</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Motor</dt>
                    <dd className="font-semibold">{car.specs.engine}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Power className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Putere Motor</dt>
                    <dd className="font-semibold">{car.engine_power} CP</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Transmisie</dt>
                    <dd className="font-semibold">{car.specs.transmission}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Flag className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Țara de origine</dt>
                    <dd className="font-semibold">{car.country_of_origin}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Combustibil</dt>
                    <dd className="font-semibold">{car.specs.fuelType}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Box className="w-5 h-5 text-gray-500" />
                  <div>
                    <dt className="text-sm text-gray-500">Spațiu marfă</dt>
                    <dd className="font-semibold">{car.specs.cargoSpace}</dd>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 mt-6">
                <a
                  href="https://g.co/kgs/qsF1o1f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-lg"
                >
                  <MapPin className="w-6 h-6" />
                  <span>Vezi pe Google Maps</span>
                </a>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] text-white py-3 px-6 rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center space-x-2 text-lg"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>Contactează prin WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Vehicles */}
        {relatedCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Vehicule similare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar) => (
                <Link
                  key={relatedCar.id}
                  to={`/cars/${relatedCar.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={`${relatedCar.images[0]}?width=400&quality=80&format=webp`}
                      alt={relatedCar.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{relatedCar.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-700">
                        {formatPrice(relatedCar.price)}
                      </span>
                      <span className="text-gray-600">{relatedCar.year}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt={car.title}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}