import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Music2, Film, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { MOODS } from "@/lib/moods";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoodVibe — Read your vibe. Get your soundtrack." },
      {
        name: "description",
        content:
          "Snap a photo or pick an emoji. MoodVibe reads your mood and serves trending songs, plus Bollywood, Hollywood and South Indian films tuned to it.",
      },
      { property: "og:title", content: "MoodVibe — Your mood, scored." },
      {
        property: "og:description",
        content: "AI-powered mood detection meets trending music and cinema.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <AuroraBackdrop />
      <Header />
      <main className="pt-32 sm:pt-40 pb-24">
        <Hero />
        <HowItWorks />
        <MoodPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs sm:text-sm text-muted-foreground mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered mood detection — in seconds
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tighter"
        >
          Your mood,
          <br />
          <span className="text-gradient">scored in seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Snap a selfie or tap an emoji. MoodVibe reads the room and curates
          trending tracks and films across Bollywood, Hollywood, and South Indian
          cinema — tuned exactly to how you feel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/discover"
            className="group relative inline-flex items-center gap-2 bg-aurora text-primary-foreground font-medium px-7 py-3.5 rounded-full glow hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Discover Your Mood
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
          </Link>
          <a
            href="#how"
            className="glass inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm text-foreground hover:bg-white/10 transition"
          >
            How it works
          </a>
        </motion.div>

        {/* Orbital emoji ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mt-20 sm:mt-28 h-[280px] sm:h-[360px] flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 -m-20 rounded-full border border-white/10" />
            <div className="absolute inset-0 -m-40 rounded-full border border-white/5" />
            <div className="absolute inset-0 -m-60 rounded-full border border-white/5 hidden sm:block" />

            <div className="glass-strong rounded-full p-8 sm:p-10 glow">
              <div className="text-6xl sm:text-7xl">🎧</div>
            </div>

            {MOODS.map((m, i) => {
              const angle = (i / MOODS.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 180 }}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="glass rounded-2xl px-3 py-2 text-2xl sm:text-3xl hover:scale-110 transition cursor-default">
                    {m.emoji}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Camera, title: "Show your vibe", body: "Upload a selfie or pick the emoji that fits right now." },
    { icon: Sparkles, title: "We read the room", body: "On-device analysis detects the dominant emotion in seconds." },
    { icon: Music2, title: "Songs land", body: "Trending tracks queued to match the energy you brought." },
    { icon: Film, title: "Films, sorted", body: "Bollywood, Hollywood, South Indian — one tap each." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 mt-32 sm:mt-40">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Four taps to a <span className="text-gradient">perfect night</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          No sign-up. No data hoarding. Just better recommendations.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-3xl p-6 hover:bg-white/[0.08] transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-aurora flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">Step {i + 1}</div>
            <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MoodPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-32 sm:mt-40">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Six moods.
            <br />
            <span className="text-gradient">Infinite recommendations.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Every mood ships with a hand-curated palette, a trending playlist,
            and a triple-feature across Bollywood, Hollywood, and South Indian
            cinema.
          </p>
          <Link
            to="/discover"
            className="mt-8 inline-flex items-center gap-2 glass-strong rounded-full px-6 py-3 text-sm hover:bg-white/10 transition"
          >
            Try it now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MOODS.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 text-center hover:scale-[1.04] hover:bg-white/[0.08] transition cursor-default"
            >
              <div
                className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2"
                style={{ background: `color-mix(in oklab, var(--color-${m.color}) 30%, transparent)` }}
              >
                {m.emoji}
              </div>
              <div className="font-medium text-sm">{m.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.tagline}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-32 sm:mt-40">
      <div className="glass-strong rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/30 blur-3xl rounded-full" />
        <div className="relative">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Ready to feel <span className="text-gradient">seen</span>?
          </h2>
          <p className="mt-4 text-muted-foreground">
            One photo. One emoji. A whole night, perfectly scored.
          </p>
          <Link
            to="/discover"
            className="mt-8 inline-flex items-center gap-2 bg-aurora text-primary-foreground font-medium px-7 py-3.5 rounded-full glow hover:scale-[1.02] transition"
          >
            Start now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 pb-10 pt-10 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} MoodVibe — Built for the feeling.
    </footer>
  );
}
