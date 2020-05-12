const fs = require("fs");
const path = require("path");

const Git = require("nodegit");

async function getRepository(repositoryPath) {
  const basePath = path.resolve(repositoryPath);
  return await Git.Repository.open(basePath);
}

function getLog(commit, count = 10) {
  return new Promise((resolve, reject) => {
    const result = [];
    const eventEmitter = commit.history();

    eventEmitter.on("commit", function (commit) {
      if (count > 0 && result.length >= count) {
        return;
      }
      const signature = commit.author();
      result.push({
        id: commit.sha(),
        author: signature.name(),
        email: signature.email(),
        date: commit.date().toISOString(),
        message: commit.message(),
      });
    });

    eventEmitter.on("end", function (commits) {
      resolve(result);
    });

    eventEmitter.on("error", function (error) {
      reject(error);
    });

    eventEmitter.start();
  });
}

module.exports = {
  getRepository,
  getLog,
};
