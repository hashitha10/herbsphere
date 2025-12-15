# HerbSphere 3D Backend (HerbSphere API)

This folder contains the Node.js + Express backend for **HerbSphere 3D: An Interactive Virtual AYUSH Medicinal Plant Explorer**.
It exposes REST APIs for plants and quiz data, backed by MongoDB via Mongoose.

## Setup

1. From the project root, change into this folder:

   ```bash
   cd herbsphere-backend
   ```

2. Create a `.env` file with at least:

   ```bash
   MONGO_URI=mongodb://localhost:27017/herbsphere
   PORT=5000
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.js
   ```

   The API will run on `http://localhost:5000` by default.

## Available Endpoints

All routes are prefixed with `/api`:

- `GET /api/plants` – list all plants  
- `GET /api/plants/:id` – get a single plant by ID  
- `GET /api/plants/search?q=...` – search plants by name/system/description  
- `GET /api/plants/system/:system` – filter by AYUSH system  
- `GET /api/quiz` – list quiz questions (optionally filter with `?system=` or `?plantId=`)

The frontend (Vite dev server) is expected to run on `http://localhost:5173` and will communicate with this backend at `http://localhost:5000`.


