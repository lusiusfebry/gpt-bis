import {
  Avatar,
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildFotoKaryawanUrl,
  useKaryawanList,
  useMasterDataDropdowns,
  type KaryawanListItem,
} from "../hooks/useKaryawan";

const { Text, Title } = Typography;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function KaryawanListPage() {
  const navigate = useNavigate();
  const { items, meta, query, isLoading, setFilter, setPage, setSearch } = useKaryawanList();
  const dropdowns = useMasterDataDropdowns();

  const columns = useMemo<TableProps<KaryawanListItem>["columns"]>(
    () => [
      {
        title: "Foto",
        dataIndex: "foto_karyawan",
        key: "foto_karyawan",
        width: 88,
        render: (_, record) => (
          <Avatar
            size={48}
            src={buildFotoKaryawanUrl(record.foto_karyawan)}
            className="bg-slate-900"
          >
            {getInitials(record.nama_lengkap)}
          </Avatar>
        ),
      },
      {
        title: "NIK",
        dataIndex: "nomor_induk_karyawan",
        key: "nomor_induk_karyawan",
        width: 140,
        render: (value: string) => <Text strong>{value}</Text>,
      },
      {
        title: "Nama Lengkap",
        dataIndex: "nama_lengkap",
        key: "nama_lengkap",
        render: (value: string) => <Text strong>{value}</Text>,
      },
      {
        title: "Divisi",
        key: "divisi",
        render: (_, record) => record.divisi?.nama ?? "-",
      },
      {
        title: "Department",
        key: "department",
        render: (_, record) => record.department?.nama ?? "-",
      },
      {
        title: "Posisi Jabatan",
        key: "posisi_jabatan",
        render: (_, record) => record.posisi_jabatan?.nama ?? "-",
      },
      {
        title: "Status Karyawan",
        key: "status_karyawan",
        render: (_, record) => <Tag color="blue">{record.status_karyawan?.nama ?? "-"}</Tag>,
      },
      {
        title: "Lokasi Kerja",
        key: "lokasi_kerja",
        render: (_, record) => record.lokasi_kerja?.nama ?? "-",
      },
    ],
    [],
  );

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-2xl shadow-slate-950/10">
        <Space direction="vertical" size={14} className="w-full">
          <Text className="uppercase tracking-[0.3em] !text-teal-300">Human Resources</Text>
          <Title level={2} className="!mb-0 !text-white">
            Daftar Karyawan
          </Title>
          <Text className="!text-slate-300">
            Kelola data karyawan dengan pencarian cepat, filter server-side, dan navigasi langsung ke
            detail.
          </Text>
        </Space>
      </Card>

      <Card className="rounded-3xl shadow-panel">
        <Space direction="vertical" size={16} className="flex w-full">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Input.Search
              allowClear
              placeholder="Cari nama lengkap atau NIK"
              defaultValue={query.search}
              onSearch={setSearch}
              className="w-full xl:max-w-md"
            />
            <Button type="primary" size="large" onClick={() => navigate("/hr/karyawan/tambah")}>
              Tambah Karyawan
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
            <Select
              allowClear
              showSearch
              filterOption
              optionFilterProp="label"
              placeholder="Divisi"
              options={dropdowns.divisiOptions}
              loading={dropdowns.loadingState.divisi.loading}
              onChange={(value) => setFilter("divisi_id", value)}
              value={query.divisi_id}
            />
            <Select
              allowClear
              showSearch
              filterOption
              optionFilterProp="label"
              placeholder="Department"
              options={dropdowns.departmentOptions}
              loading={dropdowns.loadingState.department.loading}
              onChange={(value) => setFilter("department_id", value)}
              value={query.department_id}
            />
            <Select
              allowClear
              showSearch
              filterOption
              optionFilterProp="label"
              placeholder="Status Karyawan"
              options={dropdowns.statusKaryawanOptions}
              loading={dropdowns.loadingState.statusKaryawan.loading}
              onChange={(value) => setFilter("status_karyawan_id", value)}
              value={query.status_karyawan_id}
            />
            <Select
              allowClear
              showSearch
              filterOption
              optionFilterProp="label"
              placeholder="Lokasi Kerja"
              options={dropdowns.lokasiKerjaOptions}
              loading={dropdowns.loadingState.lokasiKerja.loading}
              onChange={(value) => setFilter("lokasi_kerja_id", value)}
              value={query.lokasi_kerja_id}
            />
          </div>

          <Table<KaryawanListItem>
            rowKey="id"
            columns={columns}
            dataSource={items}
            loading={isLoading}
            pagination={{
              current: meta.page,
              pageSize: meta.limit,
              total: meta.total,
              showSizeChanger: true,
              onChange: setPage,
            }}
            scroll={{ x: 1200 }}
            onRow={(record) => ({
              onClick: () => navigate(`/hr/karyawan/${record.id}`),
              className: "cursor-pointer",
            })}
          />
        </Space>
      </Card>
    </Space>
  );
}

export default KaryawanListPage;
