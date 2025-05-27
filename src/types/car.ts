export interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  cargoVolume: number;
  images: string[];
  videos?: string[];
  status: 'available' | 'sold';
  specs: {
    engine: string;
    engineCode: string;
    transmission: string;
    fuelType: string;
    payload: string;
    dimensions: string;
    doors: number;
    seats: number;
    cargoVolume: number;
  };
}