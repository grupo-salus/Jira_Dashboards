// Arquivo vazio - será implementado futuramente
// src/shared/themes/index.ts

import { salusTheme } from "./salus";
import { jiraTheme } from "./jira";
import { customTheme } from "./custom";

export const availableThemes = {
  salus: salusTheme,
  jira: jiraTheme,
  custom: customTheme,
};

export type ThemeName = keyof typeof availableThemes;

export const DEFAULT_THEME: ThemeName = "salus";
