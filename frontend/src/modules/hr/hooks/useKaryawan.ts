import { App } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import api, { getBackendBaseUrl } from "../../../lib/axios";
import {
  fetchMasterDataOptions,
  type MasterDataActiveOption,
  type PaginationMeta,
} from "./useMasterData";

export type KaryawanRelation = {
  id: string;
  code?: string;
  nama?: string;
  nama_lengkap?: string;
  nomor_induk_karyawan?: string;
  foto_karyawan?: string | null;
  status?: string;
};

export type KaryawanListItem = {
  id: string;
  foto_karyawan?: string | null;
  nama_lengkap: string;
  nomor_induk_karyawan: string;
  divisi?: KaryawanRelation | null;
  department?: KaryawanRelation | null;
  posisi_jabatan?: KaryawanRelation | null;
  status_karyawan?: KaryawanRelation | null;
  lokasi_kerja?: KaryawanRelation | null;
};

export type KaryawanDetail = KaryawanListItem & {
  manager_id?: string | null;
  atasan_langsung_id?: string | null;
  divisi_id?: string | null;
  department_id?: string | null;
  posisi_jabatan_id?: string | null;
  status_karyawan_id?: string | null;
  lokasi_kerja_id?: string | null;
  tag_id?: string | null;
  email_perusahaan?: string | null;
  nomor_handphone?: string | null;
  qr_code?: string | null;
  manager?: KaryawanRelation | null;
  atasan_langsung?: KaryawanRelation | null;
  tag?: KaryawanRelation | null;
};

export type KaryawanQuery = {
  page: number;
  limit: number;
  search: string;
  divisi_id?: string;
  department_id?: string;
  status_karyawan_id?: string;
  lokasi_kerja_id?: string;
};

export type KaryawanListResponse = {
  data: KaryawanListItem[];
  meta: PaginationMeta;
};

export type NullableSelectValue = string | null;

