import { CountUp } from '@/components/ui/CountUp'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { STATS } from '@/lib/constants'

export function SocialProof() {
  return (
    <SectionWrapper className="border-y border-white/5 bg-navy-800/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="font-display font-black text-3xl md:text-4xl text-white">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  isDecimal={stat.isDecimal}
                />
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
