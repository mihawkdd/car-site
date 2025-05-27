import { useState, useEffect, useRef } from 'react';
import { PlusCircle, Pencil, Trash2, Loader2, Tag, Upload, Play, ArrowLeft } from 'lucide-react';
import { supabase, uploadImage, uploadVideo, withAdminToken } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { useMedia } from 'react-use';
import { DraggableImageList } from '../components/DraggableImageList';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  images: string[];
  videos: string[];
  specs: {
    engine: string;
    engine_power: string;
    transmission: string;
    fuelType: string;
    country_of_origin: string;
    payload: string;
    cargoSpace: string;
  };
  status: 'available' | 'sold';
  created_at: string;
}

interface CarFormData {
  title: string;
  description: string;
  price: string;
  year: string;
  mileage: string;
  engine: string;
  engine_power: string;
  transmission: string;
  fuelType: string;
  country_of_origin: string;
  payload: string;
  cargoSpace: string;
  images: string[];
  videos: string[];
  status: 'available' | 'sold';
}

const initialFormData: CarFormData = {
  title: '',
  description: '',
  price: '',
  year: '',
  mileage: '',
  engine: '',
  engine_power: '',
  transmission: '',
  fuelType: '',
  country_of_origin: '',
  payload: '',
  cargoSpace: '',
  images: [],
  videos: [],
  status: 'available'
};

