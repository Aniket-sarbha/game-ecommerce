"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aria Winters",
    role: "Esports Analyst",
    quote: "Delivery speed is insane. I top up mid‑scrim and it's ready before the next round.",
    rating: 5
  },
  {
    name: "Kieran Zhao",
    role: "Strategy Streamer",
    quote: "The rotating bundle drops have probably saved me hundreds this season alone.",
    rating: 5
  },
  {
    name: "Lyra Fox",
    role: "Guild Leader",
    quote: "Bulk guild credits processed flawlessly. Zero failed transactions in months.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/85 to-white/60">
            Loved by Players Everywhere
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/50 text-base sm:text-lg">
            Real stories from our rapidly growing community.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-2xl p-6 bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_-8px_rgba(0,0,0,0.7)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-white/70 text-sm font-semibold ring-1 ring-white/20">
                    {t.name.split(' ').map(p=>p[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <figcaption className="text-sm font-medium text-white tracking-wide">{t.name}</figcaption>
                    <p className="text-xs text-white/45">{t.role}</p>
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed text-white/60 font-light">“{t.quote}”</blockquote>
                <div className="mt-5 flex gap-1" aria-label={`${t.rating} star rating`}>
                  {Array.from({ length: t.rating }).map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
