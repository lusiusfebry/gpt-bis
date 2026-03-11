import {
  BankOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Select, message } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import type { KaryawanDetail } from "../../hooks/useKaryawan";

type PersonalInfoTabProps = {
  data: KaryawanDetail;
  onSave: () => Promise<void> | void;
  employeeId: string;
};

type PersonalInfoFormValues = {
  nama_lengkap?: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: Dayjs | null;
  email_pribadi?: string;
  agama?: string;
  golongan_darah?: string;
  nomor_kartu_keluarga?: string;
  nomor_ktp?: string;
  nomor_npwp?: string;
  nomor_bpjs?: string;
  no_nik_kk?: string;
  status_pajak?: string;
  alamat_domisili?: string;
  kota_domisili?: string;
  provinsi_domisili?: string;
  alamat_ktp?: string;
  kota_ktp?: string;
  provinsi_ktp?: string;
  nomor_handphone_1?: string;
  nomor_handphone_2?: string;
  nomor_telepon_rumah_1?: string;
  nomor_telepon_rumah_2?: string;
  status_pernikahan?: string;
  nama_pasangan?: string;
  tanggal_menikah?: Dayjs | null;
  tanggal_cerai?: Dayjs | null;
  tanggal_wafat_pasangan?: Dayjs | null;
  pekerjaan_pasangan?: string;
  jumlah_anak?: number | null;
  nomor_rekening?: string;
  nama_pemegang_rekening?: string;
  nama_bank?: string;
  cabang_bank?: string;
};

const GENDER_OPTIONS = [
  { label: "Laki-laki", value: "Laki-laki" },
  { label: "Perempuan", value: "Perempuan" },
];

const BLOOD_TYPE_OPTIONS = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "AB", value: "AB" },
  { label: "O", value: "O" },
];

const AGAMA_OPTIONS = [
  { label: "Islam", value: "Islam" },
  { label: "Kristen", value: "Kristen" },
  { label: "Katolik", value: "Katolik" },
  { label: "Hindu", value: "Hindu" },
  { label: "Buddha", value: "Buddha" },
  { label: "Konghucu", value: "Konghucu" },
];

const STATUS_PERNIKAHAN_OPTIONS = [
  { label: "Belum Menikah", value: "Belum Menikah" },
  { label: "Menikah", value: "Menikah" },
  { label: "Cerai Hidup", value: "Cerai Hidup" },
  { label: "Cerai Mati", value: "Cerai Mati" },
];

const SEARCHABLE_SELECT_PROPS = {
  showSearch: true,
  optionFilterProp: "label" as const,
  filterOption: true,
};

const DATE_FIELDS: Array<keyof PersonalInfoFormValues> = [
  "tanggal_lahir",
  "tanggal_menikah",
  "tanggal_cerai",
  "tanggal_wafat_pasangan",
];

function toDayjs(value?: string | null) {
  return value ? dayjs(value) : null;
}

function toIsoString(value?: Dayjs | null) {
  return value ? value.toISOString() : null;
}

function mapDataToFormValues(data: KaryawanDetail): PersonalInfoFormValues {
  return {
    nama_lengkap: data.nama_lengkap,
    jenis_kelamin: data.jenis_kelamin ?? undefined,
    tempat_lahir: data.tempat_lahir ?? undefined,
    tanggal_lahir: toDayjs(data.tanggal_lahir),
    email_pribadi: data.email_pribadi ?? undefined,
    agama: data.agama ?? undefined,
    golongan_darah: data.golongan_darah ?? undefined,
    nomor_kartu_keluarga: data.nomor_kartu_keluarga ?? undefined,
    nomor_ktp: data.nomor_ktp ?? undefined,
    nomor_npwp: data.nomor_npwp ?? undefined,
    nomor_bpjs: data.nomor_bpjs ?? undefined,
    no_nik_kk: data.no_nik_kk ?? undefined,
    status_pajak: data.status_pajak ?? undefined,
    alamat_domisili: data.alamat_domisili ?? undefined,
    kota_domisili: data.kota_domisili ?? undefined,
    provinsi_domisili: data.provinsi_domisili ?? undefined,
    alamat_ktp: data.alamat_ktp ?? undefined,
    kota_ktp: data.kota_ktp ?? undefined,
    provinsi_ktp: data.provinsi_ktp ?? undefined,
    nomor_handphone_1: data.nomor_handphone ?? undefined,
    nomor_handphone_2: data.nomor_handphone_2 ?? undefined,
    nomor_telepon_rumah_1: data.nomor_telepon_rumah_1 ?? undefined,
    nomor_telepon_rumah_2: data.nomor_telepon_rumah_2 ?? undefined,
    status_pernikahan: data.status_pernikahan ?? undefined,
    nama_pasangan: data.nama_pasangan ?? undefined,
    tanggal_menikah: toDayjs(data.tanggal_menikah),
    tanggal_cerai: toDayjs(data.tanggal_cerai),
    tanggal_wafat_pasangan: toDayjs(data.tanggal_wafat_pasangan),
    pekerjaan_pasangan: data.pekerjaan_pasangan ?? undefined,
    jumlah_anak: data.jumlah_anak ?? null,
    nomor_rekening: data.nomor_rekening ?? undefined,
    nama_pemegang_rekening: data.nama_pemegang_rekening ?? undefined,
    nama_bank: data.nama_bank ?? undefined,
    cabang_bank: data.cabang_bank ?? undefined,
  };
}

