## Run The Following Upon Environment Creation

`gcloud pubsub topics create vtt_transcribe`

`gcloud pubsub topics create vtt_upload`

## Run To Deploy

Init Deploy:

https://cloud.google.com/sql/docs/mysql/connect-functions

https://cloud.google.com/sql/docs/mysql/connect-run#configure

Deployment command for prod:

`
gcloud functions deploy vtt_transcribe --runtime nodejs18 --trigger-topic vtt_transcribe --gen2 --region=northamerica-northeast2 --timeout=540 --memory=2GB --set-env-vars PGUSER=postgres,PGHOST=/cloudsql/cubecommons-prod:northamerica-northeast2:prod,PGDATABASE=cube_content,PGPORT=5432 --set-secrets PGPASSWORD=prod-db-password:latest,OPENAI=prod-openai:latest,cfToken=prod-cloudflare-api-token:latest,CF-R2-ID=prod-cloudflare-r2-access-key-id:latest,CF-R2-SECRET=prod-cloudflare-r2-secret-access-key:latest,CF-ACCOUNT-ID=prod-cloudflare-account-id:latest --ingress-settings=internal-only

gcloud functions deploy vtt_upload --runtime nodejs18 --trigger-topic vtt_upload --gen2 --region=northamerica-northeast2 --timeout=120 --memory=256MB --set-env-vars PGUSER=postgres,PGHOST=/cloudsql/cubecommons-prod:northamerica-northeast2:prod,PGDATABASE=cube_content,PGPORT=5432 --set-secrets PGPASSWORD=prod-db-password:latest,OPENAI=prod-openai:latest,cfToken=prod-cloudflare-api-token:latest,CF-R2-ID=prod-cloudflare-r2-access-key-id:latest,CF-R2-SECRET=prod-cloudflare-r2-secret-access-key:latest,CF-ACCOUNT-ID=prod-cloudflare-account-id:latest --ingress-settings=internal-only

`

Follow https://cloud.google.com/sql/docs/mysql/connect-functions after first deployment.
-- TLDR - Find the created cloudrun instance, click "edit and deploy new revision", then under "Cloud SQL connections" add the required DB.

## Manual Testing

In the UI, navigate to Pub/Sub, the navigate to vtt_transcribe, and click "Publish Message". In the message body, put a content record ID. The cloud function logs can be viewed in the UI under Cloud Functions. The VTT file will be generated within a few moments depending on the length of the video. 
