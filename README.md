# SortLab — Backend
<img width="1774" height="547" alt="image" src="https://github.com/user-attachments/assets/01a66c04-7373-4dbf-9e3d-df359099b514" />

Backend ini adalah bagian dari virtual lab pembelajaran algoritma sorting: SortLab.

Techstacks:
[![Node.js](https://img.shields.io/badge/Node.js-20.0-green?logo=node.js)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-4.18-black?logo=express)](https://expressjs.com/) [![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-cloud-green?logo=mongodb)](https://www.mongodb.com/atlas) [![Deploy on Railway](https://img.shields.io/badge/Deploy-Railway-purple?logo=railway)](https://railway.app/)

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
