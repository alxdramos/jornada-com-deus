"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { seedDatabase } from '@/data/seed';

export function useDB() {
  const [isReady, setIsReady] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        console.log('🔄 Inicializando banco de dados...');

        // Verificar se já foi feito seed antes (usando localStorage)
        const hasSeeded = localStorage.getItem('jornada_db_seeded');

        // Abrir conexão com o banco
        await db.open();
        console.log('✅ Conexão com banco estabelecida');

        // Verificar se já temos dados
        let devotionalsCount = 0;
        let prayersCount = 0;

        try {
          devotionalsCount = await db.devotionals.count();
          prayersCount = await db.prayers.count();
        } catch (countError) {
          console.warn('⚠️ Erro ao contar registros, prosseguindo:', countError);
        }

        // Se estiver vazio E não foi feito seed antes, fazer seed
        if ((devotionalsCount === 0 || prayersCount === 0) && !hasSeeded) {
          console.log('🌱 Fazendo seed inicial...');
          setIsSeeding(true);

          try {
            await seedDatabase();
            localStorage.setItem('jornada_db_seeded', 'true');
            console.log('✅ Seed concluído');
          } catch (seedError) {
            console.error('❌ Erro no seed:', seedError);
            // Mesmo com erro no seed, continuar
          }

          setIsSeeding(false);
        } else {
          console.log('ℹ️ Dados já existem ou seed já foi feito');
        }

        setIsReady(true);
        console.log('✅ Banco de dados pronto para uso');

      } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);

        // Mesmo com erro, marcar como pronto para não travar a UI
        setIsReady(true);
        console.log('⚠️ Continuando com dados de teste devido a erro no banco');
      }
    };

    // Pequeno delay para garantir que a página renderize primeiro
    const timer = setTimeout(initializeDB, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      // Dexie handles connection cleanup automatically
    };
  }, []);

  return {
    db,
    isReady,
    isSeeding,
  };
}