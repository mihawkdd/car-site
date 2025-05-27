import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { Info, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export function Contact() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/40751614321', '_blank');
  };

  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/CS6SfMZhq6oD149s7', '_blank');
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-black">Contact</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Despre Noi */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">Despre Noi</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 mt-1 text-primary" />
                  <p className="text-black">
                    Cu peste 10 ani de experiență în domeniul auto, oferim cele mai bune soluții pentru afacerea dumneavoastră.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 mt-1 text-primary" />
                  <p className="text-black">
                    Program:
                    <br />
                    Luni - Sâmbătă: 09:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">Contact</h3>
              <div className="space-y-4">
                <a href="mailto:autoutilitareneamt@gmail.com" className="flex items-center space-x-2 text-black hover:text-secondary">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>autoutilitareneamt@gmail.com</span>
                </a>
                <div className="space-y-2">
                  <a href="tel:+40751614321" className="flex items-center space-x-2 text-black hover:text-secondary">
                    <Phone className="w-5 h-5 text-primary" />
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
              <h3 className="text-xl font-bold mb-4 text-black">Unde ne găsiți</h3>
              <button 
                onClick={handleMapClick}
                className="flex items-start space-x-2 text-black hover:text-secondary transition-colors"
              >
                <MapPin className="w-5 h-5 mt-1 text-primary" />
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
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}