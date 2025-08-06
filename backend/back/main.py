from fastapi import FastAPI, HTTPException, Depends
from back.database import get_db, engine
from back.models import Persona, Equipo, Accesorios, EquipoAccesorio, Usuario
from back.schemas import PersonaOut, EquipoOut, PersonaCreate, EquipoCreate, AccesorioOut
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import datetime
from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from back.auth import router as auth_router
from back.security import get_current_user, require_admin_role, require_user_role

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth_router)

# RUTAS

@app.get("/")
def root():
    return {"mensaje": "API de gestión de radios activa"}

@app.post("/personas/")
def agregar_persona(persona: PersonaCreate, current_user=Depends(require_user_role)):
    db = next(get_db())
    db_persona = Persona(**persona.dict())
    db.add(db_persona)
    try:
        db.commit()
        db.refresh(db_persona)
        return {"mensaje": "Persona agregada con exito"}
    except IntegrityError as e:
        db.rollback()
        if 'cedula' in str(e.orig):
            raise HTTPException(status_code=409, detail="Ya existe una persona con esa cédula.")
        else:
            raise HTTPException(status_code=400, detail="Error de integridad en la base de datos.")

@app.post("/equipos/")
def agregar_radios(equipo: EquipoCreate, current_user=Depends(require_user_role)):
    db = next(get_db())

    data = equipo.dict()
    accesorios = data.pop("accesorios", None)

    db_equipo = Equipo(**equipo.dict())
    db.add(db_equipo)
    try:
        db.commit()
        db.refresh(db_equipo)
        return {"mensaje": "Equipo agregado con exito"}
    except IntegrityError as e:
        db.rollback()
        if 'serial' in str(e.orig):
            raise HTTPException(status_code=409, detail="Ya existe un equipo con ese serial.")
        else:
            raise HTTPException(status_code=400, detail="Error de integridad en la base de datos.")

@app.get("/personas/{cedula}", response_model=PersonaOut)
def buscar_persona_por_cedula(cedula: str, current_user=Depends(require_user_role)):
    db = next(get_db())
    normalized_cedula = cedula.replace(",", "")
    persona = db.query(Persona).filter(func.replace(Persona.cedula, ",", "") == normalized_cedula).first()
    if persona:
        return persona
    else:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
@app.get("/personas/{cedula}/radios")
def radios_asignados(cedula: str, current_user=Depends(require_user_role)):
    db = next(get_db())
    radios = db.query(Equipo).filter(Equipo.asignado == cedula).all()
    if radios:
        return [
            {
                "serial": radio.serial,
                "modelo": radio.modelo,
                "estado": radio.estado,
                "asignado": radio.asignado
            }
            for radio in radios
        ]
    else:
        raise HTTPException(status_code=404, detail="No se encontraron radios asignados a esta persona")

@app.get("/equipos/buscar/{serial}", response_model=EquipoOut)
def buscar_equipos_por_serial(serial: str, current_user=Depends(require_user_role)):
    db = next(get_db())
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
    
@app.get("/personas/cantidad_radios/{cedula}")
def obtener_cantidad_radios(cedula: str, current_user=Depends(require_user_role)):
    db = next(get_db())
    cantidad_radios = db.query(Equipo).filter(Equipo.asignado == cedula).count()
    return {"cedula": cedula, "cantidad_radios": cantidad_radios}

from fastapi import Body
from back.schemas import EquipoEntregaRequest

@app.put("/equipos/entregar/{serial}")
def entregar_radio(serial: str, cedula: str, request: EquipoEntregaRequest = Body(...), current_user=Depends(require_user_role)):
    db = next(get_db())
    # Busca el equipo por serial
    equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # Busca la persona por cedula
    persona = db.query(Persona).filter(Persona.cedula == cedula).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    #Actualiza campos del equipo
    ente = f"{persona.ente}" if persona.ente else "No especificado"
    equipo.user = ente
    equipo.asignado = cedula
    
    #Actulaiza los campos de la persona
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

@app.put("/personas/{cedula}")
def editar_persona(cedula: str, persona: PersonaCreate, current_user=Depends(require_user_role)):
    db = next(get_db())
    db_persona = db.query(Persona).filter(Persona.cedula == cedula).first()
    if not db_persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    #Actualiza los campos de persona
    db_persona.nombres = persona.nombres
    db_persona.apellidos = persona.apellidos
    db_persona.ente = persona.ente
    db_persona.contacto = persona.contacto
    db_persona.entrega = persona.entrega
    try:
        db.commit()
        return {"mensaje": "Persona actualizada con éxito"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad en la base de datos.")

@app.put("/equipos/{serial}")
def editar_equipo(serial: str, equipo: EquipoCreate, current_user=Depends(require_user_role)):
    db = next(get_db())
    db_equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if not db_equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    # Actualiza los campos del equipo
    db_equipo.modelo = equipo.modelo
    db_equipo.estado = equipo.estado
    db_equipo.ident = equipo.ident
    db_equipo.tei = equipo.tei
    db_equipo.tipo = equipo.tipo
    db_equipo.n_bien = equipo.n_bien
    try:
        db.commit()
        return {"mensaje": "Equipo actualizado con éxito"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad en la base de datos.")
    
@app.delete("/personas/{cedula}")
def eliminar_persona(cedula: str, current_user=Depends(require_user_role)):
    db = next(get_db())
    db_persona = db.query(Persona).filter(Persona.cedula == cedula).first()
    if not db_persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    try:
        db.delete(db_persona)
        db.commit()
        return {"mensaje": "Persona eliminada con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/equipos/{serial}")
def eliminar_equipo(serial: str, current_user=Depends(require_user_role)):
    db = next(get_db())
    db_equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if not db_equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrada")
    try:
        db.delete(db_equipo)
        db.commit()
        return {"mensaje": "Equipo eliminado con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/equipos/totales")
def total_radios(current_user=Depends(require_user_role)):
    db = next(get_db())
    total = db.query(Equipo).count()
    return {"total_radios": total}

@app.get("/equipos/total")
def total_radios_alias(current_user=Depends(require_user_role)):
    db = next(get_db())
    total = db.query(Equipo).count()
    return {"total_radios": total}

@app.get("/accesorios", response_model=List[AccesorioOut])
def obtener_accesorios(current_user=Depends(require_user_role)):
    db = next(get_db())
    return db.query(Accesorios).all()

@app.put("/personas/poner_de_vacaciones/")
def poner_de_vacaciones(current_user=Depends(require_user_role)):
    db = next(get_db())
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

@app.put("/equipos/poner_de_vacaciones/{serial}")
def poner_radio_de_vacaciones(serial: str, current_user=Depends(require_user_role)):
    db = next(get_db())
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

# Create tables
from back.database import Base
Base.metadata.create_all(bind=engine)
