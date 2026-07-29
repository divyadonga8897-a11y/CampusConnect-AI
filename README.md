# CampusConnect AI — Sri Satya Institute of Engineering and Technology

CampusConnect AI is a premium, full-stack college discovery and content management platform built using **Next.js**, **FastAPI**, and **PostgreSQL** (with SQLite fallback support). It helps external students, parents, and visitors explore academics, facilities, fees, placements, and submit admissions enquiries, while letting authorized college admins manage all content dynamically.

---

## Tech Stack
*   **Frontend**: Next.js (App Router, Framer Motion animations, TailwindCSS configuration, React Hook Form, Zod).
*   **Backend**: FastAPI (Python 3.10+, JWT Bearer Authentication, custom rate limiting, Swagger OpenAPI docs).
*   **Database**: PostgreSQL (Production) / SQLite (Local development).
*   **Orchestration**: Docker & Docker Compose.

---

## Features Matrix
1.  **College Profile**: Mission, Vision, Leadership biographies, and achievements galleries.
2.  **Academics**: Engineering departments, courses catalogs, eligibility parameters, and intake capacities.
3.  **Admissions & Fees**: Step-by-step procedures checklists, counseling calendar timelines, quota fee structures, and scholarships.
4.  **Campus Experiential Tour**: Infrastructure highlights, library inventory metrics, sports areas, laboratories, hostels, and student clubs.
5.  **Placement Registry**: Placements percentage statistics, recruiting companies showcases, and alumni networks directory.
6.  **Interactive Enquiry**: Real-time validated enquiry forms and searchable FAQs explorer.
7.  **Admin CMS Panel**: Role-based access control (ADMIN/CONTENT_MANAGER), activity audit logs, and forms to perform full CRUD on college data.

---

## Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   Docker & Docker Compose (Optional)

### Development Setup (Local)
1.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # macOS/Linux
    source .venv/bin/activate
    
    pip install -r requirements.txt
    ```
2.  **Seed & Run Backend**:
    ```bash
    # Run the database seeder and table creation
    python -c "from backend.app.database.connection import SessionLocal; from backend.app.database.init_db import init_db; db = SessionLocal(); init_db(db); db.close()"
    
    # Run dev server
    uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
    ```
    *   API docs will be available at: `http://localhost:8000/docs`
    *   Health status is checked at: `http://localhost:8000/health`

3.  **Frontend Setup**:
    ```bash
    npm install
    npm run dev
    ```
    *   Web application will be accessible at: `http://localhost:3000`

---

## Seed Admin Credentials
*   **Admin Profile**:
    *   Email: `admin@ssiet.ac.in`
    *   Password: `admin_password_123`
    *   Role: `ADMIN`
*   **Content Manager Profile**:
    *   Email: `manager@ssiet.ac.in`
    *   Password: `manager_password_123`
    *   Role: `CONTENT_MANAGER`

---

## Deployment Configuration (Docker)
To spin up the entire production stack (Frontend, Backend, and PostgreSQL database) with bridge networking and health checking:
```bash
docker-compose up --build
```
This binds:
*   Frontend: `http://localhost:3000`
*   Backend: `http://localhost:8000`
*   PostgreSQL: `localhost:5432`
