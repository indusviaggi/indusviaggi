import { useState, useEffect } from 'react';
import { Menu, X, User, LogIn, LogOut, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  
  const { user, login, signup, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast({ title: "Bentornato!", description: "Hai effettuato l'accesso con successo." });
      setLoginEmail('');
      setLoginPassword('');
      setIsLoginOpen(false);
      navigate('/dashboard');
    } else {
      toast({ title: "Accesso fallito", description: "Email o password non validi.", variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(signupName, signupEmail, signupPassword);
    if (success) {
      toast({ title: "Benvenuto su SkyWander!", description: "Il tuo account è stato creato con successo." });
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setIsSignupOpen(false);
      navigate('/dashboard');
    } else {
      toast({ title: "Registrazione fallita", description: "Utente già esistente o dati non validi.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Arrivederci!", description: "Hai effettuato il logout con successo." });
    navigate('/');
  };

  const handleNavClick = (section: string) => {
    if (location.pathname !== '/') {
      // If not on homepage, navigate to homepage first, then scroll
      navigate('/');
      setTimeout(() => {
        if (section === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    } else {
      // If on homepage, just scroll to section
      if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-6 lg:px-10',
        'bg-white/95 backdrop-blur-md shadow-sm py-4'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gold-500 p-2 rounded-lg">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-maiandra font-bold text-xl sm:text-2xl tracking-tight text-navy-900">
            Indus Viaggi
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {[
              { key: 'home', label: 'Home' },
              { key: 'destinations', label: 'Destinazioni' },
              { key: 'flights', label: 'Voli' },
              { key: 'about', label: 'Chi Siamo' }
            ].map((item) => (
              <li key={item.key}>
                <button 
                  onClick={() => handleNavClick(item.key)}
                  className="font-medium transition-all duration-300 hover:text-gold-500 text-navy-900"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="font-medium transition-all duration-300 hover:text-gold-500 text-navy-900 hover:bg-gold-50"
                >
                  <User className="h-4 w-4 mr-1" />
                  {user.name}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="font-medium transition-all duration-300 hover:text-gold-500 text-navy-900 hover:bg-gold-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Esci
                </Button>
              </>
            ) : (
              <>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="font-medium flex items-center gap-1.5 transition-all duration-300 hover:text-gold-500 text-navy-900 hover:bg-gold-50"
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
                      <div className="text-center text-sm mt-4 text-gray-600">
                        Demo: demo@indusviaggi.com / demo123
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gold-500 hover:bg-gold-600 text-white">
                      <User className="h-4 w-4 mr-1" />
                      Registrati
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Crea un Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSignup} className="space-y-4 mt-4">
                      <div>
                        <label htmlFor="signup-name" className="block text-sm font-medium mb-1">Nome Completo</label>
                        <input 
                          type="text" 
                          id="signup-name" 
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" 
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          id="signup-email" 
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" 
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium mb-1">Password</label>
                        <input 
                          type="password" 
                          id="signup-password" 
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" 
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creazione account...' : 'Registrati'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </nav>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-navy-900" />
          ) : (
            <Menu className="h-6 w-6 text-navy-900" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in-up overflow-x-hidden">
          <ul className="flex flex-col p-4 sm:p-6 space-y-4">
            {[
              { key: 'home', label: 'Home' },
              { key: 'destinations', label: 'Destinazioni' },
              { key: 'flights', label: 'Voli' },
              { key: 'about', label: 'Chi Siamo' }
            ].map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.key)}
                  className="block py-2 text-navy-900 font-medium w-full text-left"
                >
                  {item.label}
                </button>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <button 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 w-full text-left text-navy-900 font-medium flex items-center gap-1.5"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 w-full text-left text-navy-900 font-medium flex items-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" />
                    Esci
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <button 
                        className="block py-2 w-full text-left text-navy-900 font-medium flex items-center gap-1.5"
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
                        <div className="text-center text-sm mt-4 text-gray-600">
                          Demo: demo@indusviaggi.com / demo123
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </li>
                <li>
                  <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                    <DialogTrigger asChild>
                      <button 
                        className="block py-2 w-full text-left text-gold-500 font-medium flex items-center gap-1.5"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Registrati
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Crea un Account</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSignup} className="space-y-4 mt-4">
                        <div>
                          <label htmlFor="mobile-signup-name" className="block text-sm font-medium mb-1">Nome Completo</label>
                          <input 
                            type="text" 
                            id="mobile-signup-name" 
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" 
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="mobile-signup-email" className="block text-sm font-medium mb-1">Email</label>
                          <input 
                            type="email" 
                            id="mobile-signup-email" 
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" 
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="mobile-signup-password" className="block text-sm font-medium mb-1">Password</label>
                          <input 
                            type="password" 
                            id="mobile-signup-password" 
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" 
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Creazione account...' : 'Registrati'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
