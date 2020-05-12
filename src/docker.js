const { spawn } = require("child_process");

function docker(workingDirectory, ...args) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn("docker", args, {
      cwd: workingDirectory,
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

async function build(options = {}) {
  const { workingDirectory, dockerFile, tag } = options;
  await docker(
    workingDirectory,
    "build",
    "--rm",
    "-f",
    dockerFile || "Dockerfile",
    "-t",
    tag,
    "."
  );
}

async function push(options = {}) {
  const { workingDirectory, tag } = options;
  await docker(workingDirectory, "push", tag);
}

module.exports = {
  build,
  push,
};
