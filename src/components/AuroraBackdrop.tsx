export function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div
        className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-mood-romantic/25 blur-3xl animate-blob"
        style={{ animationDelay: "-12s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
