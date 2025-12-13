# API-DOCS.md

## Guest Management System – REST API Documentation

Dokumentasi ini menjelaskan seluruh endpoint REST API untuk **Guest Management System**, termasuk autentikasi, otorisasi, dan CRUD resource.

---

## Base URL

```text
http://PUBLIC_IP_EC2
```

---

## Authentication

### Authorization Header

Semua endpoint protected **WAJIB** menyertakan header:

```http
Authorization: Bearer <access_token>
```

---

## Response Format Standar

### Success Response

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {},
  "pagination": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response `201 Created`

---

### Login User

**POST** `/api/auth/login`

Request Body:

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

---

### Refresh Token

**POST** `/api/auth/refresh`

Request Body:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response `200 OK`

---

### Get Current User

**GET** `/api/auth/me`

Auth: ✅ Required

Response `200 OK`

---

## Event Endpoints

### List Events

**GET** `/api/events`

Query Params:

* `page` (default: 1)
* `limit` (default: 10)
* `search`
* `sortBy`
* `order` (asc | desc)

Response `200 OK`

---

### Get Event Detail

**GET** `/api/events/:id`

Response `200 OK`

---

### Create Event

**POST** `/api/events`

Auth: ✅ Required (USER / ADMIN)

Request Body:

```json
{
  "title": "Tech Conference",
  "description": "Annual tech event",
  "date": "2025-12-01"
}
```

Response `201 Created`

---

### Update Event

**PUT** `/api/events/:id`

Auth: ✅ Required (Owner / ADMIN)

Response `200 OK`

---

### Delete Event

**DELETE** `/api/events/:id`

Auth: ✅ Required (Owner / ADMIN)

Response `204 No Content`

---

## Guest Endpoints

### List Guests

**GET** `/api/guests`

Query Params:

* `page`
* `limit`
* `status`
* `search`

Response `200 OK`

---

### Get Guest Detail

**GET** `/api/guests/:id`

Response `200 OK`

---

### Create Guest

**POST** `/api/guests`

Auth: ✅ Required

Request Body:

```json
{
  "name": "Alice",
  "email": "alice@mail.com",
  "phone": "08123456789"
}
```

Response `201 Created`

---

### Update Guest

**PUT** `/api/guests/:id`

Auth: ✅ Required (Owner / ADMIN)

Response `200 OK`

---

### Delete Guest

**DELETE** `/api/guests/:id`

Auth: ✅ Required (Owner / ADMIN)

Response `204 No Content`

---

## Health Check

### Check API Status

**GET** `/health`

Auth: ❌ Not required

Response `200 OK`

```json
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "2025-01-01T00:00:00Z",
  "uptime": 12345
}
```

---

## HTTP Status Codes

* `200 OK`
* `201 Created`
* `204 No Content`
* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `409 Conflict`
* `500 Internal Server Error`

---

## Notes

* Semua endpoint POST & PUT menggunakan validation schema
* Password di-hash menggunakan bcrypt
* JWT access token berdurasi pendek
* Refresh token digunakan untuk memperbarui access token

---

Dokumentasi ini dibuat untuk memenuhi kebutuhan **Tugas Project Akhir Backend – Pemrograman Web**.
