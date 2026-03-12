# AGENTS.md

## Debugging runtime
- Jika data master terlihat "terhapus", cek status `Aktif/Tidak Aktif`; delete master data bukan hard delete.
- Jika karyawan hilang dari list/detail, cek flag `is_deleted` lebih dulu.
- Error create/update karyawan paling sering berasal dari mismatch rantai divisi/department/posisi, manager tidak aktif/bukan `head`, atau referensi master data berstatus non-`Aktif`.
- Jika import gagal setelah preview berhasil, cek tahapnya: hasil `validate` menyimpan session di memory `Map`; restart backend membuat `sessionId` lama invalid.
- Jika hasil import lookup meleset, cek nama aktif di master data/karyawan; lookup tidak berbasis code/id dan parser header/tanggal cukup toleran.
- Jika foto tidak tampil, cek file fisik di [`backend/uploads/foto-karyawan`](backend/uploads/foto-karyawan), nilai relative path di DB, dan base API frontend untuk `/uploads/...`.
- Jika masalah auth muncul saat banyak request paralel, telusuri queue refresh token di [`frontend/src/lib/axios.ts`](frontend/src/lib/axios.ts) dan mode storage di [`frontend/src/modules/auth/AuthContext.tsx`](frontend/src/modules/auth/AuthContext.tsx).
- QR code yang rusak perlu dicek di nilai data URL base64 DB, bukan filesystem.
