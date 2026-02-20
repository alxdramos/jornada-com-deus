"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Heart, Info } from "lucide-react";
import Link from "next/link";

export default function SobreBiblia() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com botão voltar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/biblia"
            className="p-2 rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </Link>
          <h1 className="text-xl font-bold text-[#1F2937]">Sobre a Bíblia</h1>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          {/* Ícone e título */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#FB923C]/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#FB923C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Almeida Revista e Corrigida</h2>
              <p className="text-sm text-[#6B7280]">Tradução Clássica Portuguesa</p>
            </div>
          </div>

          {/* Aviso legal */}
          <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6 border-l-4 border-[#FB923C]">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#FB923C] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-[#1F2937] mb-2">Aviso Legal</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  O texto bíblico apresentado é da <strong>Almeida Revista e Corrigida</strong>,
                  uma tradução clássica da Bíblia para o português que se encontra em domínio público.
                  Esta versão foi originalmente traduzida por João Ferreira de Almeida no século XVII
                  e revisada ao longo dos anos.
                </p>
              </div>
            </div>
          </div>

          {/* Fonte da API */}
          <div className="bg-[#F0F9FF] rounded-xl p-4 mb-6 border-l-4 border-[#0EA5E9]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#0EA5E9]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#0EA5E9]">API</span>
              </div>
              <div>
                <h3 className="font-medium text-[#1F2937] mb-1">Fonte dos Dados</h3>
                <p className="text-sm text-[#6B7280]">
                  Os textos bíblicos são fornecidos pela API pública{' '}
                  <a
                    href="https://bible-api.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0EA5E9] hover:underline font-medium"
                  >
                    bible-api.com
                  </a>
                  {' '}através do endpoint de tradução ACF (Almeida Corrigida Fiel).
                </p>
              </div>
            </div>
          </div>

          {/* Sobre o aplicativo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1F2937]">Sobre este Aplicativo</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Este aplicativo foi desenvolvido para aproximar pessoas da Palavra de Deus,
              oferecendo uma experiência de leitura bíblica moderna, acessível e gratuita.
              Nossa missão é facilitar o acesso à Bíblia em qualquer lugar e momento.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-[#FEF7F0] rounded-lg p-4 text-center">
                <Heart className="w-6 h-6 text-[#FB923C] mx-auto mb-2" />
                <p className="text-sm font-medium text-[#1F2937]">100% Gratuito</p>
                <p className="text-xs text-[#6B7280]">Sem anúncios ou custos ocultos</p>
              </div>

              <div className="bg-[#F0FDF4] rounded-lg p-4 text-center">
                <BookOpen className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
                <p className="text-sm font-medium text-[#1F2937]">Texto Completo</p>
                <p className="text-xs text-[#6B7280]">66 livros, 31.000+ versículos</p>
              </div>
            </div>
          </div>

          {/* Links de navegação */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
            <div className="flex gap-3">
              <Link
                href="/biblia"
                className="flex-1 bg-[#1F2937] text-white py-3 px-4 rounded-xl font-medium text-center hover:bg-[#2D3748] transition-colors"
              >
                Voltar à Bíblia
              </Link>
              <Link
                href="/"
                className="flex-1 bg-[#FB923C] text-white py-3 px-4 rounded-xl font-medium text-center hover:bg-[#EA580C] transition-colors"
              >
                Página Inicial
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Card adicional com informações técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h3 className="font-medium text-[#1F2937] mb-3">Informações Técnicas</h3>
          <div className="space-y-2 text-sm text-[#6B7280]">
            <p>• <strong>Tradução:</strong> Almeida Corrigida Fiel (ACF)</p>
            <p>• <strong>Idioma:</strong> Português Brasileiro</p>
            <p>• <strong>API:</strong> bible-api.com (gratuita e pública)</p>
            <p>• <strong>Compatibilidade:</strong> Todos os dispositivos modernos</p>
            <p>• <strong>Atualização:</strong> Textos sempre atualizados via API</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}