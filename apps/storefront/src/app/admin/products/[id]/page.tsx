import Link from 'next/link';
import { notFound } from 'next/navigation';
import { saveProductOptionGroup, updatePriceTier } from '@/features/admin/actions';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatMoney(minor: bigint) {
  return (Number(minor) / 100).toFixed(2);
}

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getDb().product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      priceTiers: { orderBy: { quantity: 'asc' } },
      optionGroups: { orderBy: { sortOrder: 'asc' }, include: { values: { orderBy: { sortOrder: 'asc' } } } },
    },
  });
  if (!product) notFound();
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <Link className="text-sm font-semibold text-primary hover:underline" href="/admin/products">← Products</Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-primary">{product.category.name} · {product.sku}</p>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Configure {product.name}</h1>
      {product.isIndicativePricing && <p className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">This product uses development sample pricing. Review every price and VAT treatment before clearing the indicator in Product management. Check current UK VAT treatment with a qualified adviser.</p>}

      <section className="mt-8 rounded-3xl border border-border bg-white p-5 sm:p-6"><h2 className="text-xl font-extrabold">Quantity price tiers</h2><p className="mt-1 text-sm text-muted-foreground">Enter the net product price in GBP. Tier prices are exact quantities; VAT is calculated and rounded to the nearest penny by the server.</p>
        {product.priceTiers.length ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><th className="py-2">Quantity</th><th>Net price</th><th>VAT override</th><th>Active</th><th>Starts</th></tr></thead><tbody>{product.priceTiers.map((tier) => <tr className="border-b border-border last:border-0" key={tier.id}><td className="py-3 font-bold">{tier.quantity.toLocaleString('en-GB')}</td><td>£{formatMoney(tier.basePriceMinor)}</td><td>{tier.vatRateBps === null ? `Product rate (${product.vatRateBps} bps)` : `${tier.vatRateBps} bps`}</td><td>{tier.isActive ? 'Yes' : 'No'}</td><td>{tier.startsAt.toLocaleDateString('en-GB')}</td></tr>)}</tbody></table></div> : <p className="mt-4 text-sm text-muted-foreground">No price tiers yet. Product cannot be configured until at least one exact quantity has a price.</p>}
        <form action={updatePriceTier} className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4"><input name="productId" type="hidden" value={product.id} /><label className="space-y-2 text-sm font-semibold">Quantity<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" max="1000000" min="1" name="quantity" required type="number" /></label><label className="space-y-2 text-sm font-semibold">Net price (£)<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" max="9999999.99" min="0.01" name="price" placeholder="25.00" required step="0.01" type="number" /></label><label className="space-y-2 text-sm font-semibold">VAT override (bps)<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" max="10000" min="0" name="vatRateBps" placeholder={`Product default: ${product.vatRateBps}`} type="number" /></label><div className="flex items-end"><button className="h-10 rounded-lg bg-primary px-5 text-sm font-bold text-white" type="submit">Save tier</button></div></form>
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-white p-5 sm:p-6"><h2 className="text-xl font-extrabold">Configurator option groups</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Use one line per option: <code>code | customer label | extra price in £</code>. Keep a zero-price option when the customer must make a choice without an added charge. Archived values stay attached to historical orders.</p>
        <div className="mt-5 space-y-4">{product.optionGroups.map((group) => <form action={saveProductOptionGroup} className="rounded-2xl border border-border p-4" key={group.id}><input name="productId" type="hidden" value={product.id} /><div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-2 text-sm font-semibold">Option code<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" defaultValue={group.code} name="code" required /></label>
          <label className="space-y-2 text-sm font-semibold">Customer label<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" defaultValue={group.name} name="name" required /></label>
          <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold"><input defaultChecked={group.isRequired} name="required" type="checkbox" />Required</label>
          <label className="space-y-2 text-sm font-semibold sm:col-span-3">Active values<textarea className="min-h-32 w-full rounded-lg border border-input p-3 font-mono text-xs font-normal" defaultValue={group.values.filter((value) => value.isActive).map((value) => `${value.code} | ${value.label} | ${formatMoney(value.modifierValue)}`).join('\n')} name="values" required /></label>
          <button className="h-10 w-fit rounded-lg border border-border px-5 text-sm font-bold hover:border-primary sm:col-span-3" type="submit">Save this group</button>
        </div></form>)}</div>
        <form action={saveProductOptionGroup} className="mt-5 rounded-2xl border border-dashed border-border p-4"><input name="productId" type="hidden" value={product.id} /><h3 className="font-bold">Add an option group</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-semibold">Option code<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" maxLength={64} name="code" placeholder="paper-weight" required /></label><label className="space-y-2 text-sm font-semibold">Customer label<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" maxLength={120} name="name" placeholder="Paper weight" required /></label><label className="space-y-2 text-sm font-semibold sm:col-span-2">Values<textarea className="min-h-24 w-full rounded-lg border border-input p-3 font-mono text-xs font-normal" name="values" placeholder={'170gsm | 170 gsm | 0.00\n250gsm | 250 gsm | 3.00'} required /></label><label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input defaultChecked name="required" type="checkbox" />Customer must choose one value</label><button className="h-10 w-fit rounded-lg bg-primary px-5 text-sm font-bold text-white sm:col-span-2" type="submit">Add option group</button></div></form>
      </section>
    </main>
  );
}
