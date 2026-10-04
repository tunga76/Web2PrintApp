'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateProofForm({
  orderId,
  orderLineId,
  artwork,
}: {
  orderId: string;
  orderLineId: string;
  artwork: Array<{ id: string; originalFilename: string }>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending(true);
    setMessage('');
    const data = new FormData(formElement);
    const file = data.get('proof');
    const sourceArtworkId = String(data.get('sourceArtworkId') ?? '');
    if (!(file instanceof File) || file.type !== 'application/pdf' || file.size < 1 || file.size > 20 * 1024 * 1024) {
      setMessage('Choose a PDF proof no larger than 20 MB.');
      setPending(false);
      return;
    }
    try {
      const init = await fetch('/api/admin/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderLineId, sourceArtworkId, fileSizeBytes: file.size, reviewNotes: data.get('reviewNotes') }),
      });
      const signed = (await init.json()) as { proofId?: string; uploadUrl?: string; fields?: Record<string, string>; error?: string };
      if (!init.ok || !signed.proofId || !signed.uploadUrl || !signed.fields) throw new Error(signed.error ?? 'PROOF_UPLOAD_PREPARATION_FAILED');
      const payload = new FormData();
      Object.entries(signed.fields).forEach(([key, value]) => payload.append(key, value));
      payload.append('file', file);
      const uploaded = await fetch(signed.uploadUrl, { method: 'POST', body: payload });
      if (!uploaded.ok) throw new Error('S3_UPLOAD_FAILED');
      const completed = await fetch(`/api/admin/proofs/${signed.proofId}/complete`, { method: 'POST' });
      const result = (await completed.json()) as { error?: string };
      if (!completed.ok) throw new Error(result.error ?? 'PROOF_REVIEW_FAILED');
      router.push(`/admin/orders/${orderId}`);
      router.refresh();
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      setMessage(code === 'MALWARE_DETECTED' ? 'The scanner detected a threat and removed the file.' : 'The proof could not be uploaded, scanned or sent. Check storage and ClamAV, then try again.');
    } finally {
      setPending(false);
    }
  }

  return <form className="mt-6 space-y-5 rounded-3xl border border-border bg-white p-5 sm:p-6" onSubmit={submit}>
    <div className="space-y-2"><Label htmlFor="sourceArtworkId">Source artwork</Label><select className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm" id="sourceArtworkId" name="sourceArtworkId" required>{artwork.map((file) => <option key={file.id} value={file.id}>{file.originalFilename}</option>)}</select></div>
    <div className="space-y-2"><Label htmlFor="proof">Proof PDF</Label><Input accept="application/pdf,.pdf" id="proof" name="proof" required type="file" /><p className="text-xs text-muted-foreground">PDF only, up to 20 MB. The file is malware-scanned before the customer can view it.</p></div>
    <div className="space-y-2"><Label htmlFor="reviewNotes">Note for the customer <span className="text-muted-foreground">(optional)</span></Label><textarea className="min-h-24 w-full rounded-lg border border-input p-3 text-sm" id="reviewNotes" maxLength={500} name="reviewNotes" /></div>
    {message && <p aria-live="polite" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
    <Button disabled={pending} type="submit">{pending ? 'Uploading, scanning and sending…' : 'Send proof for approval'}</Button>
  </form>;
}

export function ProofDownloadButton({ proofId }: { proofId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function download() {
    setBusy(true);
    setError('');
    const response = await fetch(`/api/account/proofs/${proofId}/download`);
    const result = (await response.json()) as { url?: string };
    setBusy(false);
    if (!response.ok || !result.url) return setError('Proof unavailable. Refresh and try again.');
    window.open(result.url, '_blank', 'noopener,noreferrer');
  }
  return <div><Button disabled={busy} onClick={download} type="button" variant="outline">{busy ? 'Preparing…' : 'View proof PDF'}</Button>{error && <p className="mt-1 text-xs text-red-700">{error}</p>}</div>;
}

export function ProofDecisionForm({ proofId }: { proofId: string }) {
  const router = useRouter();
  const [responseText, setResponseText] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function decide(decision: 'APPROVED' | 'CHANGES_REQUESTED') {
    if (decision === 'CHANGES_REQUESTED' && !responseText.trim()) {
      setError('Add a note describing the changes you need.');
      return;
    }
    setPending(true);
    setError('');
    const result = await fetch(`/api/account/proofs/${proofId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, response: responseText }),
    });
    setPending(false);
    if (!result.ok) {
      setError('We could not save your proof decision. Refresh and try again.');
      return;
    }
    router.refresh();
  }

  return <div className="mt-4 space-y-3"><Label htmlFor={`response-${proofId}`}>Message for the production team</Label><textarea className="min-h-20 w-full rounded-lg border border-input p-3 text-sm" id={`response-${proofId}`} maxLength={1000} onChange={(event) => setResponseText(event.target.value)} value={responseText} /><div className="flex flex-wrap gap-2"><Button disabled={pending} onClick={() => decide('APPROVED')} type="button">Approve proof</Button><Button disabled={pending} onClick={() => decide('CHANGES_REQUESTED')} type="button" variant="outline">Request changes</Button></div>{error && <p className="text-sm text-red-700" role="alert">{error}</p>}</div>;
}
