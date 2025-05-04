# Gratify Pro

A comprehensive application for calculating gratuity using the Payment of Gratuity Act, 1972. This application provides both individual and bulk calculation options for gratuity amounts.

## Tech Stack

- **Frontend**: Next.js with TypeScript and App Router
- **Backend**: FastAPI with Python
- **Development**: Configured environments for seamless development

## Project Structure

- `/frontend` - Next.js application
- `/backend` - FastAPI application
- `/scripts` - Utility scripts
- `/tasks` - Task management files

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

## Development

Both the frontend and backend include hot-reloading for a smooth development experience. The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## API Documentation

Once the backend server is running, API documentation is automatically available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 