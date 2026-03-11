from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'momentrashoot@gmail.com')

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    booking_date: str
    duration: str
    location: str
    additional_notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    booking_date: str
    duration: str
    location: str
    additional_notes: Optional[str] = ""

class Membership(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    city: str
    customer_type: str
    message: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MembershipCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    city: str
    customer_type: str
    message: Optional[str] = ""

class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLoginResponse(BaseModel):
    token: str
    email: str

class SearchQuery(BaseModel):
    query: Optional[str] = ""
    date_from: Optional[str] = None
    date_to: Optional[str] = None

async def send_email_notification(subject: str, html_content: str):
    if not resend.api_key or resend.api_key == '':
        logging.warning("Resend API key not configured, skipping email")
        return
    
    params = {
        "from": SENDER_EMAIL,
        "to": [NOTIFICATION_EMAIL],
        "subject": subject,
        "html": html_content
    }
    
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Email sent: {subject}")
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")

def create_token(email: str) -> str:
    payload = {
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.get("/")
async def root():
    return {"message": "Momentra API"}

@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login: AdminLogin):
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@momentra.com')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    if login.email != admin_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if login.password != admin_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(login.email)
    return AdminLoginResponse(token=token, email=login.email)

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate):
    booking_dict = booking.model_dump()
    booking_obj = Booking(**booking_dict)
    
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    
    duration_prices = {
        '1hr': '₹1999',
        '2hr': '₹3999',
        'halfday': '₹5999',
        'fullday': '₹9999'
    }
    price = duration_prices.get(booking.duration, 'N/A')
    
    email_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #450a0a 0%, #DC2626 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Booking Received!</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <h2 style="color: #DC2626;">Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.full_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.booking_date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Duration:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.duration}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Price:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{price}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Location:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.location}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Notes:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{booking.additional_notes or 'None'}</td>
                    </tr>
                </table>
            </div>
        </body>
    </html>
    """
    
    asyncio.create_task(send_email_notification(
        f"New Booking: {booking.full_name} - {booking.booking_date}",
        email_html
    ))
    
    return booking_obj

@api_router.post("/admin/bookings/search", response_model=List[Booking])
async def search_bookings(search: SearchQuery, email: str = Depends(verify_token)):
    query = {}
    
    if search.query:
        query["$or"] = [
            {"full_name": {"$regex": search.query, "$options": "i"}},
            {"email": {"$regex": search.query, "$options": "i"}},
            {"phone": {"$regex": search.query, "$options": "i"}}
        ]
    
    projection = {
        "_id": 0,
        "id": 1,
        "full_name": 1,
        "email": 1,
        "phone": 1,
        "booking_date": 1,
        "duration": 1,
        "location": 1,
        "additional_notes": 1,
        "created_at": 1
    }
    
    bookings = await db.bookings.find(query, projection).sort("created_at", -1).limit(500).to_list(500)
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    return bookings

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    projection = {
        "_id": 0,
        "id": 1,
        "full_name": 1,
        "email": 1,
        "phone": 1,
        "booking_date": 1,
        "duration": 1,
        "location": 1,
        "additional_notes": 1,
        "created_at": 1
    }
    
    bookings = await db.bookings.find({}, projection).sort("created_at", -1).limit(500).to_list(500)
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    return bookings

@api_router.post("/memberships", response_model=Membership)
async def create_membership(membership: MembershipCreate):
    membership_dict = membership.model_dump()
    membership_obj = Membership(**membership_dict)
    
    doc = membership_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.memberships.insert_one(doc)
    
    email_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #450a0a 0%, #DC2626 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Member Registration!</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
                <h2 style="color: #DC2626;">Member Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{membership.full_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{membership.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{membership.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>City:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{membership.city}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Customer Type:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{membership.customer_type}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{membership.message or 'None'}</td>
                    </tr>
                </table>
            </div>
        </body>
    </html>
    """
    
    asyncio.create_task(send_email_notification(
        f"New Member: {membership.full_name}",
        email_html
    ))
    
    return membership_obj

@api_router.post("/admin/memberships/search", response_model=List[Membership])
async def search_memberships(search: SearchQuery, email: str = Depends(verify_token)):
    query = {}
    
    if search.query:
        query["$or"] = [
            {"full_name": {"$regex": search.query, "$options": "i"}},
            {"email": {"$regex": search.query, "$options": "i"}},
            {"city": {"$regex": search.query, "$options": "i"}}
        ]
    
    projection = {
        "_id": 0,
        "id": 1,
        "full_name": 1,
        "email": 1,
        "phone": 1,
        "city": 1,
        "customer_type": 1,
        "message": 1,
        "created_at": 1
    }
    
    memberships = await db.memberships.find(query, projection).sort("created_at", -1).limit(500).to_list(500)
    for membership in memberships:
        if isinstance(membership['created_at'], str):
            membership['created_at'] = datetime.fromisoformat(membership['created_at'])
    return memberships

@api_router.get("/memberships", response_model=List[Membership])
async def get_memberships():
    projection = {
        "_id": 0,
        "id": 1,
        "full_name": 1,
        "email": 1,
        "phone": 1,
        "city": 1,
        "customer_type": 1,
        "message": 1,
        "created_at": 1
    }
    
    memberships = await db.memberships.find({}, projection).sort("created_at", -1).limit(500).to_list(500)
    for membership in memberships:
        if isinstance(membership['created_at'], str):
            membership['created_at'] = datetime.fromisoformat(membership['created_at'])
    return memberships

@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact: ContactCreate):
    contact_dict = contact.model_dump()
    contact_obj = Contact(**contact_dict)
    
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contacts.insert_one(doc)
    return contact_obj

@api_router.post("/admin/contacts/search", response_model=List[Contact])
async def search_contacts(search: SearchQuery, email: str = Depends(verify_token)):
    query = {}
    
    if search.query:
        query["$or"] = [
            {"name": {"$regex": search.query, "$options": "i"}},
            {"email": {"$regex": search.query, "$options": "i"}}
        ]
    
    projection = {
        "_id": 0,
        "id": 1,
        "name": 1,
        "email": 1,
        "message": 1,
        "created_at": 1
    }
    
    contacts = await db.contacts.find(query, projection).sort("created_at", -1).limit(500).to_list(500)
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts():
    projection = {
        "_id": 0,
        "id": 1,
        "name": 1,
        "email": 1,
        "message": 1,
        "created_at": 1
    }
    
    contacts = await db.contacts.find({}, projection).sort("created_at", -1).limit(500).to_list(500)
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

@api_router.get("/admin/stats")
async def get_admin_stats(email: str = Depends(verify_token)):
    bookings_count = await db.bookings.count_documents({})
    memberships_count = await db.memberships.count_documents({})
    contacts_count = await db.contacts.count_documents({})
    
    return {
        "bookings": bookings_count,
        "memberships": memberships_count,
        "contacts": contacts_count
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()