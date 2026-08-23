import React, { useState } from 'react';
import { useAlbums } from '@/hooks/useAlbum';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clearStoredAlbums, exportAlbumsAsJson, getStoredAlbums } from '@/data/storage';
import { useToast } from '@/hooks/use-toast';
import AlbumEditor from '@/components/admin/AlbumEditor';

const Admin = () => {
  const albums = useAlbums();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(albums[0]?.id || '');

  const handleExport = () => {
    const json = exportAlbumsAsJson();
    if (!json || json === 'null') {
      toast({
        title: "Aucune modification",
        description: "Aucune modification n'a été sauvegardée.",
        variant: "destructive"
      });
      return;
    }
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'albums-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées en JSON."
    });
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les modifications ? Cette action est irréversible.')) {
      clearStoredAlbums();
      window.dispatchEvent(new Event('storage'));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="font-orbitron text-2xl font-bold text-amber-100">
              Admin - Gestion des Albums
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 border border-amber-500/20 mb-8">
            {albums.map(album => (
              <TabsTrigger 
                key={album.id} 
                value={album.id}
                className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
              >
                {album.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {albums.map(album => (
            <TabsContent key={album.id} value={album.id}>
              <AlbumEditor albumId={album.id} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
