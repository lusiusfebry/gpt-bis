import {
  ApartmentOutlined,
  EnvironmentOutlined,
  ImportOutlined,
  NodeIndexOutlined,
  TagOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Form, Space, Tag, Typography, type TableProps } from "antd";
import MasterDataPage, { type MasterDataFormField } from "../components/MasterDataPage";
import { useMasterData, type MasterDataBaseItem, type MasterDataStatus } from "../hooks/useMasterData";

const { Text } = Typography;

export type RelationOption = {
  id: string;
  code: string;
  nama: string;
  status: MasterDataStatus;
};

export type DepartmentManagerOption = {
  id: string;
  nama_lengkap: string;
  nomor_induk_karyawan: string;
};

export type SimpleMasterDataFormValues = {
  nama: string;
  keterangan?: string;
  status: MasterDataStatus;
};

export type DepartmentMasterDataItem = MasterDataBaseItem & {
  divisi_id: string;
  manager_id?: string | null;
  divisi?: RelationOption;
};

export type DepartmentFormValues = {
  nama: string;
  divisi_id: string;
  manager_id?: string;
  keterangan?: string;
  status: MasterDataStatus;
};

export type PosisiJabatanMasterDataItem = MasterDataBaseItem & {
  department_id: string;
  department?: RelationOption & {
    divisi?: RelationOption;
  };
};

export type PosisiJabatanFormValues = {
  nama: string;
  department_id: string;
  keterangan?: string;
  status: MasterDataStatus;
};

export type TagMasterDataItem = MasterDataBaseItem & {
  warna_tag: string;
};

export type TagFormValues = {
  nama: string;
  warna_tag: string;
  keterangan?: string;
  status: MasterDataStatus;
};

export type LokasiKerjaMasterDataItem = MasterDataBaseItem & {
  alamat: string;
};

export type LokasiKerjaFormValues = {
  nama: string;
  alamat: string;
  keterangan?: string;
  status: MasterDataStatus;
};

export const MASTER_DATA_STATUS_OPTIONS: Array<{ label: string; value: MasterDataStatus }> = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

export const SIMPLE_INITIAL_VALUES: SimpleMasterDataFormValues = {
  nama: "",
  keterangan: "",
  status: "Aktif",
};

export const DEPARTMENT_INITIAL_VALUES: DepartmentFormValues = {
  nama: "",
  divisi_id: "",
  manager_id: undefined,
  keterangan: "",
  status: "Aktif",
};

export const POSISI_JABATAN_INITIAL_VALUES: PosisiJabatanFormValues = {
  nama: "",
  department_id: "",
  keterangan: "",
  status: "Aktif",
};

export const TAG_INITIAL_VALUES: TagFormValues = {
  nama: "",
  warna_tag: "#1677ff",
  keterangan: "",
  status: "Aktif",
};

export const LOKASI_KERJA_INITIAL_VALUES: LokasiKerjaFormValues = {
  nama: "",
  alamat: "",
  keterangan: "",
  status: "Aktif",
};

export const DEFAULT_MASTER_DATA_COLUMNS: TableProps<MasterDataBaseItem>["columns"] = [
  {
    title: "Kode",
    dataIndex: "code",
    key: "code",
    width: 140,
    render: (value: string) => <span className="font-mono text-xs text-slate-500">{value}</span>,
  },
  {
    title: "Nama",
    dataIndex: "nama",
    key: "nama",
    render: (value: string) => (
      <div className="text-slate-900">
        <Text strong>{value}</Text>
      </div>
    ),
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
    render: (value?: string | null) => <span className="text-slate-500">{value || "-"}</span>,
  },
];

export const DEPARTMENT_COLUMNS: TableProps<DepartmentMasterDataItem>["columns"] = [
  {
    title: "Kode",
    dataIndex: "code",
    key: "code",
    width: 140,
    render: (value: string) => <span className="font-mono text-xs text-slate-500">{value}</span>,
  },
  {
    title: "Nama Department",
    dataIndex: "nama",
    key: "nama",
    render: (value: string) => <Text strong>{value}</Text>,
  },
  {
    title: "Divisi",
    key: "divisi",
    render: (_, record) => <span className="text-slate-600">{record.divisi?.nama ?? "-"}</span>,
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
    render: (value?: string | null) => <span className="text-slate-500">{value || "-"}</span>,
  },
];

