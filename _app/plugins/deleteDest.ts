import { log } from "console";
import fs from "node:fs";
import { Plugin } from "vite";

const Plugin = (dest: string): Plugin => {
  return {
    name: "vite-clear-dest",
    apply: "build",
    options: () => {
      log("------------------");
      log(`👉 Cleard ${dest} directory`);

      fs.rmSync(dest, { force: true, recursive: true });

      log(`👉 Done cleard ${dest} directory`);
      log("------------------");
    },
  };
};

export default Plugin;