export function AdminPanel() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CarFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCar, setEditingCar] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const isMobile = useMedia('(max-width: 640px)');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showForm]);

  async function fetchCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploadingMedia(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const url = await uploadImage(file);
          if (url) uploadedUrls.push(url);
        } catch (error: any) {
          errors.push(`Error uploading ${file.name}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        alert(`Some images failed to upload:\n${errors.join('\n')}`);
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
      }
    } catch (error: any) {
      console.error('Error handling image uploads:', error);
      alert(error.message || 'Error uploading images. Please try again.');
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploadingMedia(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const url = await uploadVideo(file);
          if (url) uploadedUrls.push(url);
        } catch (error: any) {
          errors.push(`Error uploading ${file.name}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        alert(`Some videos failed to upload:\n${errors.join('\n')}`);
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          videos: [...prev.videos, ...uploadedUrls]
        }));
      }
    } catch (error: any) {
      console.error('Error handling video uploads:', error);
      alert(error.message || 'Error uploading videos. Please try again.');
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const carData = withAdminToken({
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      images: formData.images,
      videos: formData.videos,
      status: formData.status,
      specs: {
        engine: formData.engine,
        engine_power: formData.engine_power,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        country_of_origin: formData.country_of_origin,
        payload: formData.payload,
        cargoSpace: formData.cargoSpace
      }
    });

    try {
      if (editingCar) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', editingCar);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cars')
          .insert([carData]);
        
        if (error) throw error;
      }

      setShowForm(false);
      setFormData(initialFormData);
      setEditingCar(null);
      fetchCars();
    } catch (error: any) {
      alert('Error saving vehicle: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleStatus(carId: string, currentStatus: 'available' | 'sold') {
    try {
      const newStatus = currentStatus === 'available' ? 'sold' : 'available';
      const { error } = await supabase
        .from('cars')
        .update(withAdminToken({ status: newStatus }))
        .eq('id', carId);
      
      if (error) throw error;
      fetchCars();
    } catch (error: any) {
      alert('Error updating status: ' + error.message);
    }
  }

  const handleImageReorder = (newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleImageDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-1 hidden sm:inline">Înapoi</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-primary">Admin Panel</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingCar(null);
              setFormData(initialFormData);
            }}
            className="bg-primary text-white px-4 md:px-6 py-2 rounded-md hover:bg-primary/90 transition-colors inline-flex items-center justify-center w-full md:w-auto"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Vehicle
          </button>
        </div>

        {showForm && (
          <div ref={formRef} className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 font-display">
              {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (Euro)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mileage</label>
                  <input
                    type="number"
                    required
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Engine</label>
                  <input
                    type="text"
                    required
                    value={formData.engine}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: 2.0L TDI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Engine Power (HP)</label>
                  <input
                    type="number"
                    required
                    value={formData.engine_power}
                    onChange={(e) => setFormData({ ...formData, engine_power: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: 150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Transmission</label>
                  <input
                    type="text"
                    required
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: Manual 6-speed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fuel Type</label>
                  <input
                    type="text"
                    required
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: Diesel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country of Origin</label>
                  <input
                    type="text"
                    required
                    value={formData.country_of_origin}
                    onChange={(e) => setFormData({ ...formData, country_of_origin: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: Germany"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payload</label>
                  <input
                    type="text"
                    required
                    value={formData.payload}
                    onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: 1,200 kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cargo Space</label>
                  <input
                    type="text"
                    required
                    value={formData.cargoSpace}
                    onChange={(e) => setFormData({ ...formData, cargoSpace: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                    placeholder="ex: 14.5 m³"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'sold' })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Media</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex-1">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-6 h-6 mr-2" />
                        <span>Upload Images</span>
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Play className="w-6 h-6 mr-2" />
                        <span>Upload Videos</span>
                      </div>
                    </label>
                  </div>
                  
                  {uploadingMedia && (
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading media...</span>
                    </div>
                  )}

                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Images (drag to reorder)</h3>
                      <DraggableImageList
                        images={formData.images}
                        onReorder={handleImageReorder}
                        onDelete={handleImageDelete}
                      />
                    </div>
                  )}

                  {formData.videos?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.videos.map((url, index) => (
                        <div key={`video-${index}`} className="relative group">
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-400" />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newVideos = formData.videos.filter((_, i) => i !== index);
                              setFormData({ ...formData, videos: newVideos });
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCar(null);
                    setFormData(initialFormData);
                  }}
                  className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4">Title</th>
                  {!isMobile && (
                    <>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Year</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Added</th>
                    </>
                  )}
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="border-b border-gray-200">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span>{car.title}</span>
                        {isMobile && (
                          <>
                            <span className="text-sm text-gray-600">{formatPrice(car.price)}</span>
                            <span className="text-sm text-gray-600">{car.year}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              car.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {car.status === 'available' ? 'Available' : 'Sold'}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    {!isMobile && (
                      <>
                        <td className="p-4">{formatPrice(car.price)}</td>
                        <td className="p-4">{car.year}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            car.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {car.status === 'available' ? 'Available' : 'Sold'}
                          </span>
                        </td>
                        <td className="p-4">{new Date(car.created_at).toLocaleDateString('ro-RO')}</td>
                      </>
                    )}
                    <td className="p-4">
                      <div className="flex flex-col md:flex-row gap-2">
                        <button 
                          className="text-primary hover:text-primary/80 inline-flex items-center"
                          onClick={() => {
                            setEditingCar(car.id);
                            setFormData({
                              title: car.title,
                              description: car.description,
                              price: car.price.toString(),
                              year: car.year.toString(),
                              mileage: car.mileage.toString(),
                              engine: car.specs.engine,
                              engine_power: car.specs.engine_power,
                              transmission: car.specs.transmission,
                              fuelType: car.specs.fuelType,
                              country_of_origin: car.specs.country_of_origin,
                              payload: car.specs.payload,
                              cargoSpace: car.specs.cargoSpace,
                              images: car.images,
                              videos: car.videos || [],
                              status: car.status
                            });
                            setShowForm(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          <span className="md:hidden">Edit</span>
                        </button>
                        <button 
                          className="text-accent hover:text-accent/80 inline-flex items-center"
                          onClick={() => toggleStatus(car.id, car.status)}
                        >
                          <Tag className="w-4 h-4 mr-1" />
                          <span className="md:hidden">
                            {car.status === 'available' ? 'Mark as Sold' : 'Mark as Available'}
                          </span>
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-700 inline-flex items-center"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this vehicle?')) {
                              const { error } = await supabase
                                .from('cars')
                                .delete()
                                .eq('id', car.id);

                              if (error) {
                                alert('Error deleting: ' + error.message);
                              } else {
                                fetchCars();
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="md:hidden">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}