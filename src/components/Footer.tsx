import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Info, MessageCircle } from 'lucide-react';

export function Footer() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/40751614321', '_blank');
  };

  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/CS6SfMZhq6oD149s7', '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-gray-800 via-primary to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Despre Noi */}
          <div>
            <h3 className="text-xl font-bold mb-4">Despre Noi</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 mt-1 text-gray-300" />
                <p>
                  Cu peste 10 ani de experiență în domeniul auto, oferim cele mai bune soluții pentru afacerea dumneavoastră.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 mt-1 text-gray-300" />
                <p>
                  Program:
                  <br />
                  Luni - Sâmbătă: 09:00 - 18:00
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-4">
              <a href="mailto:autoutilitareneamt@gmail.com" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
                <Mail className="w-5 h-5 text-gray-300" />
                <span>autoutilitareneamt@gmail.com</span>
              </a>
              <div className="space-y-2">
                <a href="tel:+40751614321" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
                  <Phone className="w-5 h-5 text-gray-300" />
                  <span>+40 751 614 321</span>
                </a>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center space-x-2 text-[#25D366] hover:text-[#128C7E] transition-colors ml-7"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contactează prin WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Locație */}
          <div>
            <h3 className="text-xl font-bold mb-4">Unde ne găsiți</h3>
            <button 
              onClick={handleMapClick}
              className="flex items-start space-x-2 hover:text-gray-300 transition-colors"
            >
              <MapPin className="w-5 h-5 mt-1 text-gray-300" />
              <span>
                Strada Bistritei 83
                <br />
                Piatra-Neamt, România
                <br />
                (Langa Lukoil)
              </span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} AutoUtilitare Neamt. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}