import Link from 'next/link';
import { createCategory, createProduct, updateProduct } from '@/features/admin/actions';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getDb().product.findMany({ orderBy: [{ status: 'asc' }, { name: 'asc' }], include: { category: { select: { name: true } }, priceTiers: { where: { isActive: true }, orderBy: { quantity: 'asc' } } } }),
    getDb().category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Catalog management</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Products and pricing</h1>
      <details className="mt-6 rounded-3xl border border-border bg-white p-5"><summary className="cursor-pointer font-bold">Manage product categories</summary><p className="mt-2 text-sm text-muted-foreground">Categories group products in the shop. They can be reused by multiple products.</p><form action={createCategory} className="mt-4 flex flex-col gap-3 sm:flex-row"><input className="h-10 rounded-lg border border-input px-3 text-sm" maxLength={120} name="slug" placeholder="Category URL slug" required /><input className="h-10 rounded-lg border border-input px-3 text-sm" maxLength={160} name="name" placeholder="Category name" required /><button className="h-10 rounded-lg border border-border px-5 text-sm font-bold" type="submit">Add category</button></form></details>
      <section className="mt-8 rounded-3xl border border-border bg-white p-5 sm:p-6"><h2 className="text-lg font-extrabold">Add a product</h2><p className="mt-1 text-sm text-muted-foreground">New products start as drafts and need option groups and prices before publishing.</p><form action={createProduct} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2 text-sm font-semibold">Category<select className="h-10 w-full rounded-lg border border-input bg-white px-3 font-normal" name="categoryId" required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="space-y-2 text-sm font-semibold">Product name<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" maxLength={180} name="name" required /></label>
        <label className="space-y-2 text-sm font-semibold">SKU<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" maxLength={64} name="sku" required /></label>
        <label className="space-y-2 text-sm font-semibold">URL slug<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" maxLength={160} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
        <label className="space-y-2 text-sm font-semibold sm:col-span-2">Short description<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" maxLength={500} name="shortDescription" /></label>
        <div className="sm:col-span-2 lg:col-span-3"><button className="h-10 rounded-lg bg-primary px-5 text-sm font-bold text-white" type="submit">Create draft</button></div>
      </form></section>
      <section className="mt-8 space-y-4" aria-label="Product list">
        {products.map((product) => <details className="rounded-3xl border border-border bg-white p-5 sm:p-6" key={product.id}><summary className="cursor-pointer list-none"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><span className="text-xs font-bold uppercase tracking-wider text-primary">{product.category.name}</span><h2 className="mt-1 text-lg font-extrabold">{product.name}</h2><p className="mt-1 text-xs text-muted-foreground">SKU {product.sku} · /products/{product.slug}</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{product.status}</span>{product.isIndicativePricing && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">Indicative prices</span>}<Link className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-primary" href={`/admin/products/${product.id}`}>Manage options / prices</Link></div></div></summary>
          <form action={updateProduct} className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <input name="id" type="hidden" value={product.id} />
            <label className="space-y-2 text-sm font-semibold">Name<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" defaultValue={product.name} maxLength={180} name="name" required /></label>
            <label className="space-y-2 text-sm font-semibold">SKU<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" defaultValue={product.sku} maxLength={64} name="sku" required /></label>
            <label className="space-y-2 text-sm font-semibold">Status<select className="h-10 w-full rounded-lg border border-input bg-white px-3 font-normal" defaultValue={product.status} name="status"><option value="DRAFT">Draft</option><option value="ACTIVE">Published</option><option value="ARCHIVED">Archived</option></select></label>
            <label className="space-y-2 text-sm font-semibold">Default VAT rate (basis points)<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" defaultValue={product.vatRateBps} max={10000} min={0} name="vatRateBps" required type="number" /></label>
            <label className="space-y-2 text-sm font-semibold sm:col-span-2">Short description<input className="h-10 w-full rounded-lg border border-input px-3 font-normal" defaultValue={product.shortDescription ?? ''} maxLength={500} name="shortDescription" /></label>
            <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2 lg:col-span-3"><input defaultChecked={!product.isIndicativePricing} name="approvePricing" type="checkbox" />I have reviewed these prices and VAT settings; clear the development pricing flag.</label>
            <div className="flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-3"><span className="text-xs text-muted-foreground">{product.priceTiers.length} active quantity tiers</span><button className="h-10 rounded-lg bg-primary px-5 text-sm font-bold text-white" type="submit">Save product</button></div>
          </form>
        </details>)}
      </section>
    </main>
  );
}
