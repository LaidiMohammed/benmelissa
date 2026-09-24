export default function Guide3d() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">Guide 3D</p>
      <h1 className="font-display mt-1 text-4xl">SketchUp et Lumion : du plan à la fiche bien</h1>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-creme/80">
        <section className="border border-champagne/20 p-6">
          <h2 className="font-display text-2xl text-champagne-clair">SketchUp → Sketchfab (maquette 3D)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Modélisez le logement dans SketchUp, purgez les composants lourds.</li>
            <li>Installez le plugin officiel « Publish to Sketchfab », connectez votre compte.</li>
            <li>Publiez, copiez l’URL page <code>sketchfab.com/3d-models/…-XXXX</code>.</li>
            <li>Collez-la dans l’admin, champ « Lien 3D » : le site convertit seul en lecteur intégré.</li>
          </ol>
        </section>
        <section className="border border-champagne/20 p-6">
          <h2 className="font-display text-2xl text-champagne-clair">Lumion → photos, film, plans</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Photos : rendu 1920px+, hébergez (ou dossier <code>public/</code>), collez 1 URL par ligne dans « Images ».</li>
            <li>Film : exportez, envoyez sur YouTube en « non répertoriée », collez le lien watch/shorts dans « Vidéo ».</li>
            <li>Plans LayOut : export PNG (jamais de PDF rasterisé flou), collez dans « Plans 2D ». Si PDF, le site affiche un bouton « Ouvrir le plan PDF ».</li>
          </ol>
        </section>
        <section className="border border-champagne/20 bg-creme p-6 text-noir">
          <h2 className="font-display text-2xl">Règle d’or</h2>
          <p className="mt-1">L’utilisateur ne touche jamais au code : il colle un lien, le moteur <code>src/lib/embed.ts</code> normalise (Maps output=embed, YouTube /embed, Sketchfab /models/id/embed, TikTok oEmbed caché, PDF détecté).</p>
        </section>
      </div>
    </div>
  );
}
