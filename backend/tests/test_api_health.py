"""
Tests for the health check API endpoints.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    """Test that the health check endpoint returns a success response."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["message"] == "API is healthy"


def test_version_endpoint():
    """Test that the version endpoint returns correct information."""
    response = client.get("/api/v1/health/version")
    assert response.status_code == 200
    assert "name" in response.json()
    assert "version" in response.json()
    assert "description" in response.json() 