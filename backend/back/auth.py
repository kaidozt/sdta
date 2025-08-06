from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from back.database import get_db
from back.models import Usuario
from back.schemas import UsuarioCreate, UsuarioOut, Token
from back.security import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    authenticate_user,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UsuarioOut)
def register(user: UsuarioCreate, db: Session = Depends(get_db)):
    """Registra un nuevo usuario"""
    # Verificar si el usuario ya existe
    db_user = db.query(Usuario).filter(Usuario.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario ya está registrado"
        )
    
    # Verificar si el email ya existe
    if user.email:
        db_email = db.query(Usuario).filter(Usuario.email == user.email).first()
        if db_email:
            raise HTTPException(
                status_code=400,
                detail="El email ya está registrado"
            )
    
    # Crear nuevo usuario
    hashed_password = get_password_hash(user.password)
    db_user = Usuario(
        username=user.username,
        password_hash=hashed_password,
        role=user.role,
        nombre=user.nombre,
        email=user.email
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Inicia sesión y retorna un token JWT"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.estado:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario deshabilitado"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UsuarioOut)
def read_users_me(current_user: Usuario = Depends(get_current_user)):
    """Obtiene información del usuario actual"""
    return current_user
