import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const config = JSON.parse(fs.readFileSync("site.config.json", "utf8"));
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${config.name} | ${config.tagline}</title>
  <meta name="description" content="${config.tagline}">
  <link rel="canonical" href="${config.domain}/">
</head>
<body>
  <main>
    <h1>${config.name}</h1>
    <p>${config.tagline}</p>
    <nav>
      <ul>
        ${config.categories.map((category) => `<li>${category}</li>`).join("\n")}
      </ul>
    </nav>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(dist, "index.html"), html);
console.log("Built dist/index.html");
