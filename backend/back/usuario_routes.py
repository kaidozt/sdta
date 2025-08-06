from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from back.database import get_db
from back.models import Persona, Equipo, Accesorios, EquipoAccesorio
from back.schemas import PersonaOut, EquipoOut, EquipoEntregaRequest
from typing import List
import datetime

router = APIRouter(prefix="/usuario", tags=["usuario"])

# Función simple de autenticación temporal
def get_current_user_role():
    # Por ahora retornamos "usuario" para simular el rol
    # En producción, esto vendría del token JWT
    return {"role": "usuario", "username": "usuario_comun"}

# RUTAS DISPONIBLES PARA USUARIO COMÚN

@router.get("/personas/{cedula}", response_model=PersonaOut)
def buscar_persona_por_cedula(cedula: str, db: Session = Depends(get_db)):
    """Buscar persona por cédula - acceso para usuarios comunes"""
    normalized_cedula = cedula.replace(",", "")
    persona = db.query(Persona).filter(func.replace(Persona.cedula, ",", "") == normalized_cedula).first()
    if persona:
        return persona
    else:
        raise HTTPException(status_code=404, detail="Persona no encontrada")

@router.get("/equipos/buscar/{serial}", response_model=EquipoOut)
def buscar_equipo_por_serial(serial: str, db: Session = Depends(get_db)):
    """Buscar equipo por serial - acceso para usuarios comunes"""
    equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    accesorios = (
        db.query(Accesorios)
        .join(EquipoAccesorio, Accesorios.id_accesorio == EquipoAccesorio.id_accesorio)
        .filter(EquipoAccesorio.id_equipo == equipo.id_equipos)
        .all()
    )
    persona = None
    if equipo.asignado:
        persona_obj = db.query(Persona).filter(Persona.cedula == equipo.asignado).first()
        if persona_obj:
            persona = f"{persona_obj.nombres} {persona_obj.apellidos}"
    equipo_dict = equipo.__dict__.copy()
    equipo_dict["asignado"] = persona

    return {
        **equipo_dict,
        "accesorios": accesorios
    }

@router.put("/equipos/entregar/{serial}")
def entregar_radio_usuario(serial: str, cedula: str, request: EquipoEntregaRequest, db: Session = Depends(get_db)):
    """Entregar radio - acceso para usuarios comunes"""
    # Busca el equipo por serial
    equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # Busca la persona por cedula
    persona = db.query(Persona).filter(Persona.cedula == cedula).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    # Actualiza campos del equipo
    ente = f"{persona.ente}" if persona.ente else "No especificado"
    equipo.user = ente
    equipo.asignado = cedula
    
    # Actualiza los campos de la persona
    persona.id_equipos = equipo.id_equipos
    persona.entrega = datetime.date.today()

    # Actualiza accesorios asignados
    # Elimina los accesorios existentes
    db.query(EquipoAccesorio).filter(EquipoAccesorio.id_equipo == equipo.id_equipos).delete()
    # Agrega los nuevos accesorios
    for id_acc in request.accesorios:
        nuevo_accesorio = EquipoAccesorio(id_equipo=equipo.id_equipos, id_accesorio=id_acc)
        db.add(nuevo_accesorio)

    try:
        db.commit()
        return {"mensaje": "Radio entregado con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/personas/poner_de_vacaciones/")
def poner_de_vacaciones_usuario(db: Session = Depends(get_db)):
    """Poner de vacaciones - acceso para usuarios comunes"""
    personas_con_radio = db.query(Persona).filter(Persona.id_equipos != None).all()
    count = 0
    for persona in personas_con_radio:
        equipo = db.query(Equipo).filter(Equipo.id_equipos == persona.id_equipos).first()
        if equipo:
            equipo.estado = "vacaciones"
            equipo.asignado = None
            equipo.user = None
        persona.id_equipos = None
        count += 1
    try:
        db.commit()
        return {"mensaje": f"{count} radios puestos de vacaciones y personas actualizadas."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/equipos/poner_de_vacaciones/{serial}")
def poner_radio_de_vacaciones_usuario(serial: str, db: Session = Depends(get_db)):
    """Poner radio específico de vacaciones - acceso para usuarios comunes"""
    equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    persona = db.query(Persona).filter(Persona.id_equipos == equipo.id_equipos).first()
    if persona:
        persona.id_equipos = None
    equipo.estado = "vacaciones"
    equipo.asignado = None
    equipo.user = None
    try:
        db.commit()
        return {"mensaje": f"Radio {serial} puesto de vacaciones con éxito."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
