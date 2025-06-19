import { useState, useEffect } from 'react';
import { Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { key: 'home', label: 'HOME' },
  { key: 'flights', label: 'VOLI' },
  { key: 'info', label: 'PERCHE NOI' },
  { key: 'destinations', label: 'DESTINAZIONI' },
  { key: 'about', label: 'RECENSIONI' },
  { key: 'contact', label: 'CONTATTI' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { user, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast({ title: 'Bentornato!', description: 'Hai effettuato l\'accesso con successo.', duration: 5000 });
      setLoginEmail(''); setLoginPassword(''); setIsLoginOpen(false); navigate('/dashboard');
    } else {
      toast({ title: 'Accesso fallito', description: 'Email o password non validi.', variant: 'destructive', duration: 5000 });
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Arrivederci!', description: 'Hai effettuato il logout con successo.', duration: 5000 });
    navigate('/');
  };

  const handleNavClick = (section) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (section === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      if (section === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-6 bg-white/95 backdrop-blur-md shadow-sm py-3 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center min-w-0 flex-shrink-0">
          <img src="/l1.png" alt="Logo" className="h-10 w-auto logo-hover-effect" />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 items-center justify-center">
          <ul className="flex gap-4 2xl:gap-8 items-center">
            {NAV_LINKS.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.key)}
                  className="font-medium text-base 1xl:text-lg px-2 py-1 rounded transition hover:text-gold-500 text-navy-900 hover:bg-gold-50"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <a aria-label="Chat on WhatsApp" href="https://wa.me/393889220982" target="_blank" rel="noopener noreferrer">
                <img width="120" className="inline-block align-middle" alt="Chat on WhatsApp" src="/WhatsAppButtonGreenMedium.png" />
              </a>
            </li>
          </ul>
        </nav>
        {/* User/Logout/Login */}
        <div className="hidden lg:flex items-center gap-2 min-w-0 flex-shrink-0">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="font-medium hover:text-gold-500 text-navy-900 hover:bg-gold-50 px-2"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="truncate max-w-[120px]">{user.name}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="font-medium hover:text-gold-500 text-navy-900 hover:bg-gold-50 px-2"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Esci
              </Button>
            </>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-medium flex items-center gap-1.5 hover:text-gold-500 text-navy-900 hover:bg-gold-50 px-2"
                >
                  <LogIn className="h-4 w-4" />
                  Accedi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Accedi</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      id="login-email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      id="login-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Accesso in corso...' : 'Accedi'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-navy-900" /> : <Menu className="h-6 w-6 text-navy-900" />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in-up overflow-x-hidden z-50">
          <ul className="flex flex-col p-4 sm:p-6 space-y-4">
            {NAV_LINKS.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.key)}
                  className="block py-2 text-navy-900 font-small w-full text-left rounded hover:bg-gold-50"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <a aria-label="Chat on WhatsApp" href="https://wa.me/393889220982" target="_blank" rel="noopener noreferrer">
                <img width="120" className="inline-block align-middle" alt="Chat on WhatsApp" src="/WhatsAppButtonGreenMedium.png" />
              </a>
            </li>
            {user ? (
              <>
                <li>
                  <button
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                    className="block py-2 w-full text-left text-navy-900 font-medium flex items-center gap-1.5 rounded hover:bg-gold-50"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="block py-2 w-full text-left text-navy-900 font-medium flex items-center gap-1.5 rounded hover:bg-gold-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Esci
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="block py-2 w-full text-left text-navy-900 font-medium flex items-center gap-1.5 rounded hover:bg-gold-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      Accedi
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Accedi</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <div>
                        <label htmlFor="mobile-login-email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          id="mobile-login-email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="mobile-login-password" className="block text-sm font-medium mb-1">Password</label>
                        <input
                          type="password"
                          id="mobile-login-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Accesso in corso...' : 'Accedi'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
