import React from "react";
import { EspacoDeProjetos } from "../../../types/Typesjira";

const JIRA_URL_BASE =
  "https://tigruposalus.atlassian.net/jira/software/c/projects/EP/boards/323?selectedIssue=";

export function withJiraLink(
  projeto: EspacoDeProjetos,
  children: React.ReactNode
) {
  return (
    <a
      href={`${JIRA_URL_BASE}${projeto.Chave}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      {children}
    </a>
  );
}
