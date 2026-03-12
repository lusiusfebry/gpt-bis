import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Popconfirm, Select, Table, Typography, type TableProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildFotoKaryawanUrl,
  useKaryawanDelete,
  useKaryawanList,
  useMasterDataDropdowns,
  type KaryawanListItem,
} from "../hooks/useKaryawan";

const { Paragraph, Text, Title } = Typography;

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
  const { items, meta, query, isLoading, setFilter, setPage, setSearch, reload } = useKaryawanList();
  const { deleteKaryawan, isDeleting } = useKaryawanDelete();
  const dropdowns = useMasterDataDropdowns();
  const [searchValue, setSearchValue] = useState(query.search);

  useEffect(() => {
    setSearchValue(query.search);
  }, [query.search]);

  const columns = useMemo<TableProps<KaryawanListItem>["columns"]>(
    () => [
      {
        title: "NIK",
        dataIndex: "nomor_induk_karyawan",
        key: "nomor_induk_karyawan",
        width: 150,
        render: (value: string) => (
          <span className="font-mono text-sm font-semibold text-slate-700">{value}</span>
        ),
      },
      {
        title: "Nama Lengkap",
        dataIndex: "nama_lengkap",
        key: "nama_lengkap",
        width: 280,
        render: (value: string, record) => (
          <div className="flex items-center gap-3">
            <Avatar
              size={42}
              src={buildFotoKaryawanUrl(record.foto_karyawan)}
              className="bg-slate-900"
            >
              {getInitials(record.nama_lengkap)}
            </Avatar>
            <div className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-900">{value}</span>
            </div>
          </div>
        ),
      },
      {
        title: "Divisi",
        key: "divisi",
        width: 180,
        render: (_, record) => <span className="text-sm text-slate-600">{record.divisi?.nama ?? "-"}</span>,
      },
      {
        title: "Department",
        key: "department",
        width: 180,
        render: (_, record) => (
          <span className="text-sm text-slate-600">{record.department?.nama ?? "-"}</span>
        ),
      },
      {
        title: "Posisi Jabatan",
        key: "posisi_jabatan",
        width: 220,
        render: (_, record) => (
          <span className="text-sm text-slate-600">{record.posisi_jabatan?.nama ?? "-"}</span>
        ),
      },
      {
        title: "Status Karyawan",
        key: "status_karyawan",
        width: 150,
        align: "center",
        render: (_, record) => {
          const statusLabel = record.status_karyawan?.nama ?? "-";
          const isActive =
            record.status_karyawan?.status === "Aktif" &&
            record.status_karyawan.nama?.toLowerCase() === "aktif";

          return (
            <span
              className={[
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {statusLabel}
            </span>
          );
        },
      },
      {
        title: "Lokasi Kerja",
        key: "lokasi_kerja",
        width: 180,
        render: (_, record) => (
          <span className="text-sm text-slate-600">{record.lokasi_kerja?.nama ?? "-"}</span>
        ),
      },
      {
        title: "Aksi",
        key: "actions",
        width: 120,
        align: "right",
        render: (_, record) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              title="View details"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/hr/karyawan/${record.id}`);
              }}
              className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </button>
            <button
              type="button"
              title="Edit employee"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/hr/karyawan/${record.id}`);
              }}
              className="p-2 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit_square</span>
            </button>
            <Popconfirm
              title="Hapus Karyawan"
              description={`Apakah Anda yakin ingin menghapus ${record.nama_lengkap}?`}
              onConfirm={async (event) => {
                event?.stopPropagation();
                await deleteKaryawan(record.id, reload);
              }}
              onCancel={(event) => {
                event?.stopPropagation();
              }}
              okText="Ya, Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <button
                type="button"
                title="Hapus karyawan"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [navigate, deleteKaryawan, isDeleting, reload],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Direktori Karyawan</h2>
          <p className="text-slate-500 mt-1">Mengelola dan memantau data seluruh karyawan perusahaan.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => navigate("/hr/import")}
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-3 border border-slate-200 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">file_upload</span>
            <span>Import Data</span>
          </button>
          <button
            onClick={() => navigate("/hr/karyawan/tambah")}
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-primary hover:bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-lg shadow-sm shadow-primary/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">add</span>
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Input.Search
            allowClear
            placeholder="Cari nama lengkap atau NIK"
            value={searchValue}
            onChange={(event) => {
              const nextValue = event.target.value;
              setSearchValue(nextValue);

              if (nextValue === "") {
                setSearch("");
              }
            }}
            onSearch={(value) => {
              setSearchValue(value);
              setSearch(value);
            }}
            prefix={<SearchOutlined className="text-slate-400" />}
            className="w-full xl:max-w-md [&_.ant-input-affix-wrapper]:!h-11 [&_.ant-input-affix-wrapper]:!rounded-xl [&_.ant-input-affix-wrapper]:!border-slate-200 [&_.ant-input-affix-wrapper]:!bg-slate-50 [&_.ant-input-affix-wrapper]:!px-4 [&_.ant-input]:!bg-transparent [&_.ant-input]:!text-sm [&_.ant-input-search-button]:!h-11 [&_.ant-input-search-button]:!rounded-r-xl [&_.ant-input-search-button]:!border-slate-200 [&_.ant-input-search-button]:!bg-slate-50"
          />

          <div className="flex flex-wrap items-center justify-end gap-3">
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
              className="min-w-[180px] [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-slate-50 [&_.ant-select-selector]:!px-4"
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
              className="min-w-[180px] [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-slate-50 [&_.ant-select-selector]:!px-4"
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
              className="min-w-[180px] [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-slate-50 [&_.ant-select-selector]:!px-4"
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
              className="min-w-[180px] [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-slate-50 [&_.ant-select-selector]:!px-4"
            />
            <Button
              type="link"
              onClick={() => {
                setFilter("divisi_id", undefined);
                setFilter("department_id", undefined);
                setFilter("status_karyawan_id", undefined);
                setFilter("lokasi_kerja_id", undefined);
                setSearchValue("");
                setSearch("");
              }}
              className="!h-11 !rounded-xl !px-1 !font-semibold !text-primary hover:!text-primary/80"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table<KaryawanListItem>
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={isLoading}
          scroll={{ x: 1200 }}
          className="[&_.ant-table]:!rounded-none [&_.ant-table-container]:!border-0 [&_.ant-table-thead>tr>th]:!bg-slate-50 [&_.ant-table-thead>tr>th]:!px-6 [&_.ant-table-thead>tr>th]:!py-4 [&_.ant-table-thead>tr>th]:!text-xs [&_.ant-table-thead>tr>th]:!font-bold [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!tracking-wider [&_.ant-table-thead>tr>th]:!text-slate-500 [&_.ant-table-tbody>tr>td]:!px-6 [&_.ant-table-tbody>tr>td]:!py-4 [&_.ant-table-tbody>tr>td]:!align-middle [&_.ant-table-tbody>tr>td]:!border-b [&_.ant-table-tbody>tr>td]:!border-slate-100"
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            showSizeChanger: true,
            onChange: setPage,
            showTotal: (total, range) => `Menampilkan ${range[0]}-${range[1]} dari ${total} Karyawan`,
            className: "!px-6 !py-4",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/hr/karyawan/${record.id}`),
            className: "cursor-pointer transition-colors hover:bg-slate-50/50",
          })}
        />
      </div>
    </div>
  );
}

export default KaryawanListPage;
