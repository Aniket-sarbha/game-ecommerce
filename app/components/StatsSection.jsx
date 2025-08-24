"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "500K+", label: "Orders Processed" },
  { value: "98%", label: "Avg. Satisfaction" },
  { value: "30s", label: "Median Delivery" },
  { value: "120+", label: "Supported Titles" }
];

export default function StatsSection() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300 drop-shadow-sm">
                {s.value}
              </div>
              <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.15em] text-white/45 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
