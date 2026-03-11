import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Typography } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  normalizeKaryawanPayload,
  useKaryawanCreate,
  useMasterDataDropdowns,
  type KaryawanPayload,
} from "../hooks/useKaryawan";

const { Paragraph, Title } = Typography;

function KaryawanCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<KaryawanPayload>();
  const { create, isSubmitting } = useKaryawanCreate();
  const dropdowns = useMasterDataDropdowns();

  const selectProps = useMemo(
    () => ({
      showSearch: true,
      filterOption: true,
      optionFilterProp: "label" as const,
    }),
    [],
  );

  const handleSubmit = async (values: KaryawanPayload) => {
    const createdEmployee = await create(normalizeKaryawanPayload(values));
    navigate(`/hr/karyawan/${createdEmployee.id}`);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>Human Resources</span>
          <span className="text-slate-300">›</span>
          <span>Karyawan</span>
          <span className="text-slate-300">›</span>
          <span className="text-primary">Tambah Baru</span>
        </div>

        <div className="space-y-1">
          <Title level={2} className="!mb-0 !text-3xl !font-black !tracking-tight !text-slate-900">
            Tambah Karyawan Baru
          </Title>
          <Paragraph className="!mb-0 !max-w-3xl !text-sm !text-slate-500">
            Lengkapi informasi utama karyawan baru melalui formulir terstruktur dengan dukungan
            dropdown master data yang dapat dicari.
          </Paragraph>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Form<KaryawanPayload> form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Nama Lengkap"
              name="nama_lengkap"
              rules={[{ required: true, message: "Nama lengkap wajib diisi" }]}
            >
              <Input placeholder="Masukkan nama lengkap" />
            </Form.Item>
            <Form.Item
              label="NIK"
              name="nomor_induk_karyawan"
              rules={[
                { required: true, message: "NIK wajib diisi" },
                { pattern: /^\d{2}-\d{5}$/, message: "Format NIK harus xx-xxxxx" },
              ]}
            >
              <Input placeholder="Contoh: 12-34567" />
            </Form.Item>
            <Form.Item
              label="Divisi"
              name="divisi_id"
              rules={[{ required: true, message: "Divisi wajib dipilih" }]}
            >
              <Select
                placeholder="Pilih divisi"
                options={dropdowns.divisiOptions}
                loading={dropdowns.loadingState.divisi.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item
              label="Department"
              name="department_id"
              rules={[{ required: true, message: "Department wajib dipilih" }]}
            >
              <Select
                placeholder="Pilih department"
                options={dropdowns.departmentOptions}
                loading={dropdowns.loadingState.department.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item label="Manager" name="manager_id">
              <Select
                allowClear
                placeholder="Pilih manager"
                options={dropdowns.managerOptions}
                loading={dropdowns.loadingState.manager.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item label="Atasan Langsung" name="atasan_langsung_id">
              <Select
                allowClear
                placeholder="Pilih atasan langsung"
                options={dropdowns.atasanLangsungOptions}
                loading={dropdowns.loadingState.atasanLangsung.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item
              label="Posisi Jabatan"
              name="posisi_jabatan_id"
              rules={[{ required: true, message: "Posisi jabatan wajib dipilih" }]}
            >
              <Select
                placeholder="Pilih posisi jabatan"
                options={dropdowns.posisiJabatanOptions}
                loading={dropdowns.loadingState.posisiJabatan.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item
              label="Email Perusahaan"
              name="email_perusahaan"
              rules={[{ type: "email", message: "Format email perusahaan tidak valid" }]}
            >
              <Input placeholder="nama@perusahaan.com" />
            </Form.Item>
            <Form.Item label="Nomor Handphone" name="nomor_handphone">
              <Input placeholder="Masukkan nomor handphone" />
            </Form.Item>
            <Form.Item
              label="Status Karyawan"
              name="status_karyawan_id"
              rules={[{ required: true, message: "Status karyawan wajib dipilih" }]}
            >
              <Select
                placeholder="Pilih status karyawan"
                options={dropdowns.statusKaryawanOptions}
                loading={dropdowns.loadingState.statusKaryawan.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item
              label="Lokasi Kerja"
              name="lokasi_kerja_id"
              rules={[{ required: true, message: "Lokasi kerja wajib dipilih" }]}
            >
              <Select
                placeholder="Pilih lokasi kerja"
                options={dropdowns.lokasiKerjaOptions}
                loading={dropdowns.loadingState.lokasiKerja.loading}
                {...selectProps}
              />
            </Form.Item>
            <Form.Item label="Tag" name="tag_id">
              <Select
                allowClear
                placeholder="Pilih tag"
                options={dropdowns.tagOptions}
                loading={dropdowns.loadingState.tag.loading}
                {...selectProps}
              />
            </Form.Item>
          </div>

          <div className="mt-2 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/hr/karyawan")}
              className="!inline-flex !h-11 !items-center !justify-center !rounded-xl !border !border-slate-200 !bg-white !px-5 !font-semibold !text-slate-600 !shadow-none hover:!border-slate-300 hover:!bg-slate-50 hover:!text-slate-800"
            >
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSubmitting || dropdowns.isAnyLoading}
              className="!inline-flex !h-11 !items-center !justify-center !rounded-xl !border !border-[#d4a63a] !bg-[#f2c94c] !px-5 !font-bold !text-slate-900 !shadow-none hover:!border-[#c79824] hover:!bg-[#e6bc38]"
            >
              Simpan
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default KaryawanCreatePage;
