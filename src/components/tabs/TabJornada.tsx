'use client';

import { UserHeader } from '@/components/layout/UserHeader';
import { JourneyDashboard } from '@/components/gamification/JourneyDashboard';
import { Sparkles } from 'lucide-react';

export function TabJornada() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 p-6 pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserHeader
          title="Minha Jornada"
          rightElement={
            <div className="w-10 h-10 rounded-full bg-yellow-300/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          }
        />

        <JourneyDashboard />
      </div>
    </div>
  );
}
