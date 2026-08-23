import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
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
