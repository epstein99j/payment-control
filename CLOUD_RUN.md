# Cloud Run Deployment (Alternative to Firebase)

Use this if you prefer Google Cloud Run over Firebase Hosting.

## Prerequisites
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
- Google Cloud account with billing enabled

## Deploy Commands

### 1. Login to Google Cloud
```bash
gcloud auth login
```

### 2. Set Your Project
```bash
gcloud config set project YOUR_PROJECT_ID
```

### 3. Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### 4. Deploy from Source
```bash
gcloud run deploy payment-control \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### 5. Done!
You'll get a URL like: `https://payment-control-xxxxxx-uc.a.run.app`

## Other Useful Commands

### View logs
```bash
gcloud run services logs read payment-control --region us-central1
```

### Update deployment
```bash
gcloud run deploy payment-control --source . --region us-central1
```

### Delete service
```bash
gcloud run services delete payment-control --region us-central1
```

## Costs
Cloud Run has a generous free tier:
- 2 million requests/month free
- 360,000 GB-seconds of memory free
- 180,000 vCPU-seconds free

For a demo/internal tool, you'll likely stay in the free tier.
