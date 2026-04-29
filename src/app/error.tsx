"use client"

import Link from "next/link"
import { useEffect } from "react"

type ErrorPageProps = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error)
      return
    }

    // Forward the digest to your error reporting service of choice.
    if (error?.digest) {
      console.error(`App segment render failed (digest: ${error.digest})`)
      return
    }

    console.error("App segment render failed")
  }, [error])

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
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
            Error / Runtime
          </div>
          <div
            aria-hidden="true"
            className="mt-6 font-mono text-[8rem] leading-[0.85] font-light tracking-tighter sm:text-[10rem]"
          >
            !
          </div>
          <div aria-hidden="true" className="mt-8 h-px w-24 bg-zinc-950 dark:bg-zinc-50" />
        </div>

        <div className="sm:col-span-7 sm:pt-2">
          <h2 className="text-3xl leading-tight font-light tracking-tight text-balance sm:text-4xl">
            Something broke while rendering this segment.
          </h2>

          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            The error has been captured. You can attempt to recover by retrying the segment — the
            children will re-fetch and re-render in place.
          </p>

          {error?.digest && (
            <dl className="mt-8 inline-flex flex-col gap-1 border-l border-zinc-300 pl-4 font-mono text-[11px] tracking-wider text-zinc-500 uppercase dark:border-zinc-700 dark:text-zinc-500">
              <dt>Digest</dt>
              <dd className="text-zinc-950 normal-case dark:text-zinc-50">{error.digest}</dd>
            </dl>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="group inline-flex items-center justify-center gap-3 border border-zinc-950 bg-zinc-950 px-6 py-3 font-mono text-xs tracking-[0.15em] text-zinc-50 uppercase transition-colors hover:bg-transparent hover:text-zinc-950 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-50"
            >
              Try again
              <span aria-hidden="true" className="transition-transform group-hover:rotate-90">
                ↻
              </span>
            </button>
            <Link
              href="/"
              className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
