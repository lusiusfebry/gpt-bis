# AGENTS.md

## Constraint arsitektur
- Root repo bukan entrypoint implementasi domain; backend dan frontend diperlakukan sebagai aplikasi terpisah dengan command sendiri.
- HR master data backend sengaja dipusatkan ke abstraksi [`BaseMasterDataService`](backend/src/modules/hr/master-data/base-master-data.service.ts); perubahan perilaku CRUD generik akan berdampak ke semua master data.
- Semantik delete berbeda per domain: master data = toggle status, karyawan = soft delete `is_deleted`.
- Integritas karyawan bergantung pada rantai master data aktif dan hierarki organisasi; perubahan schema/service pada divisi, department, posisi, atau manager mudah memutus create/update/import sekaligus.
- Import saat ini stateful di memory proses backend karena session disimpan di `Map`; arsitektur ini tidak tahan restart atau multi-instance tanpa redesign.
- Lookup import berbasis nama aktif membuat rename master data/karyawan menjadi coupling penting terhadap file Excel dan seed.
- Frontend HR master data tidak sepenuhnya data-driven; menu hardcoded di [`shared.tsx`](frontend/src/modules/hr/master-data/shared.tsx), sedangkan modul aplikasi utama berasal dari backend `/modules`.
- Penyimpanan media bercampur: foto sebagai file + relative path, QR sebagai base64 di DB; perubahan strategi salah satu sisi perlu audit frontend/backend sekaligus.
