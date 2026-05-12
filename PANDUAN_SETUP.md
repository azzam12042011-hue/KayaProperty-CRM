# 📘 PANDUAN LENGKAP SETUP SUPABASE - KAYA PROPERTY CRM

## ✅ YANG SUDAH DILAKUKAN OTOMATIS

Saya sudah melakukan setup kode untuk:
- ✅ Install library Supabase
- ✅ Buat file konfigurasi `src/supabaseClient.js`
- ✅ Tambah sistem Login/Register multi-user
- ✅ Update semua fungsi save/load data ke Supabase
- ✅ Buat komponen LoginPage yang modern
- ✅ Tambah tombol Logout di sidebar
- ✅ Buat file SQL database (`SETUP_DATABASE.sql`)
- ✅ Script generator TIDAK diubah (sesuai request)

---

## 🔧 LANGKAH MANUAL YANG HARUS KAMU LAKUKAN

### **TAHAP 1: BUAT PROJECT SUPABASE** (5 menit)

1. Buka https://supabase.com dan login/signup
2. Klik **"New Project"**
3. Isi data project:
   - **Name**: `kaya-property-crm`
   - **Database Password**: (simpan baik-baik!)
   - **Region**: Pilih yang terdekat (Singapore/Tokyo)
4. Klik **"Create new project"** → tunggu 2-3 menit sampai selesai

---

### **TAHAP 2: SETUP DATABASE** (2 menit)

1. Di dashboard Supabase, klik menu **"SQL Editor"** (sidebar kiri)
2. Klik **"New query"**
3. Buka file `SETUP_DATABASE.sql` di project ini
4. **Copy SEMUA isi file** tersebut
5. **Paste** ke SQL Editor di Supabase
6. Klik **"Run"** (atau Ctrl+Enter)
7. ✅ Jika sukses, akan muncul pesan "Success. No rows returned"

---

### **TAHAP 3: AMBIL API KEYS** (1 menit)

1. Di dashboard Supabase, klik menu **"Settings"** (gear icon)
2. Klik **"API"** di sidebar kiri
3. Copy 2 nilai ini:
   - **Project URL** → contoh: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key** → contoh: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### **TAHAP 4: UPDATE FILE .ENV** (1 menit)

1. Buka file `.env` di project ini
2. Ganti nilai default dengan yang kamu copy dari Supabase:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxx
```

3. **Save** file `.env`

---

### **TAHAP 5: TEST LOCAL** (2 menit)

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka browser di http://localhost:5173

3. Kamu akan melihat **halaman Login**

4. **Daftar akun pertama kali:**
   - Klik "Daftar Sekarang"
   - Masukkan nama, email, password
   - Klik "Daftar Akun Baru"

5. **Cek email** untuk verifikasi (jika enable email confirmation)
   - Atau langsung login jika tidak require confirmation

6. **Login** dengan email & password yang sudah dibuat

7. ✅ Jika berhasil login, kamu akan masuk ke Dashboard!

---

### **TAHAP 6: UNGGAH KE VERCEL (PRODUCTION)** (5 menit)

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Setup Supabase multi-user system"
   git push origin main
   ```

2. **Deploy ke Vercel:**
   - Buka https://vercel.com
   - Klik **"Add New Project"**
   - Import repository GitHub kamu
   - Framework Preset: **Vite** (auto-detect)

3. **Set Environment Variables di Vercel:**
   - Di halaman deploy, klik **"Environment Variables"**
   - Add variable:
     - `VITE_SUPABASE_URL` → paste URL project
     - `VITE_SUPABASE_ANON_KEY` → paste anon key
   - Klik **"Save"**

4. **Redeploy:**
   - Klik **"Redeploy"** agar env variables aktif
   - Tunggu build selesai (~1-2 menit)

5. ✅ **DONE!** Aplikasi sudah live dan bisa diakses tim!

---

## 👥 CARA MENGGUNAKAN BERSAMA TIM (5 ORANG)

### **Untuk Setiap Anggota Tim:**

1. Buka aplikasi (local atau production URL)
2. **Daftar akun baru** dengan email masing-masing
3. Login dengan kredensial sendiri
4. **Data otomatis terpisah** per user!

### **Keamanan Data:**

- ✅ Setiap user hanya bisa lihat data mereka sendiri
- ✅ Data tersimpan di cloud (Supabase)
- ✅ Bisa akses dari device apapun (laptop, HP, tablet)
- ✅ Real-time sync antar device
- ✅ Fallback ke localStorage jika offline

---

## 🎯 FITUR YANG SUDAH TERINTEGRASI

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Login/Register | ✅ | Email + Password |
| Multi-User | ✅ | Data terpisah per user |
| Save Leads | ✅ | Auto-save ke Supabase |
| Save Properties | ✅ | Auto-save ke Supabase |
| Save Activities | ✅ | Auto-save ke Supabase |
| Logout | ✅ | Tombol di sidebar |
| Script Generator | ✅ | **TIDAK DIUBAH** (sesuai request) |
| Offline Mode | ✅ | Fallback localStorage |

---

## 🔐 ENABLE EMAIL AUTH (Opsional tapi Recommended)

Jika ingin require email verification:

1. Di Supabase Dashboard → **Authentication** → **Providers**
2. Klik **Email** provider
3. Enable **"Enable Email Signup"**
4. Enable **"Confirm email"** (recommended)
5. Configure email template (opsional)
6. Save

---

## 🆘 TROUBLESHOOTING

### Error: "Invalid API key"
- Cek ulang `.env` file
- Pastikan tidak ada spasi di awal/akhir
- Restart dev server (`Ctrl+C` → `npm run dev`)

### Error: "relation does not exist"
- Pastikan SQL sudah di-run di Supabase
- Cek di menu **Table Editor** apakah tabel sudah ada

### Login tidak bisa
- Cek email verification (cek inbox/spam)
- Pastikan RLS policies sudah benar
- Cek browser console untuk error detail

### Data tidak tersimpan
- Cek koneksi internet
- Pastikan user sudah login
- Cek Supabase logs di dashboard

---

## 📞 SUPPORT

Jika ada kendala:
1. Cek browser console (F12) untuk error message
2. Cek Supabase logs di dashboard
3. Pastikan semua langkah sudah dilakukan berurutan

---

**🎉 SELAMAT! Sistem CRM multi-user sudah siap digunakan tim!**
