"use client"

import { useEffect } from "react"

import "./globals.css"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error)
      return
    }

    if (error?.digest) {
      console.error(`App root render failed (digest: ${error.digest})`)
      return
    }

    console.error("App root render failed")
  }, [error])

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <title>Application error</title>
      </head>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24">
          <div
            aria-hidden="true"
            className="status-grid pointer-events-none absolute inset-0 bg-size-[56px_56px] opacity-[0.05]"
          />

          <div className="relative flex w-full max-w-2xl flex-col gap-10">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase">
              <span className="inline-flex items-center gap-3 text-red-500">
                <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
                Fatal / Root Boundary
              </span>
              <span className="text-zinc-500">500</span>
            </div>

            <h1 className="font-sans text-4xl leading-[1.05] font-light tracking-tight text-balance sm:text-5xl">
              The application encountered a fatal error and could not continue.
            </h1>

            <p className="max-w-lg font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              This is the root error boundary. The page&rsquo;s layout has been replaced. You can
              attempt a recovery, or reload the document.
            </p>

            {error?.digest && (
              <dl className="inline-flex flex-col gap-1 border-l border-zinc-300 pl-4 font-mono text-[11px] tracking-wider uppercase dark:border-zinc-700">
                <dt className="text-zinc-500">Digest</dt>
                <dd className="text-zinc-950 normal-case dark:text-zinc-50">{error.digest}</dd>
              </dl>
            )}

            <div aria-hidden="true" className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex flex-col gap-3 font-mono sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                onClick={() => unstable_retry()}
                className="inline-flex items-center justify-center gap-3 border border-zinc-950 bg-zinc-950 px-6 py-3 text-xs tracking-[0.15em] text-zinc-50 uppercase transition-colors hover:bg-transparent hover:text-zinc-950 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-50"
              >
                Try again ↻
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Reload document
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
