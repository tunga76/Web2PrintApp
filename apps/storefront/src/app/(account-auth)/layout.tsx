import Link from 'next/link';

export default function AccountAuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 sm:py-12">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Link aria-label="Web2Print home" className="flex items-center gap-2 font-extrabold tracking-tight" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">W</span>
          <span>web2print</span>
        </Link>
        <Link className="text-sm font-semibold text-muted-foreground hover:text-foreground" href="/">Back to shop</Link>
      </header>
      <div className="mx-auto grid max-w-5xl items-center gap-12 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div className="hidden md:block">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Your print account</p>
          <h1 className="mt-4 max-w-md text-4xl font-black leading-tight tracking-[-0.05em]">Good print starts with a clear plan.</h1>
          <p className="mt-4 max-w-sm leading-7 text-muted-foreground">Keep your orders and artwork together, approve proofs and pick up where your next print run left off.</p>
        </div>
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-[0_24px_80px_-48px_rgba(23,43,58,0.35)] sm:p-9">
          {children}
        </div>
      </div>
    </main>
  );
}
