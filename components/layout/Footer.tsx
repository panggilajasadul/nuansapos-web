import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { SITE_CONFIG, FOOTER_LINKS } from '@/lib/constants'
import logoImage from '@/assets/nuansapos icon.png'

const SOCIAL_ICONS = {
  Instagram,
  Facebook,
  Youtube,
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + tagline */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-slate-900 group">
              <div className="relative w-8 h-8 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={logoImage}
                  alt="NuansaPos Logo"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span>
                Nuansa<span className="text-brand">Pos</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              {SITE_CONFIG.tagline}. Bekerja 100% offline, data di HP Anda sendiri.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {FOOTER_LINKS.social.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon as keyof typeof SOCIAL_ICONS]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-200/50 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors duration-150"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-slate-900 font-semibold text-sm mb-4">Produk</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-slate-900 text-sm transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-slate-900 font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-slate-900 text-sm transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-slate-500 hover:text-slate-900 text-sm transition-colors duration-150"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  )
}
