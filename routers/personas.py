from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database

router = APIRouter()

@router.post("/", response_model=schemas.PersonaOut)
def crear_persona(persona: schemas.PersonaCreate, db: Session = Depends(database.get_db)):
    return crud.crear_persona(db, persona)

@router.get("/{cedula}", response_model=schemas.PersonaOut)
def obtener_persona(cedula: str, db: Session = Depends(database.get_db)):
    persona = crud.obtener_persona_por_cedula(db, cedula)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return persona

@router.put("/{cedula}", response_model=schemas.PersonaOut)
def actualizar_persona(cedula: str, persona_data: schemas.PersonaCreate, db: Session = Depends(database.get_db)):
    persona = crud.actualizar_persona(db, cedula, persona_data)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return persona
