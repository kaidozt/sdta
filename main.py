from fastapi import FastAPI, HTTPException
from database import get_db_connection
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

# MODELOS
class personas(BaseModel):
    nombres: str
    apellidos: str
    cedula: str
    ente: str
    contacto: str
    entrega: str
    id_equipos: int

class equipos(BaseModel):
    modelo: str
    serial: str
    ident: str
    tei: str
    user: str
    categoria: str
    tipo: str
    n_bien: str
    estado: str
    asignado: str

class accesorios(BaseModel):
    fuente: str
    microfono: str
    cables: str
    base: str
    corneta: str
    bateria: str
    antena: str
    clip: str
    cargador: str
    obs: str
    id_equipos: int

# RUTAS
@app.post("/personas/")
def agregar_persona(persona: personas):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO personas (nombres, apellidos, cedula, ente, contacto, entrega, id_equipos) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (
                persona.nombres,
                persona.apellidos,
                persona.cedula,
                persona.ente,
                persona.contacto,
                persona.entrega,
                persona.id_equipos
            )
        )
        conn.commit()
        return {"mensaje": "Persona agregada exitosamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@app.post("/equipos/")
def agregar_radios(equipo: equipos):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO equipos (modelo, serial, ident, tei, user, categoria, tipo, n_bien, estado, asignado) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (
                equipo.modelo,
                equipo.serial,
                equipo.ident,
                equipo.tei,
                equipo.user,
                equipo.categoria,
                equipo.tipo,
                equipo.n_bien,
                equipo.estado,
                equipo.asignado
            )
        )
        conn.commit()
        return {"mensaje": "Equipo agregado exitosamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@app.post("/accesorios/")
def agregar_accesorios(accesorio: accesorios):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO accesorios (fuente, microfono, cables, base, corneta, bateria, antena, clip, cargador, obs, id_equipos)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                accesorio.fuente,
                accesorio.microfono,
                accesorio.cables,
                accesorio.base,
                accesorio.corneta,
                accesorio.bateria,
                accesorio.antena,
                accesorio.clip,
                accesorio.cargador,
                accesorio.obs,
                accesorio.id_equipos
            )
        )
        conn.commit()
        return {"mensaje": "Accesorios agregados exitosamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@app.get("/personas/{cedula}")
def buscar_persona_por_cedula(cedula: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM personas WHERE cedula = %s", (cedula,))
        persona = cursor.fetchone()
        if persona:
            return persona
        else:
            raise HTTPException(status_code=404, detail="Persona no encontrada")
    finally:
        cursor.close()
        conn.close()


@app.get("/equipos/{serial}")
def buscar_equipos_por_serial(serial: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM equipos WHERE serial = %s", (serial,))
        equipo = cursor.fetchone()
        if equipo:
            return equipo
        else:
            raise HTTPException(status_code=404, detail="Equipo no encontrado")
    finally:
        cursor.close()
        conn.close()


@app.put("/equipos/entregar/{serial}")
def entregar_radio(serial: str, cedula: str):
    conn = get_db_connection()
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
def editar_persona(cedula: str, persona: personas):
    conn = get_db_connection()
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
