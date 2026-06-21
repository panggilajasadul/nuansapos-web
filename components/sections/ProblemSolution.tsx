import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { PROBLEMS, SOLUTIONS } from '@/lib/constants'

export function ProblemSolution() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900">
            Masih Pakai Cara Lama?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Banyak pemilik usaha terjebak dengan cara manual yang menghabiskan waktu —
            NuansaPos hadir untuk menggantinya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problems */}
          <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 md:p-8 space-y-4">
            <h3 className="font-display font-bold text-xl text-red-900 mb-2">
              Sekarang
            </h3>
            <ul className="space-y-3">
              {PROBLEMS.map((problem) => (
                <li key={problem.text} className="flex items-start gap-3 text-slate-600">
                  <span className="text-xl shrink-0" aria-hidden="true">{problem.emoji}</span>
                  <span className="text-sm md:text-base leading-relaxed">{problem.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-6 md:p-8 space-y-4">
            <h3 className="font-display font-bold text-xl text-emerald-900 mb-2">
              Dengan NuansaPos
            </h3>
            <ul className="space-y-3">
              {SOLUTIONS.map((solution) => (
                <li key={solution.text} className="flex items-start gap-3 text-slate-700">
                  <span className="text-xl shrink-0" aria-hidden="true">{solution.emoji}</span>
                  <span className="text-sm md:text-base leading-relaxed">{solution.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
