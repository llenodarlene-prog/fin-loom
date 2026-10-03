import fs from "node:fs";
import path from "node:path";
import { readJson, parseFrontMatter, markdown, escapeHtml, cleanSlug, canonical, listFiles } from "./lib.mjs";

const site = readJson("data/site.json");
const nav = readJson("data/navigation.json");
const plan = readJson("data/content-plan.json");
const assets = readJson("data/assets.json");

const env = process.env.BUILD_ENV || "local";
if (!["local", "staging", "production"].includes(env)) throw new Error("Invalid BUILD_ENV");
if (env === "production" && process.env.SITE_URL && process.env.SITE_URL !== site.url) {
  throw new Error("SITE_URL does not match data/site.json");
}

const indexable = env === "production" && site.launch_status === "ready";
const dist = "dist";
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(path.join(dist, "styles"), { recursive: true });
fs.mkdirSync(path.join(dist, "scripts"), { recursive: true });
fs.copyFileSync("src/styles/main.css", path.join(dist, "styles/main.css"));
fs.copyFileSync("src/scripts/main.js", path.join(dist, "scripts/main.js"));
fs.copyFileSync("src/static/.htaccess", path.join(dist, ".htaccess"));

for (const asset of assets.filter((x) => x.deploy !== false)) {
  if (!fs.existsSync(asset.path)) continue;
  const dest = path.join(dist, asset.path);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(asset.path, dest);
}

const pages = listFiles("content/pages", ".md").map((file) => {
  const parsed = parseFrontMatter(fs.readFileSync(file, "utf8"));
  return { ...parsed.data, body: parsed.body, file, draft: false };
});

const posts = listFiles("content/posts", ".md").map((file) => {
  const parsed = parseFrontMatter(fs.readFileSync(file, "utf8"));
  return { ...parsed.data, body: parsed.body, file, draft: parsed.data.draft !== false };
});

const builtPosts = env === "production" ? posts.filter((p) => !p.draft) : posts;
const primaryLinks = nav.primary.map((x) => '<li><a href="' + x.href + '">' + escapeHtml(x.label) + "</a></li>").join("");
const footerLinks = nav.footer.map((x) => '<a href="' + x.href + '">' + escapeHtml(x.label) + "</a>").join(" · ");

function structuredData(item, kind) {
  const url = canonical(site.url, item.slug);
  if (kind === "post") {
    return {
      "@context": "https://schema.org",
      "@type": item.type === "blog" ? "BlogPosting" : "Article",
      headline: item.title,
      url,
      description: item.description
    };
  }
  if (item.template === "home") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", name: site.name, url: site.url },
        { "@type": "WebSite", name: site.name, url: site.url }
      ]
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": item.type === "hub" ? "CollectionPage" : "WebPage",
    name: item.title,
    url,
    description: item.description
  };
}

function shell(item, inner, kind = "page") {
  const robots = indexable && !item.noindex && !item.draft ? "index,follow" : "noindex,nofollow,noarchive";
  const url = canonical(site.url, item.slug);
  const jsonLd = JSON.stringify(structuredData(item, kind)).replace(/</g, "\\u003c");
  const draftBanner = item.draft && env !== "production"
    ? '<div class="draft-banner">Editorial draft. Not for publication.</div>'
    : "";

  return [
    "<!doctype html>",
    '<html lang="en"><head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    "<title>" + escapeHtml(item.seo_title || item.title) + "</title>",
    '<meta name="description" content="' + escapeHtml(item.description || "") + '">',
    '<meta name="robots" content="' + robots + '">',
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:title" content="' + escapeHtml(item.title) + '">',
    '<meta property="og:description" content="' + escapeHtml(item.description || "") + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:type" content="' + (kind === "post" ? "article" : "website") + '">',
    '<link rel="stylesheet" href="/styles/main.css">',
    '<script type="application/ld+json">' + jsonLd + "</script>",
    "</head><body>",
    '<a class="skip-link" href="#main">Skip to content</a>',
    draftBanner,
    '<header class="site-header"><nav class="nav" aria-label="Primary">',
    '<a class="brand" href="/">FinLoom</a>',
    '<button class="nav-toggle" data-nav-toggle aria-expanded="false">Menu</button>',
    '<ul class="nav-list" data-nav-list>' + primaryLinks + "</ul>",
    "</nav></header>",
    '<main id="main">' + inner + "</main>",
    '<footer class="site-footer"><div class="wrap"><strong>FinLoom</strong><p>' + escapeHtml(site.tagline) + "</p><p>" + footerLinks + "</p></div></footer>",
    '<script src="/scripts/main.js" defer></script>',
    "</body></html>"
  ].join("");
}

function writePage(slug, html) {
  const dir = path.join(dist, cleanSlug(slug).replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

for (const page of pages) {
  let extra = "";
  if (page.template === "home") {
    const cards = builtPosts.slice(0, 6).map((x) =>
      '<article class="card"><div class="eyebrow">' + escapeHtml(x.type) + '</div><h3><a href="' + x.slug + '">' + escapeHtml(x.title) + "</a></h3></article>"
    ).join("");
    extra = '<section class="wrap"><h2>Latest Research</h2><div class="grid">' +
      (cards || '<p class="muted">Research is in editorial review.</p>') +
      "</div></section>";
  } else if (page.type === "hub") {
    const matches = builtPosts.filter((x) => x.slug.startsWith(page.slug));
    const label = env === "production" ? "Published Research" : "Research Pipeline";
    const cards = matches.map((x) =>
      '<article class="card"><h3><a href="' + x.slug + '">' + escapeHtml(x.title) + "</a></h3></article>"
    ).join("");
    extra = '<section class="wrap"><h2>' + label + '</h2><div class="grid">' +
      (cards || '<p class="muted">No published research is available in this section yet.</p>') +
      "</div></section>";
  }
  writePage(page.slug, shell(page, '<article class="wrap prose">' + markdown(page.body) + "</article>" + extra));
}

for (const post of builtPosts) {
  writePage(post.slug, shell(
    post,
    '<article class="wrap prose"><div class="eyebrow">' + escapeHtml(post.type) + "</div>" + markdown(post.body) + "</article>",
    "post"
  ));
}

const sitemapItems = [...pages.filter((x) => !x.noindex), ...builtPosts].filter((x) => !(env === "production" && x.draft));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  sitemapItems.map((x) => "<url><loc>" + canonical(site.url, x.slug) + "</loc></url>").join("") +
  "</urlset>";
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

const feedPosts = builtPosts.filter((x) => !x.draft && x.published);
const feed = '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>' +
  escapeHtml(site.name) + "</title><id>" + site.url + '</id><link href="' + site.url +
  '/feed.xml" rel="self"/>' + feedPosts.map((x) =>
    "<entry><title>" + escapeHtml(x.title) + "</title><id>" + canonical(site.url, x.slug) +
    '</id><link href="' + canonical(site.url, x.slug) + '"/><updated>' +
    escapeHtml(x.modified || x.published) + "</updated></entry>"
  ).join("") + "</feed>";
fs.writeFileSync(path.join(dist, "feed.xml"), feed);

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  indexable ? "User-agent: *\nAllow: /\nSitemap: " + site.url + "/sitemap.xml\n" : "User-agent: *\nDisallow: /\n"
);
fs.writeFileSync(
  path.join(dist, "build-manifest.json"),
  JSON.stringify({ environment: env, indexable, pages: pages.length, planItems: plan.length, postsBuilt: builtPosts.length }, null, 2)
);
console.log("Built FinLoom:", env, pages.length, "pages", builtPosts.length, "posts");
