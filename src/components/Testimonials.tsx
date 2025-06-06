
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "SkyWander made our honeymoon absolutely magical. The attention to detail and personalized service exceeded all our expectations.",
    author: "Emily & James",
    role: "Honeymooners",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
  },
  {
    id: 2,
    quote: "The flight booking process was seamless and the customer service team went above and beyond to accommodate our last-minute changes.",
    author: "Michael Chen",
    role: "Business Traveler",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
  },
  {
    id: 3,
    quote: "As a family of five, travel planning can be stressful, but SkyWander made it effortless. Their family packages are thoughtfully crafted.",
    author: "Sarah Johnson",
    role: "Family Traveler",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(nextSlide, 6000);
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleIndicatorClick = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    // Reset the interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(nextSlide, 6000);
    }
  };

  return (
    <section className="py-20 bg-sky-50">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-navy-600">
            Discover why thousands of travelers choose SkyWander for their adventures.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-6 md:px-10"
                >
                  <div className="glass-card p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3 flex-shrink-0 flex justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-2 -left-2 bg-gold-500 rounded-full p-2">
                          <Quote className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 text-center md:text-left">
                      <p className="text-navy-800 text-lg mb-4 italic">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <h4 className="font-bold text-navy-900">{testimonial.author}</h4>
                        <p className="text-navy-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -ml-4 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center border border-gray-200 hover:bg-navy-50 transition-colors duration-300"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-5 w-5 text-navy-900" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 -mr-4 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center border border-gray-200 hover:bg-navy-50 transition-colors duration-300"
            disabled={isAnimating}
          >
            <ChevronRight className="h-5 w-5 text-navy-900" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  activeIndex === index 
                    ? "bg-gold-500 w-8" 
                    : "bg-navy-200 hover:bg-navy-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
