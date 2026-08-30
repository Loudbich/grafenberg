import { Link } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { notFoundSeo } from '@/lib/seo';
import ReleaseCard from '@/components/ReleaseCard';
import { albums } from '@/data/catalog';

/**
 * 404.
 *
 * La version d'origine était le gabarit livré avec le projet : fond gris clair,
 * lien bleu souligné, aucun élément de navigation. Sur un site noir et néon,
 * elle donnait à croire qu'on avait quitté le site plutôt que manqué une page.
 *
 * Trois pochettes plutôt qu'un simple lien de retour : quelqu'un qui arrive ici
 * suit presque toujours une URL périmée vers un disque, et lui en proposer
 * trois vaut mieux que de le renvoyer à l'accueil les mains vides.
 */
const NotFound = () => (
  <div className="bg-deep min-h-screen overflow-x-hidden">
    {/* Une page d'erreur ne doit pas entrer dans l'index : elle n'a pas de
        contenu propre et ferait doublon avec toutes les autres. */}
    <Seo route={notFoundSeo()} />

    <MainNavbar />

    <main className="px-6 pb-24 pt-40">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="font-display text-gradient-neon mb-4 text-7xl font-black md:text-8xl">404</p>
        <h1 className="font-display text-foreground mb-4 text-2xl font-bold md:text-3xl">
          This page does not exist
        </h1>
        <div className="waveform mx-auto mb-6 max-w-xs" />
        <p className="text-muted-foreground mx-auto mb-12 max-w-xl">
          The link may be out of date. The whole catalogue is still here.
        </p>

        <Link
          to="/#discography"
          className="glass border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover-glow-cyan mb-20 inline-block rounded-xl border px-6 py-3 font-semibold transition-all duration-300"
        >
          Browse the discography
        </Link>

        <div className="grid gap-8 text-left md:grid-cols-3">
          {albums.slice(0, 3).map((release) => (
            <ReleaseCard key={release.slug} release={release} />
          ))}
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default NotFound;
