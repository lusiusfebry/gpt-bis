import { App } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../lib/axios";

export type MasterDataStatus = "Aktif" | "Tidak Aktif";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type MasterDataListResponse<TItem> = {
  data: TItem[];
  meta: PaginationMeta;
};

export type MasterDataBaseItem = {
  id: string;
  code: string;
  nama: string;
  keterangan?: string | null;
  status: MasterDataStatus;
  created_at: string;
  updated_at: string;
};

export type MasterDataActiveOption = {
  id: string;
  code: string;
  nama: string;
  status: MasterDataStatus;
};

export type MasterDataQuery = {
  page: number;
  limit: number;
  search: string;
  status?: MasterDataStatus;
};

export type UseMasterDataConfig<
  TItem extends MasterDataBaseItem,
  TFormValues extends Record<string, unknown>,
> = {
  endpoint: string;
  entityName: string;
  initialValues: TFormValues;
  mapFormToPayload?: (values: TFormValues) => Record<string, unknown>;
  mapItemToFormValues?: (item: TItem) => TFormValues;
};

export type UseMasterDataResult<
  TItem extends MasterDataBaseItem,
  TFormValues extends Record<string, unknown>,
> = {
  items: TItem[];
  meta: PaginationMeta;
  query: MasterDataQuery;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  editingItem: TItem | null;
  initialValues: TFormValues;
  setSearch: (search: string) => void;
  setStatus: (status?: MasterDataStatus) => void;
  setPage: (page: number, pageSize?: number) => void;
  openCreateModal: () => void;
  openEditModal: (item: TItem) => void;
  closeModal: () => void;
  submitForm: (values: TFormValues) => Promise<boolean>;
  toggleStatus: (item: TItem) => void;
  reload: () => Promise<void>;
};

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export function useMasterData<
  TItem extends MasterDataBaseItem,
  TFormValues extends Record<string, unknown>,
>({
  endpoint,
  entityName,
  initialValues,
  mapFormToPayload,
  mapItemToFormValues,
}: UseMasterDataConfig<TItem, TFormValues>): UseMasterDataResult<TItem, TFormValues> {
  const { message, modal } = App.useApp();
  const [items, setItems] = useState<TItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [query, setQuery] = useState<MasterDataQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
  });

  const payloadMapper = useMemo(
    () => mapFormToPayload ?? ((values: TFormValues) => values),
    [mapFormToPayload],
  );

  const fetchItems = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get<MasterDataListResponse<TItem>>(endpoint, {
        params: {
          page: query.page,
          limit: query.limit,
          ...(query.search ? { search: query.search } : {}),
          ...(query.status ? { status: query.status } : {}),
        },
      });

      console.debug("[useMasterData.fetchItems] response", {
        endpoint,
        entityName,
        query,
        itemCount: data.data.length,
        meta: data.meta,
        firstItem: data.data[0] ?? null,
      });

      setItems(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("[useMasterData.fetchItems] failed", {
        endpoint,
        entityName,
        query,
        error,
      });
      message.error(`Gagal memuat data ${entityName}`);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, entityName, message, query, query.limit, query.page, query.search, query.status]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const setSearch = useCallback((search: string) => {
    setQuery((current) => ({ ...current, page: 1, search }));
  }, []);

  const setStatus = useCallback((status?: MasterDataStatus) => {
    setQuery((current) => ({ ...current, page: 1, status }));
  }, []);

  const setPage = useCallback((page: number, pageSize?: number) => {
    setQuery((current) => ({
      ...current,
      page,
      limit: pageSize ?? current.limit,
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: TItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(false);
  }, []);

  const submitForm = useCallback(
    async (values: TFormValues) => {
      setIsSubmitting(true);

      try {
        const payload = payloadMapper(values);

        if (editingItem) {
          await api.patch(`${endpoint}/${editingItem.id}`, payload);
          message.success(`${entityName} berhasil diperbarui`);
        } else {
          await api.post(endpoint, payload);
          message.success(`${entityName} berhasil ditambahkan`);
        }

        closeModal();
        await fetchItems();
        return true;
      } catch {
        message.error(`Gagal menyimpan ${entityName}`);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeModal, editingItem, endpoint, entityName, fetchItems, message, payloadMapper],
  );

  const toggleStatus = useCallback(
    (item: TItem) => {
      const nextStatus: MasterDataStatus = item.status === "Aktif" ? "Tidak Aktif" : "Aktif";
      const actionLabel = nextStatus === "Aktif" ? "mengaktifkan" : "menonaktifkan";

      modal.confirm({
        title: `${nextStatus === "Aktif" ? "Aktifkan" : "Nonaktifkan"} ${entityName}`,
        content: `Apakah Anda yakin ingin ${actionLabel} ${item.nama}?`,
        okText: nextStatus === "Aktif" ? "Aktifkan" : "Nonaktifkan",
        cancelText: "Batal",
        okButtonProps: {
          danger: nextStatus === "Tidak Aktif",
        },
        onOk: async () => {
          try {
            await api.delete(`${endpoint}/${item.id}`);
            message.success(`${entityName} berhasil ${nextStatus === "Aktif" ? "diaktifkan" : "dinonaktifkan"}`);
            await fetchItems();
          } catch {
            message.error(`Gagal memperbarui status ${entityName}`);
          }
        },
      });
    },
    [endpoint, entityName, fetchItems, message, modal],
  );

  const resolvedInitialValues = useMemo(() => {
    if (!editingItem || !mapItemToFormValues) {
      return initialValues;
    }

    return mapItemToFormValues(editingItem);
  }, [editingItem, initialValues, mapItemToFormValues]);

  return {
    items,
    meta,
    query,
    isLoading,
    isSubmitting,
    isModalOpen,
    editingItem,
    initialValues: resolvedInitialValues,
    setSearch,
    setStatus,
    setPage,
    openCreateModal,
    openEditModal,
    closeModal,
    submitForm,
    toggleStatus,
    reload: fetchItems,
  };
}

export async function fetchMasterDataOptions<TOption = MasterDataActiveOption>(
  endpoint: string,
  search?: string,
) {
  const { data } = await api.get<TOption[]>(`${endpoint}/active`, {
    params: search ? { search } : undefined,
  });

  return data;
}
