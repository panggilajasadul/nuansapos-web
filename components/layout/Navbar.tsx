'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import logoImage from '@/assets/nuansapos icon.png'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition duration-300 border-b',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-xl shadow-slate-200/20'
          : 'bg-white/0 backdrop-blur-none border-slate-200/0 shadow-none',
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-slate-900 group">
          <div className="relative w-8 h-8 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src={logoImage}
              alt="NuansaPos Logo"
              fill
              className="object-contain"
              sizes="32px"
              priority
            />
          </div>
          <span>
            Nuansa<span className="text-brand">Pos</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reseller"
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-150 flex items-center gap-1"
          >
            🤝 Reseller
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            size="sm"
            onClick={() => window.open(SITE_CONFIG.playStoreUrl, '_blank')}
          >
            Download Gratis
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-900 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-slate-600 hover:text-slate-900 text-base font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reseller"
            className="block text-amber-600 hover:text-amber-700 text-base font-semibold py-2"
            onClick={() => setMenuOpen(false)}
          >
            🤝 Program Reseller
          </Link>
          <Button
            className="w-full mt-4"
            onClick={() => {
              window.open(SITE_CONFIG.playStoreUrl, '_blank')
              setMenuOpen(false)
            }}
          >
            Download Gratis
          </Button>
        </div>
      )}
    </header>
  )
}
