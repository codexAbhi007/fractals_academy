import {
  Navbar,
  HeroSection,
  FeaturesSection,
  AboutSection,
  LatestVideosSection,
  CTASection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="videos">
          <LatestVideosSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
