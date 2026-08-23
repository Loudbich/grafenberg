import { useEffect } from 'react';
import { BASE_URL, SITE_NAME, canonicalPath, jsonLd, type RouteSeo } from '@/lib/seo';

/**
 * LE <head> PENDANT LA NAVIGATION INTERNE
 * -----------------------------------------------------------------------------
 * Le prérendu inscrit déjà titre, description, canonique, Open Graph et graphe
 * dans le HTML statique de chaque URL : au premier chargement, ce composant n'a
 * rien à faire, et c'est voulu. Il n'existe que pour la navigation interne, où
 * aucun document n'est rechargé et où le <head> resterait sinon celui de la
 * page d'arrivée précédente.
 *
 * Il lit les mêmes fonctions que `scripts/prerender.mjs` — c'est ce qui garantit
 * que la page prérendue et la page naviguée annoncent la même chose. Le
 * remplacement de ce composant par des chaînes écrites dans chaque page ferait
 * réapparaître la divergence qu'il est là pour empêcher.
 * -----------------------------------------------------------------------------
 */

type Props = { route: RouteSeo };

/** Pose une balise meta, ou la met à jour si elle existe déjà. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

const Seo = ({ route }: Props) => {
  useEffect(() => {
    const url = `${BASE_URL}${canonicalPath(route.path)}`;
    const image = route.image
      ? route.image.startsWith('http')
        ? route.image
        : `${BASE_URL}${route.image}`
      : undefined;

    document.title = route.title.includes(SITE_NAME)
      ? route.title
      : `${route.title} — ${SITE_NAME}`;

    setMeta('name', 'description', route.description);
    setMeta(
      'name',
      'robots',
      route.noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    );
    setMeta('property', 'og:title', document.title);
    setMeta('property', 'og:description', route.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', route.ogType);
    setMeta('name', 'twitter:card', 'summary_large_image');
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }

    // Sans canonique, chaque variante à paramètre de campagne (?utm_source=…)
    // est indexée comme une page distincte.
    setLink('canonical', url);

    // Le bloc prérendu porte `data-seo-graph`. Le remplacer plutôt que d'en
    // ajouter un second évite qu'une page naviguée déclare deux graphes
    // contradictoires — celui de la page d'arrivée et celui d'origine.
    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-graph]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-graph', '');
      document.head.appendChild(script);
    }
    script.textContent = jsonLd(route);
  }, [route]);

  return null;
};

export default Seo;
