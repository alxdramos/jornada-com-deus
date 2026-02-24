'use client';

import { Baby } from 'lucide-react';
import { UserHeader } from '@/components/layout/UserHeader';

export function TabKids() {
  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Kids" />
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <Baby className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Kids</h2>
          <p className="text-sm text-[#6B7280] max-w-xs">
            Conteúdo especial para as crianças crescerem na fé. Em breve disponível!
          </p>
        </div>
      </div>
    </div>
  );
}
