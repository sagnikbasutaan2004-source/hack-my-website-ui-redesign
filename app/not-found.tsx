import Link from "next/link";
import { Home, ShieldAlert, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative z-10 max-w-xl p-8 rounded-[2rem] border border-destructive/25 bg-black/60 shadow-[0_30px_100px_rgba(0,0,0,0.55)] space-y-6">
        <div className="inline-flex rounded-xl border border-destructive/35 bg-destructive/10 p-3 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-destructive">
            Error Code: 404_PAGE_NOT_FOUND
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white animate-pulse">
            Target route is unavailable or does not exist.
          </h1>
          <p className="text-sm leading-relaxed text-zinc-300">
            The page you are trying to scan is missing, has moved, or was never created. Ensure the URL is typed correctly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild variant="outline" className="rounded-xl font-mono uppercase tracking-[0.16em] text-zinc-200">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild className="rounded-xl font-mono uppercase tracking-[0.16em]">
            <Link href="/workspace">
              <TerminalSquare className="h-4 w-4" />
              Open scanner
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
