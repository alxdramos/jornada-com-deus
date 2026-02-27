'use client';

import { useEffect } from 'react';

export interface MediaSessionMetadata {
  title: string;
  artist?: string;
  album?: string;
  artwork?: string; // URL da imagem (cover art)
}

interface UseMediaSessionOptions {
  metadata: MediaSessionMetadata | null;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onStop?: () => void;
}

const DEFAULT_ARTWORK: MediaImage[] = [
  { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
];

export function useMediaSession({
  metadata,
  playing,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
  onStop,
}: UseMediaSessionOptions) {
  // Atualiza metadata quando muda
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!metadata) {
      navigator.mediaSession.metadata = null;
      return;
    }

    const artwork: MediaImage[] = metadata.artwork
      ? [
          { src: metadata.artwork, sizes: '512x512', type: 'image/png' },
          ...DEFAULT_ARTWORK,
        ]
      : DEFAULT_ARTWORK;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: metadata.title,
      artist: metadata.artist ?? 'Jornada com Deus',
      album: metadata.album ?? 'Jornada com Deus',
      artwork,
    });
  }, [metadata]);

  // Sincroniza playbackState
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }, [playing]);

  // Registra action handlers
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler | null]> = [
      ['play', onPlay],
      ['pause', onPause],
      ['seekbackward', onSeekBackward],
      ['seekforward', onSeekForward],
      ['stop', onStop ?? onPause],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Ação não suportada no browser (ex: stop em alguns browsers)
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // ignorar
        }
      }
    };
  }, [onPlay, onPause, onSeekBackward, onSeekForward, onStop]);
}
