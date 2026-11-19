import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Set USE_SQLITE=false to prioritize MySQL
USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() == "true"

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "ai_attendance")

encoded_password = urllib.parse.quote_plus(DB_PASSWORD)

def ensure_mysql_database():
    """Auto-creates the MySQL database if it does not exist."""
    try:
        import pymysql
        conn = pymysql.connect(
            host=DB_HOST,
            port=int(DB_PORT),
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=5,
        )
        with conn.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            )
        conn.commit()
        conn.close()
        print(f"[INFO] MySQL database `{DB_NAME}` verified/created on {DB_HOST}:{DB_PORT}.")
    except Exception as e:
        print(f"[WARNING] MySQL auto-database creation notice: {e}")

if not USE_SQLITE:
    ensure_mysql_database()
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    try:
        engine = create_engine(
            DATABASE_URL,
            echo=False,
            pool_pre_ping=True,
            pool_recycle=3600,
        )
        with engine.connect() as conn:
            print(f"[INFO] Successfully connected to MySQL database: `{DB_NAME}`")
    except Exception as e:
        print(f"[WARNING] Could not connect to MySQL server ({e}). Falling back to SQLite.")
        DATABASE_URL = "sqlite:///./ai_attendance.db"
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
            echo=False,
        )
else:
    DATABASE_URL = "sqlite:///./ai_attendance.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
    print("[INFO] Using SQLite database fallback (ai_attendance.db).")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
