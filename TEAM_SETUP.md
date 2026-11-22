# 👥 LUNAR SENTRY AI — Team Collaboration & Onboarding Guide (4-Member Team)

Welcome to the **Lunar Sentry AI** engineering team! This guide establishes the team workflow, repository access controls, environment setup, and Git protocols for our 4-member team.

---

## 1. Team Roles & Responsibilities

Our team operates with 4 dedicated roles to allow parallel development without overlapping changes:

| Role | Member Focus | Primary Work Directory | Key Responsibilities |
|---|---|---|---|
| **Member 1: AI / Computer Vision** | Model & Inference | `backend/weights/`, `backend/app/` | YOLOv9-Lunar model inference, weight integration, GSD image calibration, and detection evaluation. |
| **Member 2: Backend Engineer** | API & Persistence | `backend/app/`, `backend/alembic/` | FastAPI endpoints, SQLite / SQLAlchemy persistence, Alembic migrations, and WebSocket telemetry stream. |
| **Member 3: Frontend Engineer** | User Interface | `lunar-sentry-ai/src/` | React 18 SPA dashboards, interactive controls, live telemetry display, and API fetch integration. |
| **Member 4: Integration & QA Lead** | Coordination & DevOps | Root, `backend/tests/`, Docs | Central Git repository management, PR reviews, automated test suites, documentation, and release readiness. |

---

## 2. GitHub Access & Repository Permissions

To allow all 4 members to work on the central GitHub repository:

### 2.1 Granting Collaborator Access (Repo Owner Action)
1. Go to the repository on GitHub: [https://github.com/harsha2345678/lunar](https://github.com/harsha2345678/lunar)
2. Click **Settings** (top navigation tab).
3. In the left sidebar, click **Collaborators** under *Access*.
4. Click the green **Add people** button.
5. Enter each member's GitHub username or email address and click **Add <user> to this repository**.
6. Each member will receive an invitation email and must click **Accept Invitation** (or accept at `https://github.com/harsha2345678/lunar/invitations`).

### 2.2 Member Authentication (PAT or SSH)
GitHub no longer accepts account passwords for Git operations. Members must authenticate using either:
- **Personal Access Token (PAT):**
  1. On GitHub: `Settings > Developer settings > Personal access tokens > Tokens (classic)`.
  2. Generate new token with `repo` scope selected.
  3. When Git prompts for a password during `git push`, paste the token.
- **SSH Key (Recommended):**
  1. Run `ssh-keygen -t ed25519 -C "your_email@example.com"`.
  2. Add the public key (`~/.ssh/id_ed25519.pub`) to `GitHub > Settings > SSH and GPG keys`.
  3. Clone using SSH: `git clone git@github.com:harsha2345678/lunar.git`.

---

## 3. Initial Repository Clone

Every member clones the central repository to their local machine:

```powershell
git clone https://github.com/harsha2345678/lunar.git
cd lunar
git checkout develop
```

Verify local branches:
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

- **Member 1 (AI / Computer Vision Engineer):** Works on `backend/weights/`, model loading, YOLOv9-Lunar inference, and image preprocessing functions.
- **Member 2 (Backend / Database Engineer):** Works on `backend/` FastAPI endpoints, database persistence, Alembic migrations, and WebSocket telemetry stream.
- **Member 3 (Frontend / UI Engineer):** Connects `lunar-sentry-ai/` fetch calls to the running backend endpoints and manages live UI state.
- **Member 4 (Integration / QA Lead):** Manages repository branching, merge conflict resolution, test pipelines, and deployment release verification.
