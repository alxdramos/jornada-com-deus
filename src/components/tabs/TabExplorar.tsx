'use client';

import { UserHeader } from '@/components/layout/UserHeader';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useTabStore } from '@/stores/tabStore';
import { BookOpen, Bird, Music, Book, ChevronRight } from 'lucide-react';
import { MEDITACOES } from '@/data/meditacoes';
import { ORACOES } from '@/data/oracoes';
import { ESTUDOS } from '@/data/estudos';

interface HubSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
  onNavigate: () => void;
  preview?: { label: string }[];
}

function HubSection({ icon, title, subtitle, count, color, bgColor, borderColor, onNavigate, preview }: HubSectionProps) {
  return (
    <div
      className={`rounded-2xl border ${borderColor} ${bgColor} p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]`}
      onClick={onNavigate}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-white border ${borderColor} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-[#1F2937] text-base">{title}</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">{count} disponíveis</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${color}`}>
          <span>Ver tudo</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">{subtitle}</p>

      {preview && preview.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {preview.slice(0, 3).map((item, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 rounded-full border ${borderColor} ${color} bg-white/60 truncate max-w-[140px]`}
            >
              {item.label}
            </span>
          ))}
          {count > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-[#9CA3AF] border border-gray-100">
              +{count - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function TabExplorar() {
  const setActiveTab = useTabStore((s) => s.setActiveTab);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const meditacoesPreview = MEDITACOES.slice(0, 3).map(m => ({ label: m.title }));
  const oracoesPreview = ORACOES.slice(0, 3).map(o => ({ label: o.titulo }));
  const estudosPreview = ESTUDOS.slice(0, 3).map(e => ({ label: e.shortTitle }));

  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Descobrir" />

        <SearchBar
          placeholder="Orações, Estudos, Meditações e mais"
          onSearch={handleSearch}
          fullWidth
        />

        <h2 className="text-text-primary text-xl font-bold pt-2">Explorar conteúdo</h2>

        <div className="space-y-4">
          <HubSection
            icon={<Music className="w-5 h-5 text-purple-600" />}
            title="Meditações"
            subtitle="Meditações guiadas para acalmar a mente e fortalecer o espírito"
            count={MEDITACOES.length}
            color="text-purple-600"
            bgColor="bg-purple-50"
            borderColor="border-purple-100"
            onNavigate={() => setActiveTab('meditacoes')}
            preview={meditacoesPreview}
          />

          <HubSection
            icon={<Bird className="w-5 h-5 text-green-600" />}
            title="Orações"
            subtitle="Orações para cada momento da sua jornada com Deus"
            count={ORACOES.length}
            color="text-green-600"
            bgColor="bg-green-50"
            borderColor="border-green-100"
            onNavigate={() => setActiveTab('oracoes')}
            preview={oracoesPreview}
          />

          <HubSection
            icon={<BookOpen className="w-5 h-5 text-amber-600" />}
            title="Estudos Bíblicos"
            subtitle="Estudos em áudio para aprofundar sua compreensão da Palavra"
            count={ESTUDOS.length}
            color="text-amber-600"
            bgColor="bg-amber-50"
            borderColor="border-amber-100"
            onNavigate={() => setActiveTab('estudos')}
            preview={estudosPreview}
          />

          <HubSection
            icon={<Book className="w-5 h-5 text-blue-600" />}
            title="Bíblia"
            subtitle="Leia a Bíblia completa por livros, capítulos e versículos"
            count={66}
            color="text-blue-600"
            bgColor="bg-blue-50"
            borderColor="border-blue-100"
            onNavigate={() => setActiveTab('biblia')}
          />
        </div>
      </div>
    </div>
  );
}
