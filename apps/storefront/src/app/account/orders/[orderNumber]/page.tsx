import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ProofDecisionForm, ProofDownloadButton } from '@/features/artwork/proof-forms';
import { ReorderButton } from '@/features/orders/reorder-button';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Order details', robots: { index: false, follow: false } };

function formatMoney(value: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value) / 100);
}

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const { orderNumber } = await params;
  const order = await getDb().order.findFirst({
    where: { orderNumber, customerAccount: { members: { some: { userId: session.user.id } } } },
    include: {
      deliveryMethod: { select: { name: true, estimatedDaysMin: true, estimatedDaysMax: true } },
      lines: {
        include: {
          productionJob: { include: { history: { orderBy: { createdAt: 'asc' } } } },
          proof: { orderBy: { version: 'desc' } },
          artwork: { include: { artwork: { select: { originalFilename: true } } } },
        },
      },
      shipments: { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { attempt: 'desc' }, take: 1 },
    },
  });
  if (!order) notFound();
  return (
    <main className="min-h-screen"><header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link className="font-black tracking-tight" href="/">web2print</Link><Link className="text-sm font-semibold" href="/account/orders">All orders</Link></div></header>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14"><Link className="text-sm font-semibold text-primary hover:underline" href="/account/orders">← Your orders</Link><p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-primary">Order tracking</p><div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><h1 className="text-4xl font-black tracking-[-0.05em]">{order.orderNumber}</h1><span className="w-fit rounded-full bg-muted px-4 py-2 text-sm font-bold">{order.status.toLowerCase().replaceAll('_', ' ')}</span></div><p className="mt-3 text-sm text-muted-foreground">Placed {order.placedAt.toLocaleDateString('en-GB')} · Payment {order.payments[0]?.status.toLowerCase() ?? 'pending'}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
          <section className="space-y-4">{order.lines.map((line) => <article className="rounded-3xl border border-border bg-white p-5" key={line.id}><div className="flex justify-between gap-3"><div><h2 className="text-lg font-extrabold">{line.productNameSnapshot}</h2><p className="mt-1 text-sm text-muted-foreground">{line.quantity.toLocaleString('en-GB')} copies</p></div><span className="font-black">{formatMoney(line.lineGrossMinor)}</span></div>
            {line.artwork.length > 0 && <p className="mt-3 text-xs text-muted-foreground">Artwork: {line.artwork.map(({ artwork }) => artwork.originalFilename).join(', ')}</p>}
            {line.proof.map((proof) => <div className="mt-4 rounded-2xl border border-border p-4" key={proof.id}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-bold">Proof version {proof.version}</h3><p className="mt-1 text-xs text-muted-foreground">{proof.status.toLowerCase().replaceAll('_', ' ')} · {proof.createdAt.toLocaleDateString('en-GB')}</p></div>{proof.proofObjectKey && <ProofDownloadButton proofId={proof.id} />}</div>{proof.reviewNotes && <p className="mt-3 text-sm leading-6">{proof.reviewNotes}</p>}{proof.status === 'AWAITING_CUSTOMER' && <ProofDecisionForm proofId={proof.id} />}{proof.customerResponse && <p className="mt-3 rounded-lg bg-muted p-3 text-sm">Your response: {proof.customerResponse}</p>}</div>)}
            {line.productionJob && <div className="mt-4 rounded-2xl bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-wider">Production</p><p className="mt-1 text-sm font-bold">{line.productionJob.status.toLowerCase().replaceAll('_', ' ')}</p><ol className="mt-3 space-y-2">{line.productionJob.history.map((event) => <li className="flex gap-3 text-xs text-muted-foreground" key={event.id}><time className="shrink-0">{event.createdAt.toLocaleDateString('en-GB')}</time><span>{event.toStatus.toLowerCase().replaceAll('_', ' ')}{event.note ? ` · ${event.note}` : ''}</span></li>)}</ol></div>}
          </article>)}</section>
          <aside className="h-fit space-y-5"><section className="rounded-3xl border border-border bg-white p-5"><h2 className="font-extrabold">Order summary</h2><dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Products</dt><dd>{formatMoney(order.subtotalNetMinor + order.taxMinor)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatMoney(order.deliveryNetMinor + order.deliveryVatMinor)}</dd></div><div className="flex justify-between border-t border-border pt-3"><dt className="font-bold">Total</dt><dd className="font-black">{formatMoney(order.totalGrossMinor)}</dd></div></dl><p className="mt-3 text-xs leading-5 text-muted-foreground">{order.deliveryMethod.name} · {order.deliveryMethod.estimatedDaysMin}–{order.deliveryMethod.estimatedDaysMax} working days (estimate)</p></section>
            <section className="rounded-3xl border border-border bg-white p-5"><h2 className="font-extrabold">Delivery tracking</h2>{order.shipments.length ? <ul className="mt-3 space-y-3">{order.shipments.map((shipment) => <li className="rounded-xl bg-muted/50 p-3 text-sm" key={shipment.id}><p className="font-bold">{shipment.carrierName ?? 'Carrier'} · {shipment.status.toLowerCase().replaceAll('_', ' ')}</p>{shipment.trackingNumber && <p className="mt-1 text-xs text-muted-foreground">{shipment.trackingNumber}</p>}{shipment.trackingUrl && <a className="mt-2 inline-flex font-semibold text-primary hover:underline" href={shipment.trackingUrl} rel="noreferrer" target="_blank">Open tracking ↗</a>}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">Tracking will appear here after dispatch.</p>}</section>
            <ReorderButton orderNumber={order.orderNumber} />
          </aside>
        </div>
      </div>
    </main>
  );
}
