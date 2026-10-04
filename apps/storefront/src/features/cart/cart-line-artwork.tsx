'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ArtworkChoice = { id: string; originalFilename: string };

export function CartLineArtwork({
  lineId,
  attached,
  available,
  locked,
}: {
  lineId: string;
  attached: ArtworkChoice[];
  available: ArtworkChoice[];
  locked: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function attach() {
    setPending(true);
    setError(null);
    const response = await fetch(`/api/cart/lines/${lineId}/artwork`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artworkId: selected }),
    });
    setPending(false);
    if (!response.ok) {
      setError('The artwork could not be attached. Check its review status and try again.');
      return;
    }
    router.refresh();
  }

  async function detach(artworkId: string) {
    const response = await fetch(`/api/cart/lines/${lineId}/artwork?artworkId=${encodeURIComponent(artworkId)}`, { method: 'DELETE' });
    if (!response.ok) {
      setError('The artwork could not be removed. Refresh and try again.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-4 rounded-xl bg-muted/70 p-3">
      <p className="text-xs font-bold">Artwork</p>
      {attached.length > 0 ? <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{attached.map((file) => <li className="flex justify-between gap-3" key={file.id}><span>{file.originalFilename}</span>{!locked && <button className="font-semibold text-primary hover:underline" onClick={() => detach(file.id)} type="button">Remove</button>}</li>)}</ul> : <p className="mt-1 text-xs text-muted-foreground">No artwork attached.</p>}
      {!locked && available.length > 0 && (
        <div className="mt-3 flex gap-2"><select aria-label="Choose approved artwork" className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-white px-2 text-xs" onChange={(event) => setSelected(event.target.value)} value={selected}><option value="">Choose approved file</option>{available.filter((file) => !attached.some((current) => current.id === file.id)).map((file) => <option key={file.id} value={file.id}>{file.originalFilename}</option>)}</select><button className="h-9 rounded-lg bg-primary px-3 text-xs font-bold text-white disabled:opacity-50" disabled={!selected || pending} onClick={attach} type="button">Attach</button></div>
      )}
      {!available.length && <p className="mt-2 text-xs text-muted-foreground"><Link className="font-semibold text-primary hover:underline" href="/account/artwork">Upload artwork</Link>. A production team member must approve it before attaching.</p>}
      {error && <p className="mt-2 text-xs text-red-700" role="alert">{error}</p>}
    </div>
  );
}
