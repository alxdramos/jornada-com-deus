'use client';

import React, { useState } from 'react';
import { ORACOES } from '@/data/oracoes';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OracoesPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentOracao = selectedIndex !== null ? ORACOES[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">🙏 Orações Diárias</h1>
          <p className="text-white/60">Escolha uma oração para ler e ouvir</p>
          <p className="text-white/40 text-sm mt-2">Total: {ORACOES.length} orações disponíveis</p>
        </div>

        {/* Grid de Orações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ORACOES.map((oracao, index) => (
            <button
              key={oracao.id}
              onClick={() => setSelectedIndex(index)}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-blue-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/20 text-left"
            >
              {/* Número */}
              <div className="absolute top-3 right-3 bg-blue-600/30 rounded-lg px-3 py-1 text-xs text-blue-300">
                #{index + 1}
              </div>

              {/* Conteúdo */}
              <h3 className="text-lg font-bold mb-3 pr-12 group-hover:text-blue-400 transition-colors line-clamp-2">
                {oracao.titulo}
              </h3>

              <p className="text-white/60 text-sm mb-4 line-clamp-3">
                {oracao.texto.substring(0, 120)}...
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  {oracao.imagem?.background && (
                    <span className="text-xs bg-white/10 rounded px-2 py-1">🖼️ Imagem</span>
                  )}
                  {oracao.audioUrl && (
                    <span className="text-xs bg-white/10 rounded px-2 py-1">🔊 Áudio</span>
                  )}
                </div>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Detail */}
      {currentOracao && selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header Modal */}
            <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 p-6 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <p className="text-white/60 text-sm mb-2">Oração #{selectedIndex + 1} de {ORACOES.length}</p>
                <h2 className="text-2xl font-bold">{currentOracao.titulo}</h2>
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo Modal */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Imagem */}
              {currentOracao.imagem?.background && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white/10">
                  <img
                    src={`/Imagens Paisagem/${currentOracao.imagem.background}`}
                    alt={currentOracao.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Texto */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-base">
                  {currentOracao.texto}
                </p>
              </div>

              {/* Áudio */}
              {currentOracao.audioUrl && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-3 font-semibold">🔊 Ouvir Áudio:</p>
                  <audio
                    controls
                    className="w-full h-10"
                    src={currentOracao.audioUrl}
                  >
                    Seu navegador não suporta áudio
                  </audio>
                </div>
              )}
            </div>

            {/* Footer Modal - Navegação */}
            <div className="border-t border-white/10 bg-white/5 p-6 flex gap-3">
              <button
                onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                disabled={selectedIndex === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                <ChevronLeft size={20} /> Anterior
              </button>

              <button
                onClick={() => setSelectedIndex(null)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg font-semibold transition-colors"
              >
                Voltar à Lista
              </button>

              <button
                onClick={() => setSelectedIndex(Math.min(ORACOES.length - 1, selectedIndex + 1))}
                disabled={selectedIndex === ORACOES.length - 1}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                Próxima <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
