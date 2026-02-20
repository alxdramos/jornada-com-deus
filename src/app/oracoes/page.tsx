'use client';

import React, { useEffect, useState } from 'react';
import { ORACOES } from '@/data/oracoes';

export default function OracoesPage() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  const oracao = ORACOES[currentIndex];

  if (!oracao) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Nenhuma oração disponível</p>
          <p className="text-white/60">Total de orações: {ORACOES.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{oracao.titulo}</h1>
          <p className="text-white/60">{currentIndex + 1} de {ORACOES.length}</p>
        </div>

        {/* Imagem (se disponível) */}
        {oracao.imagem?.background && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-white/10">
            <img
              src={`/Imagens Paisagem/${oracao.imagem.background}`}
              alt={oracao.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Texto */}
        <div className="bg-white/5 rounded-lg p-6 max-h-96 overflow-y-auto border border-white/10">
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {oracao.texto}
          </p>
        </div>

        {/* Áudio */}
        {oracao.audioUrl && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-white/60 text-sm mb-3">Ouvir Áudio:</p>
            <audio
              controls
              className="w-full"
              src={oracao.audioUrl}
            >
              Seu navegador não suporta áudio
            </audio>
          </div>
        )}

        {/* Navegação */}
        <div className="flex gap-3 justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(ORACOES.length - 1, currentIndex + 1))}
            disabled={currentIndex === ORACOES.length - 1}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            Próxima →
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-white/40 text-xs">
          <p>Total de orações: {ORACOES.length}</p>
        </div>
      </div>
    </div>
  );
}
