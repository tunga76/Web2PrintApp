import Link from 'next/link';
import { updateProductionJob } from '@/features/admin/actions';
import { getDb } from '@/lib/db';

const transitionOptions: Record<string, string[]> = {
  AWAITING_ARTWORK: ['ARTWORK_REVIEW', 'ON_HOLD', 'CANCELLED'],
  ARTWORK_REVIEW: ['AWAITING_PROOF_APPROVAL', 'READY_FOR_PRODUCTION', 'ON_HOLD', 'CANCELLED'],
  AWAITING_PROOF_APPROVAL: ['READY_FOR_PRODUCTION', 'ARTWORK_REVIEW', 'ON_HOLD'],
  READY_FOR_PRODUCTION: ['IN_PRODUCTION', 'ON_HOLD'],
  IN_PRODUCTION: ['FINISHING', 'ON_HOLD'],
  FINISHING: ['PACKAGING', 'ON_HOLD'],
  PACKAGING: ['READY_TO_SHIP', 'ON_HOLD'],
  READY_TO_SHIP: ['COMPLETE', 'ON_HOLD'],
  COMPLETE: [],
  ON_HOLD: ['ARTWORK_REVIEW', 'AWAITING_ARTWORK', 'AWAITING_PROOF_APPROVAL', 'READY_FOR_PRODUCTION', 'IN_PRODUCTION', 'FINISHING', 'PACKAGING', 'READY_TO_SHIP', 'CANCELLED'],
  CANCELLED: [],
};

export async function ProductionQueue({ adminLinks = false }: { adminLinks?: boolean }) {
  const jobs = await getDb().productionJob.findMany({
    where: { status: { notIn: ['COMPLETE', 'CANCELLED'] } },
    orderBy: [{ priority: 'desc' }, { dueAt: 'asc' }, { createdAt: 'asc' }],
    include: {
      orderLine: {
        include: {
          order: { select: { id: true, orderNumber: true, customerEmailSnapshot: true, status: true } },
          product: { select: { name: true } },
          artwork: { include: { artwork: { select: { id: true, originalFilename: true, status: true } } } },
        },
      },
    },
  });
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Production workflow</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Production queue</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Move each order line through artwork review, proof approval, production, finishing, packaging and dispatch readiness. Status changes are validated and recorded.</p>
      {!jobs.length ? <div className="mt-8 rounded-3xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">The active production queue is empty.</div> : <div className="mt-8 grid gap-4 xl:grid-cols-2">{jobs.map((job) => {
        const options = transitionOptions[job.status] ?? [];
        return <article className="rounded-3xl border border-border bg-white p-5 sm:p-6" key={job.id}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{job.orderLine.order.orderNumber} · {job.orderLine.product.name}</p><p className="mt-2 text-lg font-extrabold">{job.status.toLowerCase().replaceAll('_', ' ')}</p><p className="mt-1 text-xs text-muted-foreground">{job.orderLine.order.customerEmailSnapshot} · {job.orderLine.quantity.toLocaleString('en-GB')} copies</p></div>{adminLinks && <Link className="h-fit text-sm font-bold text-primary hover:underline" href={`/admin/orders/${job.orderLine.order.id}`}>Open order ↗</Link>}</div>
          <div className="mt-4 rounded-2xl bg-muted/50 p-4"><p className="text-xs font-bold uppercase tracking-wider">Artwork</p>{job.orderLine.artwork.length ? <ul className="mt-2 space-y-1 text-sm">{job.orderLine.artwork.map(({ artwork }) => <li key={artwork.id}>{artwork.originalFilename} · {artwork.status.toLowerCase().replaceAll('_', ' ')}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">Waiting for customer artwork.</p>}</div>
          {options.length > 0 && <form action={updateProductionJob} className="mt-5 grid gap-3 sm:grid-cols-2"><input name="jobId" type="hidden" value={job.id} /><label className="space-y-1 text-xs font-bold">Next status<select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" name="status">{options.map((status) => <option key={status} value={status}>{status.toLowerCase().replaceAll('_', ' ')}</option>)}</select></label><label className="space-y-1 text-xs font-bold">Manufacturing method<select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" defaultValue={job.manufacturingMethod === 'UNASSIGNED' ? 'OWN_PRODUCTION' : job.manufacturingMethod} name="manufacturingMethod"><option value="OWN_PRODUCTION">Own production</option><option value="PRINT_PARTNER">Print partner</option></select></label><label className="space-y-1 text-xs font-bold sm:col-span-2">Partner name (if applicable)<input className="h-10 w-full rounded-lg border border-input px-3 text-sm font-normal" defaultValue={job.partnerName ?? ''} maxLength={160} name="partnerName" /></label><label className="space-y-1 text-xs font-bold sm:col-span-2">Production note (optional)<input className="h-10 w-full rounded-lg border border-input px-3 text-sm font-normal" maxLength={500} name="note" /></label><button className="h-10 rounded-lg bg-primary text-sm font-bold text-white sm:col-span-2" type="submit">Save production update</button></form>}
        </article>;
      })}</div>}
    </main>
  );
}
