import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06),rgba(14,165,233,0.05))] opacity-70" />
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="rounded-3xl p-[2px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-rose-500/40 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_-12px_rgba(0,0,0,0.7)]">
          <div className="rounded-[calc(1.5rem-2px)] px-8 py-14 bg-[#0b0b0c] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 bottom-0 w-72 h-72 bg-gradient-to-tr from-rose-500/10 to-fuchsia-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
                Ready to Level Up Your Loadouts?
              </h2>
              <p className="mt-5 text-white/55 text-base sm:text-lg leading-relaxed">
                Join thousands of gamers unlocking exclusive bundles and lightning‑fast currency delivery.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-medium px-8 py-3 text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:shadow-fuchsia-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">
                  Get Started <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/stores" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-3 text-sm sm:text-base transition-all shadow-inner">
                  Browse Stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
