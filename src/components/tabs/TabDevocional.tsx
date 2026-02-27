'use client';

import { BookHeart } from 'lucide-react';
import { UserHeader } from '@/components/layout/UserHeader';

export function TabDevocional() {
  return (
    <div className="min-h-screen bg-bg-primary p-6 pb-36">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader title="Devocional" />
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <BookHeart className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Devocionais</h2>
          <p className="text-sm text-[#6B7280] max-w-xs">
            Reflexões diárias para nutrir sua fé. Em breve disponível!
          </p>
        </div>
      </div>
    </div>
  );
}
