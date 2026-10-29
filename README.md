# 🚧 โปรเจกต์อยู่ระหว่างการพัฒนา (WORK IN PROGRESS)

## 🎨 ขณะนี้กำลังพัฒนาส่วน FRONTEND เป็นหลัก

> [!WARNING]
> **สำหรับผู้ที่เข้ามาชมโปรเจกต์ (บริษัท / ผู้สนใจ / ผู้ตรวจสอบผลงาน)**
>
> - โปรเจกต์นี้ **ยังพัฒนาไม่เสร็จสมบูรณ์** โดยขณะนี้โฟกัสที่การพัฒนา **Frontend (React)** เป็นหลัก
> - ส่วน **Backend (Django + PostgreSQL)** ที่เห็นอยู่ในโปรเจกต์ เป็นเพียง **โครงสร้างพื้นฐานที่เตรียมไว้เบื้องต้นเท่านั้น** และจะพัฒนาต่อในลำดับถัดไป
> - ปัจจุบัน **Frontend ยังไม่ได้เชื่อมต่อกับ Backend / ฐานข้อมูล** ข้อมูลหนังและรีวิวที่แสดงบนหน้าเว็บเป็น **ข้อมูลจำลอง (Mock Data)** ทั้งหมด
> - ระบบ Login / Register และ **ระบบผู้ดูแล (Admin)** บนหน้าเว็บตอนนี้เป็น **ระบบจำลอง** ทะเบียนบัญชี แคตตาล็อกหนัง รีวิว และรายการอยากดู เก็บไว้ใน **localStorage ของเบราว์เซอร์** เท่านั้น การตรวจสิทธิ์ผู้ดูแลฝั่งหน้าเว็บมีไว้สาธิต ระบบจริงต้องตรวจที่ backend
>
> **English:** This project is **under active development**. The current focus is the **React frontend**. The Django backend in this repository is only a **preliminary scaffold** and is **not yet connected** to the frontend. All movie data and reviews shown in the UI are **mock data**. Login/register and the **admin panel** are mocks — accounts, the movie catalog, reviews and watchlists are stored only in the browser's localStorage, and the client-side admin check is for demonstration only.

---

# 🎬 MovieApp (PixelFilm) — Movie Review Platform

