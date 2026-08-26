from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() == "true"

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "ai_attendance")

if USE_SQLITE:
    DATABASE_URL = "sqlite:///./ai_attendance.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    import time
    engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                print("[INFO] Successfully connected to MySQL database.")
                break
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"[WARNING] MySQL connection failed. Retrying in 5 seconds... ({e})")
                time.sleep(5)
            else:
                print(f"[ERROR] MySQL connection failed after {max_retries} attempts. Falling back to SQLite.")
                DATABASE_URL = "sqlite:///./ai_attendance.db"
                engine = create_engine(
                    DATABASE_URL,
                    connect_args={"check_same_thread": False},
                    echo=False
                )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
