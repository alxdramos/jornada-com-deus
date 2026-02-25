import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço — Jornada com Deus",
  description: "Leia os termos e condições de uso do aplicativo Jornada com Deus.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#FB923C] transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 5.15-4.97 13.5 0 18 4.97-4.5 4.97-12.85 0-18z" />
              </svg>
            </div>
            <span className="font-semibold text-[#1F2937]">Jornada com Deus</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
            Termos de Serviço
          </h1>
          <p className="text-[#6B7280] text-sm">
            Última atualização: 24 de fevereiro de 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-[#374151]">

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">1. Aceitação dos termos</h2>
            <p className="leading-relaxed">
              Ao criar uma conta ou usar o aplicativo <strong>Jornada com Deus</strong> (disponível em{" "}
              <a href="https://app.minhajornadadiaria.com.br" className="text-[#FB923C] hover:underline">
                app.minhajornadadiaria.com.br
              </a>
              ), você concorda com estes Termos de Serviço e com nossa{" "}
              <Link href="/privacidade" className="text-[#FB923C] hover:underline">
                Política de Privacidade
              </Link>
              . Se não concordar com qualquer parte destes termos, não utilize o aplicativo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">2. Descrição do serviço</h2>
            <p className="leading-relaxed">
              O Jornada com Deus é um aplicativo devocional cristão gratuito que oferece:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Orações guiadas em áudio para diferentes momentos do dia.</li>
              <li>Meditações cristãs temáticas (paz, ansiedade, cura, gratidão e outros).</li>
              <li>Estudos bíblicos em áudio sobre diferentes livros e temas.</li>
              <li>Bíblia completa para leitura direta no aplicativo.</li>
              <li>Sistema de jornada diária com gamificação espiritual (streak, XP, árvore de crescimento).</li>
              <li>Sincronização de progresso entre dispositivos para usuários cadastrados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">3. Conta de usuário</h2>
            <p className="leading-relaxed">
              Para acessar funcionalidades completas (sincronização, favoritos, progresso em nuvem), você pode criar uma conta gratuita com e-mail/senha ou autenticar via Google.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Você é responsável por manter a confidencialidade da sua senha.</li>
              <li>É proibido criar contas falsas ou compartilhar credenciais de acesso.</li>
              <li>Você deve ter pelo menos 13 anos para criar uma conta.</li>
              <li>Reservamo-nos o direito de suspender contas que violem estes termos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">4. Uso adequado</h2>
            <p className="leading-relaxed mb-3">Ao usar o Jornada com Deus, você concorda em <strong>não</strong>:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usar o aplicativo para fins ilegais ou que violem direitos de terceiros.</li>
              <li>Tentar acessar dados de outros usuários.</li>
              <li>Realizar engenharia reversa, descompilar ou copiar o código do aplicativo.</li>
              <li>Interferir no funcionamento dos servidores ou da infraestrutura do app.</li>
              <li>Distribuir conteúdos do aplicativo sem autorização expressa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">5. Propriedade intelectual</h2>
            <p className="leading-relaxed">
              Todo o conteúdo disponível no aplicativo — incluindo textos, áudios de orações, meditações e estudos bíblicos, design, logotipo e código — é de propriedade do Jornada com Deus ou de seus licenciadores, e está protegido pelas leis de direitos autorais aplicáveis.
            </p>
            <p className="leading-relaxed mt-3">
              Os textos bíblicos utilizados são de domínio público (versões sem direitos autorais) ou estão licenciados para uso no aplicativo. O conteúdo é fornecido exclusivamente para uso pessoal e devocional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">6. Gratuidade e disponibilidade</h2>
            <p className="leading-relaxed">
              O aplicativo é oferecido gratuitamente. Não garantimos disponibilidade ininterrupta do serviço. Podemos realizar manutenções, atualizações ou mudanças a qualquer momento, com ou sem aviso prévio.
            </p>
            <p className="leading-relaxed mt-3">
              Funcionalidades futuras pagas (se houver) serão claramente sinalizadas, e o uso continuará sendo opcional para o usuário.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">7. Limitação de responsabilidade</h2>
            <p className="leading-relaxed">
              O Jornada com Deus é um aplicativo de apoio espiritual e devocional. <strong>Não substitui aconselhamento pastoral, psicológico, médico ou de qualquer natureza profissional.</strong>
            </p>
            <p className="leading-relaxed mt-3">
              Na máxima extensão permitida pela lei, não somos responsáveis por danos indiretos, incidentais ou consequentes decorrentes do uso (ou impossibilidade de uso) do aplicativo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">8. Exclusão de conta</h2>
            <p className="leading-relaxed">
              Você pode solicitar a exclusão da sua conta a qualquer momento pelo e-mail de contato abaixo. Após a solicitação, seus dados serão removidos dos nossos servidores em até 30 dias, conforme nossa{" "}
              <Link href="/privacidade" className="text-[#FB923C] hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">9. Alterações nos termos</h2>
            <p className="leading-relaxed">
              Podemos atualizar estes Termos de Serviço a qualquer momento. Notificaremos usuários ativos sobre mudanças relevantes por e-mail ou aviso no aplicativo. O uso continuado do aplicativo após a notificação constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">10. Lei aplicável</h2>
            <p className="leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão resolvidas no foro da comarca de domicílio do usuário, conforme o Código de Defesa do Consumidor (Lei nº 8.078/1990).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">11. Contato</h2>
            <p className="leading-relaxed">
              Dúvidas sobre estes termos? Entre em contato:
            </p>
            <div className="mt-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="font-medium text-[#1F2937]">Jornada com Deus</p>
              <p className="text-[#6B7280] text-sm mt-1">
                E-mail:{" "}
                <a href="mailto:contato@minhajornadadiaria.com.br" className="text-[#FB923C] hover:underline">
                  contato@minhajornadadiaria.com.br
                </a>
              </p>
              <p className="text-[#6B7280] text-sm">
                Site:{" "}
                <a href="https://app.minhajornadadiaria.com.br" className="text-[#FB923C] hover:underline">
                  app.minhajornadadiaria.com.br
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-[#9CA3AF]">
          <Link href="/privacidade" className="hover:text-[#FB923C] transition-colors">
            Política de Privacidade
          </Link>
          <span>·</span>
          <Link href="/login" className="hover:text-[#FB923C] transition-colors">
            Voltar ao login
          </Link>
        </div>

      </main>
    </div>
  );
}
