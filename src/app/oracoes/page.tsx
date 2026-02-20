'use client';

import React, { useEffect, useState } from 'react';
import { Search, Home } from 'lucide-react';
import Link from 'next/link';
import OracaoCard from '@/components/OracaoCard';
import useOracaoStore from '@/stores/oracaoStore';
import { Oracao } from '@/data/oracoes';

export default function OracoesPage() {
  const {
    loadOracoes,
    oracoes,
    currentOracao,
    filteredOracoes,
    setCurrentOracao,
    searchOracoes,
    searchQuery,
    getNextOracao,
    getPreviousOracao,
  } = useOracaoStore();

  const [view, setView] = useState<'card' | 'list'>('card');
  const [mounted, setMounted] = useState(false);

  // Load oracoes on mount
  useEffect(() => {
    loadOracoes();
    setMounted(true);
  }, [loadOracoes]);

  // Set first oracao on load
  useEffect(() => {
    if (mounted && oracoes.length > 0 && !currentOracao) {
      setCurrentOracao(oracoes[0]);
    }
  }, [mounted, oracoes, currentOracao, setCurrentOracao]);

  if (!mounted || !currentOracao) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <div className="mb-4 animate-spin">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-blue-500 rounded-full" />
          </div>
          <p>Carregando orações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {view === 'card' ? (
        <>
          {/* Card View */}
          <OracaoCard
            oracao={currentOracao}
            onNext={() => {
              const next = getNextOracao();
              if (next) setCurrentOracao(next);
            }}
            onPrevious={() => {
              const prev = getPreviousOracao();
              if (prev) setCurrentOracao(prev);
            }}
          />

          {/* Bottom Controls */}
          <div className="fixed bottom-6 left-6 right-6 z-20 flex gap-2">
            <Link
              href="/"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Home size={20} />
            </Link>
            <button
              onClick={() => setView('list')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Ver Lista
            </button>
          </div>
        </>
      ) : (
        <>
          {/* List View */}
          <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">Orações Diárias</h1>
              <button
                onClick={() => setView('card')}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Voltar
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-3 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar oração..."
                value={searchQuery}
                onChange={(e) => searchOracoes(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-white/40 transition-colors"
              />
            </div>

            {/* Results info */}
            <p className="text-white/60 mb-4">
              {filteredOracoes.length} oração(ões) encontrada(s)
            </p>

            {/* List */}
            <div className="space-y-3">
              {filteredOracoes.length > 0 ? (
                filteredOracoes.map((oracao) => (
                  <button
                    key={oracao.id}
                    onClick={() => {
                      setCurrentOracao(oracao);
                      setView('card');
                    }}
                    className={`w-full p-4 rounded-lg text-left transition-all transform hover:scale-105 ${
                      currentOracao.id === oracao.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <h3 className="font-semibold mb-1">{oracao.titulo}</h3>
                    <p className="text-white/60 text-sm truncate">
                      {oracao.texto.substring(0, 80)}...
                    </p>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  <p>Nenhuma oração encontrada</p>
                  <button
                    onClick={() => searchOracoes('')}
                    className="text-blue-400 hover:text-blue-300 mt-2 text-sm"
                  >
                    Limpar busca
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
