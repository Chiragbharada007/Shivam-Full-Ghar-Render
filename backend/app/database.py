from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

db_url = settings.normalized_database_url
is_sqlite = db_url.startswith("sqlite")

if is_sqlite:
    connect_args = {"check_same_thread": False}
else:
    # Ensure isolated schema exists on shared PostgreSQL instances
    bootstrap_engine = create_engine(db_url, pool_pre_ping=True)
    with bootstrap_engine.connect() as conn:
        conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{settings.db_schema}"'))
        conn.commit()
    bootstrap_engine.dispose()
    connect_args = {"options": f"-csearch_path={settings.db_schema},public"}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
