# Vidhan Soudha — Attendance System Deployment Guide

## Overview

This guide covers the end-to-end deployment process for the Attendance Backend and Frontend services used in the Vidhan Soudha FRS (Face Recognition System) setup.

---

## Prerequisites

- Docker & Docker Compose installed on the build machine
- Docker Hub access with push permissions to `vtpl/`
- SSH access to the Vidhan Soudha production server

---

## Step 1 — Build Docker Images

Run the following command from the project root to build all services:

```bash
docker compose up --build
```

---

## Step 2 — Push Images to Docker Hub

After a successful build, push both images to the registry:

```bash
docker push vtpl/attendance-backend:latest
docker push vtpl/attendance-frontend:latest
```

---

## Step 3 — Deploy on the Vidhan Soudha Server

### 3.1 Connect to the Server

SSH into the Vidhan Soudha production server. The FRS-related Docker Compose deployment will be present there.

### 3.2 Pull Latest Images and Restart

```bash
# Bring down running containers
docker compose down

# Pull the latest images
docker compose pull

# Start services again
docker compose up -d
```
