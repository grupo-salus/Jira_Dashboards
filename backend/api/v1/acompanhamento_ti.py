from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/acompanhamento_ti", tags=["Acompanhamento TI"])


@router.get("/tabela")
def get_tabela_acompanhamento_ti(request: Request):
    """
    Endpoint temporário - retorna Hello World.
    """
    return {"message": "Hello World - Acompanhamento TI"} 