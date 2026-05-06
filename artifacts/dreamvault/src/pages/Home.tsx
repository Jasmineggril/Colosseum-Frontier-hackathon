import { useEffect, useState } from 'react';
import { ParticleField } from '@/components/ParticleField';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { NoxAssistant } from '@/components/NoxAssistant';
import { DreamGenerator } from '@/components/DreamGenerator';
import { DreamResult } from '@/components/DreamResult';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { AIPipelineSection } from '@/components/AIPipelineSection';
import { GallerySection } from '@/components/GallerySection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [dreamGenerated, setDreamGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dreamText, setDreamText] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    document.body.style.backgroundColor = 'hsl(220 30% 4%)';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      <ParticleField />
      <Navbar />

      <main>
        <HeroSection />

        <DreamGenerator
          onGenerateStart={(text, cat) => {
            setDreamText(text);
            setCategory(cat);
            setIsGenerating(true);
            setDreamGenerated(false);
          }}
          onGenerateComplete={() => {
            setIsGenerating(false);
            setDreamGenerated(true);
            setTimeout(() => {
              window.scrollBy({ top: 500, behavior: 'smooth' });
            }, 150);
          }}
        />

        {dreamGenerated && (
          <DreamResult
            onReset={() => { setDreamGenerated(false); setDreamText(''); setCategory(''); }}
            dreamText={dreamText}
            category={category}
          />
        )}

        <FeaturesSection />
        <HowItWorksSection />
        <AIPipelineSection />
        <GallerySection />
        <TestimonialsSection />
        <FAQSection />
      </main>

      <Footer />
      <NoxAssistant isGenerating={isGenerating} />
    </div>
  );
}
