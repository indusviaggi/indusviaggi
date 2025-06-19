
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const BackgroundSlider = () => {
  const backgrounds = [
    '/travel1.jpg',
    '/travel2.jpg',
    '/travel3.jpg',
  ];
  
  const [currentBg, setCurrentBg] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [backgrounds.length]);
  
  return (
    <div className="absolute inset-0 z-0">
      {backgrounds.map((bg, index) => (
        <div
          key={bg}
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out",
            currentBg === index ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
      <div className="absolute inset-0 bg-navy-900/50" />
    </div>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <BackgroundSlider />
      <div className="relative z-10 text-center px-6 md:px-10 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-3xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Viaggia <br />
          <span className="text-gold-500">Verso l'Avventura</span>
        </h1>
        
        <p className="text-md md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          Vivi il viaggio di una vita con le nostre destinazioni selezionate e pacchetti di viaggio personalizzati.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <a href="#destinations" className="btn-accent">
            Esplora Destinazioni
          </a>
          <a href="#flights" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg transition-all duration-300">
            Prenota un Volo
          </a>
        </div>
      </div>
      
      <a
        href="#destinations"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center animate-pulse-subtle"
      >
        <span className="text-sm mb-2">Scorri Giù</span>
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
};

export default Hero;
