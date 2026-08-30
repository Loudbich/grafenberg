import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

/**
 * Les polices, servies par le site lui-même.
 *
 * Elles arrivaient de fonts.googleapis.com, ce qui livrait l'adresse IP de
 * chaque visiteur à Google avant même le premier octet de contenu — et
 * contredisait exactement ce que la façade du lecteur et les pochettes locales
 * cherchent à éviter. C'est aussi une feuille de style bloquante sur un
 * troisième domaine, à résoudre et à négocier avant de pouvoir peindre du texte.
 *
 * UNE SEULE FAMILLE, et c'est un choix.
 *
 * Les titres étaient en Orbitron. C'est la police « futuriste » par défaut de
 * Google Fonts, présente sur des milliers de sites du même genre : elle ne
 * signalait pas Grafenberg, elle signalait qu'on avait voulu faire techno. Et
 * sa lourdeur géométrique contredisait le noir et le verre.
 *
 * Surtout, le site porte déjà trente-deux lettrages dessinés — le logo, dix-sept
 * pochettes, quatorze bandeaux — chacun avec sa propre typographie. Une police
 * de titre marquée y ajoutait une voix de plus, qui parlait par-dessus les
 * autres. L'interface se tait ; les images parlent.
 *
 * `opsz` et non `wght` : la variante à axe optique. Inter y ajuste ses
 * proportions selon la taille de rendu — plus resserrée et plus fine en grand,
 * plus ouverte en petit. C'est ce qui distingue une typographie composée d'une
 * typographie simplement posée, et le fichier ne coûte pas plus cher.
 */
import '@fontsource-variable/inter/opsz.css';

import './index.css';

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Chaque route est prérendue en HTML statique au build : en production le
// balisage est déjà là et React n'a qu'à s'y rattacher. En développement, où
// rien n'est prérendu, le rendu part de zéro.
//
// `firstElementChild` et non `hasChildNodes()` : en développement le conteneur
// n'est pas vide, il contient le commentaire `<!--app-html-->` que le prérendu
// remplacera. Un commentaire est un nœud, si bien que `hasChildNodes()` était
// vrai partout et que le serveur de développement tentait d'hydrater une
// coquille vide — d'où un échec d'hydratation à chaque rechargement.
if (container.firstElementChild) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
