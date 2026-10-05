# 🚧 โปรเจกต์อยู่ระหว่างการพัฒนา (WORK IN PROGRESS)

## 🎨 ขณะนี้กำลังพัฒนาส่วน FRONTEND เป็นหลัก

> [!WARNING]
> **สำหรับผู้ที่เข้ามาชมโปรเจกต์ (บริษัท / ผู้สนใจ / ผู้ตรวจสอบผลงาน)**
>
> - โปรเจกต์นี้ **ยังพัฒนาไม่เสร็จสมบูรณ์** โดยขณะนี้โฟกัสที่การพัฒนา **Frontend (React)** เป็นหลัก
> - ส่วน **Backend (Django + PostgreSQL)** ที่เห็นอยู่ในโปรเจกต์ เป็นเพียง **โครงสร้างพื้นฐานที่เตรียมไว้เบื้องต้นเท่านั้น** และจะพัฒนาต่อในลำดับถัดไป
> - ปัจจุบัน **Frontend ยังไม่ได้เชื่อมต่อกับ Backend / ฐานข้อมูล** ข้อมูลหนังและรีวิวที่แสดงบนหน้าเว็บเป็น **ข้อมูลจำลอง (Mock Data)** ทั้งหมด
> - ระบบ Login / Register บนหน้าเว็บตอนนี้เป็น **ตัวอย่างหน้าตา (UI) เท่านั้น** ยังไม่ใช่ระบบยืนยันตัวตนจริง
>
> **English:** This project is **under active development**. The current focus is the **React frontend**. The Django backend in this repository is only a **preliminary scaffold** and is **not yet connected** to the frontend. All movie data and reviews shown in the UI are **mock data**, and the login/register flow is a UI demo only.

---

# 🎬 MovieApp (PixelFilm) — Movie Review Platform

ระบบรีวิวและให้คะแนนหนังแบบ Full Stack สร้างด้วย React + Django + PostgreSQL
(ชื่อแบรนด์ที่แสดงบนหน้าเว็บคือ **PixelFilm**)

> 📅 อัปเดตล่าสุด: 2026-10-05

---

## 📋 สารบัญ

