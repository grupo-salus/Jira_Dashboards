import dash
from dash import dcc, html, dash_table, Input, Output
import pandas as pd
from datetime import datetime, timedelta
from backend.services.jira_service import JiraService
from backend.services.jira_parser import parse_issues_to_dataframe

# --- Coleta inicial dos dados
service = JiraService()
backlog_issues = service.get_raw_backlog_issues(board_id=71).get("issues", [])
df = parse_issues_to_dataframe(backlog_issues)

# --- Tratamento
df["Data de Criação"] = pd.to_datetime(df["Data de Criação"]).dt.tz_localize(None)
df["Dias no Backlog"] = (pd.Timestamp.today() - df["Data de Criação"]).dt.days

def dias_para_str(dias):
    if dias == 0:
        return "hoje"
    elif dias == 1:
        return "1 dia"
    else:
        return f"{dias} dias"

df["Dias no Backlog (texto)"] = df["Dias no Backlog"].apply(dias_para_str)

# --- Filtros únicos
departamentos = sorted(df["Unidade / Departamento"].dropna().unique())
grupos = sorted(df["Grupo Solicitante"].dropna().unique())
prioridades = sorted(df["Prioridade Calculada"].dropna().astype(str).unique())

tipos = sorted(df["Tipo"].dropna().unique())

# --- App
app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("Backlog - Jira", style={
        "textAlign": "center", "color": "#0747A6", "marginBottom": "20px"
    }),

    html.Div([
        dcc.Dropdown(
            id="filtro-depto",
            options=[{"label": d, "value": d} for d in departamentos],
            placeholder="Filtrar por Departamento...",
            style={"width": "250px"}
        ),
        dcc.Dropdown(
            id="filtro-grupo",
            options=[{"label": g, "value": g} for g in grupos],
            placeholder="Filtrar por Grupo Solicitante...",
            style={"width": "250px"}
        ),
        dcc.Dropdown(
            id="filtro-prioridade",
            options=[{"label": p, "value": p} for p in prioridades],
            placeholder="Filtrar por Prioridade...",
            style={"width": "250px"}
        ),
        dcc.Dropdown(
            id="filtro-tipo",
            options=[{"label": t, "value": t} for t in tipos],
            placeholder="Filtrar por Tipo...",
            style={"width": "250px"}
        ),
    ], style={
        "display": "flex", "justifyContent": "center", "gap": "25px",
        "marginBottom": "30px"
    }),

    html.Div(id="cards-backlog", style={"marginBottom": "20px"}),

    html.Div(id="tabela-backlog"),

    dcc.Interval(id="interval-update", interval=3600 * 1000, n_intervals=0)
])

@app.callback(
    Output("tabela-backlog", "children"),
    Output("cards-backlog", "children"),
    Input("filtro-depto", "value"),
    Input("filtro-grupo", "value"),
    Input("filtro-prioridade", "value"),
    Input("filtro-tipo", "value"),
    Input("interval-update", "n_intervals")
)
def atualizar_tela(depto, grupo, prioridade, tipo, _):
    issues = service.get_raw_backlog_issues(board_id=71).get("issues", [])
    df = parse_issues_to_dataframe(issues)
    df["Data de Criação"] = pd.to_datetime(df["Data de Criação"]).dt.tz_localize(None)
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Data de Criação"]).dt.days
    df["Dias no Backlog (texto)"] = df["Dias no Backlog"].apply(dias_para_str)

    # Filtros aplicados
    if depto:
        df = df[df["Unidade / Departamento"] == depto]
    if grupo:
        df = df[df["Grupo Solicitante"] == grupo]
    if prioridade:
        df = df[df["Prioridade Calculada"] == prioridade]
    if tipo:
        df = df[df["Tipo"] == tipo]

    # Cards
    tempo_medio = int(df["Dias no Backlog"].mean()) if not df.empty else 0
    card_style = {
        "backgroundColor": "#F4F5F7", "padding": "15px", "borderRadius": "8px",
        "boxShadow": "0 2px 4px rgba(0,0,0,0.1)", "textAlign": "center", "minWidth": "180px"
    }
    
    cards = html.Div([
        html.Div([
            html.Div("Total no Backlog", style={"fontWeight": "bold"}),
            html.Div(f"{len(df)}", style={"fontSize": "24px", "color": "#0747A6"})
        ], style=card_style),
        html.Div([
            html.Div("Tempo medio (dias)", style={"fontWeight": "bold"}),
            html.Div(f"{tempo_medio}", style={"fontSize": "24px", "color": "#0747A6"})
        ], style=card_style),
        html.Div([
            html.Div("Mais antigo", style={"fontWeight": "bold"}),
            html.Div(df.loc[df['Dias no Backlog'].idxmax()]['Chave'] if not df.empty else "-", style={"fontSize": "20px", "color": "#DE350B"})
        ], style=card_style)
    ], style={"display": "flex", "justifyContent": "center", "gap": "30px"})

    tabela = dash_table.DataTable(
        columns=[
            {"name": "Chave", "id": "Chave"},
            {"name": "Título", "id": "Título"},
            {"name": "Tipo", "id": "Tipo"},
            {"name": "Prioridade", "id": "Prioridade Calculada"},
            {"name": "Grupo", "id": "Grupo Solicitante"},
            {"name": "Departamento", "id": "Unidade / Departamento"},
            {"name": "Solicitante", "id": "Solicitante"},
            {"name": "Dias no Backlog", "id": "Dias no Backlog"},
        ],
        data=df.to_dict("records"),
        sort_action="native",
        page_size=20,
        style_table={"overflowX": "auto"},
        style_cell={"padding": "6px", "textAlign": "left", "whiteSpace": "normal"},
        style_header={"backgroundColor": "#DEEBFF", "fontWeight": "bold", "color": "#172B4D"},
        style_data_conditional=[
            {
                "if": {"column_id": "Dias no Backlog", "filter_query": "{Dias no Backlog} >= 30"},
                "backgroundColor": "#FFEBE6", "color": "#BF2600"
            }
        ]
    )

    return tabela, cards

if __name__ == "__main__":
    app.run(debug=True, port=8050)