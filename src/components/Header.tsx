import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-aurora rounded-lg blur-md opacity-70 group-hover:opacity-100 transition" />
              <div className="relative bg-aurora rounded-lg p-1.5">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Mood<span className="text-gradient">Vibe</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition"
              activeProps={{ className: "px-3 py-1.5 rounded-lg text-foreground" }}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition"
              activeProps={{ className: "px-3 py-1.5 rounded-lg text-foreground" }}
            >
              Discover
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
