import { useEffect } from 'react';
import { MapPin, Plane, Users, Headphones } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import FlightSearch from '../components/FlightSearch';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  // Featured Destinations
  const destinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      location: "Sud-est Asiatico",
      price: 899,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    },
    {
      id: 2,
      name: "Santorini, Grecia",
      location: "Europa",
      price: 1299,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    },
    {
      id: 3,
      name: "Kyoto, Giappone",
      location: "Asia Orientale",
      price: 1099,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    },
    {
      id: 4,
      name: "Machu Picchu, Perù",
      location: "Sud America",
      price: 1599,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    },
    {
      id: 5,
      name: "Costa Amalfitana, Italia",
      location: "Europa",
      price: 1199,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      <div id="home">
        <Hero />
      </div>
      
      {/* Flight Search Section - Moved below hero */}
      <div id="flights">
        <FlightSearch />
      </div>
      
      {/* Stats Section - Moved up */}
      <section id="info" className="py-20 bg-navy-900 text-white">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Destinazioni", icon: MapPin },
              { number: "150+", label: "Compagnie Aeree", icon: Plane },
              { number: "15k+", label: "Viaggiatori Felici", icon: Users },
              { number: "24/7", label: "Supporto", icon: Headphones },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-gold-500" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Destinations Section - Moved down */}
      <section id="destinations" className="section-container">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider text-gold-500 font-medium mb-2 inline-block">
            Esplora il Mondo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Destinazioni in Evidenza
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto">
            Scopri la nostra selezione curata di destinazioni mozzafiato in tutto il mondo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              name={destination.name}
              location={destination.location}
              price={destination.price}
              rating={destination.rating}
              image={destination.image}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="btn-primary">
            Vedi Tutte le Destinazioni
          </a>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <div id="about">
        <Testimonials />
      </div>
      
      {/* Call to Action */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2800&q=80')] bg-cover bg-center" />
        
        <div className="section-container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            Pronto a Intraprendere la Tua Prossima Avventura?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Unisciti a migliaia di viaggiatori soddisfatti che hanno esplorato il mondo con Indus Viaggi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#flights" className="btn-accent">
              Prenota il Tuo Volo
            </a>
            <a href="#destinations" className="bg-white text-navy-900 hover:bg-gray-100 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md">
              Esplora Destinazioni
            </a>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
