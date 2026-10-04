import { reviewArtwork } from '@/features/admin/actions';
import { getDb } from '@/lib/db';
import { ArtworkDownloadButton } from '@/features/artwork/artwork-review-controls';
import { ArtworkScanButton } from '@/features/artwork/artwork-review-controls';

export async function ArtworkReviewQueue() {
  const files = await getDb().artworkAsset.findMany({
    where: { deletedAt: null, status: { in: ['QUARANTINED', 'REVIEW_REQUIRED'] } },
    orderBy: { createdAt: 'asc' },
    include: {
      customerAccount: { select: { displayName: true } },
      uploadedBy: { select: { name: true, email: true } },
    },
  });
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Artwork workflow</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Artwork review</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Uploads remain private. Files must pass ClamAV malware scanning before print-quality review; only clean and approved artwork can be attached to a basket.</p>
      {!files.length ? <div className="mt-8 rounded-3xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">No artwork is waiting for review.</div> : <div className="mt-8 space-y-4">{files.map((file) => <article className="rounded-3xl border border-border bg-white p-5 sm:p-6" key={file.id}><div className="flex flex-col justify-between gap-4 md:flex-row"><div><p className="font-extrabold">{file.originalFilename}</p><p className="mt-1 text-sm text-muted-foreground">{file.customerAccount.displayName} · {file.uploadedBy.email}</p><p className="mt-1 text-xs text-muted-foreground">{file.mimeType} · {(Number(file.sizeBytes) / (1024 * 1024)).toFixed(1)} MB · {file.createdAt.toLocaleString('en-GB')}</p><span className="mt-3 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-bold">{file.status === 'QUARANTINED' ? 'Security scan pending' : 'Virus scan passed · print review pending'}</span></div><div className="flex flex-wrap items-center gap-2"><ArtworkDownloadButton artworkId={file.id} />{file.status === 'QUARANTINED' ? <ArtworkScanButton artworkId={file.id} /> : <form action={reviewArtwork} className="flex flex-wrap items-center gap-2"><input name="artworkId" type="hidden" value={file.id} /><input className="h-9 min-w-44 rounded-lg border border-input px-3 text-xs" maxLength={500} name="note" placeholder="Review note (optional)" /><button className="h-9 rounded-lg bg-primary px-4 text-xs font-bold text-white" name="decision" type="submit" value="APPROVED">Approve for use</button><button className="h-9 rounded-lg border border-border px-4 text-xs font-bold" name="decision" type="submit" value="REJECTED">Reject</button></form>}</div></div></article>)}</div>}
    </main>
  );
}
