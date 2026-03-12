# AGENTS.md

## Implementasi
- Jalankan command domain dari subdir yang benar: backend di [`backend`](backend), frontend di [`frontend`](frontend); jangan andalkan root selain `dev`.
- Untuk master data HR, reuse pola [`BaseMasterDataService`](backend/src/modules/hr/master-data/base-master-data.service.ts) dan pertahankan semantik delete = toggle status `Aktif/Tidak Aktif`.
- Untuk karyawan, pertahankan soft delete `is_deleted`; query list/detail baru harus tetap memfilter data non-deleted.
- Saat menambah validasi karyawan, jaga coupling relasi: department↔divisi, posisi↔department, manager aktif + posisi mengandung `head`, seluruh master data referensi harus `Aktif`.
- Fitur import harus tetap mengikuti alur 3 tahap upload/validate/execute berbasis `sessionId`; jangan ubah asumsi lookup berbasis nama aktif tanpa menyesuaikan seluruh mapping/import.
- Simpan foto sebagai relative path ke folder upload, bukan URL absolut; QR code tetap data URL base64 di DB.
- Di frontend HR master data, ikuti pola [`useMasterData`](frontend/src/modules/hr/hooks/useMasterData.ts); penambahan menu master data perlu edit [`shared.tsx`](frontend/src/modules/hr/master-data/shared.tsx), bukan berharap muncul dari `/modules`.
- Perubahan form create karyawan perlu dicek terhadap perbedaan payload dengan edit/detail/import agar field tidak diam-diam hilang.
- Ikuti gaya field/domain Indonesia snake_case di backend dan searchable select `optionFilterProp: "label"` di frontend.
- Validasi NIK harus tetap `xx-xxxxx`.
