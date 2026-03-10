import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  normalizeKaryawanPayload,
  useKaryawanCreate,
  useMasterDataDropdowns,
  type KaryawanPayload,
} from "../hooks/useKaryawan";

const { Text, Title } = Typography;

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
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-2xl shadow-slate-950/10">
        <Space direction="vertical" size={14} className="w-full">
          <Text className="uppercase tracking-[0.3em] !text-teal-300">Human Resources</Text>
          <Title level={2} className="!mb-0 !text-white">
            Tambah Karyawan Baru
          </Title>
          <Text className="!text-slate-300">
            Form single-page untuk membuat data head karyawan baru dengan dropdown master data
            yang dapat dicari.
          </Text>
        </Space>
      </Card>

      <Card className="rounded-3xl shadow-panel">
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

          <div className="mt-2 flex flex-wrap justify-end gap-3">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/hr/karyawan")}>
              Batal
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting || dropdowns.isAnyLoading}>
              Simpan
            </Button>
          </div>
        </Form>
      </Card>
    </Space>
  );
}

export default KaryawanCreatePage;
