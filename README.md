# VivaMate-AI

## Run the project with one click

The launcher starts both the backend and frontend, then opens the site. If Node.js/npm are missing, it downloads an official portable Node.js LTS runtime for the current operating system. The first run needs an internet connection to download Node.js and install locked project dependencies. Later runs reuse the runtime and installed dependencies.

### Windows
Double-click `run-project.bat` in the project root.

### macOS / Linux
Run:

```bash
chmod +x run-project.sh
./run-project.sh
```

### Terminal version

Install dependencies once in each app folder, then start both services:

```bash
npm --prefix backend install
npm --prefix client install
```

In separate terminals run `npm --prefix backend run dev` and `npm --prefix client run dev -- --host 0.0.0.0`.

The app will run in the `client` folder and is available at:

- http://localhost:5173/
