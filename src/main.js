const fs = require("fs");

const commandlineArgs = require("command-line-args");
const semver = require("semver");

const docker = require("./docker");
const npm = require("./npm");
const maintain = require("./maintain");

const options = commandlineArgs([
  { name: "mode", type: String, defaultOption: "minor" },
]);

(async () => {
  const pkg = JSON.parse(
    (await fs.promises.readFile("./package.json")).toString()
  );
  const { version } = pkg;
  const tagBase = "docker.pkg.github.com/online-exhibition/exhibition/";

  console.log(options);
  const publishVersion = semver.inc(version, options.mode || "minor");

  const uiDirectory = "../ui";

  const gatewayDirectory = "../gateway/production";
  const gatewayTag = `${tagBase}exhibit-gateway:${publishVersion}`;

  const serverDirectory = "../server";
  const serverTag = `${tagBase}exhibit-server:${publishVersion}`;

  //   await npm.install(uiDirectory);
  //   await npm.build(uiDirectory);

  //   await docker.build({
  //     workingDirectory: serverDirectory,
  //     dockerFile: "Dockerfile-production",
  //     tag: serverTag,
  //   });

  //   await docker.push({
  //     workingDirectory: serverDirectory,
  //     tag: serverTag,
  //   });

  //   await docker.build({
  //     workingDirectory: gatewayDirectory,
  //     dockerFile: "Dockerfile",
  //     tag: gatewayTag,
  //   });

  //   await docker.push({
  //     workingDirectory: gatewayDirectory,
  //     tag: gatewayTag,
  //   });

  await maintain.dockerCompose("./docker-compose.yml", {
    serverTag,
    gatewayTag,
  });

  await maintain.localCommit(
    ".",
    ["docker-compose.yml"],
    "Use new published version " + publishVersion
  );
  // await npm.version(".", publishVersion);
})();
