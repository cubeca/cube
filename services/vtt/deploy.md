## Run The Following Upon Environment Creation

`gcloud pubsub topics create vtt_queue`

## Run To Deploy

Init Deploy:

https://cloud.google.com/sql/docs/mysql/connect-functions

https://cloud.google.com/sql/docs/mysql/connect-run#configure

Deployment command for dev:

`gcloud functions deploy vtt_gen --runtime nodejs18 --trigger-topic vtt_queue --gen2 --region=northamerica-northeast2 --timeout=540 --memory=1024MB --set-env-vars PGUSER=postgres,PGHOST=/cloudsql/cubecommons-dev:northamerica-northeast2:dev,PGDATABASE=cube_content,PGPORT=5432,CONTENTSVC=https://content-tjjg4pjowa-pd.a.run.app --set-secrets PGPASSWORD=dev-db-password:latest,OPENAI=dev-openai:latest,cfToken=dev-cloudflare-api-token:latest,CF-R2-ID=dev-cloudflare-r2-access-key-id:latest,CF-R2-SECRET=dev-cloudflare-r2-secret-access-key:latest --ingress-settings=internal-only`

2317bdcc-ef3c-4668-9b60-d0f8a0505a1b
