from pydantic import BaseModel
from typing import Optional
from datetime import date

# PERSONA
class PersonaBase(BaseModel):
    nombres: str
    apellidos: str
    cedula: str
    ente: Optional[str]
    contacto: Optional[str]
    entrega: Optional[date]
    id_equipos: Optional[int]

class PersonaCreate(PersonaBase):
    pass

class PersonaOut(PersonaBase):
    id_personas: int
    model_config = {
        "from_attributes": True
    }

# EQUIPO

class EquipoBase(BaseModel):
    modelo: str
    serial: str
    ident: str
    tei: str
    user: str
    categoria: str
    tipo: str
    n_bien: str
    estado: str
    asignado: Optional[str]

class EquipoCreate(EquipoBase):
    pass

class EquipoOut(EquipoBase):
    id_equipos: int
    model_config = {
        "from_attributes": True
    }


# ACCESORIOS
class AccesorioBase(BaseModel):
    fuente: Optional[str]
    microfono: Optional[str]
    cables: Optional[str]
    base: Optional[str]
    corneta: Optional[str]
    bateria: Optional[str]
    antena: Optional[str]
    clip: Optional[str]
    cargador: Optional[str]
    obs: Optional[str]
    id_equipos: Optional[int]

class AccesorioCreate(AccesorioBase):
    pass

class AccesorioOut(AccesorioBase):
    id_accesorios: int
    model_config = {
        "from_attributes": True
    }

