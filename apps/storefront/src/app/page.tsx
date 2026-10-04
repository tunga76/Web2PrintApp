import Link from 'next/link';

const productGroups = [
  {
    number: '01',
    name: 'Business cards',
    detail: 'Make every introduction count.',
    shape: 'cards',
    slug: 'business-cards',
  },
  {
    number: '02',
    name: 'Flyers',
    detail: 'Put your message in more hands.',
    shape: 'flyer',
    slug: 'flyers',
  },
  {
    number: '03',
    name: 'Leaflets',
    detail: 'A little more room for your message.',
    shape: 'flyer',
    slug: 'leaflets',
  },
  {
    number: '04',
    name: 'Posters',
    detail: 'Get noticed from across the room.',
    shape: 'poster',
    slug: 'posters',
  },
  {
    number: '05',
    name: 'Brochures',
    detail: 'Give your story a little more space.',
    shape: 'booklet',
    slug: 'brochures',
  },
  {
    number: '06',
    name: 'Booklets',
    detail: 'Give your story a little more space.',
    shape: 'booklet',
    slug: 'booklets',
  },
  {
    number: '07',
    name: 'Stickers',
    detail: 'Add a memorable finishing touch.',
    shape: 'sticker',
    slug: 'stickers',
  },
  {
    number: '08',
    name: 'Banners',
    detail: 'Make your message easy to spot.',
    shape: 'poster',
    slug: 'banners',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="bg-[#0c4440] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        Made for your next big idea · Printed to your specification
      </div>

      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link aria-label="Web2Print home" className="flex items-center gap-2" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-[#135d57] text-sm font-black text-white">
            W
          </span>
          <span className="text-lg font-extrabold tracking-tight">web2print</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-semibold text-[#314b55] md:flex">
          <a className="transition hover:text-[#135d57]" href="#products">Print products</a>
          <a className="transition hover:text-[#135d57]" href="#how-it-works">How it works</a>
          <a className="transition hover:text-[#135d57]" href="#business">For business</a>
        </nav>
        <div className="flex items-center gap-3">
          <a className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#314b55] sm:inline-flex" href="/login">
            Sign in
          </a>
          <a className="inline-flex min-h-11 items-center rounded-full bg-[#135d57] px-5 text-sm font-bold text-white transition hover:bg-[#0c4440]" href="#products">
            Start an order
          </a>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d5dfd5] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#135d57]">
            Print that moves you forward
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-[#172b3a] sm:text-6xl lg:text-7xl">
            Your ideas look good <span className="text-[#135d57]">on paper.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#63727a] sm:text-lg sm:leading-8">
            Thoughtful print, clear choices and a price you can see before you order. Make something people want to keep.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#135d57] px-6 text-sm font-bold text-white transition hover:bg-[#0c4440]" href="#products">
              Explore print products <span aria-hidden="true" className="ml-2">↗</span>
            </a>
            <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c7d3ce] bg-white/65 px-6 text-sm font-bold text-[#25434d] transition hover:bg-white" href="#how-it-works">
              See how it works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#52656c] sm:text-sm">
            <span className="inline-flex items-center gap-2"><span className="text-[#135d57]">✓</span> Artwork review available</span>
            <span className="inline-flex items-center gap-2"><span className="text-[#135d57]">✓</span> Order updates</span>
            <span className="inline-flex items-center gap-2"><span className="text-[#135d57]">✓</span> Clear pricing</span>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto aspect-[1.05/1] w-full max-w-[570px]">
          <div className="absolute inset-[8%] rotate-[-7deg] rounded-[2.25rem] bg-[#e9b54a] shadow-[0_28px_70px_-32px_rgba(23,43,58,0.45)]" />
          <div className="absolute inset-[13%_7%_12%_16%] rotate-[5deg] rounded-[2rem] bg-[#d8e5d8] shadow-[0_30px_60px_-34px_rgba(23,43,58,0.42)]" />
          <div className="absolute inset-[19%_13%_18%_9%] overflow-hidden rounded-[1.8rem] bg-[#145b55] p-7 text-white shadow-[0_30px_60px_-30px_rgba(23,43,58,0.5)] sm:p-10">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                <span>Make it memorable</span><span>01 / 08</span>
              </div>
              <div className="relative">
                <div className="absolute -right-16 -top-20 size-44 rounded-full border-[22px] border-[#f0c45f] sm:-right-10 sm:-top-28 sm:size-60 sm:border-[30px]" />
                <p className="relative max-w-[310px] text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">Good ideas deserve good print.</p>
                <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-sm">Paper, made personal.</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-2 w-20 rounded-full bg-[#e9b54a] sm:w-28" />
                <span className="text-xs font-bold text-white/75">WEB2PRINT · UK</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-0 rounded-2xl border border-[#e1e5da] bg-white px-4 py-3 shadow-[0_14px_40px_-20px_rgba(23,43,58,0.3)] sm:bottom-3 sm:px-5 sm:py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#738087]">Made for your business</p>
            <p className="mt-1 text-sm font-extrabold text-[#172b3a] sm:text-base">Small details. Big impression.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5e7df] bg-white/55" id="products">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#135d57]">The good stuff</p>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.04em] text-[#172b3a] sm:text-4xl">Find the right print for the job.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#63727a]">Choose your format, make it yours and get a clear price before you add it to your basket.</p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productGroups.map((product) => (
              <a key={product.number} className="group rounded-[1.5rem] border border-[#e5e7df] bg-white p-4 transition hover:-translate-y-1 hover:border-[#b8cdc3] hover:shadow-[0_18px_40px_-30px_rgba(23,43,58,0.35)]" href={`/products/${product.slug}`}>
                <div className={`relative flex h-40 items-center justify-center overflow-hidden rounded-[1.1rem] ${product.shape === 'poster' ? 'bg-[#e7eee5]' : product.shape === 'booklet' ? 'bg-[#f2e7ce]' : product.shape === 'sticker' ? 'bg-[#dce8e3]' : 'bg-[#f4eee0]'}`}>
                  {product.shape === 'cards' && <><span className="absolute h-20 w-32 rotate-[-12deg] rounded-lg bg-[#edbd58] shadow-lg transition group-hover:-translate-x-2" /><span className="absolute h-20 w-32 rotate-[8deg] rounded-lg bg-[#135d57] shadow-lg transition group-hover:translate-x-2"><span className="absolute bottom-3 left-3 h-1 w-10 rounded-full bg-white/70" /></span></>}
                  {product.shape === 'flyer' && <><span className="absolute h-28 w-20 rotate-[-11deg] rounded-md bg-white shadow-lg" /><span className="absolute h-28 w-20 rotate-[8deg] rounded-md bg-[#edbd58] shadow-lg"><span className="absolute left-3 top-4 h-2 w-10 rounded-full bg-[#135d57]" /><span className="absolute bottom-4 left-3 h-12 w-14 rounded bg-[#f7e9c2]" /></span></>}
                  {product.shape === 'poster' && <span className="grid h-28 w-20 place-items-center rounded-md bg-[#135d57] text-3xl font-black tracking-[-0.08em] text-[#f0c45f] shadow-xl transition group-hover:rotate-3">WOW</span>}
                  {product.shape === 'booklet' && <><span className="absolute h-28 w-20 -translate-x-2 rotate-[-9deg] rounded-md bg-[#dbad47] shadow-md" /><span className="absolute h-28 w-20 translate-x-2 rotate-[7deg] rounded-md bg-[#1b645d] p-3 text-left text-xs font-black leading-tight text-white shadow-xl">YOUR<br />NEXT<br />CHAPTER</span></>}
                  {product.shape === 'sticker' && <><span className="grid size-20 -rotate-12 place-items-center rounded-full bg-[#efbb4e] text-xs font-black uppercase tracking-wide text-[#18313b] shadow-lg">HELLO!</span><span className="absolute ml-24 mt-8 grid size-14 rotate-12 place-items-center rounded-full bg-white text-[8px] font-black uppercase text-[#135d57] shadow-md">GOOD<br />IDEA</span></>}
                </div>
                <div className="flex items-start justify-between gap-4 px-1 pb-1 pt-4">
                  <div>
                    <h3 className="font-extrabold text-[#172b3a]">{product.name}</h3>
                    <p className="mt-1 text-sm text-[#738087]">{product.detail}</p>
                  </div>
                  <span aria-hidden="true" className="mt-1 text-lg text-[#135d57] transition group-hover:translate-x-1">↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-3" id="how-it-works">
        {[
          ['01', 'Choose your print', 'Pick a product, then choose the size, stock, finish and quantity that suit your project.'],
          ['02', 'Upload your artwork', 'Send your print-ready file securely. Our team can review it and share a proof when needed.'],
          ['03', 'We make it happen', 'Follow your order from confirmation through production and manual dispatch updates.'],
        ].map(([number, title, detail]) => (
          <div key={number} className="border-t-2 border-[#cbd9d0] pt-5">
            <span className="text-xs font-bold tracking-[0.15em] text-[#135d57]">{number}</span>
            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-[#172b3a]">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#63727a]">{detail}</p>
          </div>
        ))}
      </section>

      <section className="bg-[#135d57] px-5 py-14 text-white sm:px-8 sm:py-16" id="business">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f0c45f]">For teams and growing businesses</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Print for one launch or the whole year.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">Keep your orders, artwork and repeat jobs together in one place.</p>
          </div>
          <a className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#f0c45f] px-6 text-sm font-extrabold text-[#172b3a] transition hover:bg-[#f5d68c]" href="/register">Create an account <span aria-hidden="true" className="ml-2">↗</span></a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-[#718087] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} Web2Print. Print made around your ideas.</span>
        <span>Clear options · Secure artwork · Human support</span>
      </footer>
    </main>
  );
}
