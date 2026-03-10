import { Form } from "antd";
import MasterDataPage from "../components/MasterDataPage";
import { useMasterData } from "../hooks/useMasterData";
import {
  LOKASI_KERJA_COLUMNS,
  LOKASI_KERJA_FIELDS,
  LOKASI_KERJA_INITIAL_VALUES,
  type LokasiKerjaFormValues,
  type LokasiKerjaMasterDataItem,
} from "./shared";

function LokasiKerjaPage() {
  const [form] = Form.useForm<LokasiKerjaFormValues>();
  const masterData = useMasterData<LokasiKerjaMasterDataItem, LokasiKerjaFormValues>({
    endpoint: "/hr/master-data/lokasi-kerja",
    entityName: "Lokasi Kerja",
    initialValues: LOKASI_KERJA_INITIAL_VALUES,
    mapItemToFormValues: (item) => ({
      nama: item.nama,
      alamat: item.alamat,
      keterangan: item.keterangan ?? "",
      status: item.status,
    }),
  });

  return (
    <MasterDataPage<LokasiKerjaMasterDataItem, LokasiKerjaFormValues>
      title="Master Data Lokasi Kerja"
      description="Kelola lokasi kerja dan alamat yang dipakai pada profil serta mutasi karyawan."
      entityName="Lokasi Kerja"
      searchPlaceholder="Cari lokasi kerja"
      form={form}
      fields={LOKASI_KERJA_FIELDS}
      columns={LOKASI_KERJA_COLUMNS}
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

export default LokasiKerjaPage;
