#!/usr/bin/env node
/**
 * PRÉRENDU STATIQUE
 * -----------------------------------------------------------------------------
 * Transforme l'application à page unique en un jeu de vrais fichiers HTML — un
 * par URL — chacun portant son propre <title>, ses métadonnées, sa canonique,
 * son Open Graph et son graphe schema.org, ainsi que le corps de page déjà
 * rendu.
 *
 * POURQUOI : Googlebot exécute le JavaScript, mais l'extraction d'entités pour
 * le graphe de connaissances, les robots des réseaux sociaux (Facebook,
 * Discord, WhatsApp, Slack, LinkedIn) et ceux des assistants IA ne le font
 * généralement pas. Avec un index.html unique dont les métadonnées sont posées
 * par JavaScript, tous voyaient la même page d'accueil générique pour les
 * seize URL du site — un lien partagé vers Afterimage s'affichait sous le titre
 * du site, sans sa pochette.
 *
 * Ce prérendu remplace aussi la redirection via 404.html : chaque album étant
 * désormais un fichier réel, GitHub Pages le sert directement en 200, sans
 * rebond ni URL réécrite.
 *
 * Lancé automatiquement par `npm run build`.
 * -----------------------------------------------------------------------------
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const DIST = resolve(root, 'dist');
const SSR = resolve(root, 'dist-ssr');

const log = (...a) => console.log('[prerender]', ...a);

/* -------------------------------------------------------------------------- */

const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Un bloc JSON-LD ne doit jamais pouvoir fermer sa propre balise <script>.
 *
 * Un titre d'album contenant `</script>` suffirait sinon à terminer le bloc et
 * à faire interpréter le reste du graphe comme du balisage — c'est la voie
 * classique d'une injection dans une page par ailleurs entièrement statique.
 */
const escapeJsonLd = (s) =>
  s.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

function headFor(route, base, shareImage) {
  const image = route.image
    ? route.image.startsWith('http')
      ? route.image
      : base + route.image
    : base + shareImage;

  const tags = [
    `<title>${escapeAttr(route.title)}</title>`,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    `<meta name="robots" content="${route.noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`,
    `<link rel="canonical" href="${escapeAttr(route.canonical)}" />`,
    `<meta property="og:site_name" content="Grafenberg" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:type" content="${escapeAttr(route.ogType)}" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(route.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
    `<script type="application/ld+json" data-seo-graph>${escapeJsonLd(route.jsonLd)}</script>`,
  ];

  return tags.map((t) => '    ' + t).join('\n');
}

/**
 * Le fichier à écrire pour une route.
 *
 * `/album/afterimage/index.html` plutôt que `/album/afterimage.html` : c'est la
 * forme que tout hébergeur statique sert à `/album/afterimage/`, l'URL même que
 * la canonique déclare.
 */
function outPathFor(routePath) {
  if (routePath === '/') return join(DIST, 'index.html');
  if (routePath === '/404') return join(DIST, '404.html');
  return join(DIST, routePath.replace(/^\//, ''), 'index.html');
}

function sitemapFor(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => !r.noIndex)
    .map(
      (r) => `  <url>
    <loc>${r.canonical}</loc>
    <lastmod>${r.lastmod ?? today}</lastmod>
    <changefreq>${r.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${r.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* -------------------------------------------------------------------------- */

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html absent — lancez `vite build` d’abord.');
    process.exit(1);
  }

  const entry = pathToFileURL(join(SSR, 'entry-server.js')).href;
  const { render, routes: getRoutes, baseUrl, shareImage } = await import(entry);

  const template = readFileSync(join(DIST, 'index.html'), 'utf8');

  // Sans ces marqueurs le prérendu écrirait des pages sans métadonnées et sans
  // corps, silencieusement. Mieux vaut casser le build.
  if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-start-->')) {
    console.error("[prerender] index.html n'a plus ses marqueurs <!--app-html--> / <!--seo-start-->.");
    process.exit(1);
  }

  const routes = getRoutes();
  let written = 0;

  for (const route of routes) {
    // La route 404 n'a pas d'URL propre : on demande un chemin qui ne peut
    // correspondre à aucune route, pour que le catch-all rende NotFound.
    const url = route.path === '/404' ? '/__not_found__' : route.path;

    let html;
    try {
      html = render(url);
    } catch (err) {
      console.error(`[prerender] rendu impossible pour ${route.path} : ${err.message}`);
      process.exit(1);
    }

    const page = template
      .replace(/ *<!--seo-start-->[\s\S]*?<!--seo-end-->/, headFor(route, baseUrl, shareImage))
      .replace('<!--app-html-->', html);

    const out = outPathFor(route.path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page);
    written++;
  }

  writeFileSync(join(DIST, 'sitemap.xml'), sitemapFor(routes));

  // Généré plutôt que statique, pour que l'URL du sitemap ne puisse pas diverger
  // de l'origine configurée dans seo.ts.
  writeFileSync(
    join(DIST, 'robots.txt'),
    `User-agent: *
Allow: /

# Les moteurs de réponse et assistants IA sont les bienvenus : les données
# structurées sont aussi écrites pour eux.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`,
  );

  // GitHub Pages fait tourner Jekyll sauf mention contraire, et Jekyll ignore
  // silencieusement tout fichier ou dossier dont le nom commence par un
  // souligné — ce qui viderait `assets/` de ses fichiers hachés.
  writeFileSync(join(DIST, '.nojekyll'), '');

  // Le bundle SSR est un artefact de build, pas quelque chose à déployer.
  rmSync(SSR, { recursive: true, force: true });

  const indexable = routes.filter((r) => !r.noIndex).length;
  log(`${written} pages statiques + sitemap.xml (${indexable} URL indexables)`);
}

main().catch((err) => {
  console.error('[prerender]', err);
  process.exit(1);
});
