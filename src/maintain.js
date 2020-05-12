const fs = require("fs");

const ejs = require("ejs");

async function dockerCompose(outputFile, data) {
  await fs.promises.writeFile(
    outputFile,
    ejs.render(
      (await fs.promises.readFile("./docker-compose.template.yml")).toString(),
      data
    )
  );
}

module.exports = {
  dockerCompose,
};
