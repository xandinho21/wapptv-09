
import React from 'react';
import { usePublicAdmin } from '../hooks/useAdmin';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface TutorialsProps {
  type: 'wapp' | 'krator';
}

const Tutorials: React.FC<TutorialsProps> = ({ type }) => {
  const { adminData } = usePublicAdmin();
  const tutorials = adminData.tutorials[type];

  if (!tutorials || tutorials.length === 0) {
    return null;
  }

  const isKrator = type === 'krator';
  const bgClass = isKrator ? '' : 'bg-gray-800';
  const titleColor = isKrator ? 'text-krator-primary' : 'text-theme-primary';
  const cardBg = isKrator ? 'bg-krator-secondary/30' : 'bg-theme-primary/30';
  const borderColor = isKrator ? 'border-krator-primary/20' : 'border-theme-accent/20';

  return (
    <section id="tutoriais" className={`py-16 ${bgClass}`} style={isKrator ? { background: `linear-gradient(135deg, hsl(var(--krator-secondary) / 0.9), hsl(var(--krator-primary) / 0.7), hsl(217.2 32.6% 17.5%))` } : {}}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4`}>
              Tutoriais {isKrator ? 'Krator' : adminData.siteName}
            </h2>
            <p className="text-xl text-gray-300">
              Aprenda a usar nossa plataforma com nossos guias passo a passo
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto relative"
          >
            <CarouselContent className="-ml-2 md:-ml-4 py-[10px]">
              {tutorials.map((tutorial) => (
                <CarouselItem key={tutorial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <a
                    href={tutorial.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className={`${cardBg} backdrop-blur-sm rounded-xl p-6 border ${borderColor} transition-all duration-300 hover:scale-105 h-full`}>
                      <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-700">
                        <img
                          src={tutorial.image}
                          alt={tutorial.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <h3 className={`text-lg font-semibold text-white text-center`}>
                        {tutorial.title}
                      </h3>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white border-gray-600 bg-gray-800/50 hover:bg-gray-700 absolute left-4" />
            <CarouselNext className="text-white border-gray-600 bg-gray-800/50 hover:bg-gray-700 absolute right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Tutorials;