export const POSISI_JABATAN_COLUMNS: TableProps<PosisiJabatanMasterDataItem>["columns"] = [
  {
    title: "Kode",
    dataIndex: "code",
    key: "code",
    width: 140,
    render: (value: string) => <span className="font-mono text-xs text-slate-500">{value}</span>,
  },
  {
    title: "Nama Posisi Jabatan",
    dataIndex: "nama",
    key: "nama",
    render: (value: string) => <Text strong>{value}</Text>,
  },
  {
    title: "Department",
    key: "department",
    render: (_, record) => <span className="text-slate-700">{record.department?.nama ?? "-"}</span>,
  },
  {
    title: "Divisi",
    key: "divisi",
    render: (_, record) => <span className="text-slate-600">{record.department?.divisi?.nama ?? "-"}</span>,
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
    render: (value?: string | null) => <span className="text-slate-500">{value || "-"}</span>,
  },
];

export const TAG_COLUMNS: TableProps<TagMasterDataItem>["columns"] = [
  {
    title: "Kode",
    dataIndex: "code",
    key: "code",
    width: 140,
    render: (value: string) => <span className="font-mono text-xs text-slate-500">{value}</span>,
  },
  {
    title: "Nama Tag",
    dataIndex: "nama",
    key: "nama",
    render: (value: string) => <Text strong>{value}</Text>,
  },
  {
    title: "Warna Tag",
    dataIndex: "warna_tag",
    key: "warna_tag",
    render: (value: string) => <Tag color={value}>{value}</Tag>,
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
    render: (value?: string | null) => <span className="text-slate-500">{value || "-"}</span>,
  },
];

export const LOKASI_KERJA_COLUMNS: TableProps<LokasiKerjaMasterDataItem>["columns"] = [
  {
    title: "Kode",
    dataIndex: "code",
    key: "code",
    width: 140,
    render: (value: string) => <span className="font-mono text-xs text-slate-500">{value}</span>,
  },
  {
    title: "Nama Lokasi Kerja",
    dataIndex: "nama",
    key: "nama",
    render: (value: string) => <Text strong>{value}</Text>,
  },
  {
    title: "Alamat",
    dataIndex: "alamat",
    key: "alamat",
    render: (value: string) => <span className="text-slate-600">{value || "-"}</span>,
  },
  {
    title: "Keterangan",
    dataIndex: "keterangan",
    key: "keterangan",
    render: (value?: string | null) => <span className="text-slate-500">{value || "-"}</span>,
  },
];

export const SIMPLE_FIELDS: MasterDataFormField[] = [
  {
    name: "nama",
    label: "Nama",
    placeholder: "Masukkan nama",
    rules: [{ required: true, message: "Nama wajib diisi" }],
  },
  {
    name: "keterangan",
    label: "Keterangan",
    type: "textarea",
    placeholder: "Tambahkan keterangan bila diperlukan",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Pilih status",
    options: MASTER_DATA_STATUS_OPTIONS,
    rules: [{ required: true, message: "Status wajib dipilih" }],
  },
];

export function useSimpleMasterDataPage(config: {
  endpoint: string;
  title: string;
  description: string;
  entityName: string;
}) {
  const [form] = Form.useForm<SimpleMasterDataFormValues>();
  const masterData = useMasterData<MasterDataBaseItem, SimpleMasterDataFormValues>({
    endpoint: config.endpoint,
    entityName: config.entityName,
    initialValues: SIMPLE_INITIAL_VALUES,
    mapItemToFormValues: (item) => ({
      nama: item.nama,
      keterangan: item.keterangan ?? "",
      status: item.status,
    }),
  });

  return (
    <MasterDataPage<MasterDataBaseItem, SimpleMasterDataFormValues>
      title={config.title}
      description={config.description}
      entityName={config.entityName}
      searchPlaceholder={`Cari ${config.entityName.toLowerCase()}`}
      form={form}
      fields={SIMPLE_FIELDS}
      columns={DEFAULT_MASTER_DATA_COLUMNS}
      items={masterData.items}
      meta={masterData.meta}
      isLoading={masterData.isLoading}
      isSubmitting={masterData.isSubmitting}
      isModalOpen={masterData.isModalOpen}
      editingItem={masterData.editingItem}
      initialValues={masterData.initialValues}
      searchValue={masterData.query.search}
      statusValue={masterData.query.status}
      onSearchChange={masterData.setSearch}
      onStatusChange={masterData.setStatus}
      onPageChange={masterData.setPage}
      onCreate={masterData.openCreateModal}
      onEdit={masterData.openEditModal}
      onToggleStatus={masterData.toggleStatus}
      onCloseModal={masterData.closeModal}
      onSubmit={masterData.submitForm}
    />
  );
}

