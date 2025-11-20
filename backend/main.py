import os
from fastapi import FastAPI, Form, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from twilio.twiml.messaging_response import MessagingResponse
from datetime import datetime
from typing import List

# --- CONFIGURATION ---
# Update with your Postgres credentials: postgresql://user:password@localhost/dbname
DATABASE_URL = os.getenv("DATABASE_url", "postgresql://neondb_owner:npg_e7Gqrd8JhQlN@ep-patient-butterfly-a4qk94jh.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# --- DATABASE SETUP ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    contact_number = Column(String)
    user_name = Column(String)
    product_name = Column(String)
    product_review = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# --- APP & STATE ---
app = FastAPI()

# Allow CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In-memory state management for conversation flow
# Structure: { 'phone_number': {'step': 0, 'data': {}} }
# Steps: 0=Start, 1=Asked Product, 2=Asked Name, 3=Asked Review
conversation_state = {}

# --- ROUTES ---

@app.post("/whatsapp")
async def whatsapp_webhook(From: str = Form(...), Body: str = Form(...), db: Session = Depends(get_db)):
    """
    Handle incoming WhatsApp messages via Twilio Webhook.
    """
    response = MessagingResponse()
    msg = response.message()
    
    user_input = Body.strip()
    sender = From
    
    # Initialize state if new user
    if sender not in conversation_state:
        conversation_state[sender] = {"step": 0, "data": {}}

    state = conversation_state[sender]
    step = state["step"]

    # --- CONVERSATION FLOW ---
    
    if step == 0:
        # Initial Greeting
        msg.body("Hi! Which product is this review for?")
        state["step"] = 1
        
    elif step == 1:
        # Capture Product Name, Ask for User Name
        state["data"]["product_name"] = user_input
        msg.body("Got it. What's your name?")
        state["step"] = 2
        
    elif step == 2:
        # Capture User Name, Ask for Review
        state["data"]["user_name"] = user_input
        product = state["data"]["product_name"]
        msg.body(f"Thanks {user_input}. Please send your review for {product}.")
        state["step"] = 3
        
    elif step == 3:
        # Capture Review, Save to DB, Reset
        state["data"]["product_review"] = user_input
        
        # Save to Postgres
        new_review = Review(
            contact_number=sender,
            user_name=state["data"]["user_name"],
            product_name=state["data"]["product_name"],
            product_review=state["data"]["product_review"]
        )
        db.add(new_review)
        db.commit()
        
        msg.body(f"Thanks {state['data']['user_name']} -- your review for {state['data']['product_name']} has been recorded.")
        
        # Reset state so they can review another product
        del conversation_state[sender]

    return Response(content=str(response), media_type="application/xml")

@app.get("/api/reviews")
def get_reviews(db: Session = Depends(get_db)):
    """
    Fetch all reviews for the Frontend.
    """
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return reviews

# Helper to return XML response for Twilio
from fastapi import Response