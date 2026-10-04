import Link from 'next/link';
import { notFound } from 'next/navigation';
import { addShipment, updateOrderStatus, updateShipmentStatus } from '@/features/admin/actions';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(minor) / 100);
}

const orderNext: Record<string, string[]> = { CONFIRMED: ['IN_PRODUCTION'], SHIPPED: ['COMPLETED'] };
const shipmentNext: Record<string, string[]> = { PREPARING: ['DISPATCHED', 'CANCELLED'], DISPATCHED: ['IN_TRANSIT', 'DELIVERED', 'EXCEPTION', 'CANCELLED'], IN_TRANSIT: ['DELIVERED', 'EXCEPTION'], EXCEPTION: ['IN_TRANSIT', 'DELIVERED'], DELIVERED: [], CANCELLED: [] };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getDb().order.findUnique({
    where: { id },
    include: {
      customerAccount: { include: { members: { include: { user: { select: { name: true, email: true } } } } } },
      placedBy: { select: { name: true, email: true } },
      lines: { include: { productionJob: { include: { history: { orderBy: { createdAt: 'desc' }, take: 4 } } }, artwork: { include: { artwork: true } }, proof: { orderBy: { version: 'desc' }, take: 1 } } },
      payments: { orderBy: { attempt: 'desc' }, include: { events: { orderBy: { createdAt: 'desc' } } } },
      shipments: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!order) notFound();
  const canDispatch = ['IN_PRODUCTION', 'SHIPPED'].includes(order.status) && order.lines.length > 0 && order.lines.every((line) => ['READY_TO_SHIP', 'COMPLETE'].includes(line.productionJob?.status ?? ''));
  const shippingAddress = order.shippingAddressSnapshot as Record<string, string>;
  const billingAddress = order.billingAddressSnapshot as Record<string, string>;
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link className="text-sm font-semibold text-primary hover:underline" href="/admin/orders">← Orders</Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">{order.customerAccount.displayName}</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">{order.orderNumber}</h1><p className="mt-2 text-sm text-muted-foreground">{order.customerEmailSnapshot} · {order.placedAt.toLocaleString('en-GB')}</p></div><span className="w-fit rounded-full bg-muted px-4 py-2 text-sm font-bold">{order.status.toLowerCase().replaceAll('_', ' ')}</span></div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4" aria-label="Order lines">
          {order.lines.map((line) => {
            const configuration = line.configurationSnapshot as { options?: Array<{ groupName: string; label: string }> };
            return <article className="rounded-3xl border border-border bg-white p-5" key={line.id}><div className="flex justify-between gap-4"><div><h2 className="font-extrabold">{line.productNameSnapshot}</h2><p className="mt-1 text-xs text-muted-foreground">SKU {line.productSkuSnapshot} · {line.quantity.toLocaleString('en-GB')} copies</p></div><p className="font-black">{formatMoney(line.lineGrossMinor)}</p></div><ul className="mt-3 flex flex-wrap gap-2">{configuration.options?.map((option, index) => <li className="rounded-full bg-muted px-3 py-1 text-xs" key={`${option.groupName}-${index}`}>{option.groupName}: {option.label}</li>)}</ul>
              <div className="mt-4 border-t border-border pt-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Artwork / proofs</p><p className="mt-2 text-sm">{line.artwork.length ? line.artwork.map(({ artwork }) => artwork.originalFilename).join(', ') : 'No artwork attached'}</p>{line.proof[0] && <p className="mt-2 text-xs text-muted-foreground">Proof v{line.proof[0].version}: {line.proof[0].status.toLowerCase().replaceAll('_', ' ')}</p>}{line.artwork.length > 0 && <Link className="mt-3 inline-flex text-sm font-bold text-primary hover:underline" href={`/admin/orders/${order.id}/proofs?line=${encodeURIComponent(line.id)}`}>Review artwork and create proof ↗</Link>}</div>
              {line.productionJob && <div className="mt-4 rounded-2xl bg-muted/60 p-4"><div className="flex justify-between gap-4"><h3 className="font-bold">Production job</h3><span className="text-xs font-bold">{line.productionJob.status.toLowerCase().replaceAll('_', ' ')}</span></div><p className="mt-1 text-xs text-muted-foreground">Manufacturing: {line.productionJob.manufacturingMethod.toLowerCase().replaceAll('_', ' ')}{line.productionJob.partnerName ? ` · ${line.productionJob.partnerName}` : ''}</p><Link className="mt-3 inline-flex text-sm font-bold text-primary hover:underline" href="/admin/production">Manage production queue ↗</Link></div>}
            </article>;
          })}
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-border bg-white p-5"><h2 className="font-extrabold">Order total</h2><dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Products ex VAT</dt><dd>{formatMoney(order.subtotalNetMinor)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Products VAT</dt><dd>{formatMoney(order.taxMinor)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Delivery ex VAT</dt><dd>{formatMoney(order.deliveryNetMinor)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Delivery VAT</dt><dd>{formatMoney(order.deliveryVatMinor)}</dd></div><div className="flex justify-between border-t border-border pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-black">{formatMoney(order.totalGrossMinor)}</dd></div></dl><p className="mt-3 text-xs text-muted-foreground">Currency {order.currency} · delivery: {order.deliveryMethodId}</p>{(orderNext[order.status] ?? []).length > 0 && <form action={updateOrderStatus} className="mt-5 flex gap-2"><input name="orderId" type="hidden" value={order.id} /><select className="h-10 flex-1 rounded-lg border border-input bg-white px-3 text-sm" name="status">{orderNext[order.status]!.map((status) => <option key={status} value={status}>{status.toLowerCase().replaceAll('_', ' ')}</option>)}</select><button className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-white" type="submit">Update</button></form>}</section>

          <section className="rounded-3xl border border-border bg-white p-5"><h2 className="font-extrabold">Delivery address</h2><address className="mt-3 not-italic text-sm leading-6 text-muted-foreground">{shippingAddress.recipient}<br />{shippingAddress.company && <>{shippingAddress.company}<br /></>}{shippingAddress.line1}<br />{shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}{shippingAddress.city}<br />{shippingAddress.postcode}<br />{shippingAddress.countryCode}</address><h3 className="mt-5 font-bold">Billing address</h3><address className="mt-2 not-italic text-sm leading-6 text-muted-foreground">{billingAddress.recipient}<br />{billingAddress.company && <>{billingAddress.company}<br /></>}{billingAddress.line1}<br />{billingAddress.line2 && <>{billingAddress.line2}<br /></>}{billingAddress.city}<br />{billingAddress.postcode}<br />{billingAddress.countryCode}</address></section>

          <section className="rounded-3xl border border-border bg-white p-5"><h2 className="font-extrabold">Payment events</h2>{order.payments.length ? <ul className="mt-3 space-y-4">{order.payments.map((payment) => <li className="border-t border-border pt-3" key={payment.id}><div className="flex justify-between text-sm"><strong>Attempt {payment.attempt}</strong><span>{payment.status}</span></div><p className="mt-1 text-xs text-muted-foreground">{formatMoney(payment.amountMinor)} · {payment.stripeCheckoutSessionId ?? 'Session not created'}</p><ul className="mt-2 space-y-1 text-xs text-muted-foreground">{payment.events.map((event) => <li key={event.id}>{event.createdAt.toLocaleString('en-GB')} · {event.eventType} · {event.message}</li>)}</ul></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No payments recorded.</p>}</section>

          <section className="rounded-3xl border border-border bg-white p-5"><h2 className="font-extrabold">Manual shipping</h2>{order.shipments.length ? <ul className="mt-4 space-y-4">{order.shipments.map((shipment) => <li className="rounded-2xl bg-muted/50 p-3" key={shipment.id}><div className="flex justify-between gap-3 text-sm"><strong>{shipment.carrierName}</strong><span>{shipment.status}</span></div><p className="mt-1 text-xs">Tracking: {shipment.trackingNumber}</p>{shipment.trackingUrl && <a className="mt-1 inline-flex text-xs font-semibold text-primary hover:underline" href={shipment.trackingUrl} rel="noreferrer" target="_blank">Open carrier tracking ↗</a>}{(shipmentNext[shipment.status] ?? []).length > 0 && <form action={updateShipmentStatus} className="mt-3 space-y-2"><input name="shipmentId" type="hidden" value={shipment.id} /><select className="h-9 w-full rounded-lg border border-input bg-white px-2 text-xs" name="status">{shipmentNext[shipment.status]!.map((status) => <option key={status} value={status}>{status}</option>)}</select><input className="h-9 w-full rounded-lg border border-input px-2 text-xs" maxLength={500} name="note" placeholder="Tracking note (optional)" /><button className="h-9 rounded-lg border border-border px-3 text-xs font-bold" type="submit">Update tracking</button></form>}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No tracking entered yet.</p>}
            {canDispatch && <form action={addShipment} className="mt-5 space-y-3 border-t border-border pt-5"><input name="orderId" type="hidden" value={order.id} /><label className="block space-y-1 text-xs font-bold">Carrier<input className="h-9 w-full rounded-lg border border-input px-3 text-sm font-normal" maxLength={120} name="carrierName" required /></label><label className="block space-y-1 text-xs font-bold">Tracking number<input className="h-9 w-full rounded-lg border border-input px-3 text-sm font-normal" maxLength={160} name="trackingNumber" required /></label><label className="block space-y-1 text-xs font-bold">Tracking URL<input className="h-9 w-full rounded-lg border border-input px-3 text-sm font-normal" name="trackingUrl" type="url" /></label><button className="h-10 w-full rounded-lg bg-primary text-sm font-bold text-white" type="submit">Record dispatch</button></form>}
          </section>
        </aside>
      </div>
    </main>
  );
}
