// =========================================================================
// cms/build.mjs — zet inhoud uit content/*.json in de HTML (Decap CMS-kit)
// Gebruik:  node cms/build.mjs          → bouwt de site naar dist/
//           node cms/build.mjs --watch  → bouwt opnieuw bij elke wijziging
// Geen dependencies (Node 18+). Netlify draait dit als build command.
//
// Markeringen in de HTML (zonder build blijft de standaardtekst gewoon zichtbaar):
//   <!--cms:text pad-->standaardtekst<!--/cms-->
//   <!--cms:list pad--><template data-cms-tpl>…{{veld}}…</template>standaard-items<!--/cms-->
// Pad: bestandsnaam.veld.subveld, bijv. home.hero_titel of plannen.items[id=nieuw].prijs
// In templates: {{veld}}  {{if veld}}…{{else}}…{{/if}}  {{each lijst}}…{{.}}…{{/each}}
// =========================================================================
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, watch, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'dist');
// Niet publiceren: bouwgereedschap en interne bestanden (belscript, README, bronversies van componenten)
const SKIP = new Set(['dist', 'cms', 'content', 'node_modules', '.git', '.gitignore', '.netlify', '.claude',
  'components', 'templates', 'deploy', 'api', 'README.md', 'OPLEVERING.md', 'manifest.json', 'netlify.toml',
  'telefoonpitch-websites.md', 'prompt-showcase-websites.txt']);
const warnings = [];

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadContent() {
  const data = {};
  for (const f of readdirSync(join(ROOT, 'content')).filter((f) => f.endsWith('.json'))) {
    data[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8'));
  }
  return data;
}

// Pad ophalen, met ondersteuning voor items[id=nieuw]
function get(obj, path) {
  return path.split('.').reduce((cur, part) => {
    if (cur == null) return undefined;
    const m = part.match(/^(\w+)\[(\w+)=([\w-]+)\]$/);
    if (m) return (cur[m[1]] || []).find((x) => String(x[m[2]]) === m[3]);
    return cur[part];
  }, obj);
}

// Mini-templates: each → if/else → {{veld}}
function render(tpl, item) {
  let out = tpl.replace(/\{\{each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, inner) =>
    (item[key] || []).map((v) => inner.replace(/\{\{\.\}\}/g, esc(v))).join(''));
  out = out.replace(/\{\{if (\w+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (_, key, yes, no = '') => (item[key] ? yes : no));
  return out.replace(/\{\{(\w+)\}\}/g, (_, key) => esc(item[key]));
}

function processHtml(html, data, file) {
  return html.replace(/<!--cms:(text|list) ([^\s>]+)-->([\s\S]*?)<!--\/cms-->/g, (whole, kind, path, inner) => {
    const value = get(data, path);
    if (value === undefined) { warnings.push(`${file}: geen inhoud voor "${path}", standaardtekst gebruikt`); return inner; }
    if (kind === 'text') return esc(value);
    const tpl = inner.match(/<template data-cms-tpl>([\s\S]*?)<\/template>/);
    if (!tpl) { warnings.push(`${file}: lijst "${path}" mist <template data-cms-tpl>`); return inner; }
    return value.map((item) => render(tpl[1], item)).join('\n');
  });
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (dir === ROOT && SKIP.has(name)) continue;
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, files) : files.push(p);
  }
  return files;
}

function build() {
  warnings.length = 0;
  const data = loadContent();
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT);
  let pages = 0;
  for (const src of walk(ROOT)) {
    const rel = relative(ROOT, src);
    const dest = join(OUT, rel);
    mkdirSync(join(dest, '..'), { recursive: true });
    if (extname(src) === '.html' && !rel.startsWith('components')) {
      writeFileSync(dest, processHtml(readFileSync(src, 'utf8'), data, rel));
      pages++;
    } else {
      cpSync(src, dest);
    }
  }
  console.log(`[cms] ${pages} pagina's gebouwd naar dist/ ${new Date().toLocaleTimeString('nl-NL')}`);
  warnings.forEach((w) => console.warn('[cms] let op:', w));
}

build();
if (process.argv.includes('--watch')) {
  let timer;
  console.log('[cms] kijkt mee naar wijzigingen (Ctrl+C om te stoppen)');
  watch(ROOT, { recursive: true }, (_, file) => {
    if (!file || file.startsWith('dist') || file.startsWith('.git')) return;
    clearTimeout(timer);
    timer = setTimeout(() => { try { build(); } catch (e) { console.error('[cms] fout:', e.message); } }, 200);
  });
}
