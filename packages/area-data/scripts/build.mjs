import fs from "node:fs";
import { areaList } from "@vant/area-data";
import { compress } from "../dist/compress.js";
fs.writeFileSync(
    "./dist/area.json",
    JSON.stringify(
        Object.fromEntries(
            Object.entries(areaList).map(([key, val]) => {
                return [key, compress(val)];
            }),
        ),
    ),
);
fs.writeFileSync("./dist/area_upzip.json", JSON.stringify(areaList));
