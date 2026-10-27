# Local Emergency Resource Finder

**Institution:** Vellore Institute of Technology (VIT), Vellore  
**Course & Project Type:** Innovative Project (IIP)  
**Project Role:** Frontend / UI-UX Lead  

### Project Team Members
| Register No. | Name | Specialization / Project Domain |
|---|---|---|
| **24MIC0120** | NARENDIRAN | Full-Stack Integration & System Verification |
| **24MIC0146** | SIVASANKAR | Backend API Architecture & Routing |
| **24MID0003** | RISHI.H | Database Models, Indexing & Geocoding |
| **24MID0213** | RUPESHWAR | Frontend UI & Interactive Leaflet Maps |
| **24MID0280** | KRISHNAKUMAR | JWT Authentication & Security Governance |
| **24MID0344** | MARIAROOSO | Bilingual Localization (Tamil/English) & Accessibility |
| **24MID0349** | RAMAKRISHNAN | QA Testing, PWA Offline Resilience & Docs |

---

## 1. Project Overview & Architecture

**Local Emergency Resource Finder** is a location-aware web application developed to help citizens, students, and emergency first responders locate critical emergency resources nearest to their immediate coordinates or a searched landmark during high-stress situations.

### Core Emergency Categories (7 Tiers):
1. **Hospitals** – Trauma centers, intensive care units, emergency casualty wards.
2. **Ambulance Services** – 108 Emergency response, ALS/BLS life-support transport units.
3. **Police Stations** – Law enforcement desks, highway patrols, women's helplines.
4. **Fire Stations** – Fire suppression units, disaster rescue, vehicle extrication.
5. **Pharmacies** – 24/7 night chemists, emergency insulin and oxygen dispensers.
6. **Blood Banks** – Platelet apheresis, rare blood registries, component separation.
7. **Emergency Shelters** – Disaster relief halls, cyclone safe-havens, civic flood posts.

---

## 2. Technology Stack

### Frontend:
- **Framework:** React.js 18 with Vite
- **Styling & Design System:** Tailwind CSS (Emergency Navy `#0f172a`, Urgent Red `#dc2626`, Verified Green `#16a34a`)
- **Mapping & Geospatial UI:** React Leaflet & OpenStreetMap raster tiles
- **Routing:** React Router v6
- **Icons:** Lucide React
- **HTTP Client:** Axios with JWT request/response interceptors
- **State & Context:** React Context API (`LanguageContext`, `LocationContext`, `AuthContext`, `ConnectivityContext`)
- **Localization:** Native English (`en.json`) and Tamil (`ta.json`) dictionaries
- **Offline / PWA:** Service Worker (`sw.js`) and Web App Manifest (`manifest.json`)

### Backend:
- **Runtime:** Node.js (v24 / v18+)
- **Framework:** Express.js REST API
- **Security:** Helmet, CORS with configurable origins, Express Rate Limiting
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing
- **Geocoding:** OpenStreetMap Nominatim with in-memory caching and Vellore landmark dictionary fallback
- **Proximity Engine:** Haversine great-circle distance algorithm (`geoUtils.js`)

### Database:
- **Database:** MongoDB
- **ODM:** Mongoose 8 with schema validation, compound indexes, text indexes
- **Resilience:** Automatic In-Memory MongoDB fallback (`mongodb-memory-server`) allowing zero-config setup on machines without a standalone local MongoDB service running.

---

## 3. Project Directory Structure

