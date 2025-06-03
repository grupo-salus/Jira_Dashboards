import pandas as pd
from services.jira_service import JiraService  # seu service acima
from datetime import datetime
from services.jira_parser import parse_issues_to_dataframe


def main():
    jira = JiraService()
    board_id = 71  # atualize se necessário

    # 🟡 Sprint ativa
    sprint_data = jira.get_raw_active_sprint_issues(board_id).get("issues", [])
    sprint_df = parse_issues_to_dataframe(sprint_data)

    # ⚪ Backlog
    backlog_data = jira.get_raw_backlog_issues(board_id).get("issues", [])
    backlog_df = parse_issues_to_dataframe(backlog_data)

    # 📤 Exportar para Excel
    file_name = f"jira_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    with pd.ExcelWriter(file_name, engine="openpyxl") as writer:
        sprint_df.to_excel(writer, index=False, sheet_name="Sprint Ativa")
        backlog_df.to_excel(writer, index=False, sheet_name="Backlog")

    print(f"✅ Arquivo gerado com sucesso: {file_name}")


if __name__ == "__main__":
    main()
