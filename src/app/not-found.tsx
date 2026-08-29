import Link from "next/link";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink text-cream flex items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(55% 45% at 70% 20%, rgba(188,82,39,0.3), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="relative text-center max-w-md">
        <Logo tone="cream" className="justify-center mb-10" />
        <p className="eyebrow eyebrow--cream justify-center mb-6">Error 404</p>
        <h1 className="display-1 mb-5">
          This table <span className="it text-ember">doesn't exist</span>
        </h1>
        <p className="text-cream/60 mb-10">
          The page you're after has been taken off the menu. Let's get you back to
          something that exists.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/menu" className="btn btn-ghost">
            View menu
          </Link>
        </div>
      </div>
    </main>
  );
}
