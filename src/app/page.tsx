import { redirect } from "next/navigation";
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  AboutSection,
  LatestVideosSection,
  CTASection,
  Footer,
} from "@/components/landing";
import { getServerSession } from "@/lib/session";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ home?: string }>;
}) {
  const session = await getServerSession();
  const params = await searchParams;

  // Only redirect if user is logged in AND they didn't explicitly click "Home"
  if (session?.user && !("home" in params)) {
    const isAdmin = (session.user as { role?: string }).role === "ADMIN";
    if (isAdmin) {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

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
