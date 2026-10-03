import fs from "node:fs";
import path from "node:path";

const required = [
  "README.md",
  "site.config.json",
  "content/articles",
  "content/blogs",
  "public"
];

const missing = required.filter((entry) => !fs.existsSync(path.resolve(entry)));
if (missing.length) {
  console.error("Missing required paths:\n" + missing.map((x) => "- " + x).join("\n"));
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync("site.config.json", "utf8"));
if (!config.name || !config.domain || !Array.isArray(config.categories) || config.categories.length === 0) {
  console.error("site.config.json is incomplete.");
  process.exit(1);
}

console.log("FinLoom content structure verified.");
