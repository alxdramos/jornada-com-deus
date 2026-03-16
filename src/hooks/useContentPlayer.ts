'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { useMediaSession } from "./useMediaSession";
import { resolveAudioUrl } from "@/lib/cdn";

interface UseContentPlayerProps {
  audioUrl?: string;
  isOpen: boolean;
  title?: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

/**
 * useContentPlayer
 *
 * Player de áudio real (HTMLAudioElement) com suporte a:
 * - speed control (0.75x … 2x)
 * - mute/unmute
 * - skip ±15s
 * - repeat
 * - MediaSession (lock screen)
 */
export function useContentPlayer({ audioUrl, isOpen, title }: UseContentPlayerProps) {
  const [playing, setPlaying]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [repeat, setRepeat]         = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [speed, setSpeedState]      = useState(1);
  const [muted, setMutedState]      = useState(false);

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Setup audio source ────────────────────────────────────
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setAudioError(false);
      setAudioLoading(true);
      audioRef.current.src = resolveAudioUrl(audioUrl);
      audioRef.current.load();
    }
  }, [audioUrl]);

  // ── Audio events ──────────────────────────────────────────
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    const onCanPlay = () => { setAudioLoading(false); setDuration(audio.duration); };
    const onWaiting = () => setAudioLoading(true);
    const onError   = () => { setAudioLoading(false); setAudioError(true); setPlaying(false); };
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error',   onError);
    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error',   onError);
    };
  }, [audioUrl]);

  // ── Progress tracking ─────────────────────────────────────
  useEffect(() => {
    if (!playing || !audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };
    const onEnded = () => {
      if (repeat) { audio.currentTime = 0; audio.play(); }
      else { setPlaying(false); }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playing, repeat, audioUrl]);

  // ── Reset on close ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setPlaying(false); setProgress(0); setCurrentTime(0);
      audioRef.current?.pause();
    }
  }, [isOpen]);

  // ── Speed ─────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // ── Mute ──────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // ── Controls ──────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    if (!audioUrl || !audioRef.current) return;
    try {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else         { await audioRef.current.play(); setPlaying(true); }
    } catch { setPlaying(false); }
  }, [audioUrl, playing]);

  const skip = useCallback((direction: 'forward' | 'backward') => {
    if (!audioRef.current) return;
    const newTime = direction === 'forward'
      ? Math.min(currentTime + 15, duration)
      : Math.max(currentTime - 15, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(duration ? (newTime / duration) * 100 : 0);
  }, [currentTime, duration]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const newPct = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = (newPct / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newPct);
    setCurrentTime(newTime);
  };

  const setSpeed = (s: number) => { setSpeedState(s); };
  const setMuted = (m: boolean) => { setMutedState(m); };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  // ── MediaSession ──────────────────────────────────────────
  const handlePlay  = useCallback(() => { void togglePlay(); }, [togglePlay]);
  const handlePause = useCallback(() => { void togglePlay(); }, [togglePlay]);
  const seekBwd     = useCallback(() => skip('backward'), [skip]);
  const seekFwd     = useCallback(() => skip('forward'),  [skip]);

  useMediaSession({
    metadata: isOpen && title ? { title, album: 'Jornada com Deus' } : null,
    playing,
    onPlay: handlePlay,
    onPause: handlePause,
    onSeekBackward: seekBwd,
    onSeekForward: seekFwd,
  });

  return {
    playing, progress, currentTime, duration,
    repeat, audioError, audioLoading,
    speed, muted, speeds: SPEEDS,
    audioRef, progressRef,
    togglePlay, skip, handleProgressClick,
    setRepeat, setSpeed, setMuted,
    formatTime,
  };
}
