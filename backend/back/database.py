from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Cambia los datos según tu configuración
<<<<<<< HEAD
DATABASE_URL = "mysql+mysqlconnector://root@localhost/db_radios"
=======
DATABASE_URL = "mysql+mysqlconnector://root:@localhost/db_radios"
>>>>>>> cf513bb29e08aba1b17ad15ac051c63975ea3a94

# Crear engine SQLAlchemy
engine = create_engine(DATABASE_URL)

# Crear sesión local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarar modelo base
Base = declarative_base()

# Dependencia para inyectar sesión
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
