## Run The Following Upon Environment Creation

`gcloud pubsub topics create vtt_transcribe`

`gcloud pubsub topics create vtt_upload`

## Run To Deploy

Init Deploy:

https://cloud.google.com/sql/docs/mysql/connect-functions

https://cloud.google.com/sql/docs/mysql/connect-run#configure

Follow https://cloud.google.com/sql/docs/mysql/connect-functions after first deployment.
-- TLDR - Find the created cloudrun instance, click "edit and deploy new revision", then under "Cloud SQL connections" add the required DB.

## Manual Testing

In the UI, navigate to Pub/Sub, the navigate to vtt_transcribe, and click "Publish Message". In the message body, put a content record ID. The cloud function logs can be viewed in the UI under Cloud Functions. The VTT file will be generated within a few moments depending on the length of the video.
