import {
  App,
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Upload,
  type UploadFile,
  type UploadProps,
} from "antd";
import {
  CameraOutlined,
  EnvironmentOutlined,
  FilePdfOutlined,
  MailOutlined,
  PhoneOutlined,
  QrcodeOutlined,
  TagOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import FamilyInfoTab from "./tabs/FamilyInfoTab";
import HrInfoTab from "./tabs/HrInfoTab";
import PersonalInfoTab from "./tabs/PersonalInfoTab";

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
  const [activeTab, setActiveTab] = useState<string>("personal-information");
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

  const handleScrollToForm = () => {
    document.getElementById("edit-data-kepegawaian")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <div className="flex min-h-[24rem] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Spin size="large" />
      </div>
    );
  }

  const photoUrl = buildFotoKaryawanUrl(data?.foto_karyawan);
  const statusLabel = data?.status_karyawan?.nama ?? "Belum diatur";
  const normalizedStatusLabel = statusLabel.trim().toLowerCase().replace(/[-\s]+/g, " ");
  const statusIdentifier = [data?.status_karyawan?.id, data?.status_karyawan_id, data?.status_karyawan?.nama]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const inactiveStatusLabels = new Set(["tidak aktif", "nonaktif", "non aktif"]);
  const activeStatusLabels = new Set(["aktif"]);
  const isActiveStatus = inactiveStatusLabels.has(normalizedStatusLabel)
    ? false
    : activeStatusLabels.has(normalizedStatusLabel) || /\bactive\b/.test(statusIdentifier);
  const tabs = [
    { key: "personal-information", label: "Personal Information" },
    { key: "informasi-hr", label: "Informasi HR" },
    { key: "informasi-keluarga", label: "Informasi Keluarga" },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <button
          type="button"
          onClick={() => navigate("/hr")}
          className="transition hover:text-slate-900"
        >
          HR
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigate("/hr/karyawan")}
          className="transition hover:text-slate-900"
        >
          Karyawan
        </button>
        <span>/</span>
        <span className="font-medium text-slate-900">{data?.nama_lengkap ?? "Detail Karyawan"}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col items-start gap-8 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-8 lg:flex-row">
            <div className="relative h-32 w-32 shrink-0">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={data?.nama_lengkap ?? "Foto karyawan"}
                  className="h-full w-full rounded-xl object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900 text-3xl font-semibold text-white ring-1 ring-slate-200">
                  {getInitials(data?.nama_lengkap ?? "Karyawan")}
                </div>
              )}
              <Upload {...uploadProps}>
                <button
                  type="button"
                  className="absolute bottom-2 right-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-slate-700 shadow-lg transition hover:bg-slate-50"
                  aria-label="Upload foto karyawan"
                >
                  <CameraOutlined />
                </button>
              </Upload>
            </div>

            <div className="min-w-0 flex-1 space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {data?.nama_lengkap ?? "Detail Karyawan"}
                  </h1>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      isActiveStatus
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-500">
                  <p>
                    NIK <span className="font-medium text-slate-900">{data?.nomor_induk_karyawan ?? "-"}</span>
                  </p>
                  <p>{data?.posisi_jabatan?.nama ?? "Posisi jabatan belum diatur"}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<FilePdfOutlined />}
                  className="!inline-flex !items-center !rounded-lg !border-slate-200 !px-4 !font-medium !text-slate-700 !shadow-none hover:!border-slate-300 hover:!text-slate-900"
                >
                  Export PDF
                </Button>
                <Button
                  type="primary"
                  onClick={handleScrollToForm}
                  className="!inline-flex !items-center !rounded-lg !border !border-primary !bg-primary !px-4 !font-semibold !text-white !shadow-none hover:!border-primary hover:!bg-primary/90 hover:!text-white"
                >
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <TeamOutlined />
                    Division / Dept
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {data?.divisi?.nama ?? "-"} / {data?.department?.nama ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <UserOutlined />
                    Manager / Supervisor
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {data?.manager?.nama_lengkap ?? "-"} / {data?.atasan_langsung?.nama_lengkap ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <MailOutlined />
                    Email
                  </div>
                  <p className="truncate text-sm font-medium text-slate-900">{data?.email_perusahaan ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <PhoneOutlined />
                    Phone
                  </div>
                  <p className="text-sm font-medium text-slate-900">{data?.nomor_handphone ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <EnvironmentOutlined />
                    Lokasi Kerja
                  </div>
                  <p className="text-sm font-medium text-slate-900">{data?.lokasi_kerja?.nama ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <TagOutlined />
                    Tag
                  </div>
                  {data?.tag?.nama ? (
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      {data.tag.nama}
                    </span>
                  ) : (
                    <p className="text-sm font-medium text-slate-900">-</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs shrink-0 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <button
              type="button"
              onClick={handleOpenQrModal}
              className="flex w-full flex-col items-center gap-4 text-center"
            >
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm">
                {qrCode ? (
                  <img src={qrCode} alt="Employee QR" className="h-full w-full object-contain p-3" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <QrcodeOutlined className="text-3xl" />
                    <span className="text-xs font-medium">QR belum tersedia</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Employee QR ({data?.nomor_induk_karyawan ?? "-"})</p>
                <p className="text-sm text-slate-600">Klik preview untuk membuka modal QR karyawan.</p>
                <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <UploadOutlined />
                  Foto dapat diperbarui langsung dari kartu profil.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div id="edit-data-kepegawaian" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="mb-6 space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">Edit Data Kepegawaian</h2>
          <p className="text-sm text-slate-500">Perbarui data head karyawan tanpa mengubah struktur field yang sudah ada.</p>
        </div>

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
            <Button
              onClick={() => navigate("/hr/karyawan")}
              className="!rounded-lg !border-slate-200 !px-5 !font-medium !text-slate-700 !shadow-none hover:!border-slate-300 hover:!text-slate-900"
            >
              Kembali
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSaving}
              className="!rounded-lg !border !border-primary !bg-primary !px-5 !font-semibold !text-white !shadow-none hover:!border-primary hover:!bg-primary/90 hover:!text-white"
            >
              Simpan
            </Button>
          </div>
        </Form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {data ? (
          <>
            <div className="mb-6 border-b border-slate-200">
              <div className="flex flex-wrap gap-6" role="tablist" aria-label="Detail informasi karyawan">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  const tabId = `${tab.key}-tab`;
                  const panelId = `${tab.key}-panel`;

                  return (
                    <button
                      key={tab.key}
                      id={tabId}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={panelId}
                      onClick={() => setActiveTab(tab.key)}
                      className={
                        isActive
                          ? "pb-3 px-1 text-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap"
                          : "pb-3 px-1 text-sm font-medium text-slate-500 hover:text-slate-800 whitespace-nowrap"
                      }
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <section
                id="personal-information-panel"
                role="tabpanel"
                aria-labelledby="personal-information-tab"
                aria-hidden={activeTab !== "personal-information"}
                className={activeTab === "personal-information" ? "block" : "hidden"}
              >
                <PersonalInfoTab data={data!} employeeId={id!} onSave={reload} />
              </section>
              <section
                id="informasi-hr-panel"
                role="tabpanel"
                aria-labelledby="informasi-hr-tab"
                aria-hidden={activeTab !== "informasi-hr"}
                className={activeTab === "informasi-hr" ? "block" : "hidden"}
              >
                <HrInfoTab data={data!} dropdowns={dropdowns} employeeId={id!} onSave={reload} />
              </section>
              <section
                id="informasi-keluarga-panel"
                role="tabpanel"
                aria-labelledby="informasi-keluarga-tab"
                aria-hidden={activeTab !== "informasi-keluarga"}
                className={activeTab === "informasi-keluarga" ? "block" : "hidden"}
              >
                <FamilyInfoTab data={data!} employeeId={id!} onSave={reload} />
              </section>
            </div>
          </>
        ) : (
          <Empty description="Data karyawan tidak ditemukan" />
        )}
      </div>

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
    </div>
  );
}

export default KaryawanDetailPage;
