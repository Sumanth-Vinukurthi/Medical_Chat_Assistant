from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.dialects.postgresql import ARRAY
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Users(Base):


    id = Column(Integer, primary_key = True, index= True)
    username = Column(String)
    password = Column(String)
    role = Column(String)

    __tablename__ = "users"


class Embeddings(Base):

    __tablename__ = "embeddings"

    id = Column(Integer, primary_key=True, index=True)
    document_name = Column(String, index=True, nullable=False)
    chunk = Column(Text)
    embedding = Column(Vector(384))  # 384 is the size of the embeddings we are using