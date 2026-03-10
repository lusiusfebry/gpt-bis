import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import MasterDataPage from "../components/MasterDataPage";
import { fetchMasterDataOptions, useMasterData } from "../hooks/useMasterData";
import {
  buildDepartmentFields,
  DEPARTMENT_COLUMNS,
  DEPARTMENT_INITIAL_VALUES,
  type DepartmentFormValues,
  type DepartmentMasterDataItem,
  type RelationOption,
} from "./shared";

function DepartmentPage() {
  const [form] = Form.useForm<DepartmentFormValues>();
  const [divisiOptions, setDivisiOptions] = useState<RelationOption[]>([]);
  const [managerOptions, setManagerOptions] = useState<RelationOption[]>([]);
  const [isDivisiLoading, setIsDivisiLoading] = useState(false);
  const [isManagerLoading, setIsManagerLoading] = useState(false);
  const [hasManagerSource, setHasManagerSource] = useState(false);

  const masterData = useMasterData<DepartmentMasterDataItem, DepartmentFormValues>({
    endpoint: "/hr/master-data/department",
    entityName: "Department",
    initialValues: DEPARTMENT_INITIAL_VALUES,
    mapItemToFormValues: (item) => ({
      nama: item.nama,
      divisi_id: item.divisi?.id ?? item.divisi_id,
      manager_id: item.manager_id ?? undefined,
      keterangan: item.keterangan ?? "",
      status: item.status,
    }),
  });

  useEffect(() => {
    const loadDependencies = async () => {
      setIsDivisiLoading(true);
      setIsManagerLoading(true);

      try {
        const [divisiData, managerData] = await Promise.allSettled([
          fetchMasterDataOptions<RelationOption>("/hr/master-data/divisi"),
          fetchMasterDataOptions<RelationOption>("/hr/employee"),
        ]);

        if (divisiData.status === "fulfilled") {
          setDivisiOptions(divisiData.value);
        }

        if (managerData.status === "fulfilled") {
          setManagerOptions(managerData.value);
          setHasManagerSource(true);
        } else {
          setManagerOptions([]);
          setHasManagerSource(false);
        }
      } finally {
        setIsDivisiLoading(false);
        setIsManagerLoading(false);
      }
    };

    void loadDependencies();
  }, []);

  const fields = useMemo(
    () =>
      buildDepartmentFields(
        divisiOptions,
        isDivisiLoading,
        managerOptions,
        isManagerLoading,
        hasManagerSource,
      ),
    [divisiOptions, hasManagerSource, isDivisiLoading, isManagerLoading, managerOptions],
  );

  return (
    <MasterDataPage<DepartmentMasterDataItem, DepartmentFormValues>
      title="Master Data Department"
      description="Kelola department dan relasinya dengan divisi aktif sesuai plan modul HR."
      entityName="Department"
      searchPlaceholder="Cari department"
      form={form}
      fields={fields}
      columns={DEPARTMENT_COLUMNS}
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

export default DepartmentPage;
