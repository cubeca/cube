## Run The Following Upon Environment Creation

`gcloud pubsub topics create vtt_queue`

## Run To Deploy

Init Deploy:

https://cloud.google.com/sql/docs/mysql/connect-functions

https://cloud.google.com/sql/docs/mysql/connect-run#configure

Deployment command for dev:

`
gcloud functions deploy vtt_transcribe --runtime nodejs18 --trigger-topic vtt_transcribe --gen2 --region=northamerica-northeast2 --timeout=540 --memory=2GB --set-env-vars PGUSER=postgres,PGHOST=/cloudsql/cubecommons-dev:northamerica-northeast2:dev,PGDATABASE=cube_content,PGPORT=5432 --set-secrets PGPASSWORD=dev-db-password:latest,OPENAI=dev-openai:latest,cfToken=dev-cloudflare-api-token:latest,CF-R2-ID=dev-cloudflare-r2-access-key-id:latest,CF-R2-SECRET=dev-cloudflare-r2-secret-access-key:latest,CF-ACCOUNT-ID=dev-cloudflare-account-id:latest --ingress-settings=internal-only

gcloud functions deploy vtt_upload --runtime nodejs18 --trigger-topic vtt_upload --gen2 --region=northamerica-northeast2 --timeout=120 --memory=256MB --set-env-vars PGUSER=postgres,PGHOST=/cloudsql/cubecommons-dev:northamerica-northeast2:dev,PGDATABASE=cube_content,PGPORT=5432 --set-secrets PGPASSWORD=dev-db-password:latest,OPENAI=dev-openai:latest,cfToken=dev-cloudflare-api-token:latest,CF-R2-ID=dev-cloudflare-r2-access-key-id:latest,CF-R2-SECRET=dev-cloudflare-r2-secret-access-key:latest,CF-ACCOUNT-ID=dev-cloudflare-account-id:latest --ingress-settings=internal-only

`

e4a51cb7-855e-4c48-84ba-8faed9b45ce6

Follow https://cloud.google.com/sql/docs/mysql/connect-functions after first deployment.
-- TLDR - Find the created cloudrun instance, click "edit and deploy new revision", then under "Cloud SQL connections" add the required DB.
