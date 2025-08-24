import Link from "next/link";
import { Gamepad2, Gift, Shield, Rocket, Sparkles } from "lucide-react";

const actions = [
  {
    title: "Browse Stores",
    desc: "Explore supported games & wallets",
    href: "/stores",
    icon: Gamepad2,
    gradient: "from-indigo-500/30 to-purple-500/20"
  },
  {
    title: "Create Account",
    desc: "Sync purchases & track rewards",
    href: "/signup",
    icon: Rocket,
    gradient: "from-fuchsia-500/30 to-pink-500/20"
  },
  {
    title: "Why Trust Us",
    desc: "Secure payments & instant fulfilment",
    href: "#features",
    icon: Shield,
    gradient: "from-emerald-500/30 to-teal-500/20"
  }
];

export default function QuickActions() {
  return (
    <section className="relative mt-24 mb-10 px-4">
      <div className="max-w-6xl mx-auto grid gap-5 md:grid-cols-3">
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <Link
              key={a.title}
              href={a.href}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-white/5 hover:from-white/25 hover:to-white/10 transition-colors"
            >
              <div className="relative h-full rounded-[1.05rem] bg-[#0b0b0c]/90 backdrop-blur-xl p-6 overflow-hidden border border-white/10">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${a.gradient}`} />
                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-inner">
                      <Icon className="text-white/80 w-5 h-5" />
                    </div>
                    <h3 className="text-white font-semibold tracking-wide text-sm md:text-base">
                      {a.title}
                    </h3>
                  </div>
                  <p className="text-white/55 text-xs md:text-sm leading-relaxed flex-1">
                    {a.desc}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-white/50 group-hover:text-white/80 font-medium">
                    <span>Start</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
                <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/5 blur-2xl group-hover:scale-125 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
