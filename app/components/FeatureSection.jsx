"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe2, Wallet2, Sparkles, Clock } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Top-Ups",
    desc: "All transactions are protected with multi‑layer encryption and fraud monitoring.",
    gradient: "from-emerald-500/20 to-teal-500/10"
  },
  {
    icon: Wallet2,
    title: "Best Prices",
    desc: "Live pricing engine constantly scans & surfaces the most competitive discounts.",
    gradient: "from-indigo-500/20 to-purple-500/10"
  },
  {
    icon: Globe2,
    title: "Global Coverage",
    desc: "Support for dozens of regions, wallets, and cross‑platform game ecosystems.",
    gradient: "from-cyan-500/20 to-sky-500/10"
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    desc: "Average fulfilment time under 30 seconds with real‑time status updates.",
    gradient: "from-amber-500/20 to-orange-500/10"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Always‑on assistance through chat & mail so you never wait for help.",
    gradient: "from-pink-500/20 to-rose-500/10"
  },
  {
    icon: Sparkles,
    title: "Curated Drops",
    desc: "Rotating seasonal bundles & loyalty boosts tailored to your library.",
    gradient: "from-fuchsia-500/20 to-violet-500/10"
  }
];

export default function FeatureSection() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(236,72,153,0.12),transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            Powering Every Purchase
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/50 text-base sm:text-lg">
            A performance‑first platform engineered for speed, security, and unbeatable value.
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="relative group"
              >
                <div className={`h-full rounded-2xl p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.02] border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_20px_-4px_rgba(0,0,0,0.6)] transition-all duration-300 overflow-hidden`}>                
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${f.gradient} pointer-events-none`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-5 border border-white/10 shadow-inner">
                      <Icon className="w-6 h-6 text-white/80" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-white/55">{f.desc}</p>
                  </div>
                  <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5 blur-2xl group-hover:scale-125 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
