# GitHub Actions CI/CD Pipeline Setup Guide

This guide explains the GitHub Actions pipeline for building, scanning, and deploying the Bitcoin App to GKE.

## Pipeline Overview

The pipeline performs the following steps:

1. **Build**: Builds Docker image and pushes to Google Container Registry (GCR)
2. **Scan with Trivy**: Vulnerability scanning of the Docker image
3. **Scan with SonarQube**: Code quality analysis
4. **Deploy**: Deploys to GKE using Helm charts

## Prerequisites

### 1. GCP Setup

Create a GCP service account with the following permissions:
- Container Registry Service Agent
- Kubernetes Engine Developer
- Service Account User

Generate a JSON key file for the service account.

### 2. GitHub Secrets

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```
GCP_PROJECT_ID          # Your GCP project ID
GCP_SA_KEY              # GCP service account JSON key (base64 encoded)
GKE_CLUSTER_NAME        # Your GKE cluster name
GKE_ZONE                # GKE cluster zone (e.g., us-central1-a)
SONAR_HOST_URL          # SonarQube server URL
SONAR_TOKEN             # SonarQube authentication token
CLUSTER_SSH_KEY         # SSH private key for cluster nodes (base64 encoded)
CLUSTER_SSH_USER        # SSH user for cluster nodes (e.g., ubuntu, gke-user)
```

### 3. Setup SSH Key for Cluster Access

Generate or use existing SSH key pair for your GKE cluster nodes:

```bash
# If you don't have a key, generate one
ssh-keygen -t rsa -b 4096 -f ~/.ssh/gke_cluster_key -N ""

# Get the private key (base64 encoded)
cat ~/.ssh/gke_cluster_key | base64 -w 0

# Copy the output and add as CLUSTER_SSH_KEY secret
```

Ensure the public key is added to your GKE cluster nodes:
- For GKE, add the public key to the node's authorized_keys
- Or use OS Login feature in GCP

### 4. Encode GCP SA Key (if needed)

```bash
cat path/to/service-account-key.json | base64 -w 0
```

## Workflow Details

### Build Job
- Checks out code
- Authenticates with GCP
- Builds Docker image with multi-stage build
- Pushes image to GCR with commit SHA and latest tags

### Scan Trivy Job
- Scans Docker image for vulnerabilities
- Uses SARIF format for GitHub security reporting
- Flags CRITICAL and HIGH severity vulnerabilities

### Scan SonarQube Job
- Installs dependencies and builds the app
- Runs SonarQube analysis
- Checks quality gate status

### Deploy Job
- Only runs on main branch push (skips PRs)
- Gets GKE cluster credentials
- Retrieves all cluster node IPs
- Sets up SSH connection using private key from secrets
- Transfers Docker image tar.gz to each node via SCP
- Loads Docker image on each node using `docker load`
- Creates namespace and deploys application using Helm
- Verifies deployment rollout and pod status

## Helm Deployment

The Helm chart includes:
- **Deployment**: 3 replicas with resource limits
- **Service**: LoadBalancer type for external access
- **HPA**: Horizontal Pod Autoscaler (2-5 replicas based on CPU/Memory)
- **Security**: Pod security context with non-root user
- **Health Checks**: Liveness and readiness probes

### Manual Helm Deployment

```bash
# Add GKE cluster credentials
gcloud container clusters get-credentials CLUSTER_NAME --zone ZONE --project PROJECT_ID

# Deploy using Helm
helm upgrade --install bitcoin-app ./helm/bitcoin-app \
  --namespace bitcoin-app \
  --set image.repository=gcr.io/PROJECT_ID/bitcoin-app \
  --set image.tag=COMMIT_SHA \
  --wait

# Check deployment status
kubectl get pods -n bitcoin-app
kubectl get svc -n bitcoin-app
```

## Customization

### Values.yaml Configuration

Edit `helm/bitcoin-app/values.yaml` to customize:
- Replica count
- Resource limits/requests
- Service type (LoadBalancer/ClusterIP/NodePort)
- Autoscaling parameters
- Health check timeouts

### Environment Variables

Add environment variables in values.yaml:

```yaml
env:
  - name: LOG_LEVEL
    value: "info"
  - name: API_KEY
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: api-key
```

## Troubleshooting

### Docker Build Fails
- Check if package.json dependencies are correct
- Verify Node.js version in Dockerfile

### SonarQube Scan Issues
- Ensure SONAR_HOST_URL is accessible
- Verify SONAR_TOKEN is valid
- Check firewall rules

### Deployment Fails
- Verify GKE cluster is running: `gcloud container clusters list`
- Check GCP service account permissions
- Verify image exists in GCR: `gcloud container images list`

## Image Delivery Method

This pipeline uses **SSH key-based delivery** to transfer Docker images directly to cluster nodes:

1. **Build**: Builds Docker image locally
2. **Save**: Compresses image to tar.gz artifact
3. **SSH Transfer**: Copies image to each cluster node via SCP
4. **Load**: Runs `docker load` on each node to import the image
5. **Deploy**: Helm deploys using `imagePullPolicy: Never` (uses pre-loaded image)

### Advantages:
- ✅ No external registry needed (GCR, ECR, etc.)
- ✅ Works in air-gapped/isolated networks
- ✅ Direct control over image distribution
- ✅ Efficient for internal deployments

### Prerequisites for SSH Delivery:
- SSH access to all cluster nodes
- Docker daemon accessible on nodes
- SSH key properly configured in GitHub secrets

## Security Considerations

- Images are scanned with Trivy for vulnerabilities
- Pod runs as non-root user (UID 1000)
- Read-only root filesystem enabled
- No privileged capabilities
- Network policies can be added as needed

## GitOps Alternative

For pure GitOps, consider using:
- **ArgoCD**: Monitors Helm charts in Git and syncs to cluster
- **Flux**: GitOps toolkit for continuous delivery

This would require adding ArgoCD/Flux ApplicationSet manifests to the repository.
