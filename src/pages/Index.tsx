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
      name: "Delhi, India",
      location: "Asia",
      price: 450,
      rating: 4.8,
      image: '/public/delhi.jpg'
    },
    {
      id: 2,
      name: "Rabat, Marocco",
      location: "Africa",
      price: 150,
      rating: 4.9,
      image: '/public/rabat.jpeg'
    },
    {
      id: 3,
      name: "Amritsar, India",
      location: "Asia",
      price: 500,
      rating: 4.7,
      image: '/public/amritsar.jpeg'
    },
    {
      id: 4,
      name: "New York, USA",
      location: "/public/newyork.jpeg",
      price: 400,
      rating: 4.9,
      image: '/public/newyork.jpg'    
    },
    {
      id: 5,
      name: "Londra, UK",
      location: "Europa",
      price: 50,
      rating: 4.8,
      image: '/public/london.jpg'
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
        <div className="absolute inset-0 opacity-20 bg-[url('/public/plane.jpg')] bg-cover bg-center" />
        
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
