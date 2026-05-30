import { Navbar } from "@/components/navbar"
import { StickySearchButtons } from "@/components/sticky-search-buttons"
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { DoctorsSection } from "@/components/doctors-section"
import { ZoomParallaxSection } from "@/components/zoom-parallax-section"
import { ReviewsSection } from "@/components/reviews-section"
import { EmergencyBanner } from "@/components/emergency-banner"
import { FAQSection } from "@/components/faq-section"
import { ForVetsSection } from "@/components/for-vets-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <DoctorsSection />
      <ZoomParallaxSection />
      <ReviewsSection />
      <EmergencyBanner />
      <FAQSection />
      <ForVetsSection />
      <Footer />
      <StickySearchButtons />
    </main>
  )
}
