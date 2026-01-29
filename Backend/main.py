from fastapi import FastAPI, UploadFile, File, Form, Depends
from typing import Optional
from langchain_ollama import ChatOllama
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool
from database import get_db, engine
from dbmodels import Base, Users, Embeddings
from models import Credentials, User, Query
from sqlalchemy.orm import Session
from rag_tools import chunk_text, generate_embeddings, search_documents, system_prompt_for_agent, system_prompt,prompt
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind = engine)

llm = ChatOllama(model = "llama3.1:8b")

app = FastAPI()

load_dotenv()

GEMINI_API_KEY = os.getenv("api_key")

gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0.3, google_api_key=GEMINI_API_KEY)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)



@app.post("/register")
def register_api(credentials : Credentials, db: Session = Depends(get_db)):

    try:

      

        exists = db.query(Users).filter(
                                Users.username==credentials.username,
                                Users.password==credentials.password,
                                Users.role==credentials.role
                                ).first()
        
        if exists:

            return "User already exists"
        
        else:

            user = Users(
                username = credentials.username,
                password = credentials.password,
                role = credentials.role
                )

            db.add(user)
            
            db.commit()

            return "Succesfully registered."
    
    except Exception as e:

        print("Exception : ",e)

   

@app.post("/login")
def login_api(user : User, db: Session = Depends(get_db) ):

    try:
    
        user = db.query(Users).filter(Users.username == user.username, Users.password == user.password).first()

        if user:

            return "User exists"
        
        else:

            return "User doesn't exist, please register."
    
    except Exception as e :

        print("Exception : ",e)



@app.post("/chat")
def master_api(query : Query, db: Session = Depends(get_db)):

    try:

        retrieved_chunks = search_documents( db, query.query )

        print(retrieved_chunks)

        agent = create_agent(
                model= gemini_llm,
                tools=[],
                system_prompt = system_prompt
                )


        response = agent.invoke({
            "messages":[{"role":"user","content":query.query,
                         "role":"user","content":retrieved_chunks}]
        })


        return response["messages"][-1].content

    except Exception as e:

        print("Exception : ",e)

    


@app.post("/chat/file")
async def upload_file(title : str = Form(...),file : Optional[UploadFile] = File(None), db: Session = Depends(get_db) ):

    try:

        document = db.query(Embeddings).filter(Embeddings.document_name==title).first()

        if document:

            return "Document already exists !"
        
        else:

            raw_bytes = await file.read()
            document_text = raw_bytes.decode("utf-8", errors = "ignore")

            chunks = chunk_text(document_text)
            embeddings = generate_embeddings(chunks)


            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                db.add(Embeddings(document_name=title, chunk=chunk, embedding=embedding.tolist()))
            db.commit()

            return "Successfully uploaded document"
    
    except Exception as e:

        print("Exception : ",e)