export function buildDepartmentFields(
  divisiOptions: RelationOption[],
  isDivisiLoading: boolean,
  managerOptions: DepartmentManagerOption[],
  isManagerLoading: boolean,
  hasManagerSource: boolean,
): MasterDataFormField[] {
  const managerPlaceholder = hasManagerSource
    ? managerOptions.length > 0
      ? "Pilih manager aktif"
      : "Belum ada karyawan aktif yang dapat dipilih"
    : "Data karyawan aktif belum tersedia";

  return [
    {
      name: "nama",
      label: "Nama Department",
      placeholder: "Masukkan nama department",
      rules: [{ required: true, message: "Nama department wajib diisi" }],
    },
    {
      name: "divisi_id",
      label: "Divisi",
      type: "select",
      placeholder: "Pilih divisi aktif",
      options: divisiOptions.map((item) => ({
        label: `${item.nama} (${item.code})`,
        value: item.id,
      })),
      rules: [{ required: true, message: "Divisi wajib dipilih" }],
      selectProps: {
        loading: isDivisiLoading,
        showSearch: true,
        filterOption: true,
        optionFilterProp: "label",
      },
    },
    {
      name: "manager_id",
      label: "Manager",
      type: "select",
      placeholder: managerPlaceholder,
      options: managerOptions.map((item) => ({
        label: `${item.nama_lengkap} (${item.nomor_induk_karyawan})`,
        value: item.id,
      })),
      selectProps: {
        loading: isManagerLoading,
        showSearch: true,
        filterOption: true,
        optionFilterProp: "label",
        disabled: !hasManagerSource || managerOptions.length === 0,
      },
      extra: hasManagerSource
        ? "Manager dipilih dari daftar karyawan aktif dan tetap dikirim sebagai manager_id."
        : "Field manager dinonaktifkan karena sumber data karyawan aktif belum tersedia.",
    },
    {
      name: "keterangan",
      label: "Keterangan",
      type: "textarea",
      placeholder: "Tambahkan keterangan bila diperlukan",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Pilih status",
      options: MASTER_DATA_STATUS_OPTIONS,
      rules: [{ required: true, message: "Status wajib dipilih" }],
    },
  ];
}

export function buildPosisiJabatanFields(
  departmentOptions: RelationOption[],
  isDepartmentLoading: boolean,
): MasterDataFormField[] {
  return [
    {
      name: "nama",
      label: "Nama Posisi Jabatan",
      placeholder: "Masukkan nama posisi jabatan",
      rules: [{ required: true, message: "Nama posisi jabatan wajib diisi" }],
    },
    {
      name: "department_id",
      label: "Department",
      type: "select",
      placeholder: "Pilih department aktif",
      options: departmentOptions.map((item) => ({
        label: `${item.nama} (${item.code})`,
        value: item.id,
      })),
      rules: [{ required: true, message: "Department wajib dipilih" }],
      selectProps: {
        loading: isDepartmentLoading,
        showSearch: true,
        filterOption: true,
        optionFilterProp: "label",
      },
    },
    {
      name: "keterangan",
      label: "Keterangan",
      type: "textarea",
      placeholder: "Tambahkan keterangan bila diperlukan",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Pilih status",
      options: MASTER_DATA_STATUS_OPTIONS,
      rules: [{ required: true, message: "Status wajib dipilih" }],
    },
  ];
}

export function buildTagFields(): MasterDataFormField[] {
  return [
    {
      name: "nama",
      label: "Nama Tag",
      placeholder: "Masukkan nama tag",
      rules: [{ required: true, message: "Nama tag wajib diisi" }],
    },
    {
      name: "warna_tag",
      label: "Warna Tag",
      type: "color",
      placeholder: "Pilih warna tag",
      rules: [{ required: true, message: "Warna tag wajib dipilih" }],
    },
    {
      name: "keterangan",
      label: "Keterangan",
      type: "textarea",
      placeholder: "Tambahkan keterangan bila diperlukan",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Pilih status",
      options: MASTER_DATA_STATUS_OPTIONS,
      rules: [{ required: true, message: "Status wajib dipilih" }],
    },
  ];
}

export const LOKASI_KERJA_FIELDS: MasterDataFormField[] = [
  {
    name: "nama",
    label: "Nama Lokasi Kerja",
    placeholder: "Masukkan nama lokasi kerja",
    rules: [{ required: true, message: "Nama lokasi kerja wajib diisi" }],
  },
  {
    name: "alamat",
    label: "Alamat",
    type: "textarea",
    placeholder: "Masukkan alamat lokasi kerja",
    rules: [{ required: true, message: "Alamat wajib diisi" }],
  },
  {
    name: "keterangan",
    label: "Keterangan",
    type: "textarea",
    placeholder: "Tambahkan keterangan bila diperlukan",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Pilih status",
    options: MASTER_DATA_STATUS_OPTIONS,
    rules: [{ required: true, message: "Status wajib dipilih" }],
  },
];

export const HR_MASTER_MENU_PARENT_KEY = "hr-master-data";
export const HR_KARYAWAN_MENU_KEY = "/hr/karyawan";
export const HR_IMPORT_MENU_KEY = "/hr/import";
export const HR_KARYAWAN_MENU_PATHS = [HR_KARYAWAN_MENU_KEY, `${HR_KARYAWAN_MENU_KEY}/tambah`] as const;

export const HR_MASTER_DATA_MENU_ITEMS = [
  { key: "/hr/master-data/divisi", label: "Divisi", icon: <ApartmentOutlined /> },
  { key: "/hr/master-data/department", label: "Department", icon: <NodeIndexOutlined /> },
  { key: "/hr/master-data/posisi-jabatan", label: "Posisi Jabatan", icon: <NodeIndexOutlined /> },
  { key: "/hr/master-data/kategori-pangkat", label: "Kategori Pangkat", icon: <TrophyOutlined /> },
  { key: "/hr/master-data/golongan", label: "Golongan", icon: <TrophyOutlined /> },
  { key: "/hr/master-data/sub-golongan", label: "Sub Golongan", icon: <TrophyOutlined /> },
  {
    key: "/hr/master-data/jenis-hubungan-kerja",
    label: "Jenis Hubungan Kerja",
    icon: <UserSwitchOutlined />,
  },
  { key: "/hr/master-data/tag", label: "Tag", icon: <TagOutlined /> },
  { key: "/hr/master-data/lokasi-kerja", label: "Lokasi Kerja", icon: <EnvironmentOutlined /> },
  { key: "/hr/master-data/status-karyawan", label: "Status Karyawan", icon: <UserSwitchOutlined /> },
] as const;

export const HR_MASTER_MENU_ITEMS = [
  {
    key: HR_MASTER_MENU_PARENT_KEY,
    label: "Master Data",
    icon: <ApartmentOutlined />,
    children: HR_MASTER_DATA_MENU_ITEMS,
  },
  {
    key: HR_KARYAWAN_MENU_KEY,
    label: "Karyawan",
    icon: <TeamOutlined />,
  },
  {
    key: HR_IMPORT_MENU_KEY,
    label: "Import Karyawan",
    icon: <ImportOutlined />,
  },
] as const;

export function HrStatsPreview() {
  return (
    <Space size={12} wrap>
      <Tag className="border-primary/30 bg-primary/10 text-slate-800">10 Master Data</Tag>
      <Tag color="green">CRUD Terintegrasi</Tag>
      <Tag className="border-primary/30 bg-primary/10 text-slate-800">Filter Status & Pencarian</Tag>
    </Space>
  );
}
