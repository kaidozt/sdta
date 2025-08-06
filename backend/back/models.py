from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from back.database import Base
<<<<<<< HEAD

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="usuario")
    estado = Column(Boolean, default=True)
    nombre = Column(String(100))
    email = Column(String(100), unique=True, index=True)

    def __repr__(self):
        return f"<Usuario(username='{self.username}', role='{self.role}')>"
=======
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
>>>>>>> cf513bb29e08aba1b17ad15ac051c63975ea3a94

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
    accesorios = relationship("Accesorios", back_populates="equipo")

class Accesorios(Base):
    __tablename__ = "accesorios"

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

<<<<<<< HEAD
    equipo_accesorios = relationship("EquipoAccesorio", back_populates="accesorio")

class EquipoAccesorio(Base):
    __tablename__ = "equipo_accesorio"

    id = Column(Integer, primary_key=True, index=True)
    id_equipo = Column(Integer, ForeignKey("equipos.id_equipos"))
    id_accesorio = Column(Integer, ForeignKey("accesorios.id_accesorio"))

    equipo = relationship("Equipo", back_populates="equipo_accesorios")
    accesorio = relationship("Accesorios", back_populates="equipo_accesorios")
=======
    equipo = relationship("Equipo", back_populates="accesorios")
>>>>>>> cf513bb29e08aba1b17ad15ac051c63975ea3a94
