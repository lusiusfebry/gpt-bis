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

export type EmployeeFamilyData = {
  id?: string;
  nama_pasangan?: string | null;
  tanggal_lahir_pasangan?: string | null;
  pendidikan_terakhir_pasangan?: string | null;
  pekerjaan_pasangan?: string | null;
  jumlah_anak?: number | null;
  keterangan_pasangan?: string | null;
  anak_ke?: number | null;
  jumlah_saudara_kandung?: number | null;
  nama_ayah_mertua?: string | null;
  tanggal_lahir_ayah_mertua?: string | null;
  pendidikan_terakhir_ayah_mertua?: string | null;
  keterangan_ayah_mertua?: string | null;
  nama_ibu_mertua?: string | null;
  tanggal_lahir_ibu_mertua?: string | null;
  pendidikan_terakhir_ibu_mertua?: string | null;
  keterangan_ibu_mertua?: string | null;
};

export type EmployeeChildData = {
  id?: string;
  nama_anak: string;
  jenis_kelamin?: string | null;
  tanggal_lahir?: string | null;
  keterangan?: string | null;
};

export type EmployeeSiblingData = {
  id?: string;
  nama_saudara_kandung: string;
  jenis_kelamin?: string | null;
  tanggal_lahir?: string | null;
  pendidikan_terakhir?: string | null;
  pekerjaan?: string | null;
  keterangan?: string | null;
};

