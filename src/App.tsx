import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { CarDetails } from './pages/CarDetails';
import { Contact } from './pages/Contact';
import { AvailableVehicles } from './pages/AvailableVehicles';
import { SoldVehicles } from './pages/SoldVehicles';
import { AdminPanel } from './pages/AdminPanel';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminAccess = Cookies.get('adminAccess');
    if (adminAccess === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicule-disponibile" element={<AvailableVehicles />} />
          <Route path="/vehicule-vandute" element={<SoldVehicles />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/contact" element={<Contact />} />
          {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;