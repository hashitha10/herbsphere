# HerbSphere 3D: An Interactive Virtual AYUSH Medicinal Plant Explorer

HerbSphere 3D is a virtual herbal garden that showcases AYUSH medicinal plants with rich profiles, audio guides, and optional 3D viewing.  
The project consists of a **React + Vite + Tailwind** frontend and a **Node.js + Express + MongoDB** backend.

## Running the Project

### Backend (HerbSphere API)
1. `cd herbsphere-backend`
2. Create a `.env` file with:

   ```bash
   MONGO_URI=mongodb://localhost:27017/herbsphere
   PORT=5000
   ```

3. Install dependencies and start the server:

   ```bash
   npm install
   node server.js
   ```

The backend exposes:

- `GET /api/plants` – list all plants  
- `GET /api/plants/:id` – get a single plant  
- `GET /api/plants/search?q=...` – basic search  
- `GET /api/quiz` – quiz questions (optional, seed as needed)

### Frontend (HerbSphere 3D UI)
1. From the project root (`client`), install dependencies:

   ```bash
   npm install
   ```

2. Start Vite dev server:

   ```bash
   npm run dev
   ```

The UI will be available at `http://localhost:5173` and will connect to the backend at `http://localhost:5000` (as configured in `src/services/plantService.js`).

## Notes

- 3D views use `@google/model-viewer` and load models when a `model` path is available, falling back to plant images otherwise.
- Audio guides play via a simple play/pause UI; plants without audio show a clear “Audio not available” state while still displaying text content.
