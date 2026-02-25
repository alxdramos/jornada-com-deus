import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Jornada com Deus",
  description: "Saiba como coletamos, usamos e protegemos seus dados no aplicativo Jornada com Deus.",
};

export default function PrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="text-[#6B7280] text-sm">
            Última atualização: 24 de fevereiro de 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-[#374151]">

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">1. Quem somos</h2>
            <p className="leading-relaxed">
              O <strong>Jornada com Deus</strong> é um aplicativo devocional cristão que ajuda você a criar um hábito diário de oração, meditação e estudo bíblico. Este documento descreve como coletamos, usamos e protegemos suas informações pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">2. Dados que coletamos</h2>
            <p className="leading-relaxed mb-3">Coletamos apenas o mínimo necessário para oferecer a experiência do aplicativo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de conta:</strong> nome, e-mail e foto de perfil (fornecidos ao criar conta com Google ou e-mail/senha).</li>
              <li><strong>Dados de progresso:</strong> streak, XP, nível, dias concluídos e datas de atividade — para personalizar sua jornada espiritual.</li>
              <li><strong>Favoritos:</strong> orações, meditações e estudos marcados como favoritos.</li>
              <li><strong>Dados técnicos:</strong> tipo de dispositivo, versão do sistema operacional e erros de aplicativo — apenas para fins de diagnóstico e melhoria do serviço.</li>
            </ul>
            <p className="leading-relaxed mt-3">
              <strong>Não coletamos</strong> localização, contatos, microfone, câmera nem qualquer dado sensível além dos listados acima.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criar e gerenciar sua conta no aplicativo.</li>
              <li>Sincronizar seu progresso entre dispositivos.</li>
              <li>Personalizar conteúdos com base nas suas preferências e histórico.</li>
              <li>Enviar notificações de lembretes devocionais (somente se você autorizar).</li>
              <li>Melhorar continuamente o aplicativo com base em dados anônimos de uso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">4. Compartilhamento de dados</h2>
            <p className="leading-relaxed">
              Seus dados <strong>não são vendidos</strong> a terceiros. Utilizamos os seguintes serviços de infraestrutura, que processam seus dados em nosso nome:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Supabase</strong> — banco de dados seguro e autenticação (servidores na região configurada pelo desenvolvedor).</li>
              <li><strong>Vercel</strong> — hospedagem do aplicativo.</li>
              <li><strong>Cloudflare R2</strong> — armazenamento de áudios e conteúdos do app.</li>
              <li><strong>Google OAuth</strong> — autenticação opcional via conta Google (somente se você escolher este método).</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Todos esses provedores possuem políticas de privacidade próprias e estão em conformidade com as leis aplicáveis de proteção de dados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">5. Armazenamento e segurança</h2>
            <p className="leading-relaxed">
              Seus dados são armazenados com criptografia em repouso e em trânsito (HTTPS/TLS). O acesso é protegido por políticas de segurança em nível de linha (Row Level Security), garantindo que cada usuário acesse apenas seus próprios dados.
            </p>
            <p className="leading-relaxed mt-3">
              Dados de progresso também ficam armazenados localmente no seu dispositivo (offline-first), permitindo o uso do app mesmo sem conexão com a internet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">6. Retenção de dados</h2>
            <p className="leading-relaxed">
              Mantemos seus dados enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, seus dados pessoais serão removidos dos nossos sistemas em até <strong>30 dias</strong>, salvo obrigação legal de retenção.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">7. Seus direitos (LGPD)</h2>
            <p className="leading-relaxed mb-3">Como titular dos seus dados, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar os dados que mantemos sobre você.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Solicitar a portabilidade dos seus dados.</li>
              <li>Solicitar a exclusão completa da conta.</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Para exercer qualquer direito, entre em contato conosco pelo e-mail abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">8. Menores de idade</h2>
            <p className="leading-relaxed">
              O aplicativo não é direcionado a menores de 13 anos. Não coletamos conscientemente dados de crianças. Caso identificarmos dados de menor sem consentimento dos responsáveis, procederemos à exclusão imediata.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">9. Alterações nesta política</h2>
            <p className="leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Quando houver alterações relevantes, notificaremos você por e-mail ou por aviso no aplicativo. A data de "última atualização" no topo deste documento sempre indicará a versão vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1F2937] mb-3">10. Contato</h2>
            <p className="leading-relaxed">
              Dúvidas, solicitações ou reclamações sobre privacidade? Entre em contato:
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
          <Link href="/termos" className="hover:text-[#FB923C] transition-colors">
            Termos de Serviço
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
