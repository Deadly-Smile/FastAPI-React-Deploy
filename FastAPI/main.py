import os
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from schemas import Token, UserOut, UserLogin, UserCreate
from auth import (
    authenticate_user, 
    create_access_token, 
    get_current_user, 
    get_current_active_user, 
    get_password_hash, 
    get_user_by_username, 
    get_user_by_email
)
from database import create_db_and_tables, get_db, DBUser
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="FastAPI JWT Auth with SQLite Example",
    description="A FastAPI app demonstrating JWT authentication and user storage with SQLite.",
    version="0.0.1",
)

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
    "https://fast-api-react-deploy.vercel.app/*",
    "http://fast-api-react-deploy.vercel.app/*",
    "https://fast-api-react-deploy.vercel.app",
    "http://fast-api-react-deploy.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    print("Database tables created/checked.")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI JWT Auth with SQLite Example!"}

@app.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        db_user_by_username = get_user_by_username(db, user.username)
        if db_user_by_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already registered"
            )
        
        db_user_by_email = get_user_by_email(db, user.email)
        if db_user_by_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        hashed_password = get_password_hash(user.password)
        db_user = DBUser(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            is_active=True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return UserOut.model_validate(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred during registration."
        )


@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me/", response_model=UserOut)
async def read_users_me(
    current_user: UserOut = Depends(get_current_active_user) 
):
    return current_user


@app.get("/protected-data/")
async def get_protected_data(
    current_user: UserOut = Depends(get_current_active_user) 
):
    return {"message": f"Hello {current_user.username}! This is sensitive data accessible only to authenticated users."}

