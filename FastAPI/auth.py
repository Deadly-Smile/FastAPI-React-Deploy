import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import DBUser, get_db
from schemas import TokenData, UserInDB

# --- Configuration for JWT ---
# Load secret key and algorithm from environment variables for security.
# In a real application, you'd use a robust way to manage secrets.
# For Vercel, these will be set in the Vercel project settings.
SECRET_KEY = os.getenv("SECRET_KEY", "your_default_super_secret_key") # CHANGE THIS IN .env!
ALGORITHM = os.getenv("ALGORITHM", "HS256") # HS256 is a common symmetric algorithm

# --- Password Hashing ---
# CryptContext handles password hashing and verification.
# 'bcrypt' is a strong, recommended hashing algorithm.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- OAuth2PasswordBearer for token handling ---
# This tells FastAPI where to expect the token (in the Authorization header,
# with the "Bearer" prefix) and which URL to use for authentication (e.g., login).
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Helper Functions for Password Hashing ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    return pwd_context.hash(password)

# --- Helper Function for JWT Creation ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT access token.

    Args:
        data (dict): The payload to encode into the token (e.g., {"sub": "username"}).
        expires_delta (timedelta, optional): How long the token should be valid.
                                            If None, defaults to 15 minutes.

    Returns:
        str: The encoded JWT token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default expiration: 15 minutes
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire}) # Add expiration timestamp to the payload
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Database Interaction Functions ---
def get_user_by_username(db: Session, username: str) -> Optional[DBUser]:
    """Retrieves a user from the database by username."""
    # Use select() to build a SELECT query
    stmt = select(DBUser).where(DBUser.username == username)
    # Execute the query and fetch the first result
    return db.execute(stmt).scalars().first()

def get_user_by_email(db: Session, email: str) -> Optional[DBUser]:
    """Retrieves a user from the database by email."""
    stmt = select(DBUser).where(DBUser.email == email)
    return db.execute(stmt).scalars().first()


def authenticate_user(db: Session, username: str, password: str) -> Optional[DBUser]:
    """
    Authenticates a user by checking username and password against the database.

    Args:
        db (Session): The SQLAlchemy database session.
        username (str): The username provided by the user.
        password (str): The plain password provided by the user.

    Returns:
        Optional[DBUser]: The DBUser object if authentication is successful and user is active, else None.
    """
    user = get_user_by_username(db, username)
    if not user or not user.is_active: # Check if user exists and is active
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# --- FastAPI Dependency for Current User ---
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db) # New: Inject database session
) -> UserInDB:
    """
    FastAPI dependency to get the current authenticated user from a JWT token.
    Fetches the user from the database to ensure they are active.

    Args:
        token (str): The JWT token extracted by OAuth2PasswordBearer.
        db (Session): The SQLAlchemy database session.

    Returns:
        UserInDB: The data (payload) from the decoded token, after verifying user exists and is active.

    Raises:
        HTTPException: If the token is invalid or authentication fails.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError: # Handles various JWT errors (e.g., invalid signature, expired token)
        raise credentials_exception
    
    # Fetch user from the database using the username from the token
    user = get_user_by_username(db, username)
    if user is None or not user.is_active: # Ensure user exists and is active
        raise credentials_exception
    
    # Return UserInDB model
    return UserInDB.model_validate(user) # Use model_validate for Pydantic v2+


# --- FastAPI Dependency for Current Active User ---
# You might want a separate dependency to ensure the user is not just authenticated
# but also specifically marked as active.
async def get_current_active_user(
    current_user: UserInDB = Depends(get_current_user)
) -> UserInDB:
    """
    FastAPI dependency to get the current active authenticated user.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

