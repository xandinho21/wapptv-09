import React from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
interface TutorialsProps {
  variant?: 'green' | 'purple';
  type?: 'wapp' | 'krator';
}
const Tutorials = ({
  variant = 'green',
  type = 'wapp'
}: TutorialsProps) => {
  const {
    adminData
  } = useAdmin();
  const handleTutorialClick = (link: string) => {
    window.open(link, '_blank');
  };
  const colorClasses = {
    green: {
      bg: 'bg-gray-800',
      accent: 'text-green-400',
      border: 'border-green-400/30',
      hover: 'hover:border-green-400/50'
    },
    purple: {
      bg: 'bg-purple-900/50',
      accent: 'text-purple-400',
      border: 'border-purple-400/30',
      hover: 'hover:border-purple-400/50'
    }
  };
  const colors = colorClasses[variant];
  const tutorials = type === 'krator' ? adminData.kratorTutorials : adminData.tutorials;
  if (!tutorials || tutorials.length === 0) {
    return null;
  }
  return <section className={`py-16 ${colors.bg}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tutoriais <span className={colors.accent}>Passo a Passo</span>
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Aprenda como configurar e usar nossos serviços com nossos guias completos
            </p>
          </div>

          <div className="mx-[117px]">
            <Carousel className="">
              <CarouselContent className="">
                {tutorials.map(tutorial => <CarouselItem key={tutorial.id} className="my-[13px] mx-0 px-[27px]">
                    <div className={`${colors.bg} rounded-xl p-6 border-2 ${colors.border} ${colors.hover} transition-all duration-300 hover:scale-105 cursor-pointer h-full`} onClick={() => handleTutorialClick(tutorial.link)}>
                      <div className="aspect-square mb-4 overflow-hidden rounded-lg px-0 mx-[15px] py-0">
                        <img src={tutorial.imageUrl} alt={tutorial.title} className="w-full h-full transition-transform duration-300 hover:scale-110 object-cover" />
                      </div>
                      
                      <h4 className={`text-lg font-bold text-center ${colors.accent} hover:underline`}>
                        {tutorial.title}
                      </h4>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>;
};
export default Tutorials;