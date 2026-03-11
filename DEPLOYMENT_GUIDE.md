# Momentra - Deployment & Admin Guide

## 🎬 About Momentra

A premium cinematic videography booking platform with real-time admin dashboard, automated email notifications, and secure authentication.

---

## 📋 Features Implemented

### Public Features
- ✅ **Home Page**: Cinematic hero section with CTAs
- ✅ **About Page**: Service introduction with features
- ✅ **Book a Slot**: Pricing cards (1hr: ₹1999, 2hr: ₹3999, Half Day: ₹5999, Full Day: ₹9999)
- ✅ **Become a Member**: Registration form for customers
- ✅ **Contact Us**: Business info + contact form

### Admin Features
- ✅ **Secure Admin Login**: JWT-based authentication
- ✅ **Real-time Dashboard**: Auto-refreshes every 5 seconds
- ✅ **Search & Filter**: Search bookings, members, contacts by name/email
- ✅ **Email Notifications**: Instant email alerts for new bookings/members
- ✅ **Statistics Overview**: Total counts for bookings, members, contacts

---

## 🔐 Admin Access

### Admin Login
**URL**: `https://videography-hub-4.preview.emergentagent.com/admin/login`

**Default Credentials**:
- Email: `admin@momentra.com`
- Password: `Momentra@2024`

**To Change Admin Credentials**:
Edit `/app/backend/.env`:
```env
ADMIN_EMAIL="your-email@domain.com"
ADMIN_PASSWORD="YourSecurePassword123"
```

---

## 📧 Email Notifications Setup

Emails are sent to: **momentrashoot@gmail.com**

### Configure Resend API (For Production Email)

1. **Sign up at Resend**: https://resend.com
2. **Get API Key**: Dashboard → API Keys → Create API Key
3. **Verify Domain** (Required for production):
   - Go to Resend Dashboard → Domains
   - Add your domain and configure DNS records
4. **Update Environment Variables** in `/app/backend/.env`:
   ```env
   RESEND_API_KEY="re_your_actual_api_key_here"
   SENDER_EMAIL="booking@yourdomain.com"
   NOTIFICATION_EMAIL="momentrashoot@gmail.com"
   ```
5. **Restart Backend**:
   ```bash
   sudo supervisorctl restart backend
   ```

**Note**: Without a verified domain, Resend only sends to verified email addresses in test mode.

---

## 🚀 Deployment to Vercel (momentra.vercel.app)

### Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account (for production database)

### Step 1: MongoDB Atlas Setup

1. Go to https://mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Configure Database Access:
   - Create a database user with username and password
4. Configure Network Access:
   - Add IP: `0.0.0.0/0` (allow from anywhere)
5. Get Connection String:
   - Click "Connect" → "Connect your application"
   - Copy: `mongodb+srv://username:password@cluster.mongodb.net/`

### Step 2: Deploy Backend (Railway/Render)

**Option A: Railway (Recommended)**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set Root Directory: `backend`
5. Add Environment Variables:
   ```
   MONGO_URL=mongodb+srv://your-connection-string
   DB_NAME=momentra
   ADMIN_EMAIL=admin@momentra.com
   ADMIN_PASSWORD=Momentra@2024
   JWT_SECRET=your-secure-random-string-here
   RESEND_API_KEY=your_resend_api_key
   SENDER_EMAIL=booking@yourdomain.com
   NOTIFICATION_EMAIL=momentrashoot@gmail.com
   CORS_ORIGINS=https://momentra.vercel.app,https://*.vercel.app
   ```
6. Deploy and copy your backend URL (e.g., `https://momentra-api.railway.app`)

**Option B: Render**
1. Go to https://render.com
2. Create New → Web Service
3. Connect your GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add same environment variables as above
6. Deploy and copy your backend URL

### Step 3: Deploy Frontend to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel Dashboard**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `frontend` (or `app/frontend`)
     - **Framework Preset**: Create React App
     - **Build Command**: `yarn build`
     - **Output Directory**: `build`

3. **Environment Variables in Vercel**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**: Click "Deploy"

5. **Custom Domain**:
   - Go to Project Settings → Domains
   - Vercel subdomains (like `momentra.vercel.app`) are automatically available
   - If the name is available, add it
   - Or add your custom domain and update DNS records

### Step 4: Update CORS in Backend

After deploying frontend, update your backend's CORS_ORIGINS environment variable to include your Vercel domain:
```
CORS_ORIGINS=https://momentra.vercel.app,https://*.vercel.app
```

---

## 🗄️ Database Structure

### Collections

**bookings**
```json
{
  "id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "booking_date": "string",
  "duration": "1hr|2hr|halfday|fullday",
  "location": "string",
  "additional_notes": "string",
  "created_at": "datetime"
}
```

**memberships**
```json
{
  "id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "customer_type": "Creator|Business|Personal",
  "message": "string",
  "created_at": "datetime"
}
```

**contacts**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "message": "string",
  "created_at": "datetime"
}
```

---

## 🔧 Local Development

### Backend
```bash
cd /app/backend
source /root/.venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd /app/frontend
yarn install
yarn start
```

---

## 📞 Contact Information

- **Email**: momentrashoot@gmail.com
- **Phone**: +91 89103 61800
- **Instagram**: @momentrashoot
- **Location**: Hyderabad, India

---

## 🎨 Design Features

- **Theme**: Deep cinematic red gradient (burgundy to crimson)
- **Typography**: Playfair Display (serif) for headings, Manrope for body
- **Effects**: Glassmorphism cards, smooth animations, hover effects
- **Responsive**: Fully mobile-optimized navigation and layouts

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Framer Motion, Shadcn/UI
- **Backend**: FastAPI (Python), JWT Authentication
- **Database**: MongoDB with Motor (async driver)
- **Email**: Resend API
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

---

## 📝 Support

For deployment assistance or technical support, contact the development team or refer to:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