```text
local-emergency-resource-finder/
├── client/                               # Frontend React + Vite Application
│   ├── public/
│   │   ├── manifest.json                 # PWA Web App Manifest
│   │   └── sw.js                         # Offline Service Worker cache
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmergencyCategoryCard.jsx # 7 Category cards with distinct icons & colors
│   │   │   ├── ErrorMessage.jsx          # Accessible alert banner with retry
│   │   │   ├── Footer.jsx                # Institutional credits, team list & emergency SOS
│   │   │   ├── LoadingSpinner.jsx        # WCAG-accessible loading spinner
│   │   │   ├── LocationSearch.jsx        # GPS detect + manual geocode + radius selector
│   │   │   ├── Navbar.jsx                # Top bar with EN/Tamil toggle & Admin portal
│   │   │   ├── OfflineBanner.jsx         # Connectivity indicator + instant emergency dialers
│   │   │   ├── ProtectedRoute.jsx        # Admin route gate
│   │   │   ├── ResourceCard.jsx          # Resource details, distance, Call Now & Navigate
│   │   │   ├── ResourceList.jsx          # Card grid, sort controls, empty states
│   │   │   └── ResourceMap.jsx           # React Leaflet map with custom SVG category pins
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Admin JWT authentication
│   │   │   ├── ConnectivityContext.jsx   # Offline detection & emergency dialers
│   │   │   ├── LanguageContext.jsx       # English & Tamil i18n
│   │   │   └── LocationContext.jsx       # Browser GPS + manual coordinates
│   │   ├── i18n/
│   │   │   ├── en.json                   # English dictionary
│   │   │   └── ta.json                   # Tamil dictionary
│   │   ├── pages/
│   │   │   ├── About.jsx                 # Objectives, problem statement & team credits
│   │   │   ├── AdminDashboard.jsx        # Metrics, category distributions, audit overview
│   │   │   ├── AdminFeedback.jsx         # User feedback & status updater
│   │   │   ├── AdminLogin.jsx            # Secure administrator login
│   │   │   ├── AdminResources.jsx        # Full CRUD resource table with modals
│   │   │   ├── Contact.jsx               # Validated contact & feedback form
│   │   │   ├── FindResources.jsx         # Resource discovery (split/list/map view)
│   │   │   ├── Home.jsx                  # Hero, GPS search, category grid, previews
│   │   │   ├── MapPage.jsx               # Full-screen interactive map
│   │   │   ├── NotFound.jsx              # 404 handler
│   │   │   └── ResourceDetails.jsx       # Complete resource specs & map pin
│   │   ├── services/
│   │   │   ├── adminService.js           # Admin REST client
│   │   │   ├── api.js                    # Base Axios instance with auth interceptor
│   │   │   └── resourceService.js        # Public REST client
│   │   ├── App.jsx                       # Routes & layout shell
│   │   ├── index.css                     # Tailwind directives & Leaflet styling
│   │   └── main.jsx                      # App root & context wrappers
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                               # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js               # Mongoose direct + in-memory auto-fallback
│   │   ├── controllers/
│   │   │   ├── adminController.js        # Dashboard stats, resource CRUD
│   │   │   ├── authController.js         # JWT login, verification & logout
│   │   │   ├── feedbackController.js     # Public submission & admin status update
│   │   │   └── resourceController.js     # Search, nearby, categories, geocoding
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # Bearer JWT verification
│   │   │   ├── errorMiddleware.js        # Centralized error handler & 404
│   │   │   └── validationMiddleware.js   # Resource and feedback input validation
│   │   ├── models/
│   │   │   ├── Admin.js                  # Admin schema with bcrypt hash
│   │   │   ├── EmergencyResource.js      # 7-category emergency resource schema
│   │   │   └── Feedback.js               # Citizen feedback & audit status schema
│   │   ├── routes/
│   │   │   ├── adminRoutes.js            # Protected /api/admin/* endpoints
│   │   │   ├── authRoutes.js             # /api/auth/* endpoints
│   │   │   ├── feedbackRoutes.js         # /api/feedback endpoint
│   │   │   └── resourceRoutes.js         # Public /api/resources/* endpoints
│   │   ├── scripts/
│   │   │   ├── createAdmin.js            # CLI script to bootstrap demo admin
│   │   │   └── seedResources.js          # Demonstration seed data for Vellore/Katpadi
│   │   ├── services/
│   │   │   ├── geocodingService.js       # Nominatim OpenStreetMap geocoder + cache
│   │   │   └── resourceDiscoveryService.js # Haversine proximity & radius filtering
│   │   ├── utils/
│   │   │   └── geoUtils.js               # Haversine distance formula implementation
│   │   ├── app.js                        # Express app setup, helmet, cors, rate-limits
│   │   └── server.js                     # HTTP server startup & database connect
│   ├── tests/
│   │   └── api.test.js                   # Node test runner suite (11 unit/integration tests)
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                          # Root convenience runner scripts
└── README.md
```

---

## 4. Getting Started (Windows & VS Code)

### Prerequisites:
- **Node.js**: v18.0.0 or later (v24 recommended).
- **npm**: v9.0.0 or later.
- Optional: MongoDB installed locally on port `27017` or a MongoDB Atlas URI. *(Note: If MongoDB is not installed locally, the server automatically starts an in-memory database engine for evaluation).*

### Step 1: Open the Project in VS Code
Open the project directory in Visual Studio Code:
```powershell
cd "C:\Users\Admin\.gemini\antigravity\scratch\local-emergency-resource-finder"
code .
```

### Step 2: Configure Environment Variables

