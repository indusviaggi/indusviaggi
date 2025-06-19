import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast({ title: 'Email non valida', description: 'Inserisci un indirizzo email valido.', variant: 'destructive', duration: 5000 });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mail/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, type: 'newsletter' }),
      });
      if (!response.ok) {
        toast({ title: 'Errore', description: 'Impossibile iscriversi alla newsletter. Riprova più tardi.', variant: 'destructive', duration: 5000 });
        setLoading(false);
        return;
      }
      setShowNewsletterDialog(true);
      setEmail('');
    } catch (error) {
      toast({ title: 'Errore', description: 'Si è verificato un errore di rete.', variant: 'destructive', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/Indusviaggi',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-navy-900 text-white pt-8 pb-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-3">Indus Viaggi</h3>
            <p className="text-gray-300 mb-4 text-sm">
              La tua agenzia di viaggi di fiducia per esplorare il mondo con comfort e stile.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Facebook, name: 'facebook' },
                { icon: Instagram, name: 'instagram' },
                { icon: Twitter, name: 'twitter' },
                { icon: Linkedin, name: 'linkedin' },
                { icon: Youtube, name: 'youtube' },
              ].map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  onClick={() => handleSocialClick(name)}
                  className="text-gray-300 hover:text-gold-500 transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                  aria-label={name}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Informazioni Legali</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Termini e Condizioni', path: '/terms' },
                { name: 'Rimborsi', path: '/refunds' },
                { name: 'Cancellazioni', path: '/cancellations' },
                { name: 'FAQ', path: '/faq' },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.path} className="text-gray-300 hover:text-gold-500 transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Newsletter</h4>
            <p className="text-gray-300 mb-3 text-sm">
              Iscriviti per ricevere le migliori offerte di viaggio!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-xs">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                className="flex-1 px-1 py-2 rounded-l-lg text-navy-900 focus:outline-none text-sm"
                required
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 px-3 py-3 rounded-r-lg transition-colors duration-300"
                disabled={loading}
                aria-label="Iscriviti alla newsletter"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-gray-300 text-xs md:text-sm">
          <div className="flex items-center gap-2 justify-center">
            <img
              src="/iata1.png"
              alt="Iata Logo"
              title="Iata Logo"
              className="inline-block align-middle ml-1"
              style={{ height: 60 }}
            />
            <span>&copy; {new Date().getFullYear()} <Link to='#' className='text-gold-600' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Indus Viaggi.</Link> Tutti i diritti riservati.</span>
          </div>
          <div className="text-grey-400">Powered by: <Link to="https://www.akwares.io" target='blank' className="text-gold-600">Akwares</Link></div>
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