export type EmployeeEducationData = {
  id?: string;
  tingkat_pendidikan?: string | null;
  bidang_studi?: string | null;
  nama_sekolah?: string | null;
  kota_sekolah?: string | null;
  status_kelulusan?: string | null;
  keterangan?: string | null;
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
  jenis_hubungan_kerja_id?: string | null;
  kategori_pangkat_id?: string | null;
  golongan_id?: string | null;
  sub_golongan_id?: string | null;
  lokasi_sebelumnya_id?: string | null;
  email_perusahaan?: string | null;
  nomor_handphone?: string | null;
  qr_code?: string | null;
  jenis_kelamin?: string | null;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  email_pribadi?: string | null;
  agama?: string | null;
  golongan_darah?: string | null;
  nomor_kartu_keluarga?: string | null;
  nomor_ktp?: string | null;
  nomor_npwp?: string | null;
  nomor_bpjs?: string | null;
  no_nik_kk?: string | null;
  status_pajak?: string | null;
  alamat_domisili?: string | null;
  kota_domisili?: string | null;
  provinsi_domisili?: string | null;
  alamat_ktp?: string | null;
  kota_ktp?: string | null;
  provinsi_ktp?: string | null;
  nomor_handphone_2?: string | null;
  nomor_telepon_rumah_1?: string | null;
  nomor_telepon_rumah_2?: string | null;
  status_pernikahan?: string | null;
  nama_pasangan?: string | null;
  tanggal_menikah?: string | null;
  tanggal_cerai?: string | null;
  tanggal_wafat_pasangan?: string | null;
  pekerjaan_pasangan?: string | null;
  jumlah_anak?: number | null;
  nomor_rekening?: string | null;
  nama_pemegang_rekening?: string | null;
  nama_bank?: string | null;
  cabang_bank?: string | null;
  tanggal_masuk_group?: string | null;
  tanggal_masuk?: string | null;
  tanggal_permanent?: string | null;
  tanggal_kontrak?: string | null;
  tanggal_akhir_kontrak?: string | null;
  tanggal_berhenti?: string | null;
  no_dana_pensiun?: string | null;
  nama_kontak_darurat_1?: string | null;
  nomor_telepon_kontak_darurat_1?: string | null;
  hubungan_kontak_darurat_1?: string | null;
  alamat_kontak_darurat_1?: string | null;
  nama_kontak_darurat_2?: string | null;
  nomor_telepon_kontak_darurat_2?: string | null;
  hubungan_kontak_darurat_2?: string | null;
  alamat_kontak_darurat_2?: string | null;
  point_of_original?: string | null;
  point_of_hire?: string | null;
  ukuran_seragam_kerja?: string | null;
  ukuran_sepatu_kerja?: string | null;
  tanggal_mutasi?: string | null;
  siklus_pembayaran_gaji?: string | null;
  costing?: string | null;
  assign?: string | null;
  actual?: string | null;
  pendidikan_terakhir_pasangan?: string | null;
  keterangan_pasangan?: string | null;
  anak_ke?: number | null;
  jumlah_saudara_kandung?: number | null;
  nama_ayah_mertua?: string | null;
  tanggal_lahir_ayah_mertua?: string | null;
  pendidikan_terakhir_ayah_mertua?: string | null;
  keterangan_ayah_mertua?: string | null;
  nama_ibu_mertua?: string | null;
  tanggal_lahir_ibu_mertua?: string | null;
  pendidikan_terakhir_ibu_mertua?: string | null;
  keterangan_ibu_mertua?: string | null;
  manager?: KaryawanRelation | null;
  atasan_langsung?: KaryawanRelation | null;
  tag?: KaryawanRelation | null;
  family?: EmployeeFamilyData | null;
  children?: EmployeeChildData[];
  siblings?: EmployeeSiblingData[];
  educations?: EmployeeEducationData[];
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

type MasterDataDropdownLoadingState = {
  divisi: DatasetState;
  department: DatasetState;
  posisiJabatan: DatasetState;
  statusKaryawan: DatasetState;
  lokasiKerja: DatasetState;
  tag: DatasetState;
  manager: DatasetState;
  atasanLangsung: DatasetState;
  jenisHubunganKerja: DatasetState;
  kategoriPangkat: DatasetState;
  golongan: DatasetState;
  subGolongan: DatasetState;
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
  jenisHubunganKerjaOptions: SelectOption[];
  kategoriPangkatOptions: SelectOption[];
  golonganOptions: SelectOption[];
  subGolonganOptions: SelectOption[];
  loadingState: MasterDataDropdownLoadingState;
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

const DEFAULT_LOADING_STATE: MasterDataDropdownLoadingState = {
  divisi: { loading: true, available: false },
  department: { loading: true, available: false },
  posisiJabatan: { loading: true, available: false },
  statusKaryawan: { loading: true, available: false },
  lokasiKerja: { loading: true, available: false },
  tag: { loading: true, available: false },
  manager: { loading: true, available: false },
  atasanLangsung: { loading: true, available: false },
  jenisHubunganKerja: { loading: true, available: false },
  kategoriPangkat: { loading: true, available: false },
  golongan: { loading: true, available: false },
  subGolongan: { loading: true, available: false },
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

export function useKaryawanDelete() {
  const { message } = App.useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteKaryawan = useCallback(
    async (id: string, onSuccess?: () => void) => {
      setIsDeleting(true);

      try {
        await api.delete(`/hr/karyawan/${id}`);
        message.success("Karyawan berhasil dihapus");
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        message.error("Gagal menghapus karyawan");
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [message],
  );

  return {
    deleteKaryawan,
    isDeleting,
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
  const [jenisHubunganKerjaOptions, setJenisHubunganKerjaOptions] = useState<SelectOption[]>([]);
  const [kategoriPangkatOptions, setKategoriPangkatOptions] = useState<SelectOption[]>([]);
  const [golonganOptions, setGolonganOptions] = useState<SelectOption[]>([]);
  const [subGolonganOptions, setSubGolonganOptions] = useState<SelectOption[]>([]);
  const [loadingState, setLoadingState] = useState<MasterDataDropdownLoadingState>(DEFAULT_LOADING_STATE);

  const loadDropdowns = useCallback(async () => {
    setLoadingState(DEFAULT_LOADING_STATE);

    const results = await Promise.allSettled([
      fetchMasterDataOptions("/hr/master-data/divisi"),
      fetchMasterDataOptions("/hr/master-data/department"),
      fetchMasterDataOptions("/hr/master-data/posisi-jabatan"),
      fetchMasterDataOptions("/hr/master-data/status-karyawan"),
      fetchMasterDataOptions("/hr/master-data/lokasi-kerja"),
      fetchMasterDataOptions("/hr/master-data/tag"),
      fetchEmployeeOptions(),
      fetchMasterDataOptions("/hr/master-data/jenis-hubungan-kerja"),
      fetchMasterDataOptions("/hr/master-data/kategori-pangkat"),
      fetchMasterDataOptions("/hr/master-data/golongan"),
      fetchMasterDataOptions("/hr/master-data/sub-golongan"),
    ]);

    const [
      divisiResult,
      departmentResult,
      posisiJabatanResult,
      statusKaryawanResult,
      lokasiKerjaResult,
      tagResult,
      employeeResult,
      jenisHubunganKerjaResult,
      kategoriPangkatResult,
      golonganResult,
      subGolonganResult,
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
    setJenisHubunganKerjaOptions(
      jenisHubunganKerjaResult.status === "fulfilled"
        ? mapMasterOptions(jenisHubunganKerjaResult.value)
        : [],
    );
    setKategoriPangkatOptions(
      kategoriPangkatResult.status === "fulfilled" ? mapMasterOptions(kategoriPangkatResult.value) : [],
    );
    setGolonganOptions(
      golonganResult.status === "fulfilled" ? mapMasterOptions(golonganResult.value) : [],
    );
    setSubGolonganOptions(
      subGolonganResult.status === "fulfilled" ? mapMasterOptions(subGolonganResult.value) : [],
    );

    setLoadingState({
      divisi: { loading: false, available: divisiResult.status === "fulfilled" },
      department: { loading: false, available: departmentResult.status === "fulfilled" },
      posisiJabatan: { loading: false, available: posisiJabatanResult.status === "fulfilled" },
      statusKaryawan: { loading: false, available: statusKaryawanResult.status === "fulfilled" },
      lokasiKerja: { loading: false, available: lokasiKerjaResult.status === "fulfilled" },
      tag: { loading: false, available: tagResult.status === "fulfilled" },
      manager: { loading: false, available: employeeResult.status === "fulfilled" },
      atasanLangsung: { loading: false, available: employeeResult.status === "fulfilled" },
      jenisHubunganKerja: {
        loading: false,
        available: jenisHubunganKerjaResult.status === "fulfilled",
      },
      kategoriPangkat: {
        loading: false,
        available: kategoriPangkatResult.status === "fulfilled",
      },
      golongan: { loading: false, available: golonganResult.status === "fulfilled" },
      subGolongan: { loading: false, available: subGolonganResult.status === "fulfilled" },
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
    jenisHubunganKerjaOptions,
    kategoriPangkatOptions,
    golonganOptions,
    subGolonganOptions,
    loadingState,
    isAnyLoading,
    reload: loadDropdowns,
  };
}
