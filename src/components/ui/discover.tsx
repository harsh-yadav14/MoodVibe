import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, Upload, Smile, Sparkles, X } from "lucide-react";
import { Header } from "@/components/Header";
import { AuroraBackdrop } from "@/components/AuroraBackdrop";
import { MOODS, type MoodKey } from "@/lib/moods";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Your Mood — MoodVibe" },
      {
        name: "description",
        content:
          "Pick an emoji or upload a selfie. MoodVibe detects your vibe and queues the perfect songs and films.",
      },
      { property: "og:title", content: "Discover Your Mood — MoodVibe" },
      {
        property: "og:description",
        content: "Two ways in. One perfect playlist out.",
      },
    ],
  }),
  component: DiscoverPage,
});

type Mode = "emoji" | "photo";

function DiscoverPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("emoji");
  const [analyzing, setAnalyzing] = useState<MoodKey | null>(null);

  const goToResults = (mood: MoodKey) => {
    setAnalyzing(mood);
    // Simulated AI analysis delay for the glass-loader experience
    setTimeout(() => {
      navigate({ to: "/results", search: { mood } });
    }, 2200);
  };

  return (
    <div className="min-h-screen">
      <AuroraBackdrop />
      <Header />
      <main className="pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Step 1 of 2
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              How are you <span className="text-gradient">feeling</span>?
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Pick the way that feels right. Either works — both take a heartbeat.
            </p>
          </motion.div>

          {/* Mode toggle */}
          <div className="flex justify-center mb-8">
            <div className="glass rounded-full p-1 inline-flex">
              <ModeBtn active={mode === "emoji"} onClick={() => setMode("emoji")} icon={<Smile className="h-4 w-4" />}>
                Emoji
              </ModeBtn>
              <ModeBtn active={mode === "photo"} onClick={() => setMode("photo")} icon={<Camera className="h-4 w-4" />}>
                Photo
              </ModeBtn>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "emoji" ? (
              <motion.div
                key="emoji"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <EmojiGrid onPick={goToResults} />
              </motion.div>
            ) : (
              <motion.div
                key="photo"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <PhotoUpload onDetected={goToResults} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {analyzing && <GlassLoader mood={analyzing} />}
      </AnimatePresence>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
        active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {active && (
        <motion.div
          layoutId="mode-pill"
          className="absolute inset-0 bg-aurora rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative flex items-center gap-2">
        {icon} {children}
      </span>
    </button>
  );
}

function EmojiGrid({ onPick }: { onPick: (m: MoodKey) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {MOODS.map((m, i) => (
        <motion.button
          key={m.key}
          onClick={() => onPick(m.key)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.97 }}
          className="glass rounded-3xl p-6 sm:p-8 text-left hover:bg-white/[0.08] transition group relative overflow-hidden"
        >
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition"
            style={{ background: `var(--color-${m.color})` }}
          />
          <div className="relative">
            <div className="text-5xl sm:text-6xl mb-4">{m.emoji}</div>
            <div className="font-semibold text-lg">{m.label}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{m.tagline}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function PhotoUpload({ onDetected }: { onDetected: (m: MoodKey) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const detect = () => {
    // Mock "face expression" detection — randomly pick a mood
    const pick = MOODS[Math.floor(Math.random() * MOODS.length)].key;
    onDetected(pick);
  };

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-10">
      {!preview ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`block border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-white/15 hover:border-white/30 hover:bg-white/[0.03]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-aurora flex items-center justify-center mb-4 glow">
            <Upload className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="font-semibold text-lg">Drop a selfie here</div>
          <div className="text-sm text-muted-foreground mt-1">
            or tap to upload / use your camera
          </div>
          <div className="text-xs text-muted-foreground/70 mt-4">
            JPG, PNG · processed locally, never stored
          </div>
        </label>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <img src={preview} alt="Your upload" className="w-full h-full object-cover" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 glass rounded-full p-2 hover:bg-white/10 transition"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Looking good.</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              We'll analyze the dominant expression — happiness, sadness, focus, calm — and curate
              your night around it.
            </p>
            <button
              onClick={detect}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-aurora text-primary-foreground font-medium px-6 py-3 rounded-full glow hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Sparkles className="h-4 w-4" /> Analyze my vibe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GlassLoader({ mood }: { mood: MoodKey }) {
  const m = MOODS.find((x) => x.key === mood)!;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-strong rounded-3xl p-10 sm:p-14 text-center max-w-sm w-full"
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: `var(--color-${m.color})`, opacity: 0.6 }}
          />
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: `var(--color-${m.color})`, opacity: 0.4, animationDelay: "0.6s" }}
          />
          <div className="relative w-24 h-24 rounded-full glass-strong flex items-center justify-center text-5xl">
            {m.emoji}
          </div>
        </div>
        <div className="font-display text-2xl font-semibold">Reading your vibes…</div>
        <div className="text-sm text-muted-foreground mt-2">
          Mapping micro-expressions to a soundtrack.
        </div>
        <div className="mt-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 bg-aurora rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