export type KaryawanPayload = {
  nama_lengkap: string;
  nomor_induk_karyawan: string;
  divisi_id: string;
  department_id: string;
  manager_id?: NullableSelectValue;
  atasan_langsung_id?: NullableSelectValue;
  posisi_jabatan_id: string;
  email_perusahaan?: string;
  nomor_handphone?: string;
  status_karyawan_id: string;
  lokasi_kerja_id: string;
  tag_id?: NullableSelectValue;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type EmployeeOption = {
  id: string;
  nomor_induk_karyawan: string;
  nama_lengkap: string;
  status_karyawan?: {
    nama?: string;
    status?: string;
  } | null;
  posisi_jabatan?: {
    nama?: string;
    status?: string;
  } | null;
};

type DatasetState = {
  loading: boolean;
  available: boolean;
};

type MasterDataDropdownsResult = {
  divisiOptions: SelectOption[];
  departmentOptions: SelectOption[];
  posisiJabatanOptions: SelectOption[];
  statusKaryawanOptions: SelectOption[];
  lokasiKerjaOptions: SelectOption[];
  tagOptions: SelectOption[];
  managerOptions: SelectOption[];
  atasanLangsungOptions: SelectOption[];
  loadingState: {
    divisi: DatasetState;
    department: DatasetState;
    posisiJabatan: DatasetState;
    statusKaryawan: DatasetState;
    lokasiKerja: DatasetState;
    tag: DatasetState;
    manager: DatasetState;
    atasanLangsung: DatasetState;
  };
  isAnyLoading: boolean;
  reload: () => Promise<void>;
};

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const DEFAULT_QUERY: KaryawanQuery = {
  page: 1,
  limit: 10,
  search: "",
  divisi_id: undefined,
  department_id: undefined,
  status_karyawan_id: undefined,
  lokasi_kerja_id: undefined,
};

function toMasterDataOptionLabel(item: MasterDataActiveOption) {
  return `${item.nama} (${item.code})`;
}

function toEmployeeOptionLabel(item: EmployeeOption) {
  return `${item.nama_lengkap} (${item.nomor_induk_karyawan})`;
}

function mapMasterOptions(items: MasterDataActiveOption[]): SelectOption[] {
  return items.map((item) => ({
    label: toMasterDataOptionLabel(item),
    value: item.id,
  }));
}

function mapEmployeeOptions(items: EmployeeOption[]): SelectOption[] {
  return items.map((item) => ({
    label: toEmployeeOptionLabel(item),
    value: item.id,
  }));
}

function isEmployeeActive(item: EmployeeOption) {
  return (
    item.status_karyawan?.status === "Aktif" &&
    item.status_karyawan.nama?.toLowerCase() === "aktif"
  );
}

function isHeadEmployee(item: EmployeeOption) {
  const posisiJabatan = item.posisi_jabatan;

  if (!isEmployeeActive(item) || !posisiJabatan || posisiJabatan.status !== "Aktif") {
    return false;
  }

  return posisiJabatan.nama?.toLowerCase().includes("head") ?? false;
}

export function normalizeNullableSelectValue(value?: string | null) {
  return value && value.trim() ? value : null;
}

export function normalizeKaryawanPayload(payload: KaryawanPayload): KaryawanPayload {
  return {
    ...payload,
    manager_id: normalizeNullableSelectValue(payload.manager_id),
    atasan_langsung_id: normalizeNullableSelectValue(payload.atasan_langsung_id),
    tag_id: normalizeNullableSelectValue(payload.tag_id),
  };
}

async function fetchEmployeeOptions() {
  const { data } = await api.get<EmployeeOption[]>("/hr/karyawan/options");

  return data;
}

export function buildFotoKaryawanUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  const backendBaseUrl = getBackendBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/uploads/${path}`;

  return new URL(normalizedPath, `${backendBaseUrl}/`).toString();
}

export function useKaryawanList() {
  const { message } = App.useApp();
  const [items, setItems] = useState<KaryawanListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [query, setQuery] = useState<KaryawanQuery>(DEFAULT_QUERY);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get<KaryawanListResponse>("/hr/karyawan", {
        params: {
          page: query.page,
          limit: query.limit,
          ...(query.search ? { search: query.search } : {}),
          ...(query.divisi_id ? { divisi_id: query.divisi_id } : {}),
          ...(query.department_id ? { department_id: query.department_id } : {}),
          ...(query.status_karyawan_id ? { status_karyawan_id: query.status_karyawan_id } : {}),
          ...(query.lokasi_kerja_id ? { lokasi_kerja_id: query.lokasi_kerja_id } : {}),
        },
      });

      setItems(data.data);
      setMeta(data.meta);
    } catch {
      message.error("Gagal memuat daftar karyawan");
    } finally {
      setIsLoading(false);
    }
  }, [
    message,
    query.department_id,
    query.divisi_id,
    query.limit,
    query.lokasi_kerja_id,
    query.page,
    query.search,
    query.status_karyawan_id,
  ]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const setSearch = useCallback((search: string) => {
    setQuery((current) => ({ ...current, page: 1, search }));
  }, []);

  const setFilter = useCallback(
    (
      key: "divisi_id" | "department_id" | "status_karyawan_id" | "lokasi_kerja_id",
      value?: string,
    ) => {
      setQuery((current) => ({
        ...current,
        page: 1,
        [key]: value || undefined,
      }));
    },
    [],
  );

  const setPage = useCallback((page: number, pageSize?: number) => {
    setQuery((current) => ({
      ...current,
      page,
      limit: pageSize ?? current.limit,
    }));
  }, []);

  return {
    items,
    meta,
    query,
    isLoading,
    setSearch,
    setFilter,
    setPage,
    reload: fetchItems,
  };
}

export function useKaryawanDetail(id?: string) {
  const { message } = App.useApp();
  const [data, setData] = useState<KaryawanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.get<KaryawanDetail>(`/hr/karyawan/${id}`);
      setData(response.data);
    } catch {
      message.error("Gagal memuat detail karyawan");
    } finally {
      setIsLoading(false);
    }
  }, [id, message]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return {
    data,
    isLoading,
    reload: fetchDetail,
    setData,
  };
}

export function useKaryawanCreate() {
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const create = useCallback(
    async (payload: KaryawanPayload) => {
      setIsSubmitting(true);

      try {
        const response = await api.post<KaryawanDetail>("/hr/karyawan", normalizeKaryawanPayload(payload));
        message.success("Karyawan berhasil ditambahkan");
        return response.data;
      } catch (error) {
        message.error("Gagal menambahkan karyawan");
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [message],
  );

  return {
    create,
    isSubmitting,
  };
}

export function useMasterDataDropdowns(): MasterDataDropdownsResult {
  const [divisiOptions, setDivisiOptions] = useState<SelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);
  const [posisiJabatanOptions, setPosisiJabatanOptions] = useState<SelectOption[]>([]);
  const [statusKaryawanOptions, setStatusKaryawanOptions] = useState<SelectOption[]>([]);
  const [lokasiKerjaOptions, setLokasiKerjaOptions] = useState<SelectOption[]>([]);
  const [tagOptions, setTagOptions] = useState<SelectOption[]>([]);
  const [managerOptions, setManagerOptions] = useState<SelectOption[]>([]);
  const [atasanLangsungOptions, setAtasanLangsungOptions] = useState<SelectOption[]>([]);
  const [loadingState, setLoadingState] = useState({
    divisi: { loading: true, available: false },
    department: { loading: true, available: false },
    posisiJabatan: { loading: true, available: false },
    statusKaryawan: { loading: true, available: false },
    lokasiKerja: { loading: true, available: false },
    tag: { loading: true, available: false },
    manager: { loading: true, available: false },
    atasanLangsung: { loading: true, available: false },
  });

  const loadDropdowns = useCallback(async () => {
    setLoadingState({
      divisi: { loading: true, available: false },
      department: { loading: true, available: false },
      posisiJabatan: { loading: true, available: false },
      statusKaryawan: { loading: true, available: false },
      lokasiKerja: { loading: true, available: false },
      tag: { loading: true, available: false },
      manager: { loading: true, available: false },
      atasanLangsung: { loading: true, available: false },
    });

    const results = await Promise.allSettled([
      fetchMasterDataOptions("/hr/master-data/divisi"),
      fetchMasterDataOptions("/hr/master-data/department"),
      fetchMasterDataOptions("/hr/master-data/posisi-jabatan"),
      fetchMasterDataOptions("/hr/master-data/status-karyawan"),
      fetchMasterDataOptions("/hr/master-data/lokasi-kerja"),
      fetchMasterDataOptions("/hr/master-data/tag"),
      fetchEmployeeOptions(),
    ]);

    const [
      divisiResult,
      departmentResult,
      posisiJabatanResult,
      statusKaryawanResult,
      lokasiKerjaResult,
      tagResult,
      employeeResult,
    ] = results;

    const employeeOptions = employeeResult.status === "fulfilled" ? employeeResult.value : [];

    setDivisiOptions(divisiResult.status === "fulfilled" ? mapMasterOptions(divisiResult.value) : []);
    setDepartmentOptions(
      departmentResult.status === "fulfilled" ? mapMasterOptions(departmentResult.value) : [],
    );
    setPosisiJabatanOptions(
      posisiJabatanResult.status === "fulfilled" ? mapMasterOptions(posisiJabatanResult.value) : [],
    );
    setStatusKaryawanOptions(
      statusKaryawanResult.status === "fulfilled" ? mapMasterOptions(statusKaryawanResult.value) : [],
    );
    setLokasiKerjaOptions(
      lokasiKerjaResult.status === "fulfilled" ? mapMasterOptions(lokasiKerjaResult.value) : [],
    );
    setTagOptions(tagResult.status === "fulfilled" ? mapMasterOptions(tagResult.value) : []);
    setManagerOptions(mapEmployeeOptions(employeeOptions.filter(isHeadEmployee)));
    setAtasanLangsungOptions(mapEmployeeOptions(employeeOptions.filter(isEmployeeActive)));

    setLoadingState({
      divisi: { loading: false, available: divisiResult.status === "fulfilled" },
      department: { loading: false, available: departmentResult.status === "fulfilled" },
      posisiJabatan: { loading: false, available: posisiJabatanResult.status === "fulfilled" },
      statusKaryawan: { loading: false, available: statusKaryawanResult.status === "fulfilled" },
      lokasiKerja: { loading: false, available: lokasiKerjaResult.status === "fulfilled" },
      tag: { loading: false, available: tagResult.status === "fulfilled" },
      manager: { loading: false, available: employeeResult.status === "fulfilled" },
      atasanLangsung: { loading: false, available: employeeResult.status === "fulfilled" },
    });
  }, []);

  useEffect(() => {
    void loadDropdowns();
  }, [loadDropdowns]);

  const isAnyLoading = useMemo(
    () => Object.values(loadingState).some((item) => item.loading),
    [loadingState],
  );

  return {
    divisiOptions,
    departmentOptions,
    posisiJabatanOptions,
    statusKaryawanOptions,
    lokasiKerjaOptions,
    tagOptions,
    managerOptions,
    atasanLangsungOptions,
    loadingState,
    isAnyLoading,
    reload: loadDropdowns,
  };
}
