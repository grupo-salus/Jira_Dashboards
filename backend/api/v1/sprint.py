from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/sprint", tags=["Sprint"])


@router.get("/tabela")
def get_tabela_sprint(request: Request):
    """
    Endpoint temporário - retorna Hello World.
    """
    return {"message": "Hello World - Sprint"} 