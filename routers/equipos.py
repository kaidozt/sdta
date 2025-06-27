from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database

router = APIRouter()

@router.post("/", response_model=schemas.EquipoOut)
def crear_equipo(equipo: schemas.EquipoCreate, db: Session = Depends(database.get_db)):
    return crud.crear_equipo(db, equipo)

@router.get("/{serial}", response_model=schemas.EquipoOut)
def obtener_equipo(serial: str, db: Session = Depends(database.get_db)):
    equipo = crud.obtener_equipo_por_serial(db, serial)
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo

@router.put("/entregar/{serial}", response_model=schemas.EquipoOut)
def entregar_equipo(serial: str, db: Session = Depends(database.get_db)):
    equipo = crud.entregar_equipo(db, serial)
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo

@router.put("/{serial}", response_model=schemas.EquipoOut)
def actualizar_equipo(serial: str, equipo_data: schemas.EquipoCreate, db: Session = Depends(database.get_db)):
    equipo = crud.actualizar_equipo(db, serial, equipo_data)
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return equipo
