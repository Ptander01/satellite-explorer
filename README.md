# DCII Satellite Explorer

A high-performance geospatial application for visualizing and analyzing data center construction progress through satellite imagery. This tool provides a time-series view of site development, featuring infrastructure overlays and capacity tracking.

**Note:** This repository contains a sanitized version of the application. All proprietary data, internal company references, and actual satellite imagery have been removed and replaced with a synthetic dataset for demonstration purposes.

## Key Features

- **Time-Series Imagery Viewer:** Interactive map with a timeline slider to step through historical satellite snapshots of data center sites.
- **Infrastructure Overlays:** Toggleable vector overlays highlighting specific infrastructure components (buildings, grid power, onsite power, cooling, network).
- **Progress Tracking:** Sidebar tracking of site status, update cadence, and estimated MW capacity progress.
- **Change Detection:** (Simulated) Comparison tools to highlight differences between historical snapshots.
- **Light/Dark Mode:** Full theme support (defaults to Light mode) with tailored map basemaps.

## Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Mapping:** MapLibre GL JS
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Data:** JSON-based synthetic datasets and local imagery serving capabilities

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm
- Python 3.9+

### 1. Start the Backend API

Navigate to the backend directory, install dependencies, and start the FastAPI server:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

The API will be available at `http://localhost:8080`.

### 2. Start the Frontend

In a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server:

```bash
cd frontend
pnpm install
pnpm dev
```

The dashboard will be available at `http://localhost:5175`.

## Data Architecture

The application relies on synthetic data files located in the `data/` directory (served by the backend):

- `sites.json`: Core site metadata and snapshot history.
- `lookups.json`: Filter dropdown options and metadata.
- `imagery_bounds.json`: Bounding box coordinates for georeferencing imagery on the map.
- `overlays.json`: GeoJSON-compatible infrastructure overlay polygons.
- `imagery/`: Directory structure for local imagery files (simulated in this demo).

## Portfolio Context

This project demonstrates expertise in time-series geospatial visualization, handling complex bounding box calculations for raster imagery overlays, and building specialized interfaces for infrastructure intelligence and progress monitoring.
