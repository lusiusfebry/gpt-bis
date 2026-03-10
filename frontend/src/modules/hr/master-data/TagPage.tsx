import { Form } from "antd";
import MasterDataPage from "../components/MasterDataPage";
import { useMasterData } from "../hooks/useMasterData";
import {
  buildTagFields,
  TAG_COLUMNS,
  TAG_INITIAL_VALUES,
  type TagFormValues,
  type TagMasterDataItem,
} from "./shared";

function TagPage() {
  const [form] = Form.useForm<TagFormValues>();
  const masterData = useMasterData<TagMasterDataItem, TagFormValues>({
    endpoint: "/hr/master-data/tag",
    entityName: "Tag",
    initialValues: TAG_INITIAL_VALUES,
    mapItemToFormValues: (item) => ({
      nama: item.nama,
      warna_tag: item.warna_tag,
      keterangan: item.keterangan ?? "",
      status: item.status,
    }),
  });

  return (
    <MasterDataPage<TagMasterDataItem, TagFormValues>
      title="Master Data Tag"
      description="Kelola tag dan warna tag untuk klasifikasi data karyawan pada modul HR."
      entityName="Tag"
      searchPlaceholder="Cari tag"
      form={form}
      fields={buildTagFields()}
      columns={TAG_COLUMNS}
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

export default TagPage;
