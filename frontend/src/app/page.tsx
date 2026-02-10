import { HeroSection } from '@/components/home/hero-section'
import { InitialInputForm } from '@/components/home/initial-input-form'
import { FeatureList } from '@/components/home/feature-list'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <InitialInputForm />
      <FeatureList />
    </div>
  )
}
