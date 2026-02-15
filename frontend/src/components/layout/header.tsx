'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Compass } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isHome && !scrolled
          ? 'bg-transparent border-transparent'
          : 'bg-background/95 backdrop-blur-lg border-b supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Compass
            className={cn(
              'h-6 w-6 transition-colors',
              isHome && !scrolled ? 'text-blue-400' : 'text-primary'
            )}
          />
          <span
            className={cn(
              'font-bold text-xl transition-colors',
              isHome && !scrolled ? 'text-white' : 'text-foreground'
            )}
          >
            テツナビ
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {isHome && (
            <a
              href="#start"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                scrolled
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'glass text-white/80 hover:text-white'
              )}
            >
              始める
            </a>
          )}
          {!isHome && (
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ホーム
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
