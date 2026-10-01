const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const npmCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
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
}

main();
