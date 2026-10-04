import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ArtworkUploadForm } from '@/features/artwork/artwork-upload-form';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your artwork', robots: { index: false, follow: false } };

const statusLabels: Record<string, string> = {
  UPLOADING: 'Upload in progress',
  UPLOADED: 'Uploaded',
  VALIDATING: 'Being checked',
  REVIEW_REQUIRED: 'Review needed',
  APPROVED: 'Approved for use',
  REJECTED: 'Not approved',
  QUARANTINED: 'Security review pending',
};

export default async function AccountArtworkPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) redirect('/account');
  const artwork = await getDb().artworkAsset.findMany({
    where: { customerAccountId: owner.account.id, uploadedByUserId: session.user.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true, originalFilename: true, sizeBytes: true, mimeType: true, status: true, createdAt: true },
  });

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link className="font-black tracking-tight" href="/">web2print</Link><Link className="text-sm font-semibold" href="/account">Your account</Link></div></header>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Artwork files</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Your artwork</h1>
        <p className="mt-3 max-w-2xl leading-6 text-muted-foreground">Upload print-ready files to your private account. Each upload is held for manual production review before it can be attached to an order.</p>
        <div className="mt-8"><ArtworkUploadForm /></div>
        <section className="mt-10" aria-labelledby="artwork-list-heading">
          <h2 className="text-xl font-extrabold" id="artwork-list-heading">Recent uploads</h2>
          {!artwork.length ? <p className="mt-4 rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted-foreground">No files uploaded yet.</p> : (
            <ul className="mt-4 space-y-3">{artwork.map((file) => <li className="flex flex-col justify-between gap-2 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center" key={file.id}><div><p className="font-bold">{file.originalFilename}</p><p className="mt-1 text-xs text-muted-foreground">{file.mimeType} · {(Number(file.sizeBytes) / (1024 * 1024)).toFixed(1)} MB · {file.createdAt.toLocaleDateString('en-GB')}</p></div><span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-bold">{statusLabels[file.status] ?? file.status}</span></li>)}</ul>
          )}
        </section>
      </div>
    </main>
  );
}
