import React from 'react';
import { useAlbumEditor } from '@/hooks/useAlbum';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, Plus, Trash2, Music, Link as LinkIcon, Disc3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlbumEditorProps {
  albumId: string;
}

const streamingPlatformLabels: Record<string, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  deezer: 'Deezer',
  bandcamp: 'Bandcamp',
  amazonMusic: 'Amazon Music',
  qobuz: 'Qobuz',
  soundcloud: 'SoundCloud',
};

const AlbumEditor: React.FC<AlbumEditorProps> = ({ albumId }) => {
  const { 
    album, 
    updateAlbum, 
    updateStreamingLink, 
    updateTrack, 
    addTrack, 
    removeTrack, 
    save, 
    reset 
  } = useAlbumEditor(albumId);
  const { toast } = useToast();

  if (!album) {
    return <div className="text-amber-400">Album non trouvé</div>;
  }

  const handleSave = () => {
    save();
    toast({
      title: "Sauvegardé",
      description: `Les modifications de "${album.title}" ont été sauvegardées.`
    });
  };

  const handleAddTrack = () => {
    const newTrack = {
      id: String(album.tracks.length + 1),
      name: 'Nouvelle piste',
      track_number: album.tracks.length + 1,
      duration_ms: 180000,
      preview_url: '',
      image: album.artwork,
      description: 'Description à remplir...',
      lyrics: 'Paroles à remplir...'
    };
    addTrack(newTrack);
  };

  return (
    <div className="space-y-8">
      {/* Album Info */}
      <Card className="bg-black/40 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <Disc3 className="w-5 h-5" />
            Informations de l'album
          </CardTitle>
          <CardDescription className="text-amber-200/60">
            Modifiez les informations générales de l'album
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-200">Titre</Label>
              <Input
                id="title"
                value={album.title}
                onChange={(e) => updateAlbum({ title: e.target.value })}
                className="bg-black/40 border-amber-500/30 text-amber-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-amber-200">Artiste</Label>
              <Input
                id="artist"
                value={album.artist}
                onChange={(e) => updateAlbum({ artist: e.target.value })}
                className="bg-black/40 border-amber-500/30 text-amber-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-amber-200">Date de sortie</Label>
              <Input
                id="releaseDate"
                value={album.releaseDate}
                onChange={(e) => updateAlbum({ releaseDate: e.target.value })}
                className="bg-black/40 border-amber-500/30 text-amber-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vinylUrl" className="text-amber-200">Lien achat vinyle</Label>
              <Input
                id="vinylUrl"
                value={album.vinylUrl || ''}
                onChange={(e) => updateAlbum({ vinylUrl: e.target.value })}
                placeholder="https://..."
                className="bg-black/40 border-amber-500/30 text-amber-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streaming Links */}
      <Card className="bg-black/40 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Liens de streaming
          </CardTitle>
          <CardDescription className="text-amber-200/60">
            Modifiez les liens vers les plateformes de streaming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(streamingPlatformLabels).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-amber-200">{label}</Label>
                <Input
                  id={key}
                  value={(album.streamingLinks as Record<string, string>)[key] || ''}
                  onChange={(e) => updateStreamingLink(key, e.target.value)}
                  placeholder="https://..."
                  className="bg-black/40 border-amber-500/30 text-amber-100"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tracks */}
      <Card className="bg-black/40 border-amber-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-amber-300 flex items-center gap-2">
                <Music className="w-5 h-5" />
                Pistes ({album.tracks.length})
              </CardTitle>
              <CardDescription className="text-amber-200/60">
                Gérez les pistes de l'album
              </CardDescription>
            </div>
            <Button 
              onClick={handleAddTrack}
              className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une piste
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {album.tracks.map((track, index) => (
              <AccordionItem 
                key={track.id} 
                value={track.id}
                className="border border-amber-500/20 rounded-lg bg-black/20 px-4"
              >
                <AccordionTrigger className="text-amber-200 hover:text-amber-100">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500/20 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold">
                      {track.track_number}
                    </span>
                    <span>{track.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-amber-200">Nom de la piste</Label>
                      <Input
                        value={track.name}
                        onChange={(e) => updateTrack(track.id, { name: e.target.value })}
                        className="bg-black/40 border-amber-500/30 text-amber-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-200">Numéro</Label>
                      <Input
                        type="number"
                        value={track.track_number}
                        onChange={(e) => updateTrack(track.id, { track_number: parseInt(e.target.value) || 1 })}
                        className="bg-black/40 border-amber-500/30 text-amber-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-200">Durée (ms)</Label>
                      <Input
                        type="number"
                        value={track.duration_ms}
                        onChange={(e) => updateTrack(track.id, { duration_ms: parseInt(e.target.value) || 0 })}
                        className="bg-black/40 border-amber-500/30 text-amber-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-amber-200">URL preview audio</Label>
                      <Input
                        value={track.preview_url}
                        onChange={(e) => updateTrack(track.id, { preview_url: e.target.value })}
                        placeholder="/audio/track.mp3"
                        className="bg-black/40 border-amber-500/30 text-amber-100"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-amber-200">URL image</Label>
                      <Input
                        value={track.image}
                        onChange={(e) => updateTrack(track.id, { image: e.target.value })}
                        placeholder="/src/assets/image.jpg"
                        className="bg-black/40 border-amber-500/30 text-amber-100"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-amber-200">Description</Label>
                    <Textarea
                      value={track.description || ''}
                      onChange={(e) => updateTrack(track.id, { description: e.target.value })}
                      className="bg-black/40 border-amber-500/30 text-amber-100 min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-amber-200">Paroles</Label>
                    <Textarea
                      value={track.lyrics || ''}
                      onChange={(e) => updateTrack(track.id, { lyrics: e.target.value })}
                      className="bg-black/40 border-amber-500/30 text-amber-100 min-h-[150px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeTrack(track.id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer cette piste
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 sticky bottom-4 bg-neutral-950/80 backdrop-blur-sm p-4 rounded-lg border border-amber-500/20">
        <Button 
          variant="outline" 
          onClick={reset}
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
        >
          Annuler les modifications
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold hover:from-amber-500 hover:to-amber-400"
        >
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default AlbumEditor;
