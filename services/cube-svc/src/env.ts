export interface Env {
  HYPERDRIVE: Hyperdrive;
  /** Deletes R2 objects. Browser uploads still use S3 presigned URLs. */
  R2_BUCKET: R2Bucket;
  HOST: string;
  CUBE_SVC_HOST: string;
  /** Sequelize schema. The live service uses `cube`, not `public`. */
  DB_SCHEMA: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN: string;
  CLOUDFLARE_R2_BUCKET_NAME: string;
  CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL: string;
  ENCRYPT_SECRET: string;
  JWT_TOKEN_SECRET: string;
  BREVO_API_KEY: string;
  CONTACT_US_EMAIL: string;
  REPORT_ABUSE_EMAIL: string;
  NOTIFICATION_EMAIL: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_R2_ACCESS_KEY_ID: string;
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
}
