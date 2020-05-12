const fs = require("fs");
const path = require("path");

const ejs = require("ejs");
const nodegit = require("nodegit");

const git = require("./git");

async function dockerCompose(outputFile, data) {
  await fs.promises.writeFile(
    outputFile,
    ejs.render(
      (await fs.promises.readFile("./docker-compose.template.yml")).toString(),
      data
    )
  );
}

async function localCommit(repositoryPath, files, message) {
  const author = nodegit.Signature.now(
    "Exhibition",
    "online-exhibition@dein-hosting.de"
  );
  const committer = author;
  const repo = await git.getRepository(repositoryPath);

  const index = await repo.refreshIndex();
  await Promise.all(
    files.map(async (file) => {
      await index.addByPath(file);
    })
  );
  const status = await repo.getStatus();
  await Promise.all(
    status
      .filter(
        (st) =>
          st.status().includes("WT_MODIFIED") ||
          st.status().includes("INDEX_NEW")
      )
      .map(async (st) => {
        console.log("Add to index", st.path());
        await index.addByPath(st.path());
      })
  );
  index.write();
  const oid = await index.writeTree();

  const headRef = await nodegit.Reference.nameToId(repo, "HEAD");
  const parentCommit = await repo.getCommit(headRef);

  const newStatus = await repo.getStatus();
  console.log(newStatus.map((st) => st.path() + " > " + st.status()));
  let commitId;
  if (newStatus.length > 0) {
    commitId = await repo.createCommit(
      "HEAD",
      author,
      committer,
      message,
      oid,
      [parentCommit]
    );
  } else {
    commitId = (await repo.getHeadCommit()).id();
  }
  console.log("Current commit ID", commitId);
}

module.exports = {
  dockerCompose,
  localCommit,
};
