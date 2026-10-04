'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ArtworkDownloadButton({ artworkId }: { artworkId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function download() {
    setPending(true);
    setError('');
    const response = await fetch(`/api/admin/artwork/${artworkId}/download`);
    const result = (await response.json()) as { url?: string };
    setPending(false);
    if (!response.ok || !result.url) {
      setError('Download link unavailable.');
      return;
    }
    window.open(result.url, '_blank', 'noopener,noreferrer');
  }
  return <div><button className="h-9 rounded-lg border border-border px-4 text-xs font-bold" disabled={pending} onClick={download} type="button">{pending ? 'Preparing…' : 'Download file'}</button>{error && <p className="mt-1 text-xs text-red-700">{error}</p>}</div>;
}

export function ArtworkScanButton({ artworkId }: { artworkId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function scan() {
    setPending(true);
    setError('');
    const response = await fetch(`/api/admin/artwork/${artworkId}/scan`, { method: 'POST' });
    const result = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(result.error === 'MALWARE_DETECTED' ? 'A threat was detected; the file was removed.' : 'Scanner is unavailable. Check the ClamAV service and try again.');
      return;
    }
    router.refresh();
  }
  return <div><button className="h-9 rounded-lg border border-border px-4 text-xs font-bold" disabled={pending} onClick={scan} type="button">{pending ? 'Scanning…' : 'Retry security scan'}</button>{error && <p className="mt-1 max-w-56 text-xs text-red-700">{error}</p>}</div>;
}
