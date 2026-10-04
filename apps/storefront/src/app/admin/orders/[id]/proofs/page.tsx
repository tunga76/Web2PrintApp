import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CreateProofForm } from '@/features/artwork/proof-forms';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminProofPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ line?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const order = await getDb().order.findUnique({
    where: { id },
    include: { lines: { include: { productionJob: { select: { status: true } }, artwork: { include: { artwork: { select: { id: true, originalFilename: true, status: true } } } }, proof: { orderBy: { version: 'desc' } } } } },
  });
  if (!order) notFound();
  const line = order.lines.find((item) => item.id === query.line) ?? order.lines.find((item) => item.artwork.length > 0);
  if (!line) return <main className="mx-auto max-w-4xl px-5 py-10"><Link className="text-sm font-bold text-primary" href={`/admin/orders/${id}`}>← Back to order</Link><h1 className="mt-6 text-3xl font-black">No artwork attached to this order</h1><p className="mt-3 text-sm text-muted-foreground">The customer must upload, pass security scan, receive approval and attach artwork before a proof can be prepared.</p></main>;
  const approvedArtwork = line.artwork.filter(({ artwork }) => artwork.status === 'APPROVED').map(({ artwork }) => artwork);
  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12"><Link className="text-sm font-semibold text-primary hover:underline" href={`/admin/orders/${id}`}>← {order.orderNumber}</Link><p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-primary">Proof workflow</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">{line.productNameSnapshot} · proof</h1><p className="mt-2 text-sm text-muted-foreground">{order.customerEmailSnapshot} · {line.quantity.toLocaleString('en-GB')} copies</p>
      <section className="mt-8 rounded-3xl border border-border bg-white p-5 sm:p-6"><h2 className="font-extrabold">Artwork attached to this order line</h2><ul className="mt-3 space-y-2">{line.artwork.map(({ artwork }) => <li className="flex justify-between gap-3 rounded-xl bg-muted/60 p-3 text-sm" key={artwork.id}><span>{artwork.originalFilename}</span><span className="font-semibold">{artwork.status.toLowerCase().replaceAll('_', ' ')}</span></li>)}</ul></section>
      {approvedArtwork.length && line.productionJob?.status === 'ARTWORK_REVIEW' ? <CreateProofForm artwork={approvedArtwork} orderId={order.id} orderLineId={line.id} /> : <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">A new proof can be sent only when an attached artwork file is approved and the production job is in artwork review.</p>}
      <section className="mt-8 rounded-3xl border border-border bg-white p-5 sm:p-6"><h2 className="font-extrabold">Proof history</h2>{line.proof.length ? <ul className="mt-4 space-y-3">{line.proof.map((proof) => <li className="flex justify-between gap-4 border-t border-border pt-3 text-sm" key={proof.id}><span>Version {proof.version} · {proof.createdAt.toLocaleDateString('en-GB')}</span><span className="font-bold">{proof.status.toLowerCase().replaceAll('_', ' ')}</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No proof sent yet.</p>}</section>
    </main>
  );
}
