# 🔍 TROUBLESHOOTING - Kenapa Gabisa?

## ❌ MASALAH UMUM & SOLUSI

### 1️⃣ "Masih Muncul Halaman Login Terus" atau "Gabisa Login"

**Penyebab:** File `.env` belum diisi dengan API key Supabase yang benar.

**Solusi:**
```bash
1. Buka https://supabase.com
2. Login → Pilih project kamu (atau buat baru)
3. Klik Settings (ikon gear) → API
4. Copy "Project URL" → Paste ke file .env di baris VITE_SUPABASE_URL
5. Copy "anon public" key → Paste ke file .env di baris VITE_SUPABASE_ANON_KEY
6. Save file .env
7. RESTART dev server (Ctrl+C, lalu npm run dev lagi)
```

---

### 2️⃣ "Error: Invalid API Key" atau "Authentication Failed"

**Penyebab:** 
- API key salah copy
- Project Supabase belum dibuat
- SQL schema belum di-run

**Solusi:**
```bash
✅ Pastikan:
- URL formatnya: https://xxxxx.supabase.co (bukan .com atau lainnya)
- Key dimulai dengan "eyJhbG..." (JWT token)
- Tidak ada spasi di awal/akhir saat copy-paste
```

---

### 3️⃣ "Table Doesn't Exist" atau Error SQL

**Penyebab:** SQL schema belum di-run di Supabase.

**Solusi:**
```bash
1. Di Supabase Dashboard → SQL Editor
2. New Query
3. Copy SEMUA isi file SETUP_DATABASE.sql
4. Paste dan klik RUN
5. Tunggu muncul "Success. No rows returned"
6. Refresh halaman app
```

---

### 4️⃣ "Data Tidak Tersimpan" atau "Save Gagal"

**Penyebab:** 
- Tabel database belum ada
- RLS (Row Level Security) belum aktif
- User belum login

**Solusi:**
```bash
✅ Cek di browser console (F12):
- Ada error merah? Screenshot dan cek solusinya di atas
- Pastikan sudah login dengan email & password
- Cek Network tab → lihat request ke supabase.co
```

---

### 5️⃣ "Aplikasi Blank/Layar Putih"

**Penyebab:** 
- Server dev tidak running
- File App.jsx ada syntax error
- Browser cache lama

**Solusi:**
```bash
1. Pastikan terminal ada tulisan "VITE ready"
2. Buka http://localhost:5173 atau http://localhost:5174
3. Hard refresh browser: Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)
4. Clear cache browser
5. Restart dev server
```

---

### 6️⃣ "Script AI Tidak Muncul"

**Penyebab:** Ini NORMAL di local development!

**Solusi:**
```bash
✅ Script generator SUDAH DIPERBAIKI dengan fallback:
- Lokal: Generate script template profesional
- Production (Vercel + GEMINI_API_KEY): Generate script AI real-time

Tidak perlu fix apa-apa, ini sudah working as intended!
```

---

### 7️⃣ "Tim Tidak Bisa Akses Data Saya"

**Penyebab:** Ini BUkannya bug, tapi FITUR keamanan!

**Penjelasan:**
```bash
✅ Setiap user punya data terpisah (RLS security)
✅ Data tim TIDAK tercampur untuk privasi
✅ Kalau mau sharing, export manual atau beri akses read-only

Ini desain intentional agar data client masing-masing agent aman!
```

---

## 🛠 CARA CEK ERROR DI BROWSER

1. Buka aplikasi di browser
2. Tekan **F12** (atau klik kanan → Inspect)
3. Klik tab **Console**
4. Lihat pesan error berwarna merah
5. Screenshot dan cocokkan dengan solusi di atas

---

## 📞 CHECKLIST LENGKAP

Sebelum bilang "error", pastikan sudah:

- [ ] Buat account di supabase.com
- [ ] Buat project baru
- [ ] Run SQL dari SETUP_DATABASE.sql
- [ ] Copy URL & key ke file .env
- [ ] Restart dev server (npm run dev)
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Cek console browser (F12) untuk error

---

## 🎯 KALAU MASIH ERROR...

Kirim screenshot yang berisi:
1. Console error (F12 → Console tab)
2. Isi file .env (sensor API key kalau mau)
3. URL browser yang dibuka
4. Pesan error lengkap

---

## ✨ SETUP YANG BENAR (Step-by-Step Visual)

```
STEP 1: Buat Project
https://supabase.com → New Project → Wait 2 menit

STEP 2: Run SQL
Dashboard → SQL Editor → New Query → Paste SETUP_DATABASE.sql → RUN

STEP 3: Get Keys
Settings → API → Copy Project URL & anon public key

STEP 4: Update .env
Buka file .env → Paste URL & key → Save

STEP 5: Restart
Ctrl+C di terminal → npm run dev

STEP 6: Test
Buka browser → Daftar akun baru → Login → Done!
```

---

🎉 **99% masalah selesai dengan mengikuti langkah di atas!**

Kalau masih stuck, cek file `PANDUAN_SETUP.md` untuk panduan lebih detail.