[![Frontend CI](https://github.com/akarawitx/movieapp/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/akarawitx/movieapp/actions/workflows/frontend-ci.yml)

ระบบรีวิวและให้คะแนนหนังแบบ Full Stack สร้างด้วย React + Django + PostgreSQL
(ชื่อแบรนด์ที่แสดงบนหน้าเว็บคือ **PixelFilm**)

> 📅 อัปเดตล่าสุด: 2026-10-29

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
- [การทดสอบ (Testing)](#การทดสอบ-testing)
- [แผนการพัฒนาต่อ (Roadmap)](#แผนการพัฒนาต่อ-roadmap)
- [ข้อมูล Environment Variables](#ข้อมูล-environment-variables)

---

## สถานะการพัฒนา

| ส่วนงาน | สถานะ | รายละเอียด |
|---|---|---|
| Frontend — UI / หน้าเว็บ | 🟢 กำลังพัฒนา | 10 หน้า: หน้าแรก, รายการหนัง, รายละเอียดหนัง, ค้นหา, รายการอยากดู, โปรไฟล์, ตั้งค่า, เกี่ยวกับเรา, ติดต่อเรา, 404 |
| Frontend — รองรับมือถือ | 🟢 เสร็จแล้ว | Header มีเมนู ☰ และช่องค้นหาแบบพับได้ ทุกหน้าใหม่ทดสอบที่ 375px |
| Frontend — การจัดการสไตล์ | 🟢 เสร็จแล้ว | แยก CSS เป็น CSS Modules ครบทุกคอมโพเนนต์/หน้า |
| Frontend — ระบบผู้ดูแล (Admin) | 🟢 เสร็จแล้ว (จำลอง) | `/admin` จัดการหนัง แนวหนัง รีวิว และบัญชีผู้ใช้ พร้อมบันทึกกิจกรรม |
| Frontend — เชื่อมต่อ API | 🔴 ยังไม่เริ่ม | มีไฟล์ Axios + AuthContext เตรียมไว้ แต่ยังไม่ถูกเรียกใช้ |
| Backend — Django REST API | 🟡 เตรียมไว้เบื้องต้น | โครงสร้างพื้นฐานเท่านั้น ยังไม่ได้เชื่อมต่อกับ Frontend |
| Database — PostgreSQL (Docker) | 🟡 เตรียมไว้เบื้องต้น | มี `docker-compose.yml` สำหรับรัน PostgreSQL |
| Authentication จริง (JWT) | 🔴 ยังไม่เชื่อมต่อ | Frontend ใช้ระบบจำลองอยู่ |
| Frontend — Automated tests | 🟢 เสร็จแล้ว | Vitest + Testing Library 96 เทสต์ รันอัตโนมัติด้วย GitHub Actions ทุกครั้งที่ push |
| Deploy | 🟡 Frontend | มี `vercel.json` สำหรับ deploy Frontend (SPA rewrites) |

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
- เมนูหลัก 3 รายการ: **รายการหนังทั้งหมด** (`/movies`), **เกี่ยวกับเรา** (`/about`), **ติดต่อเรา** (`/contact`) ไฮไลต์หน้าปัจจุบันเป็นสีทอง
- **ช่องค้นหา** พิมพ์แล้วแนะนำหนังทันที (ค้นได้จากชื่อ, ผู้กำกับ, นักแสดง, แนว) ใช้ ↑↓ / Enter / Esc ได้ และบอกเหตุผลที่ตรง เช่น "ผู้กำกับ: Christopher Nolan"
- **เมนูผู้ใช้แบบ Dropdown**: โปรไฟล์ของฉัน, รายการอยากดู, ตั้งค่า, ออกจากระบบ
- **มือถือ**: ต่ำกว่า 900px เมนูรวมอยู่ในปุ่ม ☰ (drawer) และต่ำกว่า 640px ช่องค้นหาพับเป็นไอคอน 🔍
- ปุ่มเข้าสู่ระบบ / สมัครสมาชิก แบบ Modal และเปิดให้อัตโนมัติเมื่อผู้ใช้กดฟีเจอร์ที่ต้องล็อกอิน

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

### 🎬 หน้ารายละเอียดหนัง (`/movies/:id`)
- Hero ภาพพื้นหลังเต็มจอ, โปสเตอร์, เรตติ้ง, คะแนน PixelFilm และ "คะแนนของคุณ"
- ปุ่มดูตัวอย่าง (เปิด YouTube), เพิ่ม/นำออกจากรายการอยากดู, คัดลอกลิงก์
- แถบเมนูติดบนจอ (ภาพรวม / นักแสดง / รีวิว / หนังที่คล้ายกัน) ไฮไลต์ตามส่วนที่กำลังดู
- รีวิว: กราฟสัดส่วนคะแนน, เขียน/แก้ไข/ลบรีวิวของตัวเอง (1 คน 1 รีวิวต่อเรื่อง), ซ่อนสปอยล์, กดถูกใจ, เรียงลำดับ, โหลดเพิ่ม
- คลิกการ์ดหนังที่ไหนก็มาหน้านี้ ส่วนปุ่ม ▶ บนการ์ดเปิด **Quick View (Modal)** แบบย่อ

### 🔍 หน้าค้นหา (`/search?q=`)
- แท็บ หนัง / รีวิว พร้อมจำนวนผลลัพธ์, กรองตามแนว, เรียงลำดับ, ไฮไลต์คำที่ค้น
- เมื่อไม่พบผลลัพธ์: คำแนะนำ, คำค้นยอดนิยม และหนังคะแนนสูง

### 🔖 รายการอยากดู (`/watchlist`) — ต้องล็อกอิน
- แท็บ ทั้งหมด / ยังไม่ได้ดู / ดูแล้ว, กรองแนว, เรียง 5 แบบ, สลับมุมมอง Grid / List
- สถิติและแถบความคืบหน้า, ทำเครื่องหมาย "ดูจบแล้ว", ลบพร้อมปุ่ม "เลิกทำ"

### 👤 โปรไฟล์ (`/profile`) และ ตั้งค่า (`/settings/:section`) — ต้องล็อกอิน
- โปรไฟล์: รูป, ชื่อ-นามสกุล, @username, bio, สถิติ, ข้อมูลบัญชี และแท็บกิจกรรม (รีวิว / อยากดู / ให้คะแนนแล้ว)
- ตั้งค่า 5 หมวด: ข้อมูลส่วนตัว, รูปโปรไฟล์ (อัปโหลด/เปลี่ยน/ลบ ครอปเป็น 320×320 อัตโนมัติ), อีเมลและรหัสผ่าน, ความชอบและความเป็นส่วนตัว, ลบบัญชี
- ยังไม่ล็อกอินแล้วเข้าหน้าเหล่านี้ → กลับหน้าแรกและเปิดหน้าต่าง Login ล็อกอินเสร็จพากลับหน้าที่ตั้งใจเข้า

### 📄 หน้าเกี่ยวกับเรา (`/about`) และ ติดต่อเรา (`/contact`)
- ดีไซน์ให้เข้ากับธีมของเว็บ (โทนดำ-ทอง)
- หน้าติดต่อเรามีแบบฟอร์มพร้อมตรวจสอบข้อมูลเบื้องต้น และแสดงข้อมูลติดต่อ (ข้อมูลตัวอย่าง)

### 🛡️ ระบบผู้ดูแล (`/admin`) — เฉพาะบัญชีผู้ดูแล
> บัญชีสาธิต: **`admin` / `Admin@1234`** (ล็อกอินแล้วพาไปหน้าผู้ดูแลอัตโนมัติ หรือเข้าจากเมนูผู้ใช้ → "แผงผู้ดูแลระบบ")

- **Layout แยก** มี sidebar, topbar และปุ่มกลับไปหน้าเว็บ ใช้ธีมดำ-ทองเดียวกับเว็บ บนมือถือ sidebar กลายเป็น drawer
- **แดชบอร์ด**
  - สถิติ: หนัง, บัญชี, รีวิว, รายการอยากดูรวม
  - รายการ: หนังที่รีวิวมากสุด, รีวิวล่าสุด, บัญชีที่สมัครล่าสุด, กิจกรรมของผู้ดูแล
  - ทางลัดไปหน้าจัดการต่างๆ
- **จัดการหนัง**
  - ตาราง: ค้นหา, กรองแนว/ปี/สถานะ, เรียงตามคอลัมน์, แบ่งหน้า
  - เปิด/ปิดการเผยแพร่ได้ หนังที่ซ่อนจะหายจากหน้าเว็บ แต่ผู้ดูแลยังเปิดดูได้
  - ลบ: ยืนยันพร้อมบอกผลกระทบ และมีปุ่ม "เลิกทำ"
  - ปุ่มคืนค่าแคตตาล็อกเริ่มต้น
- **ฟอร์มเพิ่ม / แก้ไขหนัง**
  - ครบทุกฟิลด์ พร้อมตรวจข้อมูล
  - สร้าง id จากชื่อเรื่องอัตโนมัติ
  - พรีวิวโปสเตอร์และภาพพื้นหลัง
  - เตือนก่อนออกถ้ายังไม่บันทึก
- **จัดการแนวหนัง**
  - เพิ่ม แก้ไข ลบ และจัดลำดับ ซึ่งมีผลกับแท็บหน้าแรกและตัวกรอง
  - ลบแนวที่ยังมีหนังใช้อยู่ไม่ได้
- **ตรวจรีวิว**
  - รวมรีวิวจากชุมชนและจากสมาชิก กรองตามแหล่ง/สถานะ/คะแนน
  - ซ่อนรีวิวจากชุมชนได้ ลบรีวิวของสมาชิกได้
- **จัดการบัญชีผู้ใช้**
  - ตารางบัญชีทั้งหมด: อีเมล, สิทธิ์, สถานะ, จำนวนรีวิว/อยากดู, วันสมัคร, เข้าใช้ล่าสุด
  - หน้ารายละเอียด: โปรไฟล์และกิจกรรมทั้งหมด
  - การกระทำ: แก้ข้อมูลโปรไฟล์, เปลี่ยนสิทธิ์, ระงับ/ยกเลิกระงับ, รีเซ็ตรหัสผ่าน (ได้รหัสชั่วคราว), ลบบัญชี
  - บัญชีที่ถูกระงับจะล็อกอินไม่ได้ และรีวิวจะหายจากหน้าเว็บ
  - กันพลาด: แก้สิทธิ์ ระงับ หรือลบบัญชีตัวเองไม่ได้ และต้องเหลือผู้ดูแลอย่างน้อย 1 คน
  - รหัสผ่านเก็บแบบ hash และไม่แสดงให้ผู้ดูแลเห็น
- **บันทึกกิจกรรม (Audit log):** ทุกการเพิ่ม แก้ ลบ และเปลี่ยนสถานะ ค้นหาได้
- **การเข้าถึงหน้าผู้ดูแล**
  - ผู้ใช้ทั่วไปที่เข้า `/admin` จะเห็นหน้า 404
  - ผู้ที่ยังไม่ล็อกอินจะถูกขอให้ล็อกอินก่อน
  - โค้ดส่วนผู้ดูแลโหลดแยก (lazy) ผู้ใช้ทั่วไปไม่ต้องโหลด

### ✨ อื่นๆ
- หน้า **404** สำหรับ URL ที่ไม่มีอยู่จริง
- จำสถานะล็อกอินและข้อมูลผู้ใช้ข้ามการรีเฟรช (localStorage แยกตาม username)
- โปสเตอร์ที่โหลดไม่ได้จะแสดงชื่อเรื่องแทนไอคอนรูปเสีย
- แจ้งเตือนแบบ Toast และเลื่อนหน้าขึ้นบนสุดอัตโนมัติเมื่อเปลี่ยนหน้า
- แยกสไตล์ทั้งหมดเป็น **CSS Modules** (ดู [แนวทางการเขียน CSS](#แนวทางการเขียน-css))

---

## สิ่งที่ยังเป็นข้อมูลจำลอง

เพื่อความโปร่งใส รายการด้านล่างนี้ **ดูเหมือนทำงานได้ แต่ยังไม่ได้เชื่อมต่อกับระบบหลังบ้านจริง**

| ฟีเจอร์ | สถานะปัจจุบัน |
|---|---|
| รายการหนัง | ข้อมูลตั้งต้น 9 เรื่องจาก `src/data/movies.js` + `movieDetails.js` ถูกคัดลอกไปเป็นแคตตาล็อกใน localStorage ครั้งแรก หลังจากนั้นแก้ได้จากหน้าผู้ดูแล |
| Login / Register | ตรวจกับทะเบียนบัญชีใน localStorage (รหัสผ่านเก็บแบบ hash อย่างง่าย ไม่ใช่การเข้ารหัสจริง) ชื่อผู้ใช้ที่ยังไม่มีบัญชีจะถูกสร้างให้อัตโนมัติตอนล็อกอิน |
| ระบบผู้ดูแล | บัญชีสาธิต `admin` / `Admin@1234` ตรวจสิทธิ์ฝั่งหน้าเว็บเท่านั้น ระบบจริงต้องตรวจ `is_staff` / permission ที่ backend ทุก request |
| บัญชีนักรีวิวชุมชน | 6 บัญชีจำลอง ยังไม่มีรหัสผ่าน ผู้ดูแลต้องรีเซ็ตรหัสผ่านให้ก่อนจึงจะล็อกอินได้ |
| โปรไฟล์ / รูปโปรไฟล์ / ตั้งค่า | บันทึกใน localStorage เปลี่ยนรหัสผ่านตรวจกับรหัสเดิมในทะเบียนบัญชีจำลอง |
| รีวิว / ให้คะแนน / รายการอยากดู | ของผู้ใช้บันทึกใน localStorage ส่วนรีวิวของคนอื่นสร้างจากข้อมูลจำลอง (คงที่ตาม id หนัง) |
| ปุ่มถูกใจรีวิว | เก็บใน state ของหน้า รีเฟรชแล้วหาย |
| ตัวอย่างภาพยนตร์ | เปิดผลค้นหาบน YouTube (ยังไม่ได้ฝังวิดีโอ) |
| ฟอร์มติดต่อเรา | แสดง Toast เมื่อกดส่ง ยังไม่ได้ส่งข้อความไปที่ใด |
| ตัวเลขใน Stats Bar | ตัวเลขที่กำหนดไว้ตายตัว |
| โซน "เร็วๆ นี้" | เรียงตามวันเข้าฉายล่าสุด (ข้อมูลจำลองยังไม่มีหนังที่ยังไม่เข้าฉาย) |
| ลิงก์ใน Footer | ใช้งานได้ทุกลิงก์ ยกเว้น "หนังไทย" (ข้อมูลจำลองยังไม่มีหนังไทย) |
| ลืมรหัสผ่าน | ไม่ได้ส่งอีเมลจริง หน้าจอมีปุ่มเปิดลิงก์ตั้งรหัสผ่านใหม่แทน |
| นโยบาย / เงื่อนไข | เอกสารตัวอย่าง ไม่ใช่ข้อตกลงทางกฎหมายจริง (มีข้อความแจ้งบนหน้า) |

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
| Testing | Vitest + React Testing Library + jsdom | Vitest 5 | 🟢 ใช้งานอยู่ |
| CI | GitHub Actions | - | 🟢 lint + test + build ทุก push / PR |
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
│   ├── assets/                   # วาง default-avatar.png ไว้ที่นี่เพื่อใช้เป็นรูปโปรไฟล์ตั้งต้น
│   ├── components/
│   │   ├── admin/                # AdminRoute, AdminLayout, AdminUi (ตาราง, dialog, badge, pager)
│   │   ├── movie/                # ReviewSection (รีวิว + ฟอร์ม + สรุปคะแนน)
│   │   ├── profile/              # ProfileHeader, ProfileStats, ProfileActivityTabs
│   │   ├── settings/             # ฟอร์มแต่ละหมวดในหน้าตั้งค่า
│   │   ├── Avatar.jsx            # รูปโปรไฟล์ + รูปตั้งต้น
│   │   ├── Header.jsx            # แถบเมนู + ช่องค้นหา + Modal เข้าสู่ระบบ/สมัคร
│   │   ├── MobileMenu.jsx        # เมนู drawer สำหรับมือถือ
│   │   ├── SearchBox.jsx         # ช่องค้นหาพร้อมรายการแนะนำ
│   │   ├── UserMenu.jsx          # Dropdown เมนูผู้ใช้
│   │   ├── MovieCard.jsx         # การ์ดหนัง
│   │   ├── MovieDetailModal.jsx  # Quick View แบบย่อ
│   │   ├── Poster.jsx            # โปสเตอร์ + fallback เมื่อรูปเสีย
│   │   ├── ProtectedRoute.jsx    # กันหน้าที่ต้องล็อกอิน
│   │   └── ...                   # Footer, HeroBanner, GenreTabs, StatsBar, Toast, Icon, Highlight
│   ├── context/
│   │   ├── AccountsContext.jsx   # ทะเบียนบัญชี, ล็อกอิน/สมัคร, สิทธิ์ผู้ดูแล, audit log (จำลอง + localStorage)
│   │   ├── CatalogContext.jsx    # แคตตาล็อกหนัง, แนวหนัง, รีวิวที่ถูกซ่อน (จำลอง + localStorage)
│   │   ├── ProfileContext.jsx    # โปรไฟล์, รายการอยากดู, รีวิวของผู้ใช้ (จำลอง + localStorage)
│   │   └── AuthContext.jsx       # Auth จริงผ่าน API (เตรียมไว้ ยังไม่ถูกเรียกใช้)
│   ├── css/                      # CSS Modules ทั้งหมด (components/, pages/, pages/admin/)
│   ├── data/
│   │   ├── movies.js             # ข้อมูลหนังและแนวหนังตั้งต้น
│   │   ├── movieDetails.js       # ข้อมูลเสริม + รีวิวจำลอง
│   │   ├── catalog.js            # สร้างแคตตาล็อกตั้งต้น, slugify, สถานะ/เรตติ้ง
│   │   ├── accounts.js           # บัญชีตั้งต้น (admin + นักรีวิว), role/status, hash รหัสผ่าน
│   │   └── profile.js            # โปรไฟล์และกิจกรรมตั้งต้น
│   ├── hooks/
│   │   ├── useLoginPrompt.js     # เปิดหน้าต่าง Login จากที่ไหนก็ได้
│   │   ├── useCommunityReviews.js# รีวิวชุมชนที่แสดงต่อสาธารณะ (กรองที่ถูกซ่อน/ระงับออก)
│   │   ├── useAdminData.js       # รวมข้อมูลทุกบัญชีและทุกรีวิวสำหรับหน้าผู้ดูแล
│   │   └── usePaging.js, useSort.js
│   ├── pages/                    # Home, MovieBrowse, MovieDetail, Search, Watchlist,
│   │   │                         # Profile, Settings, About, Contact, NotFound ฯลฯ
│   │   └── admin/                # Dashboard, Movies, MovieForm, Users, UserDetail,
│   │                             # Reviews, Genres, Activity
│   ├── utils/
│   │   ├── search.js             # ตรรกะการค้นหา + ไฮไลต์
│   │   └── storage.js            # อ่าน/เขียน localStorage อย่างปลอดภัย
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
| `/` | หน้าแรก | Hero, สถิติ, หนังกำลังฮิต, คะแนนสูงสุด, รีวิวแนะนำ, เร็วๆ นี้ |
| `/movies` | รายการหนังทั้งหมด | ค้นหา กรอง และเรียงลำดับหนัง |
| `/movies/:id` | รายละเอียดหนัง | เช่น `/movies/dune2` และ `/movies/dune2#reviews` |
| `/search?q=` | ผลการค้นหา | เช่น `/search?q=nolan` |
| `/charts` | Top Charts | อันดับคะแนนสูงสุด / รีวิวมากที่สุด กรองแนวและปี |
| `/calendar` | ปฏิทินฉาย | หนังจัดกลุ่มตามเดือนที่เข้าฉาย |
| `/reviews` | รีวิวจากชุมชน | ฟีดรีวิวทั้งหมด เรียงล่าสุด/ยอดนิยม กรองคะแนนและแนว |
| `/u/:username` | โปรไฟล์สาธารณะ | เช่น `/u/tonkla_cine` (ของตัวเองจะเห็นมุมมองที่ผู้อื่นเห็น) |
| `/watchlist` | รายการอยากดู | 🔒 ต้องล็อกอิน |
| `/profile` | โปรไฟล์ของฉัน | 🔒 ต้องล็อกอิน |
| `/settings/:section` | ตั้งค่า | 🔒 `profile`, `avatar`, `security`, `preferences`, `danger` |
| `/privacy`, `/terms` | นโยบายความเป็นส่วนตัว / เงื่อนไขการใช้งาน | เอกสารตัวอย่าง มีสารบัญ |
| `/forgot-password` | ลืมรหัสผ่าน | ขอลิงก์ตั้งรหัสผ่านใหม่ (จำลอง ไม่ได้ส่งอีเมลจริง) |
| `/reset-password?token=` | ตั้งรหัสผ่านใหม่ | ตรวจความแข็งแรงและเงื่อนไขรหัสผ่าน |
| `/about` | เกี่ยวกับเรา | แนะนำแพลตฟอร์ม |
| `/contact` | ติดต่อเรา | ข้อมูลติดต่อและแบบฟอร์ม |
| `/admin` | แดชบอร์ดผู้ดูแล | 🛡️ เฉพาะผู้ดูแล (ผู้ใช้ทั่วไปเห็น 404) |
| `/admin/movies`, `/admin/movies/new`, `/admin/movies/:id/edit` | จัดการหนัง | 🛡️ ตาราง / เพิ่ม / แก้ไข |
| `/admin/users`, `/admin/users/:username` | จัดการบัญชีผู้ใช้ | 🛡️ ตาราง / รายละเอียดและการจัดการ |
| `/admin/reviews`, `/admin/genres`, `/admin/activity` | รีวิว / แนวหนัง / บันทึกกิจกรรม | 🛡️ |
| อื่นๆ | 404 | หน้าไม่พบ |

### ตัวกรองผ่าน URL ของหน้า `/movies`

| พารามิเตอร์ | ค่าที่รองรับ | ตัวอย่าง |
|---|---|---|
| `genre` | `all`, `action`, `scifi`, `drama`, `horror`, `comedy`, `romance` | `/movies?genre=action` |
| `sort` | `score`, `newest`, `reviews`, `upcoming` | `/movies?sort=score` |

> ค่าที่ไม่รองรับจะถูกมองข้ามและใช้ค่าเริ่มต้นแทน

### Backend

Django Admin ที่ `http://127.0.0.1:8000/admin/` (ขึ้นกับการตั้งค่า Backend)

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
git clone https://github.com/akarawitx/movieapp.git
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

## การทดสอบ (Testing)

Frontend ใช้ **[Vitest](https://vitest.dev)** + **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** บน jsdom
เทสต์ตรวจพฤติกรรมที่ผู้ใช้เห็น (หาองค์ประกอบจาก role / label / ข้อความ) ไม่ผูกกับรายละเอียดภายในของคอมโพเนนต์

```bash
cd frontend
npm test                # watch mode ระหว่างพัฒนา
npm run test:run        # รันครั้งเดียว
npm run test:coverage   # รันพร้อมรายงาน coverage (HTML อยู่ที่ frontend/coverage/index.html)
```

### ขอบเขตของเทสต์

| ระดับ | ไฟล์ | ตรวจอะไร |
|---|---|---|
| Unit | `utils/*.test.js` | การค้นหาและจัดอันดับ, ไฮไลต์คำค้น, localStorage (ข้อมูลเสีย / พื้นที่เต็ม), จัดรูปแบบวันที่ |
| Unit | `data/data.test.js` | ความถูกต้องของข้อมูลตั้งต้น (id ไม่ซ้ำ, แนวหนังมีอยู่จริง), `slugify`, รีวิวจำลองคงที่, hash รหัสผ่าน |
| Unit | `hooks/*.test.js(x)` | แบ่งหน้า, เรียงคอลัมน์, กรองรีวิวที่ถูกซ่อน / ผู้เขียนถูกระงับ / หนังถูกซ่อน |
| State | `context/*.test.jsx` | ล็อกอิน / สมัคร / เปลี่ยนรหัสผ่าน, กันพลาดของผู้ดูแล (ห้ามแก้ตัวเอง, ต้องเหลือผู้ดูแลอย่างน้อย 1 คน), ระงับ / รีเซ็ตรหัส / ลบบัญชี, CRUD หนังและแนวหนัง, เลิกทำ |
| Component | `components/admin/AdminRoute.test.jsx` | guest → ขอให้ล็อกอิน, ผู้ใช้ทั่วไป → 404, ผู้ดูแล → เข้าได้ |
| Integration | `App.test.jsx` | ล็อกอินผู้ดูแลจาก Header, ออกจากระบบจากหน้าที่ต้องล็อกอิน, สร้างหนังในหน้าผู้ดูแลแล้วเห็นบนหน้าเว็บ, ระงับบัญชีผ่าน dialog |

- **เกณฑ์ coverage ขั้นต่ำ** (ตั้งไว้ใน `vite.config.js`): `utils/` และ `data/` ≥ 90%, `context/` ≥ 70% ถ้าต่ำกว่านี้ CI จะไม่ผ่าน
- **CI** (`.github/workflows/frontend-ci.yml`): รัน `lint` → `test:coverage` → `build` ทุกครั้งที่ push หรือเปิด PR ที่แก้ `frontend/` และอัปโหลดรายงาน coverage เก็บไว้ 7 วัน
- **ตัวช่วย** อยู่ใน `src/test/`: `setup.js` (jest-dom, ล้าง localStorage ก่อนทุกเทสต์, จำลอง API ที่ jsdom ไม่มี) และ `utils.jsx` (`renderStore`, `renderWithRouter`, `renderApp`)

---

## แผนการพัฒนาต่อ (Roadmap)

### ลำดับถัดไป

1. **เชื่อมต่อ Authentication จริง**
   - ให้ Header ใช้ `AuthContext` (`login`, `register`, `logout`) แทนระบบจำลอง
   - ปรับรูปแบบข้อมูล `user` ให้ตรงกันทั้งแอป (ปัจจุบันบางส่วนใช้เป็น string บางส่วนเป็น object)
   - ย้ายการอ่าน/เขียนข้อมูลใน `ProfileContext` และ `AccountsContext` ไปเรียก API แทน localStorage
   - ระบบผู้ดูแล: ตรวจสิทธิ์ที่ backend (`is_staff` / permission class) ทุก endpoint ที่แก้ข้อมูล และบันทึก audit log ฝั่งเซิร์ฟเวอร์
2. **เชื่อมต่อ API รายการหนัง** แทนแคตตาล็อกใน `CatalogContext` (หน้าผู้ดูแลเรียก create/update/delete ผ่าน API)
   - ต้องทำ mapping ฟิลด์ระหว่าง Frontend กับ Backend (Frontend ใช้ `score`, `reviews`, `poster`, `backdrop`, `synopsis`, `genreLabel`, `duration`, `director`, `cast` ส่วน Backend ออกแบบไว้เป็น ชื่อ, คำอธิบาย, ผู้กำกับ, ปีที่ออกฉาย, แนวหนัง, รูปภาพ)
   - เพิ่มฟิลด์วันที่ฉายเพื่อทำโซน "เร็วๆ นี้" ให้ถูกต้อง
3. **เชื่อมต่อ Rating / Review / Comment** ให้บันทึกลงฐานข้อมูลจริง
4. **ส่งข้อความจากฟอร์มติดต่อเรา** ผ่าน API หรือบริการอีเมล

### ปรับปรุง Frontend

- Loading Skeleton ระหว่างโหลดข้อมูล (เมื่อต่อ API)
- Pagination / Infinite Scroll
- ระบบผู้ดูแล: เลือกหลายรายการแล้วจัดการพร้อมกัน, Export / Import JSON, ตั้งค่าหนังเด่นหน้าแรก, อัปโหลดโปสเตอร์

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