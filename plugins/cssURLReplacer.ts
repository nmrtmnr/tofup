import { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import * as glob from "glob";

const Plugin = (): Plugin => {
  return {
    name: "vite-css-url-replacer",
    apply: "build",
    closeBundle: () => {
      console.log("CSS REPLACE START >>>");

      const files = glob.sync(path.resolve("./dist/**/*.css"), {
        nodir: true,
      });

      console.log("cssFiles: ", files);

      for (const file of files) {
        const code = fs.readFileSync(file, "utf-8");
        const resultCode = code.replaceAll('url("./images/', 'url("../images/');
        fs.writeFileSync(file, resultCode, "utf-8");
      }

      console.log(">>> CSS REPLACE END");
    },
  };
};

export default Plugin;
