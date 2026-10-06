# VivaMate-AI

## Run the project with one click

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
