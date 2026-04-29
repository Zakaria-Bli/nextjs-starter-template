import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-50 px-6 py-24 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <main className="relative grid w-full max-w-5xl grid-cols-1 gap-12 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <div className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            Error / 404
          </div>
          <h1 className="mt-6 font-mono text-[8rem] leading-[0.85] font-light tracking-tighter tabular-nums sm:text-[12rem]">
            404
          </h1>
          <div aria-hidden="true" className="mt-8 h-px w-24 bg-zinc-950 dark:bg-zinc-50" />
        </div>

        <div className="sm:col-span-7 sm:pt-2">
          <h2 className="text-3xl leading-tight font-light tracking-tight text-balance sm:text-4xl">
            This page does not exist — or has wandered off the map.
          </h2>

          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            The address you followed may be broken, retired, or never minted. Nothing was lost; the
            route simply has no destination here.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-3 border border-zinc-950 bg-zinc-950 px-6 py-3 font-mono text-xs tracking-[0.15em] text-zinc-50 uppercase transition-colors hover:bg-transparent hover:text-zinc-950 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-50"
            >
              <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Return home
            </Link>
            <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-500">
              or check the URL above
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
