import { HeroSection } from '@/components/home/hero-section'
import { ProblemSection } from '@/components/home/problem-section'
import { HowItWorks } from '@/components/home/how-it-works'
import { FeatureList } from '@/components/home/feature-list'
import { ArchitectureSection } from '@/components/home/architecture-section'
import { InitialInputForm } from '@/components/home/initial-input-form'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <FeatureList />
      <ArchitectureSection />
      <InitialInputForm />
    </div>
  )
}
