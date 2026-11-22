# Database initialization script
import os
import sys

# Ensure app is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import init_sqlite_db

if __name__ == "__main__":
    print("Initializing SQLite database tables for Lunar Sentry AI...")
    init_sqlite_db()
    print("Database tables initialized successfully!")