**Backend (`server/.env`):**
Create `server/.env` (a ready template is provided in `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/emergency_resource_finder
JWT_SECRET=super_secret_jwt_key_vit_iip_emergency_2026_change_in_prod
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend (`client/.env`):**
Create `client/.env` (a ready template is provided in `client/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. Running the Application

Open two terminal tabs in VS Code (PowerShell or Command Prompt):

### Terminal 1: Backend Server
```powershell
cd server
npm install
npm run dev
```
*The backend starts at `http://localhost:5000`.*  
*If no admin exists, it automatically initializes the demo administrator. If the database is empty, it automatically seeds 20 realistic demonstration emergency services for Vellore/Katpadi.*

### Terminal 2: Frontend Client
```powershell
cd client
npm install
npm run dev
```
*The React frontend will be accessible at `http://localhost:5173`.*

---

## 6. Demonstration Seed Data & Admin Setup

### Seed Demonstration Emergency Resources
To populate or reset the 20 demonstration resources across all 7 categories:
```powershell
cd server
npm run seed
```

### Create / Update Demo Administrator
To create or update the evaluation administrator:
```powershell
cd server
npm run create-admin
```

**Evaluation Admin Credentials:**
- **Email:** `admin@vit.ac.in`
- **Password:** `Admin@Emergency2026`
*(A convenient "Auto-Fill" button is also provided on the `/admin/login` page for quick testing).*

---

## 7. REST API Documentation

### Public Endpoints:
| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service health status & VIT project metadata | None |
| `GET` | `/api/resources` | Query resources with filtering & pagination | `category`, `q`, `latitude`, `longitude`, `radius`, `sort`, `page`, `limit` |
| `GET` | `/api/resources/nearby` | Proximity search sorted by distance | `latitude` (req), `longitude` (req), `radius`, `category`, `q`, `limit` |
| `GET` | `/api/resources/:id` | Retrieve single resource by MongoDB ID | None |
| `GET` | `/api/resources/categories` | Retrieve all 7 categories with counts | None |
| `GET` | `/api/resources/geocode` | Geocode landmark/city via Nominatim | `q` (e.g. `katpadi`) |
| `POST` | `/api/feedback` | Submit citizen contact / resource correction | JSON body: `{ name, email, subject, message }` |

### Administrative Endpoints (Requires `Authorization: Bearer <token>`):
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin, returns JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated admin profile |
| `POST` | `/api/auth/logout` | Invalidate administrative session |
| `GET` | `/api/admin/stats` | Dashboard KPIs (counts, categories, feedback) |
| `GET` | `/api/admin/resources` | Resource table view with filters & pagination |
| `POST` | `/api/admin/resources` | Create new emergency resource (validated) |
| `PUT` | `/api/admin/resources/:id` | Update resource information / verification |
| `DELETE` | `/api/admin/resources/:id` | Delete emergency resource record |
| `GET` | `/api/admin/feedback` | List all citizen feedback submissions |
| `PATCH` | `/api/admin/feedback/:id` | Update feedback status (`new`, `reviewed`, `resolved`) |

---

## 8. Verification & Test Execution Results

### Backend Automated Test Suite
Run the 11 integrated test cases:
```powershell
cd server
npm test
```

**Actual Test Output:**
```text
▶ Local Emergency Resource Finder - Backend API Test Suite
  ✔ GET /api/health should return ok status and VIT project information (22ms)
  ✔ Haversine distance calculation should accurately measure distance in km (1ms)
  ✔ GET /api/resources/categories should return all 7 emergency categories with counts (23ms)
  ✔ GET /api/resources should return seeded records and support category filter (55ms)
  ✔ GET /api/resources/nearby should calculate proximity and sort by distance (24ms)
  ✔ GET /api/resources/nearby without coordinates should return 400 error (15ms)
  ✔ GET /api/resources/:id should return resource details and 404 for invalid ID (42ms)
  ✔ POST /api/feedback should validate input and accept valid submission (38ms)
  ✔ POST /api/auth/login should reject bad credentials and accept valid credentials (568ms)
  ✔ GET /api/admin/stats should reject unauthorized request and allow with token (86ms)
  ✔ Admin should be able to create, update, and delete an emergency resource (108ms)
✔ Local Emergency Resource Finder - Backend API Test Suite
ℹ tests 11
ℹ pass 11
ℹ fail 0
```

### Frontend Production Build
```powershell
cd client
npm run build
```
**Actual Build Output:**
```text
vite v6.4.5 building for production...
✓ 1717 modules transformed.
dist/index.html                   1.40 kB │ gzip:   0.72 kB
dist/assets/index-DuoAc6OB.css   36.13 kB │ gzip:   6.69 kB
dist/assets/index-f-rUeb05.js   538.30 kB │ gzip: 157.74 kB
✓ built in 19.76s
```

---

## 9. Key Features & Implementation Highlights

1. **Golden-Hour Response Design:** Emergency navy blue aesthetic with urgent red callout buttons, instant one-touch `tel:` dialer, and Google Maps directions link for every mapped resource.
2. **Accurate Distance Calculations:** Implemented using spherical trigonometry (Haversine formula). Displays distance (e.g., `2.4 km away`) directly on the resource card and popup.
3. **True Bilingual Localization:** Switch dynamically between English and native Tamil without page reloads. Selected language is retained across navigation sessions via `localStorage`.
4. **Resilient Offline Architecture:** If connectivity drops, a top warning banner appears instantly providing persistent offline emergency numbers (112, 108, 100, 101, 1077, VIT Health Centre) and displays previously cached emergency listings.
5. **No Fake Data or Badges:** Records are explicitly labeled with verification statuses (`Verified`, `Pending`, or `Demo / Unverified`).
6. **Zero-Lockout Database Setup:** Supports live MongoDB connections and includes an automated in-memory fallback so faculty, mentors, and teammates can run the project immediately on any workstation without manual database provisioning.

---

## 10. License & Academic Attribution
Developed as an **Innovative Project (IIP)** by students of **Vellore Institute of Technology (VIT), Vellore**.  
OpenStreetMap data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
