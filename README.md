# 🎬 MovieApp — Full Stack Movie Review System

ระบบจัดการและรีวิวหนัง แบบ Full Stack สร้างด้วย React + Django + PostgreSQL พร้อมระบบ Authentication ด้วย JWT

---

## 📋 สารบัญ

- [ภาพรวมระบบ](#ภาพรวมระบบ)
- [Tech Stack](#tech-stack)
- [โครงสร้าง Folder](#โครงสร้าง-folder)
- [ฟีเจอร์ทั้งหมด](#ฟีเจอร์ทั้งหมด)
- [API Endpoints](#api-endpoints)
- [การติดตั้งและรันโปรเจกต์](#การติดตั้งและรันโปรเจกต์)
- [การเปิดใช้งานแต่ละส่วน](#การเปิดใช้งานแต่ละส่วน)
- [หน้าเว็บและการใช้งาน](#หน้าเว็บและการใช้งาน)
- [คำแนะนำสำหรับการพัฒนาต่อ](#คำแนะนำสำหรับการพัฒนาต่อ)

---

## ภาพรวมระบบ

MovieApp เป็นระบบ CRUD สำหรับจัดการรายการหนัง โดยผู้ใช้สามารถ:

- เพิ่ม / แก้ไข / ลบ หนัง พร้อมรูปภาพ
- ให้คะแนนหนัง (Rating) 1–10 คะแนน
- เขียนรีวิวหนัง (Review)
- แสดงความคิดเห็นใต้รีวิว (Comment)
- ระบบ Authentication ด้วย JWT (Login / Register)
- คำนวณคะแนนเฉลี่ยอัตโนมัติ

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + Vite | React 19, Vite 8 |
| Styling | Tailwind CSS | v4 |
| HTTP Client | Axios | latest |
| Routing | React Router DOM | v7 |
| Backend | Django | v6 |
| REST API | Django REST Framework | latest |
| Authentication | SimpleJWT | latest |
| CORS | django-cors-headers | latest |
| Image Upload | Pillow | latest |
| Database | PostgreSQL | v16 |
| Container | Docker + Docker Compose | v28 |
| Version Control | Git + GitHub | - |
| Editor | VSCode | - |
| API Testing | Postman | - |
| Terminal | PowerShell | - |

---

## โครงสร้าง Folder

```
movieapp/
│
├── .gitignore
│
├── frontend/                        # React Application
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance + JWT interceptor
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global Auth state (login/logout)
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # หน้าเข้าสู่ระบบ
│   │   │   ├── RegisterPage.jsx     # หน้าสมัครสมาชิก
│   │   │   ├── MovieListPage.jsx    # หน้าแสดงหนังทั้งหมด
│   │   │   ├── MovieDetailPage.jsx  # หน้าดูหนัง + Review + Rating + Comment
│   │   │   ├── MovieCreatePage.jsx  # หน้าเพิ่มหนัง
│   │   │   └── MovieEditPage.jsx    # หน้าแก้ไขหนัง
│   │   ├── App.jsx                  # Routes ทั้งหมด
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind import
│   ├── package.json
│   └── vite.config.js               # Vite config + Proxy
│
├── backend/                         # Django Application
│   ├── config/
│   │   ├── settings.py              # Django settings
│   │   ├── urls.py                  # URL หลัก
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── movies/                      # Django App หลัก
│   │   ├── models.py                # Movie, Review, Rating, Comment
│   │   ├── serializers.py           # DRF Serializers
│   │   ├── views.py                 # ViewSets ทั้งหมด
│   │   ├── urls.py                  # Nested Routes
│   │   ├── admin.py                 # Django Admin
│   │   └── migrations/
│   ├── media/                       # รูปภาพที่ Upload (ไม่ถูก commit)
│   ├── manage.py
│   ├── requirements.txt             # Python packages
│   └── .env                         # Environment variables (ไม่ถูก commit)
│
└── database/
    └── docker-compose.yml           # PostgreSQL container
```

---

## ฟีเจอร์ทั้งหมด

### Authentication
- สมัครสมาชิก (Register) พร้อม validate ข้อมูล
- เข้าสู่ระบบ (Login) ด้วย JWT Access + Refresh Token
- Auto Refresh Token เมื่อ Access Token หมดอายุ
- ออกจากระบบ (Logout) ล้าง Token จาก localStorage

### Movies
- แสดงรายการหนังทั้งหมดแบบ Grid Card
- เพิ่มหนังใหม่พร้อมอัปโหลดรูปภาพ
- แก้ไขข้อมูลหนัง + เปลี่ยนรูปภาพ
- ลบหนัง (เฉพาะเจ้าของ)
- ข้อมูลหนัง: ชื่อ, คำอธิบาย, ผู้กำกับ, ปีที่ออกฉาย, แนวหนัง, รูปภาพ

### Ratings
- ให้คะแนนหนัง 1–10 คะแนน
- แก้ไขคะแนนได้ (1 คน / 1 หนัง)
- คำนวณคะแนนเฉลี่ยอัตโนมัติ
- แสดงจำนวนคนที่ให้คะแนน

### Reviews
- เขียนรีวิวหนัง (1 คน / 1 หนัง)
- แสดงชื่อผู้รีวิว + วันที่
- ลบรีวิวของตัวเองได้

### Comments
- แสดงความคิดเห็นใต้รีวิว (ไม่จำกัด)
- ลบคอมเมนต์ของตัวเองได้

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| POST | `/api/auth/register/` | ❌ | สมัครสมาชิก |
| POST | `/api/auth/login/` | ❌ | เข้าสู่ระบบ รับ JWT Token |
| POST | `/api/auth/refresh/` | ❌ | Refresh Access Token |

### Movies
| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/movies/` | ❌ | ดูหนังทั้งหมด |
| POST | `/api/movies/` | ✅ | เพิ่มหนังใหม่ |
| GET | `/api/movies/{id}/` | ❌ | ดูหนังรายเรื่อง |
| PUT | `/api/movies/{id}/` | ✅ | แก้ไขหนัง (ทั้งหมด) |
| PATCH | `/api/movies/{id}/` | ✅ | แก้ไขหนัง (บางส่วน) |
| DELETE | `/api/movies/{id}/` | ✅ | ลบหนัง |

### Reviews
| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/movies/{id}/reviews/` | ❌ | ดูรีวิวทั้งหมด |
| POST | `/api/movies/{id}/reviews/` | ✅ | เขียนรีวิว |
| DELETE | `/api/movies/{id}/reviews/{id}/` | ✅ | ลบรีวิว |

### Ratings
| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/movies/{id}/ratings/` | ❌ | ดูคะแนนทั้งหมด |
| POST | `/api/movies/{id}/ratings/` | ✅ | ให้คะแนน |
| PATCH | `/api/movies/{id}/ratings/{id}/` | ✅ | แก้ไขคะแนน |

### Comments
| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| GET | `/api/movies/{id}/reviews/{id}/comments/` | ❌ | ดูคอมเมนต์ |
| POST | `/api/movies/{id}/reviews/{id}/comments/` | ✅ | เพิ่มคอมเมนต์ |
| DELETE | `/api/movies/{id}/reviews/{id}/comments/{id}/` | ✅ | ลบคอมเมนต์ |

---

## การติดตั้งและรันโปรเจกต์

### สิ่งที่ต้องติดตั้งก่อน

| Tool | Download |
|---|---|
| Python 3.11+ | https://python.org/downloads |
| Node.js 20 LTS+ | https://nodejs.org |
| Docker Desktop | https://docker.com/desktop |
| Git | https://git-scm.com |

### Clone โปรเจกต์

```bash
git clone https://github.com/yourusername/movieapp.git
cd movieapp
```

### ตั้งค่า Database (Docker)

```bash
cd database
docker compose up -d
```

### ตั้งค่า Backend

```bash
cd ../backend

# สร้าง Virtual Environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# ติดตั้ง packages
pip install -r requirements.txt
```

สร้างไฟล์ `.env` ใน folder `backend/`:

```env
SECRET_KEY=django-insecure-movieapp-secret-key-change-in-production
DEBUG=True
DB_NAME=movieapp
DB_USER=movieuser
DB_PASSWORD=moviepass123
DB_HOST=localhost
DB_PORT=5432
```

```bash
# Migrate Database
python manage.py migrate

# สร้าง Superuser
python manage.py createsuperuser

# รัน Backend
python manage.py runserver
```

### ตั้งค่า Frontend

```bash
cd ../frontend

# ติดตั้ง packages
npm install

# รัน Frontend
npm run dev
```

---

## การเปิดใช้งานแต่ละส่วน

ทุกครั้งที่เปิดคอมพิวเตอร์มาทำงาน ให้เปิดตามลำดับนี้:

### 1. เปิด Docker Desktop
รอให้ Engine พร้อม (Icon สีเขียวที่ Taskbar)

### 2. PowerShell หน้าที่ 1 — รัน Backend
```powershell
cd movieapp/backend
venv\Scripts\activate
python manage.py runserver
```
Backend พร้อมที่ → `http://127.0.0.1:8000`

### 3. PowerShell หน้าที่ 2 — รัน Frontend
```powershell
cd movieapp/frontend
npm run dev
```
Frontend พร้อมที่ → `http://localhost:5173`

### 4. เปิด VSCode
```powershell
cd movieapp
code .
```

---

## หน้าเว็บและการใช้งาน

| URL | หน้า | คำอธิบาย |
|---|---|---|
| `http://localhost:5173/` | หน้าแรก | แสดงรายการหนังทั้งหมดแบบ Grid |
| `http://localhost:5173/register` | สมัครสมาชิก | กรอก username, email, password |
| `http://localhost:5173/login` | เข้าสู่ระบบ | กรอก username, password |
| `http://localhost:5173/movies/create` | เพิ่มหนัง | ต้อง Login ก่อน |
| `http://localhost:5173/movies/:id` | รายละเอียดหนัง | ดู Rating, Review, Comment |
| `http://localhost:5173/movies/:id/edit` | แก้ไขหนัง | ต้อง Login + เป็นเจ้าของ |
| `http://127.0.0.1:8000/admin/` | Django Admin | จัดการข้อมูลทั้งหมด |
| `http://127.0.0.1:8000/api/` | REST API Root | ดู Endpoints ทั้งหมด |

---

## คำแนะนำสำหรับการพัฒนาต่อ

### ฟีเจอร์ที่แนะนำให้เพิ่ม

**ฝั่ง Backend (Django)**

1. **Search & Filter** — เพิ่มการค้นหาหนังด้วยชื่อ, แนวหนัง, ปี
   - ใช้ `django-filter` + `SearchFilter` ใน DRF
   - เพิ่ม query params เช่น `/api/movies/?genre=action&search=inception`

2. **Pagination** — แบ่งหน้าผลลัพธ์
   - เพิ่ม `PageNumberPagination` ใน `settings.py`

3. **User Profile** — โปรไฟล์ผู้ใช้
   - สร้าง Model `Profile` เชื่อมกับ `User`
   - เก็บ avatar, bio, รายการหนังโปรด

4. **Permissions** — จำกัดสิทธิ์
   - เฉพาะเจ้าของแก้ไข/ลบได้ (ใช้ `IsOwnerOrReadOnly`)

5. **Email Verification** — ยืนยันอีเมลตอนสมัคร

6. **Production Settings** — เตรียม deploy
   - แยก `settings/development.py` และ `settings/production.py`
   - ใช้ `gunicorn` แทน `runserver`
   - ตั้งค่า `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`

**ฝั่ง Frontend (React)**

1. **Search Bar** — ค้นหาหนังในหน้าแรก

2. **Filter by Genre** — กรองหนังตามแนว

3. **Sort** — เรียงตามคะแนน, วันที่, ชื่อ

4. **Loading Skeleton** — แสดง Skeleton ขณะโหลดข้อมูล

5. **Toast Notification** — แจ้งเตือนสวยงาม เช่น `react-hot-toast`

6. **Infinite Scroll / Pagination** — โหลดหนังเพิ่มเมื่อ Scroll

7. **Dark/Light Mode** — สลับธีม

8. **User Profile Page** — หน้าโปรไฟล์ผู้ใช้

**DevOps**

1. **Docker Compose ครบ** — รวม Frontend + Backend + Database ใน `docker-compose.yml` เดียว

2. **Deploy บน Cloud**
   - Backend → Railway, Render, หรือ AWS EC2
   - Frontend → Vercel หรือ Netlify
   - Database → Supabase หรือ AWS RDS

3. **CI/CD** — GitHub Actions สำหรับ auto deploy

4. **Environment Variables** — ใช้ `.env.production` แยกจาก development

### โครงสร้าง .env ที่แนะนำสำหรับ Production

```env
SECRET_KEY=your-very-secure-secret-key-here
DEBUG=False
DB_NAME=movieapp_prod
DB_USER=movieuser_prod
DB_PASSWORD=very-secure-password
DB_HOST=your-db-host
DB_PORT=5432
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Python Packages เพิ่มเติมที่แนะนำ

```bash
pip install django-filter          # Filter & Search
pip install drf-spectacular        # Auto API Documentation (Swagger)
pip install celery redis           # Background Tasks
pip install django-storages boto3  # S3 Image Storage
pip install gunicorn               # Production WSGI Server
```

### npm Packages เพิ่มเติมที่แนะนำ

```bash
npm install react-hot-toast        # Toast Notifications
npm install react-query            # Server State Management
npm install react-hook-form        # Form Management
npm install zustand                # Global State Management
npm install @headlessui/react      # Accessible UI Components
```

---

## ข้อมูล Environment Variables

| Variable | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| `SECRET_KEY` | Django Secret Key | `django-insecure-xxx` |
| `DEBUG` | Debug Mode | `True` / `False` |
| `DB_NAME` | ชื่อ Database | `movieapp` |
| `DB_USER` | ชื่อผู้ใช้ Database | `movieuser` |
| `DB_PASSWORD` | รหัสผ่าน Database | `moviepass123` |
| `DB_HOST` | Host ของ Database | `localhost` |
| `DB_PORT` | Port ของ Database | `5432` |

---

## สร้างโดย

MovieApp สร้างเพื่อการเรียนรู้ Full Stack Development ด้วย React + Django + PostgreSQL

**Stack:** React • Django • PostgreSQL • Docker • JWT • REST API • Tailwind CSS