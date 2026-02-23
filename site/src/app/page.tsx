import { Navbar }                  from '@/components/landing/Navbar';
import { HeroSection }             from '@/components/landing/HeroSection';
import { MissionSection }          from '@/components/landing/MissionSection';
import { ProblemSolutionSection }  from '@/components/landing/ProblemSolutionSection';
import { FeaturesSection }         from '@/components/landing/FeaturesSection';
import { TestimonialsSection }     from '@/components/landing/TestimonialsSection';
import { CTASection }              from '@/components/landing/CTASection';
import { Footer }                  from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
