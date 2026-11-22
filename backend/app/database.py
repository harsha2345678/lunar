# Database initialization and SQLite connection
import os
import sqlite3
from typing import Generator
from app.config import settings

DB_FILE = settings.database_url.replace("sqlite:///", "")

def get_db_connection() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(os.path.abspath(DB_FILE)), exist_ok=True) if os.path.dirname(DB_FILE) else None
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_sqlite_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        status TEXT NOT NULL,
        progress_pct INTEGER DEFAULT 0,
        stage_label TEXT,
        gsd_mpp REAL DEFAULT 0.50,
        noise_reduce BOOLEAN DEFAULT 1,
        contrast_enhance BOOLEAN DEFAULT 1,
        radiometric_cal BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS boulder_detections (
        id TEXT PRIMARY KEY,
        analysis_id TEXT NOT NULL,
        boulder_id TEXT NOT NULL,
        confidence REAL NOT NULL,
        diameter_m REAL NOT NULL,
        hazard_class TEXT NOT NULL,
        latitude_deg REAL,
        longitude_deg REAL,
        bbox_left_pct REAL,
        bbox_top_pct REAL,
        bbox_width_pct REAL,
        bbox_height_pct REAL,
        FOREIGN KEY (analysis_id) REFERENCES analyses (id)
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp_utc TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT 0
    )
    """)
    conn.commit()
    conn.close()
