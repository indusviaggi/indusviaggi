import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <div className="bg-white/90 border border-sky-100 rounded-2xl shadow-2xl p-12 flex flex-col items-center max-w-lg w-full">
          <img src="/airplane.gif" alt="404 Airplane" />
          <h1 className="text-5xl font-bold text-navy-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-navy-800 mb-2">Pagina non trovata</h2>
          <p className="text-navy-700 text-center mb-6">La pagina che cerchi non esiste o è stata spostata.<br />Torna alla home o cerca un volo!</p>
          <Button onClick={() => navigate('/search')} className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded">
            Torna alla ricerca voli
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
