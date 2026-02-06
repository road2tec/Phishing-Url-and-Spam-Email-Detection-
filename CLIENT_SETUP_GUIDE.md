# Client Setup Guide (Windows Laptop)

This guide will help you set up the **Phishing Detector** project on a Windows laptop.

## 1. Install Prerequisites

### Python 3.11
The project is optimized for **Python 3.11**.
1. Download Python 3.11 from the official website: [Python 3.11.0 Downloads](https://www.python.org/downloads/release/python-3110/)
2. Run the installer.
3. **IMPORTANT**: Check the box that says **"Add Python to PATH"** before clicking "Install Now".

### Visual Studio Code (Optional but Recommended)
A code editor makes it easier to manage the project.
- Download here: [VS Code](https://code.visualstudio.com/)

---

## 2. Project Setup

Open the project folder (`phishing-detector-main`) in your terminal or VS Code.

### Step 2.1: Open Terminal
- **Method A (File Explorer)**: Go to the project folder, type `cmd` in the address bar at the top, and press Enter.
- **Method B (VS Code)**: Open the folder in VS Code, then go to `Terminal > New Terminal`.

### Step 2.2: Create a Virtual Environment
A virtual environment keeps the project dependencies isolated. Run the following command:

```powershell
python -m venv venv
```

### Step 2.3: Activate the Environment
You need to activate the environment every time you work on the project.

**Command Prompt (cmd):**
```cmd
venv\Scripts\activate
```

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```
*Note: If you see a permission error in PowerShell, run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` and try again.*

You will know it's active when you see `(venv)` at the start of your command line.

---

## 3. Install Requirements

This is the step to "read" or install the `requirements.txt` file.

Make sure your virtual environment is active (see Step 2.3), then run:

```bash
pip install -r requirements.txt
```

*If you get an error, try upgrading pip first:*
```bash
python.exe -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## 4. Run the Application

How to run the backend and frontend components.

### Start the API (Backend)
```bash
uvicorn src.api_fastapi:app --reload
```
The API will run at: `http://127.0.0.1:8000`

### Start the Interface (Streamlit)
Open a **new** terminal window (keep the API running in the first one), activate the environment again, and run:
```bash
streamlit run app.py
```
*(Note: Replace `app.py` with the actual entry point file name if it's different, e.g., `frontend/main.py`)*

---

## Troubleshooting

- **"python is not recognized"**: You didn't check "Add to PATH" during installation. Reinstall Python or fix your PATH variables.
- **"pip is not recognized"**: Same as above, or your environment isn't activated.
- **Microsoft C++ Build Tools error**: Some libraries (like numpy/pandas) need C++ compilers. Download "Desktop development with C++" from the [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
