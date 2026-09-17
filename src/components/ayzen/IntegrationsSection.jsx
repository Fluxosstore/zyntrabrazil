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
          <span className="text-xs font-semibold tracking-widest text-violet-600 uppercase">
            Integrações
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Suas ferramentas Google, operadas pela IA.
          </h2>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Conecte seu ecossistema Google e deixe a Zyntra trabalhar por você.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {integrations.map((it) => (
            <div
              key={it.name}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-violet-50 flex items-center justify-center mb-4 transition-colors">
                <it.icon className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {it.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}