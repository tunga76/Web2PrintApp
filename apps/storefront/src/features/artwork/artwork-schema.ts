import { z } from 'zod';

export const artworkUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255).refine((name) => !/[\\/\u0000-\u001f\u007f]/.test(name)),
  contentType: z.enum(['application/pdf', 'image/tiff', 'image/jpeg', 'image/png']),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
}).refine((file) => {
  const extension = file.filename.toLowerCase().split('.').pop();
  return ({ pdf: 'application/pdf', tif: 'image/tiff', tiff: 'image/tiff', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' } as Record<string, string>)[extension ?? ''] === file.contentType;
}, { path: ['filename'], message: 'The file extension must match its format.' });

export function safeStorageFilename(filename: string) {
  const cleaned = filename.normalize('NFKC').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-160);
  return cleaned || 'artwork-file';
}
