# Deployment Guide: Zorvyn Financial Dashboard

This guide outlines the steps to containerize the Zorvyn Dashboard and deploy it to **Google Cloud Run**.

## 1. Prerequisites
- Docker installed locally.
- Google Cloud SDK (`gcloud`) installed and authenticated.
- A Google Cloud Project with the **Cloud Run** and **Artifact Registry** APIs enabled.

## 2. Local Containerization & Testing

To verify the production build locally:

```bash
# 1. Build the image
docker build -t zorvyn-dashboard .

# 2. Run the container
docker run -p 8080:8080 zorvyn-dashboard
```

Navigate to `http://localhost:8080` to verify the standalone bundle is operational.

## 3. Deploying to Google Cloud Run

### Step A: Create Artifact Registry
```bash
gcloud artifacts repositories create zorvyn-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Zorvyn Dashboard Production Images"
```

### Step B: Build and Push to Google Cloud
```bash
# Replace PROJECT_ID with your GCP project ID
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/zorvyn-repo/dashboard:latest
```

### Step C: Deploy to Cloud Run
```bash
gcloud run deploy zorvyn-dashboard \
    --image us-central1-docker.pkg.dev/PROJECT_ID/zorvyn-repo/dashboard:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1
```

## 4. Operational Notes

> [!WARNING]
> **Ephemeral Persistence**: This deployment uses `src/lib/mockData.json` for state. Because Cloud Run is stateless, any transactions added or deleted via the UI will be lost when the container restarts or scales to zero.
> For persistent storage in production, consider migrating the `readData`/`writeData` logic in `src/app/api/transactions/route.js` to a database like **Google Firestore** or **Cloud SQL**.

> [!IMPORTANT]
> **Environment Variables**: If you add external API integrations (e.g., Bloomberg/Refinitiv keys), use the `--set-env-vars` flag during deployment or the Google Cloud Console Secret Manager.
