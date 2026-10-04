'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const maximumBytes = 100 * 1024 * 1024;

export function ArtworkUploadForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending(true);
    setError(null);
    setStatus(null);
    const fileInput = event.currentTarget.elements.namedItem('file');
    const file = fileInput instanceof HTMLInputElement ? fileInput.files?.[0] : undefined;
    if (!file) {
      setError('Choose a file to upload.');
      setPending(false);
      return;
    }
    if (file.size < 1 || file.size > maximumBytes) {
      setError('The file must be between 1 byte and 100 MB.');
      setPending(false);
      return;
    }

    try {
      const initResponse = await fetch('/api/artwork/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, sizeBytes: file.size }),
      });
      const signed = (await initResponse.json()) as { artworkId?: string; uploadUrl?: string; fields?: Record<string, string>; error?: string };
      if (!initResponse.ok || !signed.artworkId || !signed.uploadUrl || !signed.fields) throw new Error(signed.error ?? 'UPLOAD_PREPARATION_FAILED');

      const form = new FormData();
      Object.entries(signed.fields).forEach(([key, value]) => form.append(key, value));
      form.append('file', file);
      const uploadResponse = await fetch(signed.uploadUrl, { method: 'POST', body: form });
      if (!uploadResponse.ok) throw new Error('S3_UPLOAD_FAILED');

      const completeResponse = await fetch(`/api/artwork/uploads/${signed.artworkId}/complete`, { method: 'POST' });
      const completed = (await completeResponse.json()) as { status?: string; message?: string; error?: string };
      if (!completeResponse.ok) throw new Error(completed.error ?? 'UPLOAD_VERIFICATION_FAILED');
      setStatus(completed.message ?? `File stored with status ${completed.status}.`);
      formElement.reset();
    } catch (cause) {
      const descriptions: Record<string, string> = {
        S3_CONFIGURATION_REQUIRED: 'S3-compatible storage is not configured for this environment.',
        INVALID_FILE: 'Choose a PDF, TIFF, JPEG or PNG file and check that its extension matches.',
        FILE_SIGNATURE_MISMATCH: 'The file contents do not match the selected format. The file was removed.',
        FILE_METADATA_MISMATCH: 'The uploaded file did not match its declared size or format. The file was removed.',
        MALWARE_DETECTED: 'The malware scanner detected a threat. The uploaded file was removed.',
      };
      const key = cause instanceof Error ? cause.message : '';
      setError(descriptions[key] ?? 'We could not complete this upload. Check your connection and try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="rounded-3xl border border-border bg-white p-5 sm:p-7" onSubmit={submit}>
      <label className="block text-sm font-bold" htmlFor="file">Artwork file</label>
      <input accept=".pdf,.tif,.tiff,.jpg,.jpeg,.png,application/pdf,image/tiff,image/jpeg,image/png" className="mt-3 block w-full rounded-xl border border-border p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-bold" id="file" name="file" required type="file" />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">PDF, TIFF, JPEG or PNG · maximum 100 MB. Uploads stay private while a team member reviews them.</p>
      {status && <p aria-live="polite" className="mt-4 rounded-xl bg-sky-50 p-3 text-sm leading-6 text-sky-900">{status}</p>}
      {error && <p aria-live="polite" className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</p>}
      <Button className="mt-5 h-11 w-full" disabled={pending} type="submit">{pending ? 'Uploading and checking…' : 'Upload artwork'}</Button>
    </form>
  );
}
