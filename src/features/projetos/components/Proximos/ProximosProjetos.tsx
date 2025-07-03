import { useTheme } from "@/shared/context/ThemeContext";
import { usePrioridadeColor } from "@/shared/hooks/usePrioridadeColor";

interface Projeto {
  Título: string;
  Grupo: string;
  Prioridade: string;
  PosicaoBacklog: number;
  [key: string]: any;
}

interface Props {
  projetos: Projeto[];
}

const filaLabel = ["Próximo:", "Segundo da fila:", "Terceiro da fila:"];

export const ProximosProjetos = ({ projetos }: Props) => {
  const { theme } = useTheme();
  const prioridadeColor = usePrioridadeColor();
  const proximos = projetos
    .filter((p) => p.Status === "Backlog Priorizado")
    .sort((a, b) => (a.PosicaoBacklog ?? 999) - (b.PosicaoBacklog ?? 999))
    .slice(0, 3);

  return (
    <div
      className="w-full rounded-2xl p-8"
      style={{ background: theme.bg.surface }}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold" style={{ color: theme.text.title }}>
          Próximos Projetos a Serem Executados
        </h2>
        <p className="text-base" style={{ color: theme.text.subtitle }}>
          Fila ordenada por prioridade no backlog
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proximos.map((p, idx) => (
          <div
            key={p.ID || idx}
            className="flex flex-row items-center p-4 rounded-lg shadow-sm h-full relative"
            style={{
              backgroundColor: theme.bg.base,
              borderLeft: `6px solid ${prioridadeColor(p.Prioridade)}`,
            }}
          >
            <div className="flex flex-col items-center mr-4 min-w-[48px]">
              <span
                className="rounded-full px-3 py-1 text-white font-bold text-base"
                style={{ background: theme.state.success }}
              >
                #{idx + 1}
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <span
                className="font-semibold text-base mb-1"
                style={{ color: theme.text.title }}
              >
                <span style={{ color: prioridadeColor(p.Prioridade) }}>
                  {filaLabel[idx]}{" "}
                </span>
                {p["Título"]}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm"
                  style={{ color: theme.text.subtitle }}
                >
                  {p["Grupo Solicitante"] || p.Grupo}
                </span>
                <span
                  className="rounded px-2 py-1 text-xs font-semibold"
                  style={{
                    background: prioridadeColor(p.Prioridade),
                    color: "#fff",
                  }}
                >
                  {p.Prioridade}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
