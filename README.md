# Nexora

Nexora is a beginner-friendly personal productivity dashboard built with Python and Flask. It includes a live local clock, a browser-saved task list, a focus-session counter, and motivational quotes served by a small Flask API.

## Features

- Live local clock and date
- Add, complete, and delete tasks
- Tasks persist in your browser with `localStorage`
- Focus-session counter that also persists after refreshes
- Random motivational quotes from `/api/quote`
- Responsive dark interface for desktop, tablet, and mobile

## Project structure

```
focushub/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── static/
│   ├── style.css
│   └── script.js
└── templates/
    └── index.html
```

## Run locally

1. Open a terminal in the `focushub` folder:

   ```bash
   cd focushub
   ```

2. Create and activate a virtual environment (recommended):

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   On Windows PowerShell, activate it with:

   ```powershell
   .venv\Scripts\Activate.ps1
   ```

3. Install the dependency:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the application:

   ```bash
   python app.py
   ```

5. Open <http://127.0.0.1:5000> in your browser.

To stop the server, press `Ctrl+C` in the terminal.

## Notes

The task list and focus-session total are stored in the browser that you use to open Nexora. Clearing that browser's site data will reset them. Quotes are randomly selected by Flask from the list in `app.py`.
