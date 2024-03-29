import { readFileSync, writeFileSync } from "node:fs";

const text = readFileSync("inner_files/main.mjs").toString();

const data = { text };

writeFileSync("src/assets/main.mjs.json", JSON.stringify(data));
