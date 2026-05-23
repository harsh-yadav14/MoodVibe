import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Play, Pause, Star, Heart, Share2 } from "lucide-react";
import { Header } from "@/components/Header";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { MOODS, MOOD_CONTENT, type MoodKey, type Movie } from "@/lib/moods";

const VALID: MoodKey[] = MOODS.map((m) => m.key);

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>): { mood: MoodKey } => {
    const m = search.mood as MoodKey;
    return { mood: VALID.includes(m) ? m : "happy" };
  },
  head: ({ match }) => {
    const mood = (match.search as { mood: MoodKey }).mood;
    const m = MOODS.find((x) => x.key === mood)!;
    return {
      meta: [
        { title: `${m.label} mood — Your MoodVibe playlist & films` },
        { name: "description", content: `${m.tagline}. Trending songs and films tuned for a ${m.label.toLowerCase()} mood.` },
        { property: "og:title", content: `${m.label} mood on MoodVibe` },
        { property: "og:description", content: m.tagline },
      ],
    };
  },
  component: ResultsPage,
});

function ResultsPage() {
  const { mood } = Route.useSearch() as { mood: MoodKey };
  const m = MOODS.find((x) => x.key === mood)!;
  const content = MOOD_CONTENT[mood];

  return (
    <div className="min-h-screen">
      <AuroraBackdrop />
      {/* Mood-tinted halo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] -z-10 opacity-50"
        style={{
          background: `radial-gradient(ellipse at top, color-mix(in oklab, var(--color-${m.color}) 40%, transparent), transparent 70%)`,
        }}
      />
      <Header />

      <main className="pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Pick a different mood
          </Link>

          {/* Mood badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 glass-strong rounded-full pl-2 pr-6 py-2 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: `color-mix(in oklab, var(--color-${m.color}) 40%, transparent)` }}
              >
                {m.emoji}
              </div>
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Detected mood</div>
                <div className="font-semibold leading-tight">{m.label}</div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              {m.tagline.split(",")[0]}
              {m.tagline.includes(",") && (
                <>
                  ,<br />
                  <span className="text-gradient">{m.tagline.split(",").slice(1).join(",").trim()}</span>
                </>
              )}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Tuned for you — five trending tracks and nine films across three industries.
            </p>
          </motion.div>

          {/* Sections */}
          <MusicSection mood={mood} />
          <MoviesSection mood={mood} content={content} />
        </div>
      </main>
    </div>
  );
}

function MusicSection({ mood }: { mood: MoodKey }) {
  const songs = MOOD_CONTENT[mood].songs;
  const [playing, setPlaying] = useState<number | null>(0);

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Now playing
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Trending tracks</h2>
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">Top 5 · auto-updating</div>
      </div>

      <div className="glass-strong rounded-3xl p-4 sm:p-6">
        {/* Featured track */}
        {playing !== null && (
          <div className="flex items-center gap-4 sm:gap-6 mb-4 p-3 sm:p-4 rounded-2xl bg-white/[0.04]">
            <img
              src={songs[playing].cover}
              alt={songs[playing].title}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-primary mb-1">● Playing</div>
              <div className="font-semibold text-lg truncate">{songs[playing].title}</div>
              <div className="text-sm text-muted-foreground truncate">{songs[playing].artist}</div>
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  key={playing}
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="h-full bg-aurora"
                />
              </div>
            </div>
            <button
              onClick={() => setPlaying(null)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-aurora text-primary-foreground flex items-center justify-center glow hover:scale-105 transition shrink-0"
              aria-label="Pause"
            >
              <Pause className="h-5 w-5" fill="currentColor" />
            </button>
          </div>
        )}

        {/* Track list */}
        <div className="divide-y divide-white/5">
          {songs.map((s, i) => {
            const active = playing === i;
            return (
              <button
                key={s.title}
                onClick={() => setPlaying(active ? null : i)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition group ${
                  active ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="w-7 text-sm text-muted-foreground text-center shrink-0">
                  {active ? (
                    <span className="text-primary">♪</span>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{i + 1}</span>
                      <Play className="h-3.5 w-3.5 hidden group-hover:inline" fill="currentColor" />
                    </>
                  )}
                </div>
                <img src={s.cover} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <div className={`font-medium truncate ${active ? "text-primary" : ""}`}>{s.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.artist}</div>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums shrink-0">{s.duration}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MoviesSection({
  mood,
  content,
}: {
  mood: MoodKey;
  content: typeof MOOD_CONTENT[MoodKey];
}) {
  const [tab, setTab] = useState<"bollywood" | "hollywood" | "south">("bollywood");
  const tabs: { key: typeof tab; label: string }[] = [
    { key: "bollywood", label: "Bollywood" },
    { key: "hollywood", label: "Hollywood" },
    { key: "south", label: "South Indian" },
  ];
  void mood;
  const movies = content.movies[tab];

  return (
    <section className="mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Tonight's watchlist
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Movies for the mood</h2>
        </div>
        <div className="glass rounded-full p-1 inline-flex self-start sm:self-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition ${
                tab === t.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-aurora rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {movies.map((mv, i) => (
          <MovieCard key={`${tab}-${mv.title}`} movie={mv} index={i} />
        ))}
      </div>
    </section>
  );
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="glass rounded-3xl overflow-hidden group hover:bg-white/[0.07] transition"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-xs flex items-center gap-1">
          <Star className="h-3 w-3 text-mood-happy" fill="currentColor" /> {movie.rating}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button className="glass rounded-full p-1.5 hover:bg-white/20" aria-label="Save">
            <Heart className="h-3.5 w-3.5" />
          </button>
          <button className="glass rounded-full p-1.5 hover:bg-white/20" aria-label="Share">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-xs text-white/70 mb-0.5">{movie.year}</div>
          <h3 className="font-semibold text-lg leading-tight text-white">{movie.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{movie.blurb}</p>
      </div>
    </motion.article>
  );
}
