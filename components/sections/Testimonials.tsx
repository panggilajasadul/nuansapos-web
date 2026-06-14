import { Star } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Card } from '@/components/ui/Card'
import { TESTIMONIALS } from '@/lib/constants'

export function Testimonials() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-navy-800/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            Dipercaya Pemilik Usaha di Seluruh Indonesia
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Cerita nyata dari pengguna NuansaPos di berbagai jenis bisnis.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name} className="bg-navy-800/50 backdrop-blur-sm border-white/5 space-y-4">
              <div className="flex items-center gap-1" aria-label={`Rating ${testimonial.rating} dari 5`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" aria-hidden="true" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/15 text-brand-light font-display font-bold text-sm shrink-0"
                  aria-hidden="true"
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">
                    {testimonial.business} · {testimonial.city}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
