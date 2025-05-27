import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck, Home, ArrowLeft, Lock } from 'lucide-react';
import { useState } from 'react';
import Cookies from 'js-cookie';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(Cookies.get('adminAccess') === 'true');

  const handleAdminAccess = () => {
    if (password === 'nt12gcw') {
      setIsAdmin(true);
      setShowAdminPrompt(false);
      Cookies.set('adminAccess', 'true', { expires: 1 });
      navigate('/admin');
    } else {
      alert('Parolă incorectă');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-primary to-gray-800 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="md:hidden text-white hover:text-secondary transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <Truck className="w-8 h-8 text-white" />
            <span className="text-lg md:text-xl font-bold text-white">AutoUtilitare Neamț</span>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link 
            to="/"
            className="text-white hover:text-secondary transition-colors hidden md:flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Acasă</span>
          </Link>
          <Link 
            to="/contact"
            className="text-white hover:text-secondary transition-colors hidden md:flex"
          >
            Contact
          </Link>
          <button
            onClick={() => setShowAdminPrompt(true)}
            className="text-white hover:text-secondary transition-colors p-2 rounded-full"
            aria-label="Admin access"
          >
            <Lock className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-primary md:hidden">
            <div className="py-4 px-4 space-y-4">
              <Link 
                to="/"
                className="text-white hover:text-secondary transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>Acasă</span>
              </Link>
              <Link 
                to="/contact"
                className="text-white hover:text-secondary transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Admin Password Prompt */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
            <h2 className="text-xl font-bold mb-4">Acces Admin</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduceți parola"
              className="w-full px-4 py-2 border rounded-md mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdminAccess();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAdminPrompt(false);
                  setPassword('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Anulează
              </button>
              <button
                onClick={handleAdminAccess}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Accesează
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}