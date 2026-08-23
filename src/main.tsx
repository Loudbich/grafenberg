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
 * Seules les graisses réellement utilisées sont importées : Orbitron pour les
 * titres (700 et 900), Inter en variable pour le texte courant.
 */
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';
import '@fontsource-variable/inter';

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
