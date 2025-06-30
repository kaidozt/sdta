from fastapi import FastAPI, HTTPException
from back.database import get_db
from back.models import Persona, Equipo, Accesorios
from back.schemas import PersonaOut, EquipoOut, PersonaCreate, EquipoCreate
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import datetime


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RUTAS
from sqlalchemy.exc import IntegrityError

@app.post("/personas/")
def agregar_persona(persona: PersonaCreate):
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
def agregar_radios(equipo: EquipoCreate):
    db = next(get_db())
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
def buscar_persona_por_cedula(cedula: str):
    db = next(get_db())
    persona = db.query(Persona).filter(Persona.cedula == cedula).first()
    if persona:
        return persona
    else:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
@app.get("/personas/{cedula}/radios")
def radios_asignados(cedula: str):
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


@app.get("/equipos/{serial}", response_model=EquipoOut)
def buscar_equipos_por_serial(serial: str):
    db = next(get_db())
    equipo = db.query(Equipo).filter(Equipo.serial == serial).first()
    if equipo:
        return equipo
    else:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
@app.get("/personas/cantidad_radios/{cedula}")
def obtener_cantidad_radios(cedula: str):
    db = next(get_db())
    cantidad_radios = db.query(Equipo).filter(Equipo.asignado == cedula).count()
    return {"cedula": cedula, "cantidad_radios": cantidad_radios}


@app.put("/equipos/entregar/{serial}")
def entregar_radio(serial: str, cedula: str):
    conn = get_db()
    cursor = conn.cursor()
    try:
        # 1. Obtener el ID del equipo
        cursor.execute("SELECT id_equipos FROM equipos WHERE serial = %s", (serial,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Equipo no encontrado")

        id_equipos = result[0]

        # 2. Actualizar estado del equipo
        cursor.execute("UPDATE equipos SET estado = 'entregado' WHERE serial = %s", (serial,))

        # 3. Actualizar a la persona
        fecha_actual = datetime.date.today()
        cursor.execute(
            "UPDATE personas SET id_equipos = %s, entrega = %s WHERE cedula = %s",
            (id_equipos, fecha_actual, cedula)
        )

        conn.commit()
        return {"mensaje": "Radio entregado correctamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@app.put("/personas/{cedula}")
def editar_persona(cedula: str, persona: PersonaCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """UPDATE personas SET nombres = %s, apellidos = %s, ente = %s, contacto = %s, entrega = %s, id_equipos = %s
            WHERE cedula = %s""",
            (
                persona.nombres,
                persona.apellidos,
                persona.ente,
                persona.contacto,
                persona.entrega,
                persona.id_equipos,
                cedula
            )
        )
        conn.commit()
        return {"mensaje": "Datos de persona actualizados"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
