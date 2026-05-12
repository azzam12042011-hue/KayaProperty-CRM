# 🚀 QUICK START - Setup Supabase dalam 10 Menit

## ✅ Yang Sudah Otomatis Done:
- Library Supabase terinstall
- Sistem login/register multi-user siap
- Database schema SQL sudah dibuat
- Script generator **TIDAK DIUBAH** (sesuai request)

---

## 🔥 4 LANGKAH CEPAT:

### 1️⃣ Buat Project di Supabase (3 menit)
```
→ Buka https://supabase.com
→ New Project → Name: "kaya-property-crm"
→ Pilih region Singapore/Tokyo
→ Tunggu selesai
```

### 2️⃣ Run SQL Schema (2 menit)
```
→ Di Supabase Dashboard → SQL Editor → New Query
→ Copy SEMUA isi file SETUP_DATABASE.sql
→ Paste & Run
→ Done! Tabel sudah terbuat
```

### 3️⃣ Update .env (1 menit)
```
→ Settings → API di Supabase
→ Copy Project URL & anon public key
→ Paste ke file .env di project ini
→ Save
```

### 4️⃣ Test & Deploy (4 menit)
```bash
# Test local
npm run dev

# Deploy production
git add . && git commit -m "Setup complete" && git push
# Lalu deploy ke Vercel dengan env variables yang sama
```

---

## 👥 Untuk Tim (5 Orang):

Setiap anggota:
1. Buka app → Daftar akun baru dengan email masing-masing
2. Login
3. Data otomatis terpisah dan aman!

---

## 📁 File Penting:

| File | Fungsi |
|------|--------|
| `SETUP_DATABASE.sql` | SQL schema untuk database |
| `PANDUAN_SETUP.md` | Panduan lengkap detail |
| `.env` | Tempat paste API keys |
| `src/supabaseClient.js` | Config Supabase (jangan diubah) |
| `src/App.jsx` | App utama dengan login system |

---

## ✨ Fitur Multi-User:

- ✅ Login/Register dengan email
- ✅ Data terpisah per user (RLS security)
- ✅ Cloud sync real-time
- ✅ Bisa akses dari device manapun
- ✅ Tombol logout di sidebar
- ✅ Fallback offline mode

---

## 🆘 Kalau Ada Masalah:

1. Cek console browser (F12) untuk error
2. Pastikan SQL sudah di-run di Supabase
3. Cek .env sudah benar URL & key-nya
4. Restart dev server jika perlu

**Full guide ada di `PANDUAN_SETUP.md`**

---

🎉 **Happy Coding!**
