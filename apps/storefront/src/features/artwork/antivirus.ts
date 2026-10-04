import { createConnection, type Socket } from 'node:net';
import { once } from 'node:events';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getClamAvEnv } from '@/lib/env';
import { getS3Storage } from '@/features/artwork/storage';

function waitForReply(socket: Socket) {
  return new Promise<string>((resolve, reject) => {
    let response = '';
    const timeout = setTimeout(() => reject(new Error('ClamAV scan timed out.')), 180_000);
    socket.on('data', (data: Buffer) => {
      response += data.toString('utf8');
      if (response.includes('\0') || response.endsWith('\n')) {
        clearTimeout(timeout);
        resolve(response.replace(/\0/g, '').trim());
      }
    });
    socket.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    socket.once('close', () => {
      clearTimeout(timeout);
      if (response) resolve(response.replace(/\0/g, '').trim());
      else reject(new Error('ClamAV closed the scan connection without a response.'));
    });
  });
}

export async function scanArtworkObject(objectKey: string) {
  const { client, bucket } = getS3Storage();
  const { CLAMAV_HOST, CLAMAV_PORT } = getClamAvEnv();
  const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objectKey }));
  if (!object.Body || !(Symbol.asyncIterator in object.Body)) throw new Error('Object storage did not return a readable file stream.');

  const socket = createConnection({ host: CLAMAV_HOST, port: CLAMAV_PORT });
  socket.setTimeout(180_000, () => socket.destroy(new Error('ClamAV scan timed out.')));
  try {
    await new Promise<void>((resolve, reject) => {
      socket.once('connect', resolve);
      socket.once('error', reject);
    });
    const reply = waitForReply(socket);
    socket.write(Buffer.from('zINSTREAM\0'));
    for await (const value of object.Body as AsyncIterable<Uint8Array>) {
      const bytes = Buffer.from(value);
      const frame = Buffer.allocUnsafe(4 + bytes.length);
      frame.writeUInt32BE(bytes.length, 0);
      bytes.copy(frame, 4);
      if (!socket.write(frame)) await once(socket, 'drain');
    }
    socket.write(Buffer.alloc(4));
    const result = await reply;
    if (result.endsWith(': OK')) return { clean: true as const };
    if (result.endsWith(': FOUND')) return { clean: false as const };
    throw new Error('ClamAV did not return a clean scan result.');
  } finally {
    socket.destroy();
  }
}
