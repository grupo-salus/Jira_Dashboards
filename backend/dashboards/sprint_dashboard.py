import dash
from dash import dcc, html, dash_table, Input, Output
import pandas as pd
from backend.services.jira_service import JiraService
from backend.services.jira_parser import parse_issues_to_dataframe
from datetime import timedelta

# --- Função auxiliar para formatar tempo
def format_seconds(s):
    t = timedelta(seconds=int(s))
    days = t.days
    hours, remainder = divmod(t.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{days}d {hours}h {minutes}m {seconds}s"

# --- Estilo dos cards
card_style = {
    "backgroundColor": "#F4F5F7",
    "padding": "15px 25px",
    "borderRadius": "8px",
    "boxShadow": "0 2px 8px rgba(0,0,0,0.05)",
    "textAlign": "center"
}

# --- Inicializa o app
app = dash.Dash(__name__)

# --- Layout principal
app.layout = html.Div([
    html.H1("SQUAD SALUS", style={
        "textAlign": "center", "color": "#0052CC", "marginBottom": "10px"
    }),

    html.Div([
        html.Div([
            html.Label("Desenvolvedor:", style={"fontWeight": "bold"}),
            dcc.Dropdown(id="filtro-dev", style={"width": "280px"})
        ]),
        html.Div([
            html.Label("Status Estimativa:", style={"fontWeight": "bold"}),
            dcc.Dropdown(
                id="filtro-status",
                options=[
                    {"label": "Todos", "value": "Todos"},
                    {"label": "Dentro do Prazo", "value": "Dentro do Prazo"},
                    {"label": "Fora do prazo", "value": "Fora do prazo"},
                ],
                value="Todos",
                style={"width": "280px"}
            )
        ])
    ], style={
        "display": "flex", "justifyContent": "center", "gap": "40px",
        "marginBottom": "30px", "backgroundColor": "#f4f5f7", "padding": "20px",
        "borderRadius": "8px", "boxShadow": "0 2px 4px rgba(0,0,0,0.05)"
    }),

    html.Div(id="cards-totais", style={"textAlign": "center", "marginBottom": "25px"}),

    html.Div(id="tabela-cards"),

    dcc.Interval(id="atualizador-periodico", interval=60 * 60 * 1000, n_intervals=0)  # 1 hora
], style={"fontFamily": "Segoe UI, sans-serif", "backgroundColor": "#ffffff", "padding": "30px"})


@app.callback(
    Output("filtro-dev", "options"),
    Output("filtro-dev", "value"),
    Output("tabela-cards", "children"),
    Output("cards-totais", "children"),
    Input("filtro-status", "value"),
    Input("filtro-dev", "value"),
    Input("atualizador-periodico", "n_intervals")
)
def atualizar_dashboard(status, dev, _):
    # --- Busca e trata os dados
    service = JiraService()
    sprint_issues = service.get_raw_active_sprint_issues(board_id=71).get("issues", [])
    df = parse_issues_to_dataframe(sprint_issues)

    df["Estimativa Original (segundos)"] = pd.to_numeric(df["Estimativa Original (segundos)"], errors="coerce").fillna(0)
    df["Controle de Tempo (segundos)"] = pd.to_numeric(df["Controle de Tempo (segundos)"], errors="coerce").fillna(0)

    df["Estimativa"] = df["Estimativa Original (segundos)"].apply(format_seconds)
    df["Controle"] = df["Controle de Tempo (segundos)"].apply(format_seconds)
    df["Diferença (segundos)"] = df["Controle de Tempo (segundos)"] - df["Estimativa Original (segundos)"]
    df["Diferença"] = df["Diferença (segundos)"].apply(format_seconds)

    df["Status Estimativa"] = df.apply(
        lambda row: "Dentro do Prazo" if row["Controle de Tempo (segundos)"] <= row["Estimativa Original (segundos)"]
        else "Fora do prazo", axis=1
    )

    df["Responsável (Dev)"] = df["Responsável (Dev)"].replace("", "Sem Dev")
    lista_devs = sorted(df["Responsável (Dev)"].unique().tolist())
    lista_devs.insert(0, "Geral")

    # --- Filtros
    df_filtrado = df.copy()
    if dev and dev != "Geral":
        df_filtrado = df_filtrado[df_filtrado["Responsável (Dev)"] == dev]
    if status != "Todos":
        df_filtrado = df_filtrado[df_filtrado["Status Estimativa"] == status]

    # --- Tabela
    tabela = dash_table.DataTable(
        columns=[
            {"name": "Chave", "id": "Chave"},
            {"name": "Título", "id": "Título"},
            {"name": "Responsável", "id": "Responsável (Dev)"},
            {"name": "Estimativa", "id": "Estimativa"},
            {"name": "Controle", "id": "Controle"},
            {"name": "Diferença", "id": "Diferença"},
            {"name": "Status Estimativa", "id": "Status Estimativa"},
        ],
        data=df_filtrado.to_dict("records"),
        sort_action="native",
        page_size=20,
        style_table={"overflowX": "auto"},
        style_cell={"textAlign": "left", "padding": "6px", "whiteSpace": "normal"},
        style_header={
            "backgroundColor": "#DEEBFF", "fontWeight": "bold", "color": "#172B4D"
        },
        style_data_conditional=[
            {
                "if": {"column_id": "Status Estimativa", "filter_query": '{Status Estimativa} = "Fora do prazo"'},
                "backgroundColor": "#FFEBE6", "color": "#BF2600"
            },
            {
                "if": {"column_id": "Status Estimativa", "filter_query": '{Status Estimativa} = "Dentro do Prazo"'},
                "backgroundColor": "#E3FCEF", "color": "#006644"
            }
        ]
    )

    # --- Cards de resumo
    cards = html.Div([
        html.Div([
            html.Div("Total de Cards", style={"fontWeight": "bold", "color": "#172B4D"}),
            html.Div(f"{len(df_filtrado)}", style={"fontSize": "24px", "color": "#0052CC"})
        ], style=card_style),

        html.Div([
            html.Div("Devs Ativos", style={"fontWeight": "bold", "color": "#172B4D"}),
            html.Div(f"{df_filtrado['Responsável (Dev)'].nunique()}", style={"fontSize": "24px", "color": "#0052CC"})
        ], style=card_style)
    ], style={"display": "flex", "justifyContent": "center", "gap": "40px"})

    return (
        [{"label": dev, "value": dev} for dev in lista_devs],
        dev if dev in lista_devs else "Geral",
        tabela,
        cards
    )


if __name__ == "__main__":
    app.run(debug=True, port=8051)
