import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { getPriorityConfig } from "../../../utils/themeColors";

interface CustomTooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  priority?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  children,
  priority,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const { theme } = useTheme();
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Obtém a cor da prioridade
  const priorityConfig = priority ? getPriorityConfig(priority) : null;
  const priorityColor =
    priorityConfig?.hex || (theme === "dark" ? "#10b981" : "#3b82f6");

  if (
    !content ||
    (typeof content === "string" && content === "Sem descrição disponível")
  ) {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 300; // Largura máxima do tooltip
    const padding = 16; // Espaçamento da borda da tela

    // Calcular posição horizontal
    let left = rect.right - 100; // Posição padrão à direita

    // Verificar se o tooltip vai sair da tela pela direita
    if (left + tooltipWidth + padding > window.innerWidth) {
      // Se sair pela direita, posicionar à esquerda do elemento
      left = rect.left - tooltipWidth + 190;

      // Se ainda sair pela esquerda, centralizar na tela
      if (left < padding) {
        left = Math.max(padding, (window.innerWidth - tooltipWidth) / 2);
      }
    }

    // Calcular posição vertical
    let top = rect.top;
    const tooltipHeight = 150; // Altura estimada do tooltip

    // Verificar se o tooltip vai sair da tela por baixo
    if (top + tooltipHeight + padding > window.innerHeight) {
      // Se sair por baixo, posicionar acima do elemento
      top = rect.bottom - tooltipHeight;

      // Se ainda sair por cima, centralizar verticalmente
      if (top < padding) {
        top = Math.max(padding, (window.innerHeight - tooltipHeight) / 2);
      }
    }

    setTooltipPosition({
      top: Math.max(padding, top),
      left: Math.max(padding, left),
    });
    setIsVisible(true);
  };

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed px-4 py-3 text-[10px] rounded-lg shadow-lg max-w-md break-words"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            color: theme === "dark" ? "#d1d5db" : "#374151",
            border: `2px solid ${priorityColor}`,
            boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.3)`,
            zIndex: 9999,
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            minWidth: "200px",
            maxWidth: "300px",
          }}
        >
          {typeof content === "string" ? (
            <div 
              style={{ 
                whiteSpace: "pre-line",
                lineHeight: "1.4"
              }}
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br>')
              }}
            />
          ) : (
            content
          )}
        </div>
      )}
    </div>
  );
}; 