# README.md

## Guest Management System API

Backend REST API untuk mengelola tamu (guest) dan event menggunakan arsitektur MVC. Project ini dibuat untuk memenuhi **Tugas Project Akhir – Mata Kuliah Pemrograman Web**.

---

## 🚀 Tech Stack

* **Runtime**: Node.js 18+
* **Framework**: Express.js
* **Database**: SQLite
* **ORM**: Prisma
* **Authentication**: JWT (Access & Refresh Token)
* **Password Hashing**: bcrypt
* **Validation**: Zod
* **Process Manager**: PM2
* **Deployment**: AWS EC2 (Ubuntu 22.04)

---

## 📦 Fitur Utama

* Authentication & Authorization (JWT + RBAC)
* CRUD Event (Admin only)
* CRUD Guest (Owner / Admin)
* Many-to-Many Event ↔ Guest
* Pagination, Search, Filtering
* Anti-BOLA (Ownership validation)
* Logger & Global Error Handler
* Health Check Endpoint

---

## 🌐 Base URL (Production)

```
http://<PUBLIC_IP_EC2>:3000
```

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "OK",
  "message": "Guest Management System API is running",
  "timestamp": "...",
  "uptime": 1234
}
```

---

## 🔐 Test Credentials

### Admin

```
Email: admin@gms.com
Password: admin12345
Role: ADMIN
```

### User

```
Email: john@gms.com
Password: user12345
Role: USER
```

---

## ▶️ Menjalankan Project (Local)

```bash
npm install
npx prisma migrate dev
npm run seed
npm run dev
```
