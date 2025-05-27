import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { ImageOff, AlertCircle, Play } from 'lucide-react';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface VehicleGridProps {
  vehicles: Car[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [failedVideos, setFailedVideos] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageUrl);
      return newSet;
    });
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set([...prev, imageUrl]));
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageUrl);
      return newSet;
    });
  };

  const handleVideoError = (videoUrl: string) => {
    setFailedVideos(prev => new Set([...prev, videoUrl]));
    setPlayingVideo(null);
  };

  const FallbackImage = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
      <ImageOff className="w-8 h-8 mb-2" />
      <span className="text-sm text-center px-4">Imagine indisponibilă</span>
    </div>
  );

  const FallbackVideo = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
      <AlertCircle className="w-8 h-8 mb-2" />
      <span className="text-sm text-center px-4">Video indisponibil</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {vehicles.map((car) => {
        const { ref, inView } = useInView({
          triggerOnce: true,
          threshold: 0.1,
          rootMargin: '100px',
        });

        return (
          <motion.div
            ref={ref}
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all relative flex flex-col ring-1 ring-gray-200 ${
              car.status === 'sold' ? 'opacity-75' : ''
            }`}
            onMouseEnter={() => setHoveredCard(car.id)}
            onMouseLeave={() => {
              setHoveredCard(null);
              setPlayingVideo(null);
            }}
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
              <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                navigation={hoveredCard === car.id}
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true
                }}
                loop={car.images.length > 1}
                className="h-full group"
                watchSlidesProgress={true}
                preloadImages={false}
                grabCursor={true}
                effect="fade"
                speed={300}
                lazy={{
                  loadPrevNext: true,
                  loadPrevNextAmount: 1,
                }}
              >
                {car.images && car.images.map((image, index) => {
                  const isLoaded = loadedImages.has(image);
                  const hasFailed = failedImages.has(image);

                  return (
                    <SwiperSlide key={`image-${index}`}>
                      <Link to={`/cars/${car.id}`} className="block w-full h-full">
                        {!isLoaded && !hasFailed && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        )}
                        {hasFailed ? (
                          <FallbackImage />
                        ) : (
                          inView && (
                            <img
                              src={`${image}?width=400&quality=80&format=webp`}
                              srcSet={`
                                ${image}?width=400&quality=80&format=webp 400w,
                                ${image}?width=800&quality=80&format=webp 800w
                              `}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              alt={`${car.title} - Imagine ${index + 1}`}
                              className={`w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 ${
                                isLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                              loading="lazy"
                              decoding="async"
                              onLoad={() => handleImageLoad(image)}
                              onError={() => handleImageError(image)}
                              fetchPriority={index === 0 ? "high" : "low"}
                            />
                          )
                        )}
                      </Link>
                    </SwiperSlide>
                  );
                })}

                {car.videos && car.videos.map((video, index) => {
                  const hasFailed = failedVideos.has(video);

                  return (
                    <SwiperSlide key={`video-${index}`}>
                      {hasFailed ? (
                        <FallbackVideo />
                      ) : (
                        <div 
                          className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setPlayingVideo(playingVideo === video ? null : video);
                          }}
                        >
                          {playingVideo === video ? (
                            <video
                              src={video}
                              className="w-full h-full object-contain"
                              autoPlay
                              controls
                              playsInline
                              poster={car.images[0]}
                              preload="metadata"
                              onError={() => handleVideoError(video)}
                            />
                          ) : (
                            <>
                              <Play className="absolute w-12 h-12 text-white opacity-80 z-10" />
                              <img
                                src={`${car.images[0]}?width=400&quality=80&format=webp`}
                                alt={`${car.title} - Video thumbnail`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={() => handleImageError(car.images[0])}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {car.videos && car.videos.length > 0 && !car.videos.every(v => failedVideos.has(v)) && (
                <div className="absolute top-2 right-2 z-10 bg-black/70 text-white px-2 py-1 rounded-md flex items-center text-xs sm:text-sm">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>Video</span>
                </div>
              )}

              {car.status === 'sold' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Vândut
                  </span>
                </div>
              )}
            </div>

            <Link to={`/cars/${car.id}`} className="flex-1 p-4 sm:p-5 bg-[#d0e0e7]">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{car.title}</h3>
              <div className="flex justify-between items-center">
                <span className={`text-base sm:text-lg font-bold ${car.status === 'sold' ? 'text-gray-900/60' : 'text-[#0C3C01]'}`}>
                  {formatPrice(car.price)}
                </span>
                <span className={`text-sm sm:text-base ${car.status === 'sold' ? 'text-gray-900/60' : 'text-gray-900'}`}>
                  {car.year}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <span>{car.mileage.toLocaleString()} km</span>
                <span className="mx-2">•</span>
                <span>{car.specs.fuelType}</span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}