import { log } from "console";
import fs from "node:fs";
import path from "node:path";
import { Plugin } from "vite";

const Plugin = (src: string, dest: string): Plugin => {
  return {
    name: "vite-clone-dist",
    apply: "build",
    closeBundle: () => {
      log("------------------");
      log(`👉 Cloned ${src} directory to ${dest} directory`);

      const copyDir = (src: string, dest: string) => {
        try {
          fs.mkdirSync(dest, { recursive: true });
          const files = fs.readdirSync(src, { withFileTypes: true });
          for (const file of files) {
            const srcPath = path.join(src, file.name);
            const destPath = path.join(dest, file.name);
            if (file.isDirectory()) {
              copyDir(srcPath, destPath);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      copyDir(src, dest);

      log(`👉 done cloned ${src} directory to ${dest} directory`);
      log("------------------");
    },
  };
};

export default Plugin;
