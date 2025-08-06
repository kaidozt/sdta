from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# PERSONA
class PersonaBase(BaseModel):
    nombres: str
    apellidos: str
    cedula: str
    ente: Optional[str] = None
    contacto: Optional[str] = None
    entrega: Optional[date] = None
    id_equipos: Optional[int] = None

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
    user: Optional[str] = None
    categoria: str
    tipo: Optional[str] = None
    n_bien: Optional[str] = None
    estado: Optional[str] = None
    asignado: Optional[str] = None
    #accesorios se asignan en la entrega del radio


class EquipoCreate(EquipoBase):
    pass

class AccesorioBase(BaseModel):
    nombre: str

class AccesorioCreate(AccesorioBase):
    pass

class AccesorioOut(AccesorioBase):
    id_accesorio: int
    nombre: str
    class Config:
        orm_mode = True
    
class EquipoOut(EquipoBase):
    id_equipos: int
    accesorios: List[AccesorioOut] = []
    model_config = {
        "from_attributes": True
    }

class EquipoEntregaRequest(BaseModel):
    accesorios: List[int] = []

# AUTENTICACIÓN
class UsuarioCreate(BaseModel):
    username: str
    password: str
    role: str = "admin"
    nombre: Optional[str] = None
    email: Optional[str] = None

class UsuarioLogin(BaseModel):
    username: str
    password: str

class UsuarioOut(BaseModel):
    id: int
    username: str
    role: str
    nombre: Optional[str] = None
    email: Optional[str] = None
    estado: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None



    

