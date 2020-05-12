const path = require("path");
const { spawn } = require("child_process");

function npm(workingDirectory, ...args) {
  return new Promise((resolve, reject) => {
    console.log(["npm", ...args].join(" "));
    const childProcess = spawn("npm", args, {
      cwd: path.resolve(workingDirectory),
      stdio: [process.stdin, process.stdout, process.stderr],
    });

    childProcess.addListener("exit", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(
            'Process exited with code "' +
              code +
              '" and signal "' +
              signal +
              '".'
          )
        );
      } else {
        resolve();
      }
    });
  });
}

async function install(workingDirectory, ...args) {
  await npm(workingDirectory, "install", ...args);
}

async function start(workingDirectory, ...args) {
  await npm(workingDirectory, "start", ...args);
}

async function build(workingDirectory, ...args) {
  await npm(workingDirectory, "build", ...args);
}

async function run(workingDirectory, command, ...args) {
  await npm(workingDirectory, command, ...args);
}

async function version(workingDirectory, ...args) {
  await npm(workingDirectory, "version", ...args);
}

module.exports = {
  install,
  start,
  build,
  run,
  version,
};
