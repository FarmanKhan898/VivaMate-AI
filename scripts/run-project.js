const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const npmCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
const appUrl = "http://localhost:5173/";
const shouldOpenBrowser = !process.argv.includes("--no-open");
const childEnv = { ...process.env };
const pathKey = Object.keys(childEnv).find((key) => key.toLowerCase() === "path") || "PATH";
childEnv[pathKey] = `${path.dirname(process.execPath)}${path.delimiter}${childEnv[pathKey] || ""}`;

function spawnNpm(args, options) {
  if (isWindows && existsSync(npmCli)) {
    return spawn(process.execPath, [npmCli, ...args], options);
  }

  return spawn("npm", args, options);
}

const applications = [
  {
    name: "Backend",
    directory: "backend",
    dependencies: ["express", "mongoose", "jsonwebtoken", "bcryptjs", "dotenv"],
    command: ["run", "dev"],
    url: "http://127.0.0.1:5000/api/health",
    async isReady(response) {
      if (!response.ok) return false;
      const body = await response.json();
      return body.ok === true;
    },
  },
  {
    name: "Frontend",
    directory: "client",
    dependencies: ["react", "react-dom", "react-router-dom", "vite", "gsap"],
    command: ["run", "dev", "--", "--host", "0.0.0.0", "--strictPort"],
    url: appUrl,
    async isReady(response) {
      if (!response.ok) return false;
      return (await response.text()).includes("<title>VivaMate AI</title>");
    },
  },
];

function runNpm(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawnNpm(args, {
      cwd,
      stdio: "inherit",
      shell: false,
      env: childEnv,
      windowsHide: true,
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`npm ${args.join(" ")} failed${signal ? ` (${signal})` : ` with code ${code}`}.`));
    });
  });
}

async function installMissingDependencies(application) {
  const appDirectory = path.join(projectRoot, application.directory);
  const missing = application.dependencies.some((dependency) =>
    !existsSync(path.join(appDirectory, "node_modules", dependency, "package.json"))
  );

  if (!missing) return;

  console.log(`Installing ${application.name.toLowerCase()} dependencies...`);
  await runNpm(["install"], appDirectory);
}

async function isAlreadyRunning(application) {
  try {
    const response = await fetch(application.url, { signal: AbortSignal.timeout(1500) });
    return await application.isReady(response);
  } catch {
    return false;
  }
}

function openAppInBrowser() {
  let opener;
  let args;

  if (isWindows) {
    const commandPrompt = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "cmd.exe");
    opener = commandPrompt;
    args = ["/d", "/c", `start "" "${appUrl}"`];
  } else if (process.platform === "darwin") {
    opener = "open";
    args = [appUrl];
  } else {
    opener = "xdg-open";
    args = [appUrl];
  }

  const browser = spawn(opener, args, { detached: true, stdio: "ignore", windowsHide: true });
  browser.on("error", (error) => {
    console.log(`The app is ready at ${appUrl}. Open it in your browser (${error.message}).`);
  });
  browser.unref();
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForService(application, isStopping) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (isStopping()) return false;
    if (await isAlreadyRunning(application)) return true;
    await wait(500);
  }

  return false;
}

function stopProcess(child) {
  if (!child.pid || child.exitCode !== null || child.killed) return;

  if (isWindows) {
    const taskkill = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "taskkill.exe");
    const killer = spawn(taskkill, ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    killer.on("error", (error) => console.error(`Could not stop child processes: ${error.message}`));
    return;
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
}

async function main() {
  try {
    for (const application of applications) {
      await installMissingDependencies(application);
    }
  } catch (error) {
    console.error(`VivaMate could not prepare dependencies: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  console.log("Starting the VivaMate API and web app. Stop both with Ctrl+C.");
  console.log("Web app: http://localhost:5173/  |  API: http://localhost:5000/api/health");

  const runningServices = await Promise.all(applications.map(isAlreadyRunning));
  applications.forEach((application, index) => {
    if (runningServices[index]) {
      console.log(`${application.name} is already running; reusing it.`);
    }
  });

  const servicesToStart = applications.filter((_, index) => !runningServices[index]);
  if (servicesToStart.length === 0) {
    console.log("VivaMate is already running.");
    if (shouldOpenBrowser) openAppInBrowser();
    return;
  }

  const children = [];
  let stopping = false;

  const stopAll = (exitCode = 0) => {
    if (stopping) return;
    stopping = true;
    process.exitCode = exitCode;
    children.forEach(stopProcess);
  };

  process.once("SIGINT", () => stopAll(0));
  process.once("SIGTERM", () => stopAll(0));

  for (const application of servicesToStart) {
    const child = spawnNpm(application.command, {
      cwd: path.join(projectRoot, application.directory),
      stdio: "inherit",
      shell: false,
      env: childEnv,
      windowsHide: true,
      detached: !isWindows,
    });

    children.push(child);
    child.once("error", (error) => {
      console.error(`${application.name} failed to start: ${error.message}`);
      stopAll(1);
    });
    child.once("exit", (code, signal) => {
      if (stopping) return;
      console.error(`${application.name} stopped${signal ? ` (${signal})` : ` with code ${code}`}. Stopping the other service.`);
      stopAll(code || 1);
    });
  }

  const ready = await Promise.all(applications.map((application, index) =>
    runningServices[index] ? true : waitForService(application, () => stopping)
  ));

  if (stopping) return;
  if (!ready.every(Boolean)) {
    console.error("VivaMate did not become ready in time. Check the service output above.");
    stopAll(1);
    return;
  }

  console.log("Backend and frontend are ready.");
  if (shouldOpenBrowser) openAppInBrowser();
}

main();
