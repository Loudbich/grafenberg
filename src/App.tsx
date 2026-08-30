import { TooltipProvider } from '@/components/ui/tooltip';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AlbumPage from './pages/AlbumPage';
import Label from './pages/Label';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

/**
 * Les routes du site.
 *
 * `/album/:slug` est une route unique là où il y avait une page par disque.
 * Les deux URL déjà en ligne — /album/no-saints-no-proof et
 * /album/the-error-gospel — sont conservées telles quelles : ce sont les slugs
 * du manifeste, elles continuent donc de répondre, et rien de ce qui est indexé
 * ou partagé ne se casse.
 *
 * Aucun routeur ici : le navigateur monte un BrowserRouter dans main.tsx, le
 * prérendu un StaticRouter dans entry-server.tsx. Un composant qui choisirait
 * lui-même son routeur ne pourrait pas être rendu par les deux.
 *
 * QueryClientProvider a été retiré : react-query était instancié à chaque
 * démarrage sans qu'aucun `useQuery` n'existe dans le code.
 *
 * Les deux systèmes de notification — celui de shadcn et Sonner — l'ont été
 * aussi. Ils étaient montés sur chaque page depuis la suppression de l'admin,
 * seul endroit qui déclenchait des notifications. Plus rien n'en émettait :
 * 50 ko de JavaScript, 16 ko compressés, pour du code qui ne s'exécutait
 * jamais.
 */
const App = () => (
  <TooltipProvider>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/album/:slug" element={<AlbumPage />} />
      <Route path="/label" element={<Label />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
