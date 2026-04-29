export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-50 px-6 py-24 text-zinc-950 dark:bg-black dark:text-zinc-50"
    >
      {/* Hairline grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative flex w-full max-w-3xl flex-col items-start gap-12">
        <div className="flex w-full items-center justify-between font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
          <span>Status / Loading</span>
          <span className="tabular-nums">Streaming</span>
        </div>

        <div className="relative w-full">
          <div className="flex items-baseline gap-6">
            <span
              aria-hidden="true"
              className="font-mono text-7xl leading-none font-light tracking-tighter tabular-nums sm:text-8xl"
            >
              <span className="inline-block animate-pulse">···</span>
            </span>
          </div>

          <h1 className="mt-10 max-w-xl text-3xl leading-tight font-light tracking-tight text-balance sm:text-4xl">
            Composing the next view.
          </h1>

          <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Streaming server-rendered output. This will resolve as soon as the route segment
            finishes its work.
          </p>
        </div>

        {/* Indeterminate progress rail */}
        <div
          aria-hidden="true"
          className="relative h-px w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 animate-[loading-bar_1.6s_ease-in-out_infinite] bg-zinc-950 dark:bg-zinc-50" />
        </div>

        <div className="flex w-full justify-between font-mono text-[11px] tracking-[0.15em] text-zinc-500 uppercase dark:text-zinc-500">
          <span>Suspense boundary</span>
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-zinc-950 dark:bg-zinc-50" />
            Live
          </span>
        </div>
      </div>

      <span className="sr-only">Loading content, please wait.</span>
    </div>
  )
}
