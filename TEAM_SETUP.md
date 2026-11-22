# 👥 LUNAR SENTRY AI — Team Collaboration & Onboarding Guide

Welcome to the **Lunar Sentry AI** engineering team! This guide contains the exact steps for each teammate to clone the repository, set up their independent development environments, run backend and frontend services, and follow our Git collaboration workflow.

---

## 1. Initial Repository Clone

Clone the shared GitHub repository to your local machine:

```powershell
git clone <GITHUB_REPOSITORY_URL>
cd se
```
*(Replace `<GITHUB_REPOSITORY_URL>` with our team's verified repository URL).*

Verify your local branches:
```powershell
git status
git branch -a
```

---

## 2. Environment Isolation & Safety (.env)

> [!CAUTION]
> **NEVER COMMIT YOUR `.env` FILE!**  
> Every teammate must maintain their own local `.env` file. The `.env` file is excluded in `.gitignore` to prevent leaking machine-specific paths, credentials, and API keys.

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Copy the template:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Inspect `.env` in your text editor. The defaults work out-of-the-box for local development:
   - `DATABASE_URL="sqlite:///./lunar_sentry.db"`
   - `CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"`
   - `PORT=8000`

---

## 3. Backend Setup & Independent Testing (Teammates 1 & 2)

Both teammates can independently configure, run, and test the backend without interfering with one another:

### 3.1 Python Virtual Environment
In your PowerShell terminal inside `backend/`:
```powershell
# Create an isolated virtual environment
python -m venv .venv

# Activate the virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1
```
*(If PowerShell blocks script execution, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`)*

### 3.2 Install Backend Dependencies
```powershell
pip install -r requirements.txt
```

### 3.3 Initialize Local Database
Create your local SQLite database tables:
```powershell
python init_db.py
```
Or using Alembic migrations:
```powershell
alembic upgrade head
```

### 3.4 Run Automated Backend Tests
Verify your local setup by running the test suite:
```powershell
python -m unittest discover tests
```
Expected output:
```
.......
----------------------------------------------------------------------
Ran 7 tests in 0.002s

OK
```

### 3.5 Start the FastAPI Service
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- **Health Check:** Open [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) — should return `{"status":"ok",...}`
- **Interactive Swagger Documentation:** Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to test all endpoints interactively.

---

## 4. Frontend Setup & Verification

Open a **separate PowerShell terminal**:

```powershell
cd lunar-sentry-ai
npm install
npm run build
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. All six mission control views should render cleanly.

---

## 5. Team Git Workflow & Branching Strategy

To prevent teammates from overwriting one another's code or encountering messy merge conflicts, follow this standardized workflow:

```
               ┌── feature/image-pipeline ───┐
develop ───────┼── feature/boulder-weights ──┼─────▶ develop (Integration)
               └── feature/telemetry-stream ─┘
```

### 5.1 Rules of the Road
1. **Never commit directly to `main`.** `main` is reserved for tagged stable releases.
2. **`develop` is our integration branch.** Always branch feature work from `develop`.
3. **One feature per branch.** Keep branches focused and short-lived.
4. **Pull before you push.** Always pull the latest `develop` before pushing your branch.

---

### 5.2 Step-by-Step Feature Workflow

#### Step 1: Switch to `develop` and update your local copy
```powershell
git checkout develop
git pull origin develop
```

#### Step 2: Create a descriptive feature branch
```powershell
# Examples: feature/yolo-inference, feature/rover-kinematics, fix/cors-headers
git checkout -b feature/<your-feature-name>
```

#### Step 3: Implement changes and test locally
Make your code changes, and verify before staging:
- Frontend: `npm run build` (must exit with 0 errors)
- Backend: `python -m unittest discover tests` (must pass)

#### Step 4: Check Git status and diff
```powershell
git status
git diff
```
Ensure **no secrets, `.env` files, or `__pycache__` directories** are being tracked!

#### Step 5: Stage and commit with a semantic commit message
```powershell
git add <specific-files>
git commit -m "feat(backend): add YOLOv9 inference pipeline runner"
```

#### Step 6: Sync with `develop` before pushing
```powershell
git fetch origin
git merge origin/develop
```
If there are any merge conflicts:
1. Open the conflicting files in VS Code.
2. Resolve conflicts carefully (choose incoming or current change).
3. Test again (`npm run build` / unit tests).
4. Stage resolved files: `git add <resolved-files>`
5. Commit merge: `git commit -m "chore: resolve merge conflicts with develop"`

#### Step 7: Push your feature branch and open a Pull Request
```powershell
git push -u origin feature/<your-feature-name>
```
Go to GitHub, open a **Pull Request** targeting `develop`, and request a review from your teammates. Once approved and checks pass, merge using **Squash and Merge** or **Rebase and Merge**.

---

## 6. How to Resolve Common Merge Conflicts

1. If GitHub reports `Cannot automatically merge`:
   ```powershell
   git checkout feature/<your-feature-name>
   git pull origin develop
   ```
2. VS Code highlights conflicts with:
   ```
   <<<<<<< HEAD (Current Change)
   your local code
   =======
   incoming code from develop
   >>>>>>> develop (Incoming Change)
   ```
3. Discuss with the teammate who authored the other change to ensure neither teammate's functionality is discarded.
4. Test thoroughly, commit, and push.

---

## 7. Role Distribution Reference

- **Teammate 1 (AI / Computer Vision):** Works on `backend/` model weight loading, YOLOv9-Lunar inference, and image preprocessing functions.
- **Teammate 2 (Backend / Database):** Works on `backend/` FastAPI endpoints, database persistence, Alembic migrations, and WebSocket telemetry stream.
- **Teammate 3 (Frontend / UI Integration):** Connects `lunar-sentry-ai/` fetch calls to the running backend endpoints and manages live UI state.
