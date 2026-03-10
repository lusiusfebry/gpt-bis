import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import MasterDataPage from "../components/MasterDataPage";
import { fetchMasterDataOptions, useMasterData } from "../hooks/useMasterData";
import {
  buildPosisiJabatanFields,
  POSISI_JABATAN_COLUMNS,
  POSISI_JABATAN_INITIAL_VALUES,
  type PosisiJabatanFormValues,
  type PosisiJabatanMasterDataItem,
  type RelationOption,
} from "./shared";

function PosisiJabatanPage() {
  const [form] = Form.useForm<PosisiJabatanFormValues>();
  const [departmentOptions, setDepartmentOptions] = useState<RelationOption[]>([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);

  const masterData = useMasterData<PosisiJabatanMasterDataItem, PosisiJabatanFormValues>({
    endpoint: "/hr/master-data/posisi-jabatan",
    entityName: "Posisi Jabatan",
    initialValues: POSISI_JABATAN_INITIAL_VALUES,
    mapItemToFormValues: (item) => ({
      nama: item.nama,
      department_id: item.department?.id ?? item.department_id,
      keterangan: item.keterangan ?? "",
      status: item.status,
    }),
  });

  useEffect(() => {
    const loadDepartment = async () => {
      setIsDepartmentLoading(true);

      try {
        const data = await fetchMasterDataOptions<RelationOption>("/hr/master-data/department");
        setDepartmentOptions(data);
      } finally {
        setIsDepartmentLoading(false);
      }
    };

    void loadDepartment();
  }, []);

  const fields = useMemo(
    () => buildPosisiJabatanFields(departmentOptions, isDepartmentLoading),
    [departmentOptions, isDepartmentLoading],
  );

  return (
    <MasterDataPage<PosisiJabatanMasterDataItem, PosisiJabatanFormValues>
      title="Master Data Posisi Jabatan"
      description="Kelola posisi jabatan yang terhubung ke department aktif pada modul HR."
      entityName="Posisi Jabatan"
      searchPlaceholder="Cari posisi jabatan"
      form={form}
      fields={fields}
      columns={POSISI_JABATAN_COLUMNS}
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

export default PosisiJabatanPage;
