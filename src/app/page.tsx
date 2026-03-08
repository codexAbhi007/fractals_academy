import { redirect } from "next/navigation";
import {
  Navbar,
  HeroSection,
  CoursesSection,
  FeaturesSection,
  AboutSection,
  LatestVideosSection,
  ContactSection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CTASection,
  Footer,
} from "@/components/landing";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
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
    <div className="relative min-h-screen bg-background">
      {/* Unified page background — continuous grid + subtle color washes */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Subtle grid across entire page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0d_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0d_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        {/* Continuous color washes that flow through sections */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-purple-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-0 w-[35rem] h-[35rem] bg-cyan-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-[60%] left-[10%] w-[30rem] h-[30rem] bg-pink-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[10%] w-[35rem] h-[35rem] bg-indigo-500/[0.03] rounded-full blur-3xl" />
      </div>

      <Navbar />
      <main className="relative z-1">
        <HeroSection />
        <CoursesSection />
        <AboutSection />
        <FeaturesSection />
        <LatestVideosSection />
        {/* <CTASection /> */}
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