- [สถานะการพัฒนา](#สถานะการพัฒนา)
- [ภาพรวมระบบ](#ภาพรวมระบบ)
- [สิ่งที่ทำเสร็จแล้วในฝั่ง Frontend](#สิ่งที่ทำเสร็จแล้วในฝั่ง-frontend)
- [สิ่งที่ยังเป็นข้อมูลจำลอง](#สิ่งที่ยังเป็นข้อมูลจำลอง)
- [Tech Stack](#tech-stack)
- [โครงสร้าง Folder](#โครงสร้าง-folder)
- [หน้าเว็บและ Routes](#หน้าเว็บและ-routes)
- [แนวทางการเขียน CSS](#แนวทางการเขียน-css)
- [API Endpoints (เตรียมไว้)](#api-endpoints-เตรียมไว้)
- [การติดตั้งและรันโปรเจกต์](#การติดตั้งและรันโปรเจกต์)
- [แผนการพัฒนาต่อ (Roadmap)](#แผนการพัฒนาต่อ-roadmap)
- [ข้อมูล Environment Variables](#ข้อมูล-environment-variables)

---

## สถานะการพัฒนา

| ส่วนงาน | สถานะ | รายละเอียด |
|---|---|---|
| Frontend — UI / หน้าเว็บ | 🟢 กำลังพัฒนา | หน้าแรก, รายการหนัง, เกี่ยวกับเรา, ติดต่อเรา พร้อมใช้งานด้วยข้อมูลจำลอง |
| Frontend — การจัดการสไตล์ | 🟢 เสร็จแล้ว | แยก CSS เป็น CSS Modules ครบทุกคอมโพเนนต์/หน้า |
| Frontend — เชื่อมต่อ API | 🔴 ยังไม่เริ่ม | มีไฟล์ Axios + AuthContext เตรียมไว้ แต่ยังไม่ถูกเรียกใช้ |
| Backend — Django REST API | 🟡 เตรียมไว้เบื้องต้น | โครงสร้างพื้นฐานเท่านั้น ยังไม่ได้เชื่อมต่อกับ Frontend |
| Database — PostgreSQL (Docker) | 🟡 เตรียมไว้เบื้องต้น | มี `docker-compose.yml` สำหรับรัน PostgreSQL |
| Authentication จริง (JWT) | 🔴 ยังไม่เชื่อมต่อ | Frontend ใช้ระบบจำลองอยู่ |
| Deploy | ⚪ ยังไม่วางแผน | - |

---

## ภาพรวมระบบ

MovieApp เป็นระบบจัดการและรีวิวหนัง โดยเป้าหมายสุดท้ายคือให้ผู้ใช้สามารถ:

- ดู ค้นหา และกรองรายการหนัง
- เพิ่ม / แก้ไข / ลบ หนัง พร้อมรูปภาพ
- ให้คะแนนหนัง (Rating) 1–10 คะแนน
- เขียนรีวิวหนัง (Review)
- แสดงความคิดเห็นใต้รีวิว (Comment)
- สมัครสมาชิกและเข้าสู่ระบบด้วย JWT
- คำนวณคะแนนเฉลี่ยอัตโนมัติ

> 📌 **ปัจจุบันทำเสร็จเฉพาะส่วนหน้าตาและการใช้งานฝั่ง Frontend** ฟีเจอร์ที่ต้องใช้ข้อมูลจริงจากระบบหลังบ้านยังอยู่ในแผนพัฒนาต่อ

---

## สิ่งที่ทำเสร็จแล้วในฝั่ง Frontend

### 🧭 Header (แถบเมนูด้านบน)
- เมนูหลัก 3 รายการ: **รายการหนังทั้งหมด** (`/movies`), **เกี่ยวกับเรา** (`/about`), **ติดต่อเรา** (`/contact`)
- เมนูของหน้าปัจจุบันถูกไฮไลต์เป็นสีทอง
- ปุ่มเข้าสู่ระบบ / สมัครสมาชิก แบบ Modal และโปรไฟล์ผู้ใช้ (ตัวอย่างหน้าตา)

### 🏠 หน้าแรก (`/`)
- Hero Banner แนะนำหนังประจำสัปดาห์
- แถบสถิติ (Stats Bar)
- แท็บกรองตามแนวหนัง
- แถวหนังแบบเลื่อนซ้าย-ขวาได้: **กำลังฮิตขณะนี้**, **คะแนนสูงสุด**, **เร็วๆ นี้**
- การ์ดรีวิวแนะนำ
- ปุ่ม **"ดูทั้งหมด"** ของแต่ละโซน พาไปหน้ารายการหนังทั้งหมด **พร้อมส่งตัวกรองที่เลือกไว้ไปด้วย**
  - โซนกำลังฮิต → ไปพร้อมแนวหนังที่เลือกอยู่ (เช่น เลือก "แอ็คชั่น" ก็ไปหน้า `/movies` ที่เลือกแอ็คชั่นไว้)
  - โซนคะแนนสูงสุด → เรียงตามคะแนนสูงสุด
  - โซนรีวิวแนะนำ → เรียงตามรีวิวเยอะสุด
  - โซนเร็วๆ นี้ → เรียงตามเร็วๆ นี้

### 🎞️ หน้ารายการหนังทั้งหมด (`/movies`)
- แสดงหนังแบบ Grid
- ค้นหาจากชื่อหนัง, ผู้กำกับ, แนวหนัง
- กรองตามแนวหนัง
- กรองตามปี (10 ปีย้อนหลัง หรือกรอกปีเอง)
- กรองตามช่วงคะแนนด้วย Slider สองหัว
- เรียงลำดับ: **คะแนนสูงสุด**, **ใหม่ล่าสุด**, **รีวิวเยอะสุด**, **เร็วๆ นี้**
- ปุ่มล้างตัวกรองทั้งหมด และแสดงข้อความเมื่อไม่พบผลลัพธ์
- รับค่าตัวกรองเริ่มต้นจาก URL (ดู [หน้าเว็บและ Routes](#หน้าเว็บและ-routes))

### 🎬 รายละเอียดหนัง (Modal)
- แสดงรายละเอียดหนัง คะแนน ผู้กำกับ เรื่องย่อ
- ให้คะแนนด้วยดาว และเขียนรีวิว (เก็บชั่วคราวในหน้าเว็บ ปิดแล้วหาย)

### 📄 หน้าเกี่ยวกับเรา (`/about`) และ ติดต่อเรา (`/contact`)
- ดีไซน์ให้เข้ากับธีมของเว็บ (โทนดำ-ทอง)
- หน้าติดต่อเรามีแบบฟอร์มพร้อมตรวจสอบข้อมูลเบื้องต้น และแสดงข้อมูลติดต่อ (ข้อมูลตัวอย่าง)

### ✨ อื่นๆ
- แจ้งเตือนแบบ Toast
- เลื่อนหน้าขึ้นบนสุดอัตโนมัติเมื่อเปลี่ยนหน้า
- แยกสไตล์ทั้งหมดเป็น **CSS Modules** (ดู [แนวทางการเขียน CSS](#แนวทางการเขียน-css))
- รองรับหน้าจอขนาดเล็กในบางส่วน (Stats Bar, Footer, หน้ารายการหนัง, การ์ดรีวิว)

---

## สิ่งที่ยังเป็นข้อมูลจำลอง

เพื่อความโปร่งใส รายการด้านล่างนี้ **ดูเหมือนทำงานได้ แต่ยังไม่ได้เชื่อมต่อกับระบบหลังบ้านจริง**

| ฟีเจอร์ | สถานะปัจจุบัน |
|---|---|
| รายการหนัง | ข้อมูลหนัง 10 เรื่อง เขียนไว้ในไฟล์ `src/data/movies.js` |
| Login / Register | ใส่ข้อมูลอะไรก็ผ่าน เก็บใน state ชั่วคราว รีเฟรชแล้วหาย |
| รีวิว / ให้คะแนน | เก็บใน state ของ Modal ปิดแล้วหาย |
| ปุ่ม "เพิ่มในรายการ" | แสดงเพียง Toast ยังไม่บันทึกข้อมูล |
| ฟอร์มติดต่อเรา | แสดง Toast เมื่อกดส่ง ยังไม่ได้ส่งข้อความไปที่ใด |
| ตัวเลขใน Stats Bar | ตัวเลขที่กำหนดไว้ตายตัว |
| โซน "เร็วๆ นี้" | ใช้ลำดับหนังกลับด้านแทน (ข้อมูลยังไม่มีวันที่ฉาย) |
| ข้อมูลติดต่อ / ลิงก์ใน Footer | ข้อมูลตัวอย่าง / ลิงก์ยังเป็น placeholder |

---

## Tech Stack

| Layer | Technology | Version | สถานะ |
|---|---|---|---|
| Frontend | React + Vite | React 19, Vite 8 | 🟢 ใช้งานอยู่ |
| Routing | React Router DOM | v7 | 🟢 ใช้งานอยู่ |
| Styling | CSS Modules | - | 🟢 ใช้งานอยู่ (สไตล์หลัก) |
| Styling | Tailwind CSS | v4 | ⚪ ติดตั้งไว้ (ไม่ได้ใช้เป็นสไตล์หลัก) |
| Fonts | Prompt, Goldman (Google Fonts) | - | 🟢 ใช้งานอยู่ |
| HTTP Client | Axios | latest | 🟡 เตรียมไว้ ยังไม่ถูกเรียกใช้ |
| Backend | Django | v6 | 🟡 เตรียมไว้เบื้องต้น |
| REST API | Django REST Framework | latest | 🟡 เตรียมไว้เบื้องต้น |
| Authentication | SimpleJWT | latest | 🟡 เตรียมไว้เบื้องต้น |
| CORS | django-cors-headers | latest | 🟡 เตรียมไว้เบื้องต้น |
| Image Upload | Pillow | latest | 🟡 เตรียมไว้เบื้องต้น |
| Database | PostgreSQL | v16 | 🟡 เตรียมไว้เบื้องต้น |
| Container | Docker + Docker Compose | v28 | 🟡 ใช้รันฐานข้อมูล |
| Version Control | Git + GitHub | - | - |
| Editor / Testing | VSCode, Postman, PowerShell | - | - |

---

## โครงสร้าง Folder

### Frontend (โครงสร้างปัจจุบัน)

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance + JWT interceptor (เตรียมไว้ ยังไม่ถูกเรียกใช้)
│   ├── assets/
│   ├── components/
│   │   ├── Footer.jsx            # ส่วนท้ายเว็บ
│   │   ├── GenreTabs.jsx         # แท็บเลือกแนวหนัง (หน้าแรก)
│   │   ├── Header.jsx            # แถบเมนู + Modal เข้าสู่ระบบ/สมัคร/โปรไฟล์
│   │   ├── HeroBanner.jsx        # แบนเนอร์หนังแนะนำ
│   │   ├── Icon.jsx              # ไอคอน SVG ที่ใช้ร่วมกัน
│   │   ├── MovieCard.jsx         # การ์ดหนัง
│   │   ├── MovieDetailModal.jsx  # Modal รายละเอียดหนัง + รีวิว
│   │   ├── StatsBar.jsx          # แถบสถิติ
│   │   └── Toast.jsx             # แจ้งเตือน
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state (เตรียมไว้ ยังไม่ถูกเรียกใช้)
│   ├── css/                      # CSS Modules ทั้งหมด
│   │   ├── App.module.css
│   │   ├── components/           # สไตล์ของแต่ละ component
│   │   └── pages/                # สไตล์ของแต่ละหน้า
│   ├── data/
│   │   └── movies.js             # ข้อมูลหนังจำลอง
│   ├── pages/
│   │   ├── HomePage.jsx          # หน้าแรก
│   │   ├── MovieBrowsePage.jsx   # รายการหนังทั้งหมด + ตัวกรอง
│   │   ├── AboutPage.jsx         # เกี่ยวกับเรา
│   │   └── ContactPage.jsx       # ติดต่อเรา
│   ├── App.jsx                   # Routes ทั้งหมด
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global CSS (reset, ตัวแปรสี, .container)
├── index.html
├── package.json
└── vite.config.js
```

### Backend และ Database (เตรียมไว้เบื้องต้น)

> ⚠️ ส่วนนี้เป็นโครงสร้างพื้นฐานที่วางแผนไว้ ยังไม่ได้เชื่อมต่อกับ Frontend

```
movieapp/
├── backend/                      # Django Application
│   ├── config/                   # settings, urls, wsgi, asgi
│   ├── movies/                   # models, serializers, views, urls, admin
│   ├── media/                    # รูปภาพที่อัปโหลด (ไม่ถูก commit)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                      # Environment variables (ไม่ถูก commit)
└── database/
    └── docker-compose.yml        # PostgreSQL container
```

---

## หน้าเว็บและ Routes

### Routes ที่ใช้งานได้ในปัจจุบัน

| URL | หน้า | คำอธิบาย |
|---|---|---|
| `http://localhost:5173/` | หน้าแรก | Hero, สถิติ, หนังกำลังฮิต, คะแนนสูงสุด, รีวิวแนะนำ, เร็วๆ นี้ |
| `http://localhost:5173/movies` | รายการหนังทั้งหมด | ค้นหา กรอง และเรียงลำดับหนัง |
| `http://localhost:5173/about` | เกี่ยวกับเรา | แนะนำแพลตฟอร์ม |
| `http://localhost:5173/contact` | ติดต่อเรา | ข้อมูลติดต่อและแบบฟอร์ม |

### ตัวกรองผ่าน URL ของหน้า `/movies`

| พารามิเตอร์ | ค่าที่รองรับ | ตัวอย่าง |
|---|---|---|
| `genre` | `all`, `action`, `scifi`, `drama`, `horror`, `comedy`, `romance` | `/movies?genre=action` |
| `sort` | `score`, `newest`, `reviews`, `upcoming` | `/movies?sort=score` |

> ค่าที่ไม่รองรับจะถูกมองข้ามและใช้ค่าเริ่มต้นแทน

### Routes ที่วางแผนไว้ (ยังไม่มี)

`/login`, `/register`, `/movies/create`, `/movies/:id`, `/movies/:id/edit`, หน้าโปรไฟล์ผู้ใช้
และ Django Admin ที่ `http://127.0.0.1:8000/admin/` (ขึ้นกับการตั้งค่า Backend)

---

## แนวทางการเขียน CSS

โปรเจกต์ใช้ **CSS Modules** โดยเก็บไฟล์สไตล์ไว้ใน `src/css/`

- **คอมโพเนนต์** → `src/css/components/ชื่อ.module.css`
- **หน้า** → `src/css/pages/ชื่อ.module.css`
- ชื่อไฟล์ต้องลงท้ายด้วย `.module.css`
- ใช้งานใน JSX:

  ```jsx
  import styles from "../css/components/MovieCard.module.css";

  <div className={styles.card}>...</div>
  ```
- สถานะที่สลับได้ (active / selected) ให้สลับคลาส ไม่ใช้การสลับ inline style
- `hover` / `focus` เขียนใน CSS ด้วย `:hover` / `:focus`
- ค่าที่คำนวณตอนรัน (เช่น ตำแหน่งแถบ Slider, สีที่มาจากข้อมูล) ใช้ inline style ได้
- สี/ค่าที่ใช้ร่วมกันทั้งเว็บ เรียกผ่านตัวแปรใน `src/index.css` เช่น `var(--gold)`, `var(--red)`
- `index.css` เก็บเฉพาะของ global: reset, ตัวแปรสี, คลาส `.container`

---

## API Endpoints (เตรียมไว้)

> ⚠️ **Endpoints ด้านล่างเป็นส่วนที่ออกแบบไว้ในฝั่ง Backend ปัจจุบัน Frontend ยังไม่ได้เรียกใช้งาน**

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

| Tool | Download | จำเป็นสำหรับ |
|---|---|---|
| Node.js 20 LTS+ | https://nodejs.org | Frontend |
| Git | https://git-scm.com | ทุกส่วน |
| Python 3.11+ | https://python.org/downloads | Backend (ไม่บังคับในตอนนี้) |
| Docker Desktop | https://docker.com/desktop | Database (ไม่บังคับในตอนนี้) |

### ⚡ เริ่มต้นแบบเร็ว: รันเฉพาะ Frontend (แนะนำ)

เนื่องจาก Frontend ใช้ข้อมูลจำลอง **จึงดูผลงานได้ทันทีโดยไม่ต้องรัน Backend หรือ Docker**

```bash
git clone https://github.com/yourusername/movieapp.git
cd movieapp/frontend

npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

### 🔧 (ไม่บังคับ) รัน Backend และ Database

> ส่วนนี้สำหรับทดลองโครงสร้าง Backend ที่เตรียมไว้ ปัจจุบันยังไม่มีผลต่อหน้าเว็บ

**1. ตั้งค่า Database (Docker)**

```bash
cd database
docker compose up -d
```

**2. ตั้งค่า Backend**

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

Backend พร้อมที่ `http://127.0.0.1:8000`

> 🔒 ค่าใน `.env` ด้านบนเป็นตัวอย่างสำหรับพัฒนาในเครื่องเท่านั้น ห้ามนำไปใช้จริงบน Production

---

## แผนการพัฒนาต่อ (Roadmap)

### ลำดับถัดไป

1. **เชื่อมต่อ Authentication จริง**
   - ให้ Header ใช้ `AuthContext` (`login`, `register`, `logout`) แทนระบบจำลอง
   - ปรับรูปแบบข้อมูล `user` ให้ตรงกันทั้งแอป (ปัจจุบันบางส่วนใช้เป็น string บางส่วนเป็น object)
2. **เชื่อมต่อ API รายการหนัง** แทนข้อมูลใน `src/data/movies.js`
   - ต้องทำ mapping ฟิลด์ระหว่าง Frontend กับ Backend (Frontend ใช้ `score`, `reviews`, `poster`, `backdrop`, `synopsis`, `genreLabel`, `duration`, `director`, `cast` ส่วน Backend ออกแบบไว้เป็น ชื่อ, คำอธิบาย, ผู้กำกับ, ปีที่ออกฉาย, แนวหนัง, รูปภาพ)
   - เพิ่มฟิลด์วันที่ฉายเพื่อทำโซน "เร็วๆ นี้" ให้ถูกต้อง
3. **เชื่อมต่อ Rating / Review / Comment** ให้บันทึกลงฐานข้อมูลจริง
4. **ส่งข้อความจากฟอร์มติดต่อเรา** ผ่าน API หรือบริการอีเมล

### ปรับปรุง Frontend

- ลิงก์ใน Footer ให้ไปหน้า `/about` และ `/contact` จริง
- เปลี่ยน favicon จากค่าเริ่มต้นของ Vite เป็นโลโก้ PixelFilm
- ลบไฟล์ใน `src/assets/` ที่ไม่ได้ใช้
- Loading Skeleton ระหว่างโหลดข้อมูล
- Pagination / Infinite Scroll
- หน้า Login / Register / Movie Detail / Create / Edit แบบเต็มหน้า
- หน้าโปรไฟล์ผู้ใช้
- Dark / Light Mode
- ทบทวนการรองรับหน้าจอมือถือให้ครบทุกส่วน

### ปรับปรุง Backend

- Search & Filter (`django-filter`) และ Pagination
- Permissions (`IsOwnerOrReadOnly`)
- User Profile
- Email Verification
- Production Settings (แยก settings, `gunicorn`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`)

### DevOps

- Docker Compose รวม Frontend + Backend + Database
- Deploy: Frontend → Vercel / Netlify, Backend → Railway / Render / AWS EC2, Database → Supabase / AWS RDS
- CI/CD ด้วย GitHub Actions
- แยก Environment Variables ระหว่าง development และ production

### แพ็กเกจเพิ่มเติมที่พิจารณา

```bash
# Backend
pip install django-filter          # Filter & Search
pip install drf-spectacular        # Auto API Documentation (Swagger)
pip install gunicorn               # Production WSGI Server
pip install django-storages boto3  # S3 Image Storage

# Frontend
npm install @tanstack/react-query  # Server State Management
npm install react-hook-form        # Form Management
```

---

## ข้อมูล Environment Variables

> ใช้กับฝั่ง Backend เท่านั้น (Frontend ยังไม่ต้องตั้งค่า)

| Variable | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| `SECRET_KEY` | Django Secret Key | `django-insecure-xxx` |
| `DEBUG` | Debug Mode | `True` / `False` |
| `DB_NAME` | ชื่อ Database | `movieapp` |
| `DB_USER` | ชื่อผู้ใช้ Database | `movieuser` |
| `DB_PASSWORD` | รหัสผ่าน Database | `moviepass123` |
| `DB_HOST` | Host ของ Database | `localhost` |
| `DB_PORT` | Port ของ Database | `5432` |

ตัวอย่างสำหรับ Production:

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

---

## สร้างโดย

MovieApp สร้างเพื่อการเรียนรู้ Full Stack Development ด้วย React + Django + PostgreSQL

**Stack:** React • Vite • CSS Modules • Django • PostgreSQL • Docker • JWT • REST API