import {
  App,
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
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
  useKaryawanDelete,
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
  const { deleteKaryawan, isDeleting } = useKaryawanDelete();
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
    <div className="flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark p-6">
      <nav className="flex text-sm text-slate-500 mb-6 gap-2 items-center">
        <button
          type="button"
          onClick={() => navigate("/hr")}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Karyawan
        </button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button
          type="button"
          onClick={() => navigate("/hr/karyawan")}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Daftar Karyawan
        </button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">{data?.nama_lengkap ?? "Profil Karyawan"}</span>
      </nav>

      {/* Employee Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Photo & Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1 w-full">
            <div className="relative group mx-auto sm:mx-0 shrink-0">
              <div className="size-32 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-700 shadow-md">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={data?.nama_lengkap ?? "Foto karyawan"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-slate-400">
                    {getInitials(data?.nama_lengkap ?? "Karyawan")}
                  </div>
                )}
              </div>
              <Upload {...uploadProps}>
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full shadow-lg text-slate-900 hover:brightness-95 transition-all flex items-center justify-center cursor-pointer border border-primary/50"
                  aria-label="Upload foto karyawan"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
              </Upload>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {data?.nama_lengkap ?? "Profil Karyawan"}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isActiveStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </h1>
                  <p className="text-slate-500 font-medium">
                    NIK: {data?.nomor_induk_karyawan ?? "-"} • {data?.posisi_jabatan?.nama ?? "Posisi belum diatur"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Popconfirm
                    title="Hapus Karyawan"
                    description={`Apakah Anda yakin ingin menghapus ${data?.nama_lengkap}?`}
                    onConfirm={async (event) => {
                      event?.stopPropagation();
                      if (id) {
                        await deleteKaryawan(id, () => {
                          navigate("/hr/karyawan");
                        });
                      }
                    }}
                    onCancel={(event) => {
                      event?.stopPropagation();
                    }}
                    okText="Ya, Hapus"
                    cancelText="Batal"
                    okButtonProps={{ danger: true, loading: isDeleting }}
                  >
                    <button className="px-4 py-2 border border-red-200 dark:border-red-900 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                      Hapus
                    </button>
                  </Popconfirm>
                  <button onClick={handleOpenQrModal} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                    Cetak QR
                  </button>
                  <button onClick={handleScrollToForm} className="px-4 py-2 bg-primary text-slate-900 rounded-lg text-sm font-bold hover:brightness-95 transition-all shadow-sm cursor-pointer whitespace-nowrap">
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">corporate_fare</span>
                  <div>
                    <p className="text-xs text-slate-400">Division / Dept</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {data?.divisi?.nama ?? "-"} / {data?.department?.nama ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">person_pin</span>
                  <div>
                    <p className="text-xs text-slate-400">Manager / Supervisor</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {data?.manager?.nama ?? "-"} / {data?.atasan_langsung?.nama ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                  <div>
                    <p className="text-xs text-slate-400">Company Email</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{data?.email_perusahaan ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{data?.nomor_handphone ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                  <div>
                    <p className="text-xs text-slate-400">Work Location</p>
                    <p className="font-medium text-primary underline decoration-dotted">{data?.lokasi_kerja?.nama ?? "-"}</p>
                  </div>
                </div>
                {data?.tag && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-lg">sell</span>
                    <div className="flex gap-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {data.tag.nama}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="xl:border-l xl:border-slate-200 dark:xl:border-slate-800 xl:pl-8 flex flex-col items-center justify-center w-full xl:w-auto cursor-pointer" onClick={handleOpenQrModal}>
            <div className="p-3 bg-white border-2 border-slate-100 rounded-lg shadow-sm mb-2 hover:border-primary/50 transition-colors">
              <div className="size-24 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {isQrLoading ? (
                  <Spin size="small" />
                ) : qrCode ? (
                  <img src={qrCode} alt="QR Code Khusus" className="w-full h-full object-contain" />
                ) : (
                  <div className="grid grid-cols-4 gap-1">
                    <div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-300"></div><div className="size-4 bg-slate-900"></div>
                    <div className="size-4 bg-slate-300"></div><div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-300"></div>
                     <div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-300"></div><div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-900"></div>
                     <div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-900"></div><div className="size-4 bg-slate-300"></div><div className="size-4 bg-slate-900"></div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
              Employee QR ({data?.nomor_induk_karyawan ?? "-"})
            </p>
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

      <div className="mb-6">
        {data ? (
          <>
            <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex overflow-x-auto gap-8" role="tablist" aria-label="Detail informasi karyawan">
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
                    className={`pb-3 px-1 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
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
