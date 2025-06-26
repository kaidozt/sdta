from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Persona(Base):
    __tablename__ = "personas"

    id_personas = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(22))
    apellidos = Column(String(20))
    cedula = Column(String(12), index=True)
    ente = Column(String(44))
    contacto = Column(String(14))
    entrega = Column(Date(14))
    id_equipos = Column(Integer, ForeignKey("equipos.id_equipos"))

    equipo = relationship("Equipo", back_populates="personas")

class Equipo(Base):
    __tablename_ = "equipos"
    id_equipos = Column(Integer, primary_key=True, index=11)
    modelo = Column(String(20))
    serial = Column(String(20))
    ident = Column(String(100))
    tei = Column(String(100))
    user = Column(String(100))
    categoria = Column(String(100))
    tipo = Column(String(100))
    n_bien = Column(String(100))
    estado = Column(String(100))
    asignado = Column(String(100))

class Accesorios(Base):
    __tablename_ = "accesorios"

    id_accesorios = Column(Integer, primary_key=True, index=11)
    fuente = Column(String(50))
    microfono = Column(String(50))
    cables = Column(String(50))
    base = Column(String(50))
    corneta = Column(String(50))
    bateria = Column(String(50))
    antena = Column(String(50))
    clip = Column(String(50))
    cargador = Column(String(50))
    obs = Column(String(50))
    id_equipos = Column(Integer, ForeignKey("equipos.id_equipos"))

    equipo = relationship("Equipo", back_populates="accesorios")
