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
