// Componente principal
export { ProximosProjetos } from "./ProximosProjetos";

// Componentes de visualização
export { ProximosColunas } from "./ProximosColunas";
export { ProximosLinhas } from "./ProximosLinhas";

// Componentes base
export {
  ProjetoCard,
  ResponsavelHeader,
  ResponsavelCard,
} from "./BaseProximos";

// Lógica e tipos
export {
  processarProximosProjetos,
  type ProjetoProcessado,
  type ResponsavelProcessado,
} from "./logic/processarProximosProjetos";
