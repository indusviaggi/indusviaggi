
import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive"
      });
      return;
    }

    setShowNewsletterDialog(true);
    setEmail('');
  };

  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com'
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-navy-900 text-white py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Indus Viaggi</h3>
            <p className="text-gray-300 mb-4">
              La tua agenzia di viaggi di fiducia per esplorare il mondo con comfort e stile.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, name: 'facebook' },
                { icon: Instagram, name: 'instagram' },
                { icon: Twitter, name: 'twitter' },
                { icon: Linkedin, name: 'linkedin' },
                { icon: Youtube, name: 'youtube' }
              ].map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  onClick={() => handleSocialClick(name)}
                  className="text-gray-300 hover:text-gold-500 transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Link Rapidi</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Destinazioni', path: '/#destinations' },
                { name: 'Voli', path: '/#flights' },
                { name: 'Chi Siamo', path: '/#about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-gold-500 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informazioni Legali</h4>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Termini e Condizioni', path: '/terms' },
                { name: 'Rimborsi', path: '/refunds' },
                { name: 'Cancellazioni', path: '/cancellations' },
                { name: 'FAQ', path: '/faq' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-gold-500 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Iscriviti per ricevere le migliori offerte di viaggio!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                className="flex-1 px-4 py-2 rounded-l-lg text-navy-900 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 px-4 py-2 rounded-r-lg transition-colors duration-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Indus Viaggi. Tutti i diritti riservati.</p>
        </div>
      </div>

      {/* Newsletter Success Dialog */}
      <Dialog open={showNewsletterDialog} onOpenChange={setShowNewsletterDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Iscrizione Completata!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              Grazie per esserti iscritto alla nostra newsletter! Riceverai le migliori offerte direttamente nella tua email.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
