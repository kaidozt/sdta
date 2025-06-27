from sqlalchemy.orm import Session
from . import models, schemas

# ========== PERSONAS ==========

def crear_persona(db: Session, persona: schemas.PersonaCreate):
    db_persona = models.Persona(**persona.dict())
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona

def obtener_persona_por_cedula(db: Session, cedula: str):
    return db.query(models.Persona).filter(models.Persona.cedula == cedula).first()

def actualizar_persona(db: Session, cedula: str, persona_data: schemas.PersonaCreate):
    persona = obtener_persona_por_cedula(db, cedula)
    if persona:
        for key, value in persona_data.dict().items():
            setattr(persona, key, value)
        db.commit()
        db.refresh(persona)
    return persona

# ========== EQUIPOS ==========

def crear_equipo(db: Session, equipo: schemas.EquipoCreate):
    db_equipo = models.Equipo(**equipo.dict())
    db.add(db_equipo)
    db.commit()
    db.refresh(db_equipo)
    return db_equipo

def obtener_equipo_por_serial(db: Session, serial: str):
    return db.query(models.Equipo).filter(models.Equipo.serial == serial).first()

def entregar_equipo(db: Session, serial: str):
    equipo = obtener_equipo_por_serial(db, serial)
    if equipo:
        equipo.asignado = "no asignado"
        db.commit()
        db.refresh(equipo)
    return equipo

def actualizar_equipo(db: Session, serial: str, equipo_data: schemas.EquipoCreate):
    equipo = obtener_equipo_por_serial(db, serial)
    if equipo:
        for key, value in equipo_data.dict().items():
            setattr(equipo, key, value)
        db.commit()
        db.refresh(equipo)
    return equipo
