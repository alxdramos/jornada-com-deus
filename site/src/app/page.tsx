import { Navbar }              from '@/components/landing/Navbar';
import { HeroSection }         from '@/components/landing/HeroSection';
import { MirrorSection }       from '@/components/landing/MirrorSection';
import { FeaturesSection }     from '@/components/landing/FeaturesSection';
import { JourneySection }      from '@/components/landing/JourneySection';
import { ContentStatsSection } from '@/components/landing/ContentStatsSection';
import { HabitSection }        from '@/components/landing/HabitSection';
import { FreePricingSection }  from '@/components/landing/FreePricingSection';
import { CompatSection }       from '@/components/landing/CompatSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection }          from '@/components/landing/CTASection';
import { Footer }              from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MirrorSection />
      <FeaturesSection />
      <JourneySection />
      <ContentStatsSection />
      <HabitSection />
      <FreePricingSection />
      <CompatSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
