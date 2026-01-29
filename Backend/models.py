from pydantic import BaseModel
from fastapi import UploadFile


class Credentials(BaseModel):

    username : str
    password : str
    role : str

class User(BaseModel):

    username : str
    password : str

class Document(BaseModel):

    title : str
    file : UploadFile

class Query(BaseModel):

    query : str