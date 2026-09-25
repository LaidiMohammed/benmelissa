"use client";
import { useEffect, useRef, useState } from "react";

interface YTPlayer {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
}

interface YTNamespace {
  Player: new (
    el: HTMLDivElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: { onReady?: (e: { target: YTPlayer }) => void; onError?: () => void };
    }
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function youtubeIdFrom(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/) ?? url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

// Fond vidéo YouTube plein écran (toutes tailles) + repli photo si erreur/blocage.
export default function HeroVideo({ youtubeUrl, poster }: { youtubeUrl: string; poster: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const id = youtubeIdFrom(youtubeUrl);

  useEffect(() => {
    if (!id) {
      // id invalide → repli poster, sync dérivée nécessaire
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    let player: YTPlayer | null = null;
    let cancelled = false;

    function create() {
      if (cancelled || !hostRef.current || !window.YT || failed) return;
      try {
        player = new window.YT.Player(hostRef.current, {
          videoId: id as string,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: id as string,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: (e) => {
              e.target.mute();
              e.target.playVideo();
            },
            onError: () => setFailed(true),
          },
        });
      } catch {
        setFailed(true);
      }
    }

    if (window.YT?.Player) {
      create();
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        create();
      };
      // Si l'API ne charge pas (réseau), repli photo après 8s.
      const t = setTimeout(() => {
        if (!player) setFailed(true);
      }, 8000);
      return () => {
        cancelled = true;
        clearTimeout(t);
        try {
          player?.destroy();
        } catch {
          /* noop */
        }
      };
    }
    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!id || failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="Oran, Algérie" className="animate-kenburns absolute inset-0 h-full w-full object-cover" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-noir" aria-hidden="true">
      <div
        ref={hostRef}
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: "100vw",
          height: "56.25vw",
          minHeight: "100vh",
          minWidth: "177.78vh",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
