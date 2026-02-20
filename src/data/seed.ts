import { db, JournalEntry } from '@/lib/db';

export async function seedDatabase() {
  try {
    console.log('🌱 Populando banco de dados com dados iniciais...');

    // Seed de Devotionals
    const devotionalsData = [
      // Mente & Ansiedade
      {
        title: "Superando a Ansiedade",
        duration: 15,
        category: "Mente",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Encontre paz na presença de Deus diante da ansiedade",
        createdAt: new Date('2024-01-01'),
      },
      {
        title: "Mente Renovada",
        duration: 20,
        category: "Mente",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center",
        description: "Renove sua mente através da Palavra de Deus",
        createdAt: new Date('2024-01-02'),
      },
      {
        title: "Paz Interior Profunda",
        duration: 25,
        category: "Ansiedade",
        isPlus: true,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Descubra a paz que excede todo entendimento",
        createdAt: new Date('2024-01-03'),
      },

      // Música & Adoração
      {
        title: "Adoração em Espírito",
        duration: 18,
        category: "Música",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
        description: "Adore a Deus em espírito e em verdade",
        createdAt: new Date('2024-01-04'),
      },
      {
        title: "Salmo 23 - O Bom Pastor",
        duration: 12,
        category: "Música",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Medite no Salmo 23 com música suave",
        createdAt: new Date('2024-01-05'),
      },

      // Estudos & Bíblia
      {
        title: "Deus é Fiel",
        duration: 22,
        category: "Estudos",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center",
        description: "Estude a fidelidade de Deus através das Escrituras",
        createdAt: new Date('2024-01-06'),
      },
      {
        title: "Amor de Deus",
        duration: 30,
        category: "Estudos",
        isPlus: true,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
        description: "Explore a profundidade do amor divino",
        createdAt: new Date('2024-01-07'),
      },

      // Dormir & Descanso
      {
        title: "Durma na Presença de Deus",
        duration: 35,
        category: "Dormir",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b1cf68?w=400&h=300&fit=crop&crop=center",
        description: "Prepare-se para uma noite de descanso espiritual",
        createdAt: new Date('2024-01-08'),
      },
      {
        title: "Noites de Paz",
        duration: 40,
        category: "Dormir",
        isPlus: true,
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&crop=center",
        description: "Experiência premium de sono com Deus",
        createdAt: new Date('2024-01-09'),
      },

      // Orações rápidas
      {
        title: "Oração da Manhã",
        duration: 5,
        category: "Oração",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Comece seu dia com Deus",
        createdAt: new Date('2024-01-10'),
      },
      {
        title: "Agradecimento",
        duration: 8,
        category: "Oração",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Ore com gratidão pelo dia",
        createdAt: new Date('2024-01-11'),
      },
      {
        title: "Paz Interior",
        duration: 10,
        category: "Ansiedade",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Encontre paz em momentos de angústia",
        createdAt: new Date('2024-01-12'),
      },
      {
        title: "Força Diária",
        duration: 12,
        category: "Motivação",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Ganhe força para enfrentar o dia",
        createdAt: new Date('2024-01-13'),
      },
      {
        title: "Perdão e Cura",
        duration: 15,
        category: "Cura",
        isPlus: false,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        description: "Ore por perdão e cura espiritual",
        createdAt: new Date('2024-01-14'),
      },
      {
        title: "Família e Relacionamentos",
        duration: 18,
        category: "Relacionamentos",
        isPlus: true,
        imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&crop=center",
        description: "Ore por sua família e relacionamentos",
        createdAt: new Date('2024-01-15'),
      },
    ];

    await db.devotionals.bulkAdd(devotionalsData);
    console.log(`✅ Adicionados ${devotionalsData.length} devotionals`);

    // Seed de Orações
    const prayersData = [
      {
        title: "Oração da Manhã",
        text: "Senhor, obrigado por este novo dia. Guia meus passos e dá-me sabedoria para tomar as decisões certas hoje. Ajuda-me a ser uma bênção para aqueles ao meu redor. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-01'),
        userId: 1,
      },
      {
        title: "Agradecimento pela Família",
        text: "Pai celestial, obrigado pela minha família. Protege cada um deles hoje e fortalece nossos laços de amor. Dá-nos paz e harmonia em nosso lar. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-02'),
        userId: 1,
      },
      {
        title: "Paz Interior",
        text: "Deus de paz, acalma meu coração ansioso. Lembra-me de que Tu estás no controle de todas as coisas. Dá-me paz que excede todo entendimento. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-03'),
        userId: 1,
      },
      {
        title: "Sabedoria Diária",
        text: "Pai, concede-me sabedoria para entender Teus caminhos e discernimento para tomar decisões sábias em todas as áreas da minha vida. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-04'),
        userId: 1,
      },
      {
        title: "Proteção",
        text: "Senhor, protege-me e minha família de todo mal. Cobre-nos com Tuas asas e dá-nos segurança em Teus braços amorosos. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-05'),
        userId: 1,
      },
      {
        title: "Força e Coragem",
        text: "Deus Todo-Poderoso, dá-me força para enfrentar os desafios de hoje e coragem para superar meus medos. Tu és minha fortaleza. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-06'),
        userId: 1,
      },
      {
        title: "Cura e Restauração",
        text: "Pai de misericórdia, toca em meu corpo e espírito. Cura minhas feridas e restaura minha alma. Confio em Teu poder de cura. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-07'),
        userId: 1,
      },
      {
        title: "Oração pela Igreja",
        text: "Senhor, abençoa Tua igreja e todos os servos fiéis. Dá-lhes unidade, amor e poder para proclamar o evangelho. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-08'),
        userId: 1,
      },
      {
        title: "Perdão",
        text: "Deus de perdão, perdoa meus pecados e ajuda-me a perdoar aqueles que me ofenderam. Purifica meu coração e renova meu espírito. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-09'),
        userId: 1,
      },
      {
        title: "Oração da Noite",
        text: "Pai celestial, obrigado por este dia. Abençoa meu descanso e prepara-me para um novo amanhã. Vigia meu sono e dá-me paz. Amém.",
        isPersonal: false,
        answered: false,
        createdAt: new Date('2024-01-10'),
        userId: 1,
      },
    ];

    await db.prayers.bulkAdd(prayersData);
    console.log(`✅ Adicionadas ${prayersData.length} orações`);

    // Seed de entradas do diário (algumas de exemplo)
    const journalData: JournalEntry[] = [
      {
        type: 'anotacao' as const,
        content: 'Hoje senti profundamente a presença de Deus durante minha oração da manhã. Foi um momento especial de conexão.',
        date: new Date('2024-01-15'),
        favorite: true,
        userId: 1,
      },
      {
        type: 'destaque' as const,
        content: '"O Senhor é meu pastor, nada me faltará." - Salmos 23:1',
        date: new Date('2024-01-14'),
        favorite: true,
        userId: 1,
      },
      {
        type: 'citacao' as const,
        content: 'Refletindo sobre a fidelidade de Deus. Mesmo nos momentos difíceis, Ele sempre esteve ao meu lado.',
        date: new Date('2024-01-13'),
        favorite: false,
        userId: 1,
      },
    ];

    await db.journalEntries.bulkAdd(journalData);
    console.log(`✅ Adicionadas ${journalData.length} entradas no diário`);

    console.log('🎉 Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}