from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import calculator_router

app = FastAPI(
    title="Gratify Pro API",
    description="API for calculating gratuity using the Payment of Gratuity Act, 1972",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://gratify-pro.vercel.app",  # Production frontend
        "https://*.vercel.app"  # Any Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(calculator_router)

@app.get("/")
async def root():
    """
    Root endpoint that returns a simple welcome message.
    """
    return {"message": "Welcome to Gratify Pro API"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API is up and running.
    """
    return {"status": "healthy"} 