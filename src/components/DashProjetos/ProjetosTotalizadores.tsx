import React, { useEffect, useState } from "react";
import {
  CardsIcon,
  LightbulbIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  FireIcon,
  CompassIcon,
  EpicIcon,
} from "../icons/DashboardIcons";
import { EspacoDeProjetos } from "../../types/Typesjira";
import { getTotalizadoresConfig } from "../../constants/styleConfig";
import {
  themeColors,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getPriorityConfig,
} from "../../utils/themeColors";

type TipoFiltroStatus = "projeto" | "status" | "";

interface ProjetosTotalizadoresProps {
  filteredData: EspacoDeProjetos[];
  originalData: EspacoDeProjetos[];
  onStatusPrazoClick?: (status: string) => void;
  filtroStatusPrazoAtivo?: string | null;
  onEntreguesMesClick?: () => void;
  filtroEntreguesMesAtivo?: boolean;
  tipoFiltroStatus?: "projeto" | "status" | "";
}

// Função para converter CSS rem para pixels
const remToPx = (rem: string): number => {
  const remValue = parseFloat(rem.replace("rem", ""));
  return Math.round(remValue * 16); // 1rem = 16px
};

const TotalizadorCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  currentTheme: "light" | "dark";
  tooltipContent?: React.ReactNode;
  valueColor?: string;
  onClickValue?: () => void;
  clickable?: boolean;
  isFiltered?: boolean;
}> = ({
  icon,
  label,
  value,
  currentTheme,
  tooltipContent,
  valueColor,
  onClickValue,
  clickable,
  isFiltered = false,
}) => {
  const config = getTotalizadoresConfig();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`rounded-lg shadow-md ${config.padding} flex-grow ${
        config.altura
      } relative totalizador-card 2xl:flex-1 2xl:min-w-0 ${
        clickable
          ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
          : ""
      }`}
      style={{
        backgroundColor: getBackgroundColor("card", currentTheme),
        border: isFiltered ? `2px solid ${themeColors.info[400]}` : undefined,
        transition: "border-color 0.2s ease-in-out",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={clickable ? onClickValue : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
      aria-label={clickable ? `Filtrar por ${label}` : undefined}
    >
      <div className="flex items-start gap-4 min-h-[56px]">
        <div
          className="flex-shrink-0 totalizador-icon flex items-center justify-center h-full -mt-1"
          style={{ position: "relative" }}
        >
          {icon}
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p
            className={`font-semibold break-words leading-tight ${config.label}`}
            style={{ color: getTextColor("primary", currentTheme) }}
          >
            {label}
          </p>
          <p
            className={`font-bold mt-1 ${config.valor}`}
            style={{
              color: valueColor || getTextColor("primary", currentTheme),
            }}
          >
            {value}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && tooltipContent && (
        <div
          className="absolute z-[9999] p-3 rounded-lg shadow-lg border max-w-xs"
          style={{
            backgroundColor: getBackgroundColor("card", currentTheme),
            border: `1px solid ${getBorderColor("primary", currentTheme)}`,
            color: getTextColor("primary", currentTheme),
            top: "calc(80%)",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "250px",
          }}
        >
          {tooltipContent}
          {/* Seta do tooltip */}
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent"
            style={{
              borderBottomColor: getBackgroundColor("card", currentTheme),
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

const ProjetosTotalizadores: React.FC<ProjetosTotalizadoresProps> = ({
  filteredData,
  originalData,
  onStatusPrazoClick,
  filtroStatusPrazoAtivo,
  onEntreguesMesClick,
  filtroEntreguesMesAtivo,
  tipoFiltroStatus = "",
}) => {
  const config = getTotalizadoresConfig();

  // Hook para detectar o tema atual
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
    "light"
  );

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Métricas Chave
  const total = filteredData.length; // Total no Board: dados filtrados (acompanha filtros)
  const totalIdeacao = filteredData.filter(
    (p) => p.Status === "Ideação"
  ).length;

  // Projetos em Desenvolvimento: apenas os status Em Desenvolvimento, Em Homologação e Operação Assistida
  const projetosEmAndamento = filteredData.filter((p) =>
    ["Em Desenvolvimento", "Em Homologação", "Operação Assistida"].includes(
      p.Status
    )
  );
  const totalEmAndamento = projetosEmAndamento.length;

  // Métricas do Backlog Priorizado
  const backlogPriorizado = filteredData.filter(
    (p) => p.Status === "Backlog Priorizado"
  );
  const totalBacklogPriorizado = backlogPriorizado.length;

  // Métricas de Projetos Entregues no Mês
  const projetosEntregues = filteredData.filter((p) => p.Status === "Entregue");
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const projetosEntreguesNoMes = projetosEntregues.filter((p) => {
    if (!p["Data de término"]) return false;
    const dataTermino = new Date(p["Data de término"]);
    return (
      dataTermino.getMonth() === mesAtual &&
      dataTermino.getFullYear() === anoAtual
    );
  });
  const totalEntreguesNoMes = projetosEntreguesNoMes.length;

  // Função para calcular métricas baseada no tipo de filtro
  const calcularMetricasStatus = (tipo: TipoFiltroStatus) => {
    let projetosNoPrazo = 0;
    let projetosEmRisco = 0;
    let projetosForaDoPrazo = 0;

    // Calcular métricas de projeto (sempre dos dados originais)
    const projetosNoPrazoProjeto = originalData.filter(
      (p: EspacoDeProjetos) => p["Status de prazo"] === "No prazo"
    ).length;
    const projetosEmRiscoProjeto = originalData.filter(
      (p: EspacoDeProjetos) => p["Status de prazo"] === "Em risco"
    ).length;
    const projetosForaDoPrazoProjeto = originalData.filter(
      (p: EspacoDeProjetos) => p["Status de prazo"] === "Atrasado"
    ).length;

    // Calcular métricas de status (sempre dos dados originais)
    const projetosNoPrazoStatus = originalData.filter(
      (p: EspacoDeProjetos) => p["Status da fase atual"] === "No prazo"
    ).length;
    const projetosEmRiscoStatus = originalData.filter(
      (p: EspacoDeProjetos) => p["Status da fase atual"] === "Em risco"
    ).length;
    const projetosForaDoPrazoStatus = originalData.filter(
      (p: EspacoDeProjetos) => p["Status da fase atual"] === "Atrasado"
    ).length;

    switch (tipo) {
      case "projeto":
        // Quando filtro por projeto, mostrar apenas os valores de projeto
        projetosNoPrazo = projetosNoPrazoProjeto;
        projetosEmRisco = projetosEmRiscoProjeto;
        projetosForaDoPrazo = projetosForaDoPrazoProjeto;
        break;

      case "status":
        // Quando filtro por status, mostrar apenas os valores de status
        projetosNoPrazo = projetosNoPrazoStatus;
        projetosEmRisco = projetosEmRiscoStatus;
        projetosForaDoPrazo = projetosForaDoPrazoStatus;
        break;
      case "":
        // Quando não há filtro, mostrar a soma individual de cada tipo
        projetosNoPrazo = projetosNoPrazoProjeto + projetosNoPrazoStatus;
        projetosEmRisco = projetosEmRiscoProjeto + projetosEmRiscoStatus;
        projetosForaDoPrazo =
          projetosForaDoPrazoProjeto + projetosForaDoPrazoStatus;
        break;
    }

    return {
      projetosNoPrazo,
      projetosEmRisco,
      projetosForaDoPrazo,
    };
  };

  // Calcular métricas baseada no tipo de filtro selecionado
  const { projetosNoPrazo, projetosEmRisco, projetosForaDoPrazo } =
    calcularMetricasStatus(tipoFiltroStatus);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 w-full mb-20">
      <TotalizadorCard
        icon={
          <CardsIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.total.icon,
            }}
          />
        }
        label="Total de Projetos no Board"
        value={total}
        currentTheme={currentTheme}
        tooltipContent={
          <div className="text-xs max-w-xs">
            <div style={{ color: getTextColor("secondary", currentTheme) }}>
              Total de projetos registrados no board, considerando todos os
              status
            </div>
          </div>
        }
      />
      <TotalizadorCard
        icon={
          <LightbulbIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.ideacao.icon,
            }}
          />
        }
        label="Projetos em Ideação"
        value={totalIdeacao}
        currentTheme={currentTheme}
        tooltipContent={
          <div className="text-xs max-w-xs">
            <div style={{ color: getTextColor("secondary", currentTheme) }}>
              Projetos que estão na etapa inicial, em análise ou validação antes
              de serem priorizados para execução
            </div>
          </div>
        }
      />

      <TotalizadorCard
        icon={
          <ClockIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color:
                themeColors.components.totalizadores.backlogPriorizado.icon,
            }}
          />
        }
        label="Projetos no Backlog Priorizado"
        value={totalBacklogPriorizado}
        currentTheme={currentTheme}
        tooltipContent={
          <div className="text-xs max-w-xs">
            <div style={{ color: getTextColor("secondary", currentTheme) }}>
              Projetos que já foram analisados e priorizados, prontos para serem
              executados.
            </div>
          </div>
        }
      />

      <TotalizadorCard
        icon={
          <EpicIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.projetos.icon,
            }}
          />
        }
        label="Projetos em Desenvolvimento"
        value={totalEmAndamento}
        currentTheme={currentTheme}
        tooltipContent={
          <div className="text-xs max-w-xs">
            <div style={{ color: getTextColor("secondary", currentTheme) }}>
              Projetos que estão ativamente sendo desenvolvidos: Em
              desenvolvimento, em homologação e em operação assistida.
            </div>
          </div>
        }
      />

      <TotalizadorCard
        icon={
          <CompassIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.total.icon,
            }}
          />
        }
        label={
          tipoFiltroStatus === "projeto"
            ? "Projetos No Prazo"
            : tipoFiltroStatus === "status"
            ? "Status No Prazo"
            : "No Prazo"
        }
        value={projetosNoPrazo}
        currentTheme={currentTheme}
        valueColor={themeColors.status.prazo.noPrazo.text[currentTheme]}
        onClickValue={
          onStatusPrazoClick ? () => onStatusPrazoClick("No prazo") : undefined
        }
        clickable={!!onStatusPrazoClick}
        isFiltered={filtroStatusPrazoAtivo === "No prazo"}
      />
      <TotalizadorCard
        icon={
          <ExclamationTriangleIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.total.icon,
            }}
          />
        }
        label={
          tipoFiltroStatus === "projeto"
            ? "Projetos Em Risco"
            : tipoFiltroStatus === "status"
            ? "Status Em Risco"
            : "Em Risco"
        }
        value={projetosEmRisco}
        currentTheme={currentTheme}
        valueColor={themeColors.status.prazo.emRisco.bg[currentTheme]}
        onClickValue={
          onStatusPrazoClick ? () => onStatusPrazoClick("Em risco") : undefined
        }
        clickable={!!onStatusPrazoClick}
        isFiltered={filtroStatusPrazoAtivo === "Em risco"}
      />
      <TotalizadorCard
        icon={
          <FireIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.total.icon,
            }}
          />
        }
        label={
          tipoFiltroStatus === "projeto"
            ? "Projetos Atrasados"
            : tipoFiltroStatus === "status"
            ? "Status Atrasados"
            : "Atrasados"
        }
        value={projetosForaDoPrazo}
        currentTheme={currentTheme}
        valueColor={themeColors.status.prazo.foraPrazo.text[currentTheme]}
        onClickValue={
          onStatusPrazoClick ? () => onStatusPrazoClick("Atrasado") : undefined
        }
        clickable={!!onStatusPrazoClick}
        isFiltered={filtroStatusPrazoAtivo === "Atrasado"}
      />

      <TotalizadorCard
        icon={
          <CalendarIcon
            size={remToPx(config.icone)}
            className="text-current flex-shrink-0"
            style={{
              color: themeColors.components.totalizadores.total.icon,
            }}
          />
        }
        label="Projetos Entregues no Mês"
        value={totalEntreguesNoMes}
        currentTheme={currentTheme}
        onClickValue={onEntreguesMesClick}
        clickable={!!onEntreguesMesClick}
        isFiltered={filtroEntreguesMesAtivo}
      />
    </div>
  );
};

export default ProjetosTotalizadores;
