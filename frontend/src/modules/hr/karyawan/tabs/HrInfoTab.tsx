import {
  BookOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  IdcardOutlined,
  PhoneOutlined,
  SkinOutlined,
  SwapOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import api from "../../../../lib/axios";
import type { KaryawanDetail, SelectOption, useMasterDataDropdowns } from "../../hooks/useKaryawan";

type HrInfoTabProps = {
  data: KaryawanDetail;
  dropdowns: ReturnType<typeof useMasterDataDropdowns>;
  onSave: () => Promise<void> | void;
  employeeId: string;
};

type HrInfoFormValues = {
  nomor_induk_karyawan?: string;
  posisi_jabatan_id?: string;
  divisi_id?: string;
  department_id?: string;
  email_perusahaan?: string;
  manager_id?: string;
  atasan_langsung_id?: string;
  jenis_hubungan_kerja_id?: string;
  tanggal_masuk_group?: Dayjs | null;
  tanggal_masuk?: Dayjs | null;
  tanggal_permanent?: Dayjs | null;
  tanggal_kontrak?: Dayjs | null;
  tanggal_akhir_kontrak?: Dayjs | null;
  tanggal_berhenti?: Dayjs | null;
  educations?: EducationPayload[];
  kategori_pangkat_id?: string;
  golongan_id?: string;
  sub_golongan_id?: string;
  no_dana_pensiun?: string;
  nama_kontak_darurat_1?: string;
  nomor_telepon_kontak_darurat_1?: string;
  hubungan_kontak_darurat_1?: string;
  alamat_kontak_darurat_1?: string;
  nama_kontak_darurat_2?: string;
  nomor_telepon_kontak_darurat_2?: string;
  hubungan_kontak_darurat_2?: string;
  alamat_kontak_darurat_2?: string;
  point_of_original?: string;
  point_of_hire?: string;
  ukuran_seragam_kerja?: string;
  ukuran_sepatu_kerja?: string;
  lokasi_sebelumnya_id?: string;
  tanggal_mutasi?: Dayjs | null;
  siklus_pembayaran_gaji?: string;
  costing?: string;
  assign?: string;
  actual?: string;
};

type EducationPayload = {
  tingkat_pendidikan?: string;
  bidang_studi?: string;
  nama_sekolah?: string;
  kota_sekolah?: string;
  status_kelulusan?: string;
  keterangan?: string;
};

const DATE_FIELDS: Array<keyof HrInfoFormValues> = [
  "tanggal_masuk_group",
  "tanggal_masuk",
  "tanggal_permanent",
  "tanggal_kontrak",
  "tanggal_akhir_kontrak",
  "tanggal_berhenti",
  "tanggal_mutasi",
];

const STATUS_KELULUSAN_OPTIONS = [
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Belum Lulus", value: "Belum Lulus" },
  { label: "Sedang Menempuh", value: "Sedang Menempuh" },
  { label: "Drop Out", value: "Drop Out" },
];

function toDayjs(value?: string | null) {
  return value ? dayjs(value) : null;
}

function toIsoString(value?: Dayjs | null) {
  return value ? value.toISOString() : null;
}

function normalizeOptionalText(value?: string | null) {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

function hasEducationValue(education: EducationPayload) {
  return Object.values(education).some((value) => normalizeOptionalText(value) !== undefined);
}

function normalizeEducationPayload(
  education?: {
    tingkat_pendidikan?: string | null;
    bidang_studi?: string | null;
    nama_sekolah?: string | null;
    kota_sekolah?: string | null;
    status_kelulusan?: string | null;
    keterangan?: string | null;
  } | null,
): EducationPayload {
  return {
    tingkat_pendidikan: normalizeOptionalText(education?.tingkat_pendidikan),
    bidang_studi: normalizeOptionalText(education?.bidang_studi),
    nama_sekolah: normalizeOptionalText(education?.nama_sekolah),
    kota_sekolah: normalizeOptionalText(education?.kota_sekolah),
    status_kelulusan: normalizeOptionalText(education?.status_kelulusan),
    keterangan: normalizeOptionalText(education?.keterangan),
  };
}

function buildEducationPayload(values: HrInfoFormValues): EducationPayload[] {
  return (values.educations ?? [])
    .map((education) => normalizeEducationPayload(education))
    .filter(hasEducationValue);
}

function buildInitialEducationPayload(data: KaryawanDetail): EducationPayload[] {
  return (data.educations ?? []).map((education) => normalizeEducationPayload(education));
}

function isEducationPayloadEqual(left: EducationPayload[], right: EducationPayload[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function getSelectProps(options: SelectOption[], loading?: boolean) {
  return {
    showSearch: true,
    filterOption: true,
    optionFilterProp: "label" as const,
    options,
    loading,
  };
}

function mapDataToFormValues(data: KaryawanDetail): HrInfoFormValues {
  return {
    nomor_induk_karyawan: data.nomor_induk_karyawan,
    posisi_jabatan_id: data.posisi_jabatan?.id ?? data.posisi_jabatan_id ?? undefined,
    divisi_id: data.divisi?.id ?? data.divisi_id ?? undefined,
    department_id: data.department?.id ?? data.department_id ?? undefined,
    email_perusahaan: data.email_perusahaan ?? undefined,
    manager_id: data.manager?.id ?? data.manager_id ?? undefined,
    atasan_langsung_id: data.atasan_langsung?.id ?? data.atasan_langsung_id ?? undefined,
    jenis_hubungan_kerja_id: data.jenis_hubungan_kerja_id ?? undefined,
    tanggal_masuk_group: toDayjs(data.tanggal_masuk_group),
    tanggal_masuk: toDayjs(data.tanggal_masuk),
    tanggal_permanent: toDayjs(data.tanggal_permanent),
    tanggal_kontrak: toDayjs(data.tanggal_kontrak),
    tanggal_akhir_kontrak: toDayjs(data.tanggal_akhir_kontrak),
    tanggal_berhenti: toDayjs(data.tanggal_berhenti),
    educations: buildInitialEducationPayload(data),
    kategori_pangkat_id: data.kategori_pangkat_id ?? undefined,
    golongan_id: data.golongan_id ?? undefined,
    sub_golongan_id: data.sub_golongan_id ?? undefined,
    no_dana_pensiun: data.no_dana_pensiun ?? undefined,
    nama_kontak_darurat_1: data.nama_kontak_darurat_1 ?? undefined,
    nomor_telepon_kontak_darurat_1: data.nomor_telepon_kontak_darurat_1 ?? undefined,
    hubungan_kontak_darurat_1: data.hubungan_kontak_darurat_1 ?? undefined,
    alamat_kontak_darurat_1: data.alamat_kontak_darurat_1 ?? undefined,
    nama_kontak_darurat_2: data.nama_kontak_darurat_2 ?? undefined,
    nomor_telepon_kontak_darurat_2: data.nomor_telepon_kontak_darurat_2 ?? undefined,
    hubungan_kontak_darurat_2: data.hubungan_kontak_darurat_2 ?? undefined,
    alamat_kontak_darurat_2: data.alamat_kontak_darurat_2 ?? undefined,
    point_of_original: data.point_of_original ?? undefined,
    point_of_hire: data.point_of_hire ?? undefined,
    ukuran_seragam_kerja: data.ukuran_seragam_kerja ?? undefined,
    ukuran_sepatu_kerja: data.ukuran_sepatu_kerja ?? undefined,
    lokasi_sebelumnya_id: data.lokasi_sebelumnya_id ?? undefined,
    tanggal_mutasi: toDayjs(data.tanggal_mutasi),
    siklus_pembayaran_gaji: data.siklus_pembayaran_gaji ?? undefined,
    costing: data.costing ?? undefined,
    assign: data.assign ?? undefined,
    actual: data.actual ?? undefined,
  };
}

function HrInfoTab({ data, dropdowns, onSave, employeeId }: HrInfoTabProps) {
  const [form] = Form.useForm<HrInfoFormValues>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(mapDataToFormValues(data));
  }, [data, form]);

  const initialEducationPayload = useMemo(() => buildInitialEducationPayload(data), [data]);

  const handleSubmit = async (values: HrInfoFormValues) => {
    setIsSaving(true);

    try {
      const educationPayload = buildEducationPayload(values);
      const isEducationChanged = !isEducationPayloadEqual(educationPayload, initialEducationPayload);

      const payload = {
        jenis_hubungan_kerja_id: values.jenis_hubungan_kerja_id,
        tanggal_masuk_group: toIsoString(values.tanggal_masuk_group),
        tanggal_masuk: toIsoString(values.tanggal_masuk),
        tanggal_permanent: toIsoString(values.tanggal_permanent),
        tanggal_kontrak: toIsoString(values.tanggal_kontrak),
        tanggal_akhir_kontrak: toIsoString(values.tanggal_akhir_kontrak),
        tanggal_berhenti: toIsoString(values.tanggal_berhenti),
        kategori_pangkat_id: values.kategori_pangkat_id,
        golongan_id: values.golongan_id,
        sub_golongan_id: values.sub_golongan_id,
        no_dana_pensiun: values.no_dana_pensiun,
        nama_kontak_darurat_1: values.nama_kontak_darurat_1,
        nomor_telepon_kontak_darurat_1: values.nomor_telepon_kontak_darurat_1,
        hubungan_kontak_darurat_1: values.hubungan_kontak_darurat_1,
        alamat_kontak_darurat_1: values.alamat_kontak_darurat_1,
        nama_kontak_darurat_2: values.nama_kontak_darurat_2,
        nomor_telepon_kontak_darurat_2: values.nomor_telepon_kontak_darurat_2,
        hubungan_kontak_darurat_2: values.hubungan_kontak_darurat_2,
        alamat_kontak_darurat_2: values.alamat_kontak_darurat_2,
        point_of_original: values.point_of_original,
        point_of_hire: values.point_of_hire,
        ukuran_seragam_kerja: values.ukuran_seragam_kerja,
        ukuran_sepatu_kerja: values.ukuran_sepatu_kerja,
        lokasi_sebelumnya_id: values.lokasi_sebelumnya_id,
        tanggal_mutasi: toIsoString(values.tanggal_mutasi),
        siklus_pembayaran_gaji: values.siklus_pembayaran_gaji,
        costing: values.costing,
        assign: values.assign,
        actual: values.actual,
        ...(isEducationChanged
          ? {
              educations: educationPayload,
            }
          : {}),
      };

      await api.patch(`/hr/karyawan/${employeeId}`, payload);
      message.success("Data HR karyawan berhasil disimpan");
      await onSave();
    } catch {
      message.error("Gagal menyimpan data HR karyawan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form<HrInfoFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <IdcardOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Kepegawaian</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Nomor Induk Karyawan" name="nomor_induk_karyawan">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Posisi Jabatan" name="posisi_jabatan_id">
                <Select disabled {...getSelectProps(dropdowns.posisiJabatanOptions, dropdowns.loadingState.posisiJabatan.loading)} />
              </Form.Item>
              <Form.Item label="Divisi" name="divisi_id">
                <Select disabled {...getSelectProps(dropdowns.divisiOptions, dropdowns.loadingState.divisi.loading)} />
              </Form.Item>
              <Form.Item label="Department" name="department_id">
                <Select disabled {...getSelectProps(dropdowns.departmentOptions, dropdowns.loadingState.department.loading)} />
              </Form.Item>
              <Form.Item label="Email Perusahaan" name="email_perusahaan">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Manager" name="manager_id">
                <Select disabled allowClear {...getSelectProps(dropdowns.managerOptions, dropdowns.loadingState.manager.loading)} />
              </Form.Item>
              <Form.Item label="Atasan Langsung" name="atasan_langsung_id">
                <Select
                  disabled
                  allowClear
                  {...getSelectProps(dropdowns.atasanLangsungOptions, dropdowns.loadingState.atasanLangsung.loading)}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <FileProtectOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Kontrak</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Jenis Hubungan Kerja" name="jenis_hubungan_kerja_id">
                <Select
                  allowClear
                  {...getSelectProps(
                    dropdowns.jenisHubunganKerjaOptions,
                    dropdowns.loadingState.jenisHubunganKerja.loading,
                  )}
                />
              </Form.Item>
              <Form.Item label="Tanggal Masuk Group" name="tanggal_masuk_group">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Masuk" name="tanggal_masuk">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Permanent" name="tanggal_permanent">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Kontrak" name="tanggal_kontrak">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Akhir Kontrak" name="tanggal_akhir_kontrak">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Berhenti" name="tanggal_berhenti">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <BookOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Education</h3>
          </div>
          <div className="p-5">
            <Form.List name="educations">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.key} className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-800">Pendidikan #{index + 1}</h4>
                        <Button danger type="text" onClick={() => remove(field.name)}>
                          Hapus
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Form.Item label="Tingkat Pendidikan" name={[field.name, "tingkat_pendidikan"]}>
                          <Input placeholder="Masukkan tingkat pendidikan" />
                        </Form.Item>
                        <Form.Item label="Bidang Studi" name={[field.name, "bidang_studi"]}>
                          <Input placeholder="Masukkan bidang studi" />
                        </Form.Item>
                        <Form.Item label="Nama Sekolah" name={[field.name, "nama_sekolah"]}>
                          <Input placeholder="Masukkan nama sekolah" />
                        </Form.Item>
                        <Form.Item label="Kota Sekolah" name={[field.name, "kota_sekolah"]}>
                          <Input placeholder="Masukkan kota sekolah" />
                        </Form.Item>
                        <Form.Item label="Status Kelulusan" name={[field.name, "status_kelulusan"]}>
                          <Select
                            allowClear
                            placeholder="Pilih status kelulusan"
                            showSearch
                            optionFilterProp="label"
                            filterOption
                            options={STATUS_KELULUSAN_OPTIONS}
                          />
                        </Form.Item>
                        <Form.Item label="Keterangan" name={[field.name, "keterangan"]} className="lg:col-span-2">
                          <Input.TextArea rows={4} placeholder="Masukkan keterangan pendidikan" />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add({})} block>
                    Tambah Riwayat Pendidikan
                  </Button>
                </div>
              )}
            </Form.List>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <TrophyOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Pangkat dan Golongan</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Kategori Pangkat" name="kategori_pangkat_id">
                <Select
                  allowClear
                  {...getSelectProps(
                    dropdowns.kategoriPangkatOptions,
                    dropdowns.loadingState.kategoriPangkat.loading,
                  )}
                />
              </Form.Item>
              <Form.Item label="Golongan Pangkat" name="golongan_id">
                <Select allowClear {...getSelectProps(dropdowns.golonganOptions, dropdowns.loadingState.golongan.loading)} />
              </Form.Item>
              <Form.Item label="Sub Golongan Pangkat" name="sub_golongan_id">
                <Select
                  allowClear
                  {...getSelectProps(dropdowns.subGolonganOptions, dropdowns.loadingState.subGolongan.loading)}
                />
              </Form.Item>
              <Form.Item label="No Dana Pensiun" name="no_dana_pensiun">
                <Input placeholder="Masukkan no dana pensiun" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <PhoneOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Kontak Darurat</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Nama Kontak Darurat 1" name="nama_kontak_darurat_1">
                <Input placeholder="Masukkan nama kontak darurat 1" />
              </Form.Item>
              <Form.Item label="Nomor Telepon Kontak Darurat 1" name="nomor_telepon_kontak_darurat_1">
                <Input placeholder="Masukkan nomor telepon kontak darurat 1" />
              </Form.Item>
              <Form.Item label="Hubungan Kontak Darurat 1" name="hubungan_kontak_darurat_1">
                <Input placeholder="Masukkan hubungan kontak darurat 1" />
              </Form.Item>
              <Form.Item label="Alamat Kontak Darurat 1" name="alamat_kontak_darurat_1" className="lg:col-span-2">
                <Input.TextArea rows={3} placeholder="Masukkan alamat kontak darurat 1" />
              </Form.Item>
              <Form.Item label="Nama Kontak Darurat 2" name="nama_kontak_darurat_2">
                <Input placeholder="Masukkan nama kontak darurat 2" />
              </Form.Item>
              <Form.Item label="Nomor Telepon Kontak Darurat 2" name="nomor_telepon_kontak_darurat_2">
                <Input placeholder="Masukkan nomor telepon kontak darurat 2" />
              </Form.Item>
              <Form.Item label="Hubungan Kontak Darurat 2" name="hubungan_kontak_darurat_2">
                <Input placeholder="Masukkan hubungan kontak darurat 2" />
              </Form.Item>
              <Form.Item label="Alamat Kontak Darurat 2" name="alamat_kontak_darurat_2" className="lg:col-span-2">
                <Input.TextArea rows={3} placeholder="Masukkan alamat kontak darurat 2" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <EnvironmentOutlined className="text-primary" />
            <h3 className="text-sm font-bold">POO / POH</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Point of Original" name="point_of_original">
                <Input placeholder="Masukkan point of original" />
              </Form.Item>
              <Form.Item label="Point of Hire" name="point_of_hire">
                <Input placeholder="Masukkan point of hire" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <SkinOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Seragam dan Sepatu Kerja</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Ukuran Seragam Kerja" name="ukuran_seragam_kerja">
                <Input placeholder="Masukkan ukuran seragam kerja" />
              </Form.Item>
              <Form.Item label="Ukuran Sepatu Kerja" name="ukuran_sepatu_kerja">
                <Input placeholder="Masukkan ukuran sepatu kerja" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <DollarOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Costing</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Siklus Pembayaran Gaji" name="siklus_pembayaran_gaji">
                <Input placeholder="Masukkan siklus pembayaran gaji" />
              </Form.Item>
              <Form.Item label="Costing" name="costing">
                <Input placeholder="Masukkan costing" />
              </Form.Item>
              <Form.Item label="Assign" name="assign">
                <Input placeholder="Masukkan assign" />
              </Form.Item>
              <Form.Item label="Actual" name="actual">
                <Input placeholder="Masukkan actual" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <SwapOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Pergerakan Karyawan</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Lokasi Sebelumnya" name="lokasi_sebelumnya_id">
                <Select allowClear {...getSelectProps(dropdowns.lokasiKerjaOptions, dropdowns.loadingState.lokasiKerja.loading)} />
              </Form.Item>
              <Form.Item label="Tanggal Mutasi" name="tanggal_mutasi">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <button
          type="button"
          onClick={() => form.setFieldsValue(mapDataToFormValues(data))}
          className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          Discard
        </button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSaving}
          className="!rounded-lg !border !border-primary !bg-primary !px-8 !font-semibold !text-white !shadow-md hover:!brightness-95"
        >
          Simpan
        </Button>
      </div>
    </Form>
  );
}

export default HrInfoTab;
