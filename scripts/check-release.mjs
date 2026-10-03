import fs from "node:fs";import {readJson,parseFrontMatter} from "./lib.mjs";
const site=readJson("data/site.json"),release=readJson("data/release.json"),plan=readJson("data/content-plan.json");const errors=[];
if(site.launch_status!=="ready")errors.push("launch_status must be ready.");
if(!site.contact_email)errors.push("contact_email must be set.");
for(const [k,v] of Object.entries(release.approvals))if(v!==true)errors.push(`approval ${k} must be true`);
for(const route of release.core_routes){const file=route==="/"? "content/pages/home.md":`content/pages/${route.slice(1,-1)}.md`;if(!fs.existsSync(file)){errors.push("Missing core route file "+route);continue}const {data,body}=parseFrontMatter(fs.readFileSync(file,"utf8"));if(data.complete!==true)errors.push(`Core route incomplete: ${route}`);if(/not yet|before launch|will be|placeholder/i.test(body))errors.push(`Core route marked complete but contains placeholder language: ${route}`);}
let publishedBlogs=0;for(const p of plan.filter(x=>x.type==="blog")){const file=`content/posts/${p.id}.md`;const {data}=parseFrontMatter(fs.readFileSync(file,"utf8"));const research=readJson(`content/research/${p.id}.json`);if(data.draft===false&&research.status==="verified"&&research.fact_check?.status==="approved"&&research.qa?.status==="approved")publishedBlogs++;}
if(publishedBlogs<release.minimum_published_blogs)errors.push(`Need at least ${release.minimum_published_blogs} fully verified published blog.`);
if(errors.length){console.error("Production release blocked:\n- "+errors.join("\n- "));process.exit(1)}console.log("Production release gate passed.");
