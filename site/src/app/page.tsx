import { Navbar }                  from '@/components/landing/Navbar';
import { HeroSection }             from '@/components/landing/HeroSection';
import { MissionSection }          from '@/components/landing/MissionSection';
import { ProblemSolutionSection }  from '@/components/landing/ProblemSolutionSection';
import { FeaturesSection }         from '@/components/landing/FeaturesSection';
import { TestimonialsSection }     from '@/components/landing/TestimonialsSection';
import { CTASection }              from '@/components/landing/CTASection';
import { Footer }                  from '@/components/landing/Footer';

function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <MissionSection />
      <SectionDivider />
      <ProblemSolutionSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
