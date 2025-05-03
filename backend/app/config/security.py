"""
Security utilities and configuration for the API.
"""

from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Union

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config.settings import settings

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hashed version.
    
    Args:
        plain_password: The plain text password
        hashed_password: The hashed password
        
    Returns:
        bool: True if the password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generate a hashed version of a password.
    
    Args:
        password: The plain text password
    
    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: The data to encode in the JWT
        expires_delta: Optional expiration time delta
        
    Returns:
        str: The encoded JWT token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm="HS256"
    )
    
    return encoded_jwt 