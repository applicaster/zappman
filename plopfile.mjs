import fs from "fs";
import ts from "typescript";

const directoryPath = "./src/request-types";
const files = fs.readdirSync(directoryPath);

let folders = [];

for (let i = 0; i < files.length; i++) {
  // get the path of the file
  const filePath = `${directoryPath}/${files[i]}`;
  // check if the file is a directory
  if (fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(`${filePath}/index.ts`)) {
      // if the file exists, add the directory name to the array
      const node = ts.createSourceFile(
        "temp.ts", // fileName
        fs.readFileSync(`${filePath}/index.ts`, "utf8"), // sourceText
        ts.ScriptTarget.Latest // langugeVersion
      );

      folders.push({ name: files[i] });
    }
  }
}

export default function (plop) {
  plop.setHelper("pascalCase", (txt) =>
    txt
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return word.toUpperCase();
      })
      .replace(/\s+/g, "")
      .replace(/-/g, "")
  );

  plop.setGenerator("request", {
    description: "create a new request",
    prompts: [],
    actions: [
      {
        type: "add",
        path: "tools/auto-generated-requests/requests.ts",
        templateFile: "tools/plop-templates/requests.ts.hbs",
        force: true,
        data: {
          requests: folders,
        },
      },
    ],
  });
}
