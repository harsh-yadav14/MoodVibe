import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, Star, Loader2, Youtube } from "lucide-react";
import { Header } from "@/components/Header";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { MOODS, fetchDynamicSongs, fetchDynamicMovies, type MoodKey, type Movie, type Song } from "@/lib/moods";

const VALID: MoodKey[] = MOODS.map((m) => m.key);

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>): { mood: MoodKey } => {
    const m = search.mood as MoodKey;
    return { mood: VALID.includes(m) ? m : "happy" };
  },
  component: ResultsPage,
});

function ResultsPage() {
  const { mood } = Route.useSearch() as { mood: MoodKey };
  const m = MOODS.find((x) => x.key === mood)!;

  return (
    <div className="min-h-screen">
      <AuroraBackdrop />
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

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
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
              {m.tagline.split(",")}
              {m.tagline.includes(",") && (
                <>
                  ,<br />
                  <span className="text-gradient">{m.tagline.split(",").slice(1).join(",").trim()}</span>
                </>
              )}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Powered by Live APIs — Dynamic YouTube integration & TMDB cinema posters.
            </p>
          </motion.div>

          <MusicSection mood={mood} />
          <MoviesSection mood={mood} />
        </div>
      </main>
    </div>
  );
}

function MusicSection({ mood }: { mood: MoodKey }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setActiveVideoId(null);
    fetchDynamicSongs(mood).then((data) => {
      setSongs(data);
      setLoading(false);
    });
  }, [mood]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Fetching from YouTube Live API...</p>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Trending YouTube Tracks</h2>

      <AnimatePresence>
        {activeVideoId && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-2xl mx-auto mb-8 rounded-3xl overflow-hidden glass-strong p-2 shadow-2xl"
          >
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-strong rounded-3xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs.map((s, i) => {
          const isCurrent = activeVideoId === s.videoId;
          return (
            <button
              key={`${s.videoId}-${i}`}
              onClick={() => setActiveVideoId(isCurrent ? null : s.videoId)}
              className={`flex items-center gap-4 p-3 rounded-2xl transition text-left group ${
                isCurrent ? "bg-white/[0.08] ring-1 ring-primary/30" : "hover:bg-white/[0.04]"
              }`}
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                <img src={s.cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  {isCurrent ? <Pause className="h-5 w-5 text-white" fill="currentColor" /> : <Play className="h-5 w-5 text-white" fill="currentColor" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm line-clamp-2 ${isCurrent ? "text-primary" : "text-white"}`}>{s.title}</div>
                <div className="text-xs text-muted-foreground truncate mt-1 flex items-center gap-1">
                  <Youtube className="h-3 w-3 text-red-500" /> {s.artist}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MoviesSection({ mood }: { mood: MoodKey }) {
  const [tab, setTab] = useState<"bollywood" | "hollywood" | "south">("bollywood");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDynamicMovies(mood, tab).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [mood, tab]);

  return (
    <section className="mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Movies for the mood</h2>
        </div>
        <div className="glass rounded-full p-1 inline-flex self-start sm:self-auto">
          {(["bollywood", "hollywood", "south"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-aurora rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t === "south" ? "South Indian" : t}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Fetching TMDB Catalog...</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {movies.map((mv, i) => (
              <MovieCard key={`${tab}-${mv.title}-${i}`} movie={mv} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass rounded-3xl overflow-hidden group hover:bg-white/[0.07] transition flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-xs flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" fill="currentColor" /> {movie.rating}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-xs text-white/70 mb-0.5">{movie.year}</div>
          <h3 className="font-semibold text-lg leading-tight text-white">{movie.title}</h3>
        </div>
      </div>
      <div className="p-4 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{movie.blurb}</p>
      </div>
    </motion.article>
  );
}
