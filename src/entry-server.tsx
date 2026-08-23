import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { allRoutes, canonicalPath, jsonLd, BASE_URL, SHARE_IMAGE, SITE_NAME } from './lib/seo';

/**
 * Point d'entrée du prérendu — appelé une fois par route par
 * `scripts/prerender.mjs`.
 *
 * Ce fichier n'est jamais livré au navigateur : Vite le compile séparément
 * (`build:ssr`), le script s'en sert, puis le supprime.
 */
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

/** Les métadonnées de chaque route, le graphe déjà sérialisé. */
export function routes() {
  return allRoutes().map((route) => ({
    path: route.path,
    canonical: `${BASE_URL}${canonicalPath(route.path)}`,
    title: route.title.includes(SITE_NAME) ? route.title : `${route.title} — ${SITE_NAME}`,
    description: route.description,
    ogType: route.ogType,
    image: route.image,
    noIndex: route.noIndex,
    lastmod: route.lastmod,
    jsonLd: jsonLd(route),
  }));
}

export const baseUrl = BASE_URL;

/** Image de partage par défaut, pour que le script n'en tienne pas une copie. */
export const shareImage = SHARE_IMAGE;
