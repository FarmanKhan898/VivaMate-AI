const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";

const applications = [
  {
    name: "Backend",
    directory: "backend",
    dependencies: ["express", "mongoose", "jsonwebtoken", "bcryptjs", "dotenv"],
    command: ["run", "dev"],
  },
  {
    name: "Frontend",
    directory: "client",
    dependencies: ["react", "react-dom", "react-router-dom", "vite", "gsap"],
    command: ["run", "dev", "--", "--host", "0.0.0.0", "--strictPort"],
  },
];

function runNpm(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(npmCommand, args, {
      cwd,
      stdio: "inherit",
      shell: isWindows,
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

function stopProcess(child) {
  if (!child.pid || child.exitCode !== null || child.killed) return;

  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
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

  for (const application of applications) {
    const child = spawn(npmCommand, application.command, {
      cwd: path.join(projectRoot, application.directory),
      stdio: "inherit",
      shell: isWindows,
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
}

main();
