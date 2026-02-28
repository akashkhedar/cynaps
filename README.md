# 🚀 Mistral Hackathon: Quick Start Guide

Welcome to the **Cynaps Active Data Engine** codebase! 

This repository contains the full enterprise annotation platform (Django Backend + React Frontend). To start hacking on our Multi-Agent + Active Learning pipeline, follow these quick steps:

## Prerequisites
1. **Python 3.10+** installed
2. **Node.js 18+** & **Yarn** installed (`npm install -g yarn`)
3. **Docker** installed and running
4. A HuggingFace account & Mistral API Key

---

## 🛠️ 1. Start the Platform (Windows)

We have a built-in script that handles Docker containers (PostgreSQL, Redis, MinIO), installs Python packages, runs DB migrations, and starts the Django backend.

1. Open a terminal in the root folder (`cynaps/`) and run:
   ```bat
   setup_dev_environment.bat
   ```
2. The Backend will now be running at `http://localhost:8080`.

*(Mac/Linux users: You can replicate the [.bat](file:///f:/cynaps-develop/setup_dev_environment.bat) file by running `docker-compose -f docker-compose.dev.yml up -d`, then creating a Python `.venv`, installing dependencies in [pyproject.toml](file:///f:/cynaps-develop/pyproject.toml), copying [.env](file:///f:/cynaps-develop/.env), and running `python cynaps/manage.py migrate` and `python cynaps/manage.py runserver`).*

---

## 💻 2. Start the Frontend

The frontend is a complex React Nx Monorepo. You need to run it in a separate terminal.

1. Open a **new terminal** and navigate to the `web` folder:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   yarn install --frozen-lockfile
   ```
3. Start the main Cynaps frontend watcher (this auto-rebuilds when you change React code):
   ```bash
   yarn ls:watch
   ```

**🎉 You are now officially running the platform!** 
Open `http://localhost:8080` in your browser to see the Cynaps UI. Data you modify in the React frontend will immediately reflect on the page.

---

## 🎯 Where to Write Your Hackathon Code

### For the Multi-Agent Pre-Labeler & API Wrapper:
You can create a new folder `scripts/hackathon/` in the root directory. 
Write your `mistral_agents.py` here. The Django backend will eventually import and trigger this script when a user uploads file data in the UI.

### For the Fine-Tuning `unsloth_train.py` Script:
Create this in `scripts/hackathon/unsloth_train.py`. The backend will trigger this script via a python Subprocess when we hit the Ground Truth threshold. 
It should accept a path to a `.jsonl` file as an argument:
```python
# Example execution the backend will perform:
python scripts/hackathon/unsloth_train.py --data_path /tmp/cynaps_export.jsonl
```

### For UI Indicators (React):
If you want to add a "Model Training in Progress" badge, look inside:
`web/apps/cynaps/src/pages/Projects/` or `web/apps/cynaps/src/components/`.

Happy Hacking! Let's win this. 🏆
