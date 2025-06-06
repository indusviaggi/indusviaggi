
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface DestinationCardProps {
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  featured?: boolean;
}

const DestinationCard = ({
  name,
  location,
  price,
  rating,
  image,
  featured = false,
}: DestinationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-500 h-full flex flex-col",
        isHovered ? "transform scale-[1.02] shadow-xl" : "shadow-lg"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={3/2}>
          <img
            src={image}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:bg-white/40 z-10"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-300",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </button>
        
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-sm text-white/80">{location}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-yellow-400">★</span>
              <span className="text-white ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 bg-white flex-grow flex flex-col justify-end">
        <div className="flex justify-between items-center">
          <p className="text-navy-900 font-semibold">
            <span className="text-sm text-gray-500">da</span>{" "}
            <span className="text-lg">€{price}</span>
          </p>
          
          <a
            href="#"
            className="text-gold-500 font-medium text-sm hover:text-gold-600 transition-colors"
          >
            Vedi Dettagli
          </a>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
