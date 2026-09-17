import React from "react";
import { Calendar, Mail, Users, ListTodo, HardDrive } from "lucide-react";

const integrations = [
  {
    icon: Calendar,
    name: "Google Agenda",
    desc: "A IA agenda, reorganiza e lembra dos seus compromissos.",
  },
  {
    icon: Mail,
    name: "Gmail",
    desc: "Resuma, redija e responda e-mails com o modelo ideal.",
  },
  {
    icon: Users,
    name: "Contatos",
    desc: "Enriqueça sua base e mantenha tudo atualizado.",
  },
  {
    icon: ListTodo,
    name: "Tarefas",
    desc: "Crie e priorize tarefas a partir das suas conversas.",
  },
  {
    icon: HardDrive,
    name: "Drive",
    desc: "Busque e analise documentos sem sair do chat.",
  },
];

export default function IntegrationsSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA] border-y border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#8878c3] uppercase">
            Conectores Google
          </span>
          <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1]">
            <span className="text-gray-900">Suas ferramentas Google,</span>
            <br />
            <span className="text-[#7b61ff]">operadas pela IA.</span>
          </h2>
          <p className="mt-5 text-sm text-[#666666] leading-relaxed">
            Ao conectar sua conta Google, a Zyntra acessa somente os dados
            necessários para executar o que você pede no chat. Você autoriza
            cada permissão na tela de consentimento do Google e pode revogar o
            acesso quando quiser.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {integrations.map((it) => (
            <div
              key={it.name}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-50 group-hover:bg-violet-600 flex items-center justify-center mb-4 transition-colors">
                <it.icon className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {it.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <p className="text-sm text-[#555555] leading-relaxed">
            Os dados recebidos das APIs do Google seguem a Política de Dados do
            Usuário dos Serviços de API do Google, incluindo os requisitos de
            Uso Limitado. Não são vendidos, não são usados para publicidade nem
            para treinar modelos de IA.
          </p>
          <a
            href="#"
            className="inline-block mt-3 text-sm font-medium text-[#7E57C2] hover:underline"
          >
            Ler a Política de Privacidade
          </a>
        </div>
      </div>
    </section>
  );
}