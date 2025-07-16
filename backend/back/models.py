from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from back.database import Base
class Persona(Base):
    __tablename__ = "personas"

    id_personas = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(22))
    apellidos = Column(String(20))
    cedula = Column(String(12), index=True)
    ente = Column(String(44))
    contacto = Column(String(14))
    entrega = Column(Date)
    id_equipos = Column(Integer, ForeignKey("equipos.id_equipos"))

    equipo = relationship("Equipo", back_populates="personas")

class Equipo(Base):
    __tablename__ = "equipos"
    id_equipos = Column(Integer, primary_key=True, index=True)
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

    personas = relationship("Persona", back_populates="equipo")
    equipo_accesorios = relationship("EquipoAccesorio", back_populates="equipo")

class Accesorios(Base):
    __tablename__ = "accesorios"

    id_accesorio = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))

    equipo_accesorios = relationship("EquipoAccesorio", back_populates="accesorio")


class EquipoAccesorio(Base):
    __tablename__ = "equipo_accesorio"

    id = Column(Integer, primary_key=True, index=True)
    id_equipo = Column(Integer, ForeignKey("equipos.id_equipos"))
    id_accesorio = Column(Integer, ForeignKey("accesorios.id_accesorio"))

    equipo = relationship("Equipo", back_populates="equipo_accesorios")
    accesorio = relationship("Accesorios", back_populates="equipo_accesorios")