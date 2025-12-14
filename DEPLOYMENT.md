# DEPLOYMENT.md

## Guest Management System – Backend API

Dokumen ini menjelaskan langkah lengkap melakukan deployment **Guest Management System REST API** ke **AWS EC2 (Ubuntu Server 22.04 LTS)** hingga aplikasi dapat diakses secara publik.

---

## 1. Informasi Umum

* **Repository GitHub**: [https://github.com/USERNAME/guest-management-backend](https://github.com/USERNAME/guest-management-backend)
* **Base URL Production**: http://72.44.63.167
* **Health Check Endpoint**: `GET /`

---

## 2. Detail AWS EC2

| Item           | Keterangan              |
| -------------- | ----------------------- |
| Cloud Provider | AWS Academy Learner Lab |
| Instance Type  | t2.micro                |
| OS             | Ubuntu Server 22.04 LTS |
| Storage        | 8 GB                    |
| Region         | (sesuai AWS Academy)    |
| Public IP      | 72.44.63.167            |

---

## 3. Konfigurasi Security Group

### Inbound Rules

| Type       | Port | Source           |
| ---------- | ---- | ---------------- |
| SSH        | 22   | 125.166.18.59/32 |
| HTTP       | 80   | 0.0.0.0/0        |
| Custom TCP | 4000 | 0.0.0.0/0        |

### Outbound Rules

* Allow all traffic

---

## 4. Koneksi ke Server (SSH)

```bash
chmod 400 keypair.pem
ssh -i keypair.pem ubuntu@72.44.63.167
```

Jika berhasil, terminal akan masuk ke server EC2.

---

## 5. Update Sistem

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 6. Instalasi Software

### Install Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verifikasi

```bash
node -v
npm -v
```

### Install Git & PM2

```bash
sudo apt install git -y
sudo npm install -g pm2
```

---

## 7. Clone Repository

```bash
git clone https://github.com/USERNAME/guest-management-backend.git
cd guest-management-backend
```

---

## 8. Install Dependencies

```bash
npm install
```

Pastikan tidak ada error.

---

## 9. Konfigurasi Environment Variable

Buat file `.env`:

```bash
nano .env
```

### Contoh isi `.env`

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="file:./dev.db"

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d
```

⚠️ **Jangan commit file `.env`**

---

## 10. Setup Database (Prisma)

```bash
npx prisma generate
npx prisma migrate deploy
```

### (Opsional) Jalankan Seeder

```bash
npm run seed
```

---

## 11. Menjalankan Aplikasi (Testing)

```bash
npm run start
```

Test:

```bash
curl http://72.44.63.167:3000/
```

Jika berhasil, hentikan dengan `Ctrl + C`.

---

## 12. Menjalankan dengan PM2

```bash
pm2 start src/app.js --name guest-management-api
pm2 save
pm2 startup
```

### Cek Status

```bash
pm2 status
pm2 logs
```

---

## 13. (Opsional) Konfigurasi Nginx

### Install Nginx

```bash
sudo apt install nginx -y
```

### Konfigurasi Server Block

```bash
sudo nano /etc/nginx/sites-available/guest-api
```

Isi:

```nginx
server {
    listen 80;

    server_name 72.44.63.167;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/guest-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Akses API via:

```text
http://72.44.63.167
```

---

## 14. Verifikasi Deployment

Checklist:

* [x] `/` return status 200
* [x] Login berhasil
* [x] CRUD Event berhasil
* [x] CRUD Guest berhasil
* [x] Authorization berjalan

---

## 15. Monitoring & Maintenance

### Monitoring

```bash
pm2 status
pm2 monit
pm2 logs
```

### Update Aplikasi

```bash
git pull origin main
npm install
npx prisma migrate deploy
pm2 restart guest-management-api
```

---

## 16. Troubleshooting

### Port tidak bisa diakses

* Pastikan Security Group membuka port 4000 / 80

### Aplikasi crash

* Cek log PM2
* Pastikan `.env` valid

### Prisma error

* Pastikan migrate sudah dijalankan

---

## 17. Test Credentials

### Admin

* Email: [admin@test.com](mailto:admin@test.com)
* Password: Admin123!

### User

* Email: [user1@test.com](mailto:user1@test.com)
* Password: User123!
