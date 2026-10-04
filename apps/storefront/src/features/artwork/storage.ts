import { S3Client } from '@aws-sdk/client-s3';
import { getS3Env } from '@/lib/env';

let client: S3Client | undefined;

export function getS3Storage() {
  const environment = getS3Env();
  client ??= new S3Client({
    region: environment.S3_REGION,
    endpoint: environment.S3_ENDPOINT,
    forcePathStyle: Boolean(environment.S3_ENDPOINT),
    credentials: {
      accessKeyId: environment.S3_ACCESS_KEY_ID,
      secretAccessKey: environment.S3_SECRET_ACCESS_KEY,
    },
  });
  return { client, bucket: environment.S3_BUCKET };
}