function PersonalInfoTab({ data, onSave, employeeId }: PersonalInfoTabProps) {
  const [form] = Form.useForm<PersonalInfoFormValues>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(mapDataToFormValues(data));
  }, [data, form]);

  const handleDiscard = () => {
    form.setFieldsValue(mapDataToFormValues(data));
  };

  const handleSubmit = async (values: PersonalInfoFormValues) => {
    setIsSaving(true);

    try {
      const payload = {
        jenis_kelamin: values.jenis_kelamin,
        tempat_lahir: values.tempat_lahir,
        tanggal_lahir: toIsoString(values.tanggal_lahir),
        email_pribadi: values.email_pribadi,
        agama: values.agama,
        golongan_darah: values.golongan_darah,
        nomor_kartu_keluarga: values.nomor_kartu_keluarga,
        nomor_ktp: values.nomor_ktp,
        nomor_npwp: values.nomor_npwp,
        nomor_bpjs: values.nomor_bpjs,
        no_nik_kk: values.no_nik_kk,
        status_pajak: values.status_pajak,
        alamat_domisili: values.alamat_domisili,
        kota_domisili: values.kota_domisili,
        provinsi_domisili: values.provinsi_domisili,
        alamat_ktp: values.alamat_ktp,
        kota_ktp: values.kota_ktp,
        provinsi_ktp: values.provinsi_ktp,
        nomor_handphone_2: values.nomor_handphone_2,
        nomor_telepon_rumah_1: values.nomor_telepon_rumah_1,
        nomor_telepon_rumah_2: values.nomor_telepon_rumah_2,
        status_pernikahan: values.status_pernikahan,
        nama_pasangan: values.nama_pasangan,
        tanggal_menikah: toIsoString(values.tanggal_menikah),
        tanggal_cerai: toIsoString(values.tanggal_cerai),
        tanggal_wafat_pasangan: toIsoString(values.tanggal_wafat_pasangan),
        pekerjaan_pasangan: values.pekerjaan_pasangan,
        jumlah_anak: values.jumlah_anak ?? null,
        nomor_rekening: values.nomor_rekening,
        nama_pemegang_rekening: values.nama_pemegang_rekening,
        nama_bank: values.nama_bank,
        cabang_bank: values.cabang_bank,
      };

      await api.patch(`/hr/karyawan/${employeeId}`, payload);
      message.success("Data personal karyawan berhasil disimpan");
      await onSave();
    } catch {
      message.error("Gagal menyimpan data personal karyawan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form<PersonalInfoFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <UserOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Biodata Karyawan</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Nama Lengkap" name="nama_lengkap">
                <Input placeholder="Masukkan nama lengkap" readOnly disabled />
              </Form.Item>
              <Form.Item label="Jenis Kelamin" name="jenis_kelamin">
                <Select placeholder="Pilih jenis kelamin" options={GENDER_OPTIONS} {...SEARCHABLE_SELECT_PROPS} />
              </Form.Item>
              <Form.Item label="Tempat Lahir" name="tempat_lahir">
                <Input placeholder="Masukkan tempat lahir" />
              </Form.Item>
              <Form.Item label="Tanggal Lahir" name="tanggal_lahir">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item
                label="Email Pribadi"
                name="email_pribadi"
                rules={[{ type: "email", message: "Format email pribadi tidak valid" }]}
              >
                <Input placeholder="nama@email.com" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <IdcardOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Identifikasi</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Agama" name="agama">
                <Select placeholder="Pilih agama" allowClear options={AGAMA_OPTIONS} {...SEARCHABLE_SELECT_PROPS} />
              </Form.Item>
              <Form.Item label="Golongan Darah" name="golongan_darah">
                <Select
                  placeholder="Pilih golongan darah"
                  allowClear
                  options={BLOOD_TYPE_OPTIONS}
                  {...SEARCHABLE_SELECT_PROPS}
                />
              </Form.Item>
              <Form.Item label="Nomor Kartu Keluarga" name="nomor_kartu_keluarga">
                <Input placeholder="Masukkan nomor kartu keluarga" />
              </Form.Item>
              <Form.Item label="Nomor KTP" name="nomor_ktp">
                <Input placeholder="Masukkan nomor KTP" />
              </Form.Item>
              <Form.Item label="Nomor NPWP" name="nomor_npwp">
                <Input placeholder="Masukkan nomor NPWP" />
              </Form.Item>
              <Form.Item label="Nomor BPJS" name="nomor_bpjs">
                <Input placeholder="Masukkan nomor BPJS" />
              </Form.Item>
              <Form.Item label="No NIK KK" name="no_nik_kk">
                <Input placeholder="Masukkan no NIK KK" />
              </Form.Item>
              <Form.Item label="Status Pajak" name="status_pajak">
                <Input placeholder="Masukkan status pajak" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <HomeOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Alamat KTP</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Alamat KTP" name="alamat_ktp" className="lg:col-span-2">
                <Input.TextArea rows={4} placeholder="Masukkan alamat KTP" />
              </Form.Item>
              <Form.Item label="Kota KTP" name="kota_ktp">
                <Input placeholder="Masukkan kota KTP" />
              </Form.Item>
              <Form.Item label="Provinsi KTP" name="provinsi_ktp">
                <Input placeholder="Masukkan provinsi KTP" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <EnvironmentOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Alamat Domisili</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Alamat Domisili" name="alamat_domisili" className="lg:col-span-2">
                <Input.TextArea rows={4} placeholder="Masukkan alamat domisili" />
              </Form.Item>
              <Form.Item label="Kota Domisili" name="kota_domisili">
                <Input placeholder="Masukkan kota domisili" />
              </Form.Item>
              <Form.Item label="Provinsi Domisili" name="provinsi_domisili">
                <Input placeholder="Masukkan provinsi domisili" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <PhoneOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Informasi Kontak</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Nomor Handphone 1" name="nomor_handphone_1">
                <Input placeholder="Masukkan nomor handphone 1" readOnly disabled />
              </Form.Item>
              <Form.Item label="Nomor Handphone 2" name="nomor_handphone_2">
                <Input placeholder="Masukkan nomor handphone 2" />
              </Form.Item>
              <Form.Item label="Nomor Telepon Rumah 1" name="nomor_telepon_rumah_1">
                <Input placeholder="Masukkan nomor telepon rumah 1" />
              </Form.Item>
              <Form.Item label="Nomor Telepon Rumah 2" name="nomor_telepon_rumah_2">
                <Input placeholder="Masukkan nomor telepon rumah 2" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <HeartOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Status Pernikahan & Anak</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Status Pernikahan" name="status_pernikahan">
                <Select
                  placeholder="Pilih status pernikahan"
                  allowClear
                  options={STATUS_PERNIKAHAN_OPTIONS}
                  {...SEARCHABLE_SELECT_PROPS}
                />
              </Form.Item>
              <Form.Item label="Nama Pasangan" name="nama_pasangan">
                <Input placeholder="Masukkan nama pasangan" />
              </Form.Item>
              <Form.Item label="Tanggal Menikah" name="tanggal_menikah">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Cerai" name="tanggal_cerai">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tanggal Wafat Pasangan" name="tanggal_wafat_pasangan">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Pekerjaan Pasangan" name="pekerjaan_pasangan">
                <Input placeholder="Masukkan pekerjaan pasangan" />
              </Form.Item>
              <Form.Item label="Jumlah Anak" name="jumlah_anak">
                <InputNumber min={0} className="w-full" placeholder="Masukkan jumlah anak" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <BankOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Rekening Bank</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Nomor Rekening" name="nomor_rekening">
                <Input placeholder="Masukkan nomor rekening" />
              </Form.Item>
              <Form.Item label="Nama Pemegang Rekening" name="nama_pemegang_rekening">
                <Input placeholder="Masukkan nama pemegang rekening" />
              </Form.Item>
              <Form.Item label="Nama Bank" name="nama_bank">
                <Input placeholder="Masukkan nama bank" />
              </Form.Item>
              <Form.Item label="Cabang Bank" name="cabang_bank">
                <Input placeholder="Masukkan cabang bank" />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <button
          type="button"
          onClick={handleDiscard}
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

export default PersonalInfoTab;
