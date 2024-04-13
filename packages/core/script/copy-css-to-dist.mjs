import fs from "fs-extra";
// copy src 下面所有的 css 文件到 dist
import { glob } from "glob";

const files = await glob("./src/**/*.css");

files.forEach((i) => {
    fs.outputFileSync(i.replace("src", "./dist/lib"), fs.readFileSync(i, "utf-8"));
});
