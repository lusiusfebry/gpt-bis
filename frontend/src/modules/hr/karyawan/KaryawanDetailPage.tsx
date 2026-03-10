import {
  App,
  Avatar,
  Button,
  Card,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
  Upload,
  type UploadFile,
  type UploadProps,
} from "antd";
import { ArrowLeftOutlined, QrcodeOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/axios";
import {
  buildFotoKaryawanUrl,
  normalizeNullableSelectValue,
  useKaryawanDetail,
  useMasterDataDropdowns,
  type KaryawanDetail,
} from "../hooks/useKaryawan";

const { Text, Title } = Typography;

type KaryawanHeadFormValues = {
  nama_lengkap: string;
  nomor_induk_karyawan: string;
  divisi_id?: string;
  department_id?: string;
  manager_id?: string | null;
  atasan_langsung_id?: string | null;
  posisi_jabatan_id?: string;
  email_perusahaan?: string;
  nomor_handphone?: string;
  status_karyawan_id?: string;
  lokasi_kerja_id?: string;
  tag_id?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function mapDetailToFormValues(detail: KaryawanDetail): KaryawanHeadFormValues {
  return {
    nama_lengkap: detail.nama_lengkap,
    nomor_induk_karyawan: detail.nomor_induk_karyawan,
    divisi_id: detail.divisi?.id ?? detail.divisi_id ?? undefined,
    department_id: detail.department?.id ?? detail.department_id ?? undefined,
    manager_id: detail.manager?.id ?? detail.manager_id ?? null,
    atasan_langsung_id: detail.atasan_langsung?.id ?? detail.atasan_langsung_id ?? null,
    posisi_jabatan_id: detail.posisi_jabatan?.id ?? detail.posisi_jabatan_id ?? undefined,
    email_perusahaan: detail.email_perusahaan ?? undefined,
    nomor_handphone: detail.nomor_handphone ?? undefined,
    status_karyawan_id: detail.status_karyawan?.id ?? detail.status_karyawan_id ?? undefined,
    lokasi_kerja_id: detail.lokasi_kerja?.id ?? detail.lokasi_kerja_id ?? undefined,
    tag_id: detail.tag?.id ?? detail.tag_id ?? null,
  };
}

function KaryawanDetailPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm<KaryawanHeadFormValues>();
  const [isSaving, setIsSaving] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const { data, isLoading, reload } = useKaryawanDetail(id);
  const dropdowns = useMasterDataDropdowns();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(mapDetailToFormValues(data));
      setQrCode(data.qr_code ?? null);
    }
  }, [data, form]);

  const selectProps = useMemo(
    () => ({
      showSearch: true,
      filterOption: true,
      optionFilterProp: "label" as const,
    }),
    [],
  );

  const handleSave = async (values: KaryawanHeadFormValues) => {
    if (!id) {
      return;
    }

    setIsSaving(true);
    try {
      await api.patch(`/hr/karyawan/${id}`, {
        nama_lengkap: values.nama_lengkap,
        divisi_id: values.divisi_id,
        department_id: values.department_id,
        manager_id: normalizeNullableSelectValue(values.manager_id),
        atasan_langsung_id: normalizeNullableSelectValue(values.atasan_langsung_id),
        posisi_jabatan_id: values.posisi_jabatan_id,
        email_perusahaan: values.email_perusahaan,
        nomor_handphone: values.nomor_handphone,
        status_karyawan_id: values.status_karyawan_id,
        lokasi_kerja_id: values.lokasi_kerja_id,
        tag_id: normalizeNullableSelectValue(values.tag_id),
      });
      message.success("Data head karyawan berhasil disimpan");
      await reload();
    } catch {
      message.error("Gagal menyimpan data head karyawan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenQrModal = async () => {
    if (!id) {
      return;
    }

    setIsQrModalOpen(true);
    setIsQrLoading(true);

    try {
      const { data: response } = await api.get<{ qr_code: string }>(`/hr/karyawan/${id}/qrcode`);
      setQrCode(response.qr_code);
    } finally {
      setIsQrLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      if (!id) {
        onError?.(new Error("ID karyawan tidak ditemukan"));
        return;
      }

      try {
        const formData = new FormData();
        const uploadFile = file as UploadFile;
        formData.append("foto", uploadFile as unknown as Blob, uploadFile.name);
        await api.post(`/hr/karyawan/${id}/foto`, formData);
        message.success("Foto karyawan berhasil diperbarui");
        await reload();
        onSuccess?.({}, new XMLHttpRequest());
      } catch (error) {
        message.error("Gagal mengunggah foto karyawan");
        onError?.(error as Error);
      }
    },
  };

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center rounded-3xl bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-3xl shadow-panel">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <Space size={20} align="start">
            <Avatar
              size={96}
              src={buildFotoKaryawanUrl(data?.foto_karyawan)}
              className="bg-slate-900"
            >
              {getInitials(data?.nama_lengkap ?? "Karyawan")}
            </Avatar>
            <Space direction="vertical" size={6}>
              <Text className="uppercase tracking-[0.3em] text-teal-700">Profil Karyawan</Text>
              <Title level={3} className="!mb-0">
                {data?.nama_lengkap ?? "Detail Karyawan"}
              </Title>
              <Text type="secondary">
                Bagian head karyawan dapat dikelola langsung dari halaman ini.
              </Text>
              <Text strong>{data?.nomor_induk_karyawan ?? "-"}</Text>
            </Space>
          </Space>

          <Space wrap>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Foto</Button>
            </Upload>
            <Button icon={<QrcodeOutlined />} onClick={handleOpenQrModal}>
              QR Code
            </Button>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/hr/karyawan")}>
              Kembali
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="rounded-3xl shadow-panel">
        <Form<KaryawanHeadFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="space-y-2"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Nama Lengkap"
              name="nama_lengkap"
              rules={[{ required: true, message: "Nama lengkap wajib diisi" }]}
            >
              <Input placeholder="Masukkan nama lengkap" />
            </Form.Item>
            <Form.Item label="Nomor Induk Karyawan" name="nomor_induk_karyawan">
              <Input readOnly placeholder="Nomor induk karyawan" />
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

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => navigate("/hr/karyawan")}>Kembali</Button>
            <Button type="primary" htmlType="submit" loading={isSaving}>
              Simpan
            </Button>
          </div>
        </Form>
      </Card>

      <Card className="rounded-3xl shadow-panel">
        <Tabs
          items={[
            {
              key: "personal-information",
              label: "Personal Information",
              children: <Empty description="Akan segera tersedia" />,
            },
            {
              key: "informasi-hr",
              label: "Informasi HR",
              children: <Empty description="Akan segera tersedia" />,
            },
            {
              key: "informasi-keluarga",
              label: "Informasi Keluarga",
              children: <Empty description="Akan segera tersedia" />,
            },
          ]}
        />
      </Card>

      <Modal
        open={isQrModalOpen}
        onCancel={() => setIsQrModalOpen(false)}
        footer={null}
        title="QR Code Karyawan"
        centered
      >
        <div className="flex min-h-[18rem] items-center justify-center">
          {isQrLoading ? (
            <Spin />
          ) : qrCode ? (
            <Image src={qrCode} alt="QR Code Karyawan" preview={false} width={240} />
          ) : (
            <Empty description="QR Code belum tersedia" />
          )}
        </div>
      </Modal>
    </Space>
  );
}

export default KaryawanDetailPage;
