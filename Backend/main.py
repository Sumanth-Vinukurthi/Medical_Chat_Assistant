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
from rag_tools import chunk_text, generate_embeddings, search_documents, system_prompt_for_agent, system_prompt,prompt,parse_llm_json_output
import os, json
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware
# from fastapi import HT


Base.metadata.create_all(bind = engine)


app = FastAPI()


load_dotenv()

try:

    GEMINI_API_KEY = os.getenv("api_key")

    # Use LLM based on Your availability

    gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0.3, google_api_key=GEMINI_API_KEY)

    #Please Change "model = llm" in "create_agent" if using Ollama

    llm = ChatOllama(model = "llama3.1:8b") 

except Exception as e:

    print(f"Exception : Please provide api_key in .env file or {e}" )


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

        print(user.role)

        if user:

            return {
                    "status": "success",
                    "role": user.role
                    }
        
        else:

            return {
                    "status": "error",
                    "message": "User doesn't exist"
                    }
    
    except Exception as e :

        print("Exception : ",e)



@app.post("/chat")
def master_api(query : Query, db: Session = Depends(get_db)):

    try:

        medicine_details = {

            "fever":[
                "Paracetamol (Acetaminophen), Dose (Adult): 500 mg – 650 mg every 6 hours if fever > 100°F, Max: 3,000 mg/day (do NOT cross)",
                "Ibuprofen : Stronger than paracetamol (also anti-inflammatory), Dose (Adult): 200–400 mg every 8 hours after food, Max: 1,200 mg/day (OTC safe range)",
                "Nimesulide : Very effective but use cautiously, Dose (Adult): 100 mg twice daily after food, ⚠ Not for long use (can affect liver) Only 1–2 days if needed."
                     ],
            "cold":[
                "Cetirizine: Best for: sneezing, watery nose, allergy-type cold, Dose (Adult): 10 mg once daily (usually at night)",
                "Phenylephrine: Best for: blocked nose / nasal congestion, Dose (Adult):5–10 mg every 6–8 hrs (often inside combination cold tablets)",
                "Paracetamol Best for: cold with fever, headache, body pain, Dose (Adult): 500–650 mg every 6 hrs if needed (Max 3,000 mg/day)"
                ],
            "cough":[
                "Dextromethorphan: Stops the cough reflex, Dose (Adult): 10–20 mg every 6–8 hours",
                "Ambroxol: Loosens thick mucus so you can cough it out, Dose (Adult): 30 mg 2–3 times daily",
                "Acetylcysteine: Breaks down stubborn mucus, Dose (Adult): 600 mg once daily (or 200 mg 3×/day)"
                ]

            }
        
        initial_suggestions=["Medicine for fever ?","Medicine for cold ?","Medicine for cough ?"]
        # follow_ups = ["Who should not use paracetamol ?","Who should not use Cetirizine ?","Who should not use paracetamol ?"]


        if query.query == initial_suggestions[0]:

            return [" | ".join(medicine_details["fever"]),[]]
        
        elif query.query == initial_suggestions[1]:

            return [" | ".join(medicine_details["cold"]),[]]
        
        elif query.query == initial_suggestions[2]:

            return [" | ".join(medicine_details["cough"]),[]]
        
        else:

            retrieved_chunks = search_documents( db, query.query )

            @tool
            def rag_tool():

                '''Use this tool for context for RAG'''

                return "Always answer from the documents chunks you will receive."

            agent = create_agent(
                    model= gemini_llm,
                    tools=[rag_tool],
                    system_prompt = prompt
                    )

            agent_response = agent.invoke({
                        "messages": [
                            {"role": "user", "content": f"User Query : {query.query}\n\nContext:\n{retrieved_chunks}"}
                        ]
                    })
        
            raw_text = agent_response["messages"][-1].content
            response = parse_llm_json_output(raw_text)
            return response

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