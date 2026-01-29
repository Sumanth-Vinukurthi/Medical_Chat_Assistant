from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "postgresql://postgres:root@localhost:5432/medical_assistant"

engine = create_engine(db_url)

Session = sessionmaker(autoflush=False , autocommit=False, bind = engine)

print(type(Session))

def get_db():

    db = Session()
    try:
        yield db
    finally:
        db.close()
