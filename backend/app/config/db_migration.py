import logging
from sqlalchemy import inspect, text
from app.config.database import engine, Base

logger = logging.getLogger("uvicorn")

def migrate_db():
    """
    Safely alter existing database tables to add new columns if they do not exist yet.
    """
    try:
        Base.metadata.create_all(bind=engine)
        inspector = inspect(engine)
        
        # 1. Update students table
        if inspector.has_table("students"):
            columns = [c["name"] for c in inspector.get_columns("students")]
            with engine.connect() as conn:
                if "parent_name" not in columns:
                    conn.execute(text("ALTER TABLE students ADD COLUMN parent_name VARCHAR(100)"))
                    logger.info("[MIGRATION] Added parent_name column to students table.")
                if "parent_phone" not in columns:
                    conn.execute(text("ALTER TABLE students ADD COLUMN parent_phone VARCHAR(20)"))
                    logger.info("[MIGRATION] Added parent_phone column to students table.")
                if "parent_email" not in columns:
                    conn.execute(text("ALTER TABLE students ADD COLUMN parent_email VARCHAR(100)"))
                    logger.info("[MIGRATION] Added parent_email column to students table.")
                if "password" not in columns:
                    conn.execute(text("ALTER TABLE students ADD COLUMN password VARCHAR(255)"))
                    logger.info("[MIGRATION] Added password column to students table.")
                conn.commit()

        # 2. Update teachers table
        if inspector.has_table("teachers"):
            columns = [c["name"] for c in inspector.get_columns("teachers")]
            with engine.connect() as conn:
                if "password" not in columns:
                    conn.execute(text("ALTER TABLE teachers ADD COLUMN password VARCHAR(255)"))
                    logger.info("[MIGRATION] Added password column to teachers table.")
                conn.commit()

        logger.info("[MIGRATION] Database schema check & auto-migration completed successfully.")
    except Exception as e:
        logger.warning(f"[MIGRATION WARNING] Auto-migration error: {e}")
