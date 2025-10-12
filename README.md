# SortLab — Backend

Backend ini adalah bagian dari aplikasi pembelajaran algoritma sorting yang memiliki dua mode:
- **Practice Mode** — belajar konsep sorting dan menyimpan progres topik yang sudah dipelajari.
- **Compete Mode** — menjawab kuis, meraih skor, dan menyimpan hasil skor dalam bentuk nilai numerik dan status (Completed, Failed, Not yet taken).

Project ini di-build menggunakan **Node.js + Express** dan **MongoDB Atlas (Mongoose, Cloud)** dengan autentikasi berbasis **JWT (JSON Web Token)**.

---

## Fitur Utama

### 🔐 Autentikasi
- Register & Login menggunakan email dan password.
- Password terenkripsi dengan **bcrypt**.
- Setiap sesi dilindungi dengan **JWT token**.
- Endpoint `/api/auth/me` untuk mengambil data user yang sedang login.
- 
### 📈 Progress Tracking
Dua tipe progress disimpan dalam database:
#### 1️⃣ Practice Progress
Mencatat apakah user telah menyelesaikan materi
#### 2️⃣ Compete Progress
Mencatat apakah user telah mengerjakan kuis

### 🏆 Sistem Poin dan Leaderboard
User mendapatkan poin berdasarkan performa di mode Compete. Total poin terakumulai disimpan di field totalPoints dan ditampilkan di Leaderboard.

### Struktur Direktori
backend/
├── controllers/
│   ├── authController.js        # Register, login, getMe, updateProgress
│   └── userController.js        # Update score dan compete progress
├── models/
│   └── User.js                  # Schema untuk user
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── middleware/
│   └── authMiddleware.js        # Middleware JWT verification
├── .env
├── package.json
└── server.js
