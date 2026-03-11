import {
  DeleteOutlined,
  HeartOutlined,
  HomeOutlined,
  IdcardOutlined,
  PlusOutlined,
  SmileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Select, message } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import type {
  EmployeeChildData,
  EmployeeFamilyData,
  EmployeeSiblingData,
  KaryawanDetail,
} from "../../hooks/useKaryawan";

type FamilyInfoTabProps = {
  data: KaryawanDetail;
  onSave: () => Promise<void> | void;
  employeeId: string;
};

type FamilyChildFormValue = {
  nama_anak?: string;
  jenis_kelamin?: string;
  tanggal_lahir?: Dayjs | null;
  keterangan?: string;
};

type FamilySiblingFormValue = {
  nama_saudara_kandung?: string;
  jenis_kelamin?: string;
  tanggal_lahir?: Dayjs | null;
  pendidikan_terakhir?: string;
  pekerjaan?: string;
  keterangan?: string;
};

type FamilyInfoFormValues = {
  family: {
    nama_pasangan?: string;
    tanggal_lahir_pasangan?: Dayjs | null;
    pendidikan_terakhir_pasangan?: string;
    pekerjaan_pasangan?: string;
    keterangan_pasangan?: string;
    anak_ke?: number | null;
    jumlah_saudara_kandung?: number | null;
    nama_ayah_mertua?: string;
    tanggal_lahir_ayah_mertua?: Dayjs | null;
    pendidikan_terakhir_ayah_mertua?: string;
    keterangan_ayah_mertua?: string;
    nama_ibu_mertua?: string;
    tanggal_lahir_ibu_mertua?: Dayjs | null;
    pendidikan_terakhir_ibu_mertua?: string;
    keterangan_ibu_mertua?: string;
    jumlah_anak?: number | null;
  };
  children: FamilyChildFormValue[];
  siblings: FamilySiblingFormValue[];
};

const GENDER_OPTIONS = [
  { label: "Laki-laki", value: "Laki-laki" },
  { label: "Perempuan", value: "Perempuan" },
];

const SEARCHABLE_SELECT_PROPS = {
  showSearch: true,
  optionFilterProp: "label" as const,
  filterOption: true,
};

function toDayjs(value?: string | null) {
  return value ? dayjs(value) : null;
}

function toIsoString(value?: Dayjs | null) {
  return value ? value.toISOString() : null;
}

function mapFamilyValues(data: KaryawanDetail): FamilyInfoFormValues {
  const family: EmployeeFamilyData | null | undefined = data.family;

  return {
    family: {
      nama_pasangan: data.nama_pasangan ?? undefined,
      tanggal_lahir_pasangan: toDayjs(family?.tanggal_lahir_pasangan),
      pendidikan_terakhir_pasangan: family?.pendidikan_terakhir_pasangan ?? undefined,
      pekerjaan_pasangan: family?.pekerjaan_pasangan ?? data.pekerjaan_pasangan ?? undefined,
      keterangan_pasangan: family?.keterangan_pasangan ?? data.keterangan_pasangan ?? undefined,
      anak_ke: family?.anak_ke ?? data.anak_ke ?? null,
      jumlah_saudara_kandung: family?.jumlah_saudara_kandung ?? data.jumlah_saudara_kandung ?? null,
      nama_ayah_mertua: family?.nama_ayah_mertua ?? data.nama_ayah_mertua ?? undefined,
      tanggal_lahir_ayah_mertua: toDayjs(
        family?.tanggal_lahir_ayah_mertua ?? data.tanggal_lahir_ayah_mertua,
      ),
      pendidikan_terakhir_ayah_mertua:
        family?.pendidikan_terakhir_ayah_mertua ?? data.pendidikan_terakhir_ayah_mertua ?? undefined,
      keterangan_ayah_mertua: family?.keterangan_ayah_mertua ?? data.keterangan_ayah_mertua ?? undefined,
      nama_ibu_mertua: family?.nama_ibu_mertua ?? data.nama_ibu_mertua ?? undefined,
      tanggal_lahir_ibu_mertua: toDayjs(family?.tanggal_lahir_ibu_mertua ?? data.tanggal_lahir_ibu_mertua),
      pendidikan_terakhir_ibu_mertua:
        family?.pendidikan_terakhir_ibu_mertua ?? data.pendidikan_terakhir_ibu_mertua ?? undefined,
      keterangan_ibu_mertua: family?.keterangan_ibu_mertua ?? data.keterangan_ibu_mertua ?? undefined,
      jumlah_anak: family?.jumlah_anak ?? data.jumlah_anak ?? (data.children?.length ?? 0),
    },
    children: (data.children ?? []).map((child: EmployeeChildData) => ({
      nama_anak: child.nama_anak,
      jenis_kelamin: child.jenis_kelamin ?? undefined,
      tanggal_lahir: toDayjs(child.tanggal_lahir),
      keterangan: child.keterangan ?? undefined,
    })),
    siblings: (data.siblings ?? []).map((sibling: EmployeeSiblingData) => ({
      nama_saudara_kandung: sibling.nama_saudara_kandung,
      jenis_kelamin: sibling.jenis_kelamin ?? undefined,
      tanggal_lahir: toDayjs(sibling.tanggal_lahir),
      pendidikan_terakhir: sibling.pendidikan_terakhir ?? undefined,
      pekerjaan: sibling.pekerjaan ?? undefined,
      keterangan: sibling.keterangan ?? undefined,
    })),
  };
}

function FamilyInfoTab({ data, onSave, employeeId }: FamilyInfoTabProps) {
  const [form] = Form.useForm<FamilyInfoFormValues>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(mapFamilyValues(data));
  }, [data, form]);

  const children = Form.useWatch("children", form) ?? [];

  useEffect(() => {
    const currentCount = children.length;
    const currentJumlahAnak = form.getFieldValue(["family", "jumlah_anak"]);

    if (currentJumlahAnak !== currentCount) {
      form.setFieldValue(["family", "jumlah_anak"], currentCount);
    }
  }, [children, form]);

  const handleDiscard = () => {
    form.setFieldsValue(mapFamilyValues(data));
  };

  const handleSubmit = async (values: FamilyInfoFormValues) => {
    setIsSaving(true);

    try {
      const childCount = values.children?.length ?? 0;
      const jumlahAnak = values.family?.jumlah_anak ?? 0;

      if (childCount !== jumlahAnak) {
        message.error("Jumlah anak harus sama dengan jumlah entry identitas anak");
        return;
      }

      const payload = {
        family: {
          tanggal_lahir_pasangan: toIsoString(values.family?.tanggal_lahir_pasangan),
          pendidikan_terakhir_pasangan: values.family?.pendidikan_terakhir_pasangan,
          pekerjaan_pasangan: values.family?.pekerjaan_pasangan,
          jumlah_anak: values.family?.jumlah_anak ?? null,
          keterangan_pasangan: values.family?.keterangan_pasangan,
          anak_ke: values.family?.anak_ke ?? null,
          jumlah_saudara_kandung: values.family?.jumlah_saudara_kandung ?? null,
          nama_ayah_mertua: values.family?.nama_ayah_mertua,
          tanggal_lahir_ayah_mertua: toIsoString(values.family?.tanggal_lahir_ayah_mertua),
          pendidikan_terakhir_ayah_mertua: values.family?.pendidikan_terakhir_ayah_mertua,
          keterangan_ayah_mertua: values.family?.keterangan_ayah_mertua,
          nama_ibu_mertua: values.family?.nama_ibu_mertua,
          tanggal_lahir_ibu_mertua: toIsoString(values.family?.tanggal_lahir_ibu_mertua),
          pendidikan_terakhir_ibu_mertua: values.family?.pendidikan_terakhir_ibu_mertua,
          keterangan_ibu_mertua: values.family?.keterangan_ibu_mertua,
        },
        children: (values.children ?? [])
          .filter((child) => child.nama_anak)
          .map((child) => ({
            nama_anak: child.nama_anak as string,
            jenis_kelamin: child.jenis_kelamin,
            tanggal_lahir: toIsoString(child.tanggal_lahir),
            keterangan: child.keterangan,
          })),
        siblings: (values.siblings ?? [])
          .filter((sibling) => sibling.nama_saudara_kandung)
          .map((sibling) => ({
            nama_saudara_kandung: sibling.nama_saudara_kandung as string,
            jenis_kelamin: sibling.jenis_kelamin,
            tanggal_lahir: toIsoString(sibling.tanggal_lahir),
            pendidikan_terakhir: sibling.pendidikan_terakhir,
            pekerjaan: sibling.pekerjaan,
            keterangan: sibling.keterangan,
          })),
      };

      await api.patch(`/hr/karyawan/${employeeId}`, payload);
      message.success("Data keluarga karyawan berhasil disimpan");
      await onSave();
    } catch {
      message.error("Gagal menyimpan data keluarga karyawan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form<FamilyInfoFormValues>
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ family: {}, children: [], siblings: [] }}
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <HeartOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Informasi Pasangan</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Form.Item label="Nama Pasangan" name={["family", "nama_pasangan"]}>
                <Input placeholder="Nama pasangan mengikuti data referensi" readOnly disabled />
              </Form.Item>
              <Form.Item label="Tanggal Lahir Pasangan" name={["family", "tanggal_lahir_pasangan"]}>
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Pendidikan Terakhir Pasangan" name={["family", "pendidikan_terakhir_pasangan"]}>
                <Input placeholder="Masukkan pendidikan terakhir pasangan" />
              </Form.Item>
              <Form.Item label="Pekerjaan Pasangan" name={["family", "pekerjaan_pasangan"]}>
                <Input placeholder="Masukkan pekerjaan pasangan" />
              </Form.Item>
              <Form.Item label="Jumlah Anak" name={["family", "jumlah_anak"]}>
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Jumlah anak tersinkron otomatis"
                  readOnly
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Keterangan Pasangan"
                name={["family", "keterangan_pasangan"]}
                className="lg:col-span-2"
              >
                <Input.TextArea rows={4} placeholder="Masukkan keterangan pasangan" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <SmileOutlined className="text-primary" />
              <h3 className="text-sm font-bold">Data Anak</h3>
            </div>
            <span className="text-sm font-medium text-slate-500">{children.length} anak terdaftar</span>
          </div>
          <div className="p-5">
            <Form.List name="children">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.key} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-800">Anak {index + 1}</h4>
                        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                          Hapus
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Form.Item
                          label="Nama Anak"
                          name={[field.name, "nama_anak"]}
                          rules={[{ required: true, message: "Nama anak wajib diisi" }]}
                        >
                          <Input placeholder="Masukkan nama anak" />
                        </Form.Item>
                        <Form.Item label="Jenis Kelamin" name={[field.name, "jenis_kelamin"]}>
                          <Select
                            placeholder="Pilih jenis kelamin"
                            options={GENDER_OPTIONS}
                            {...SEARCHABLE_SELECT_PROPS}
                          />
                        </Form.Item>
                        <Form.Item label="Tanggal Lahir" name={[field.name, "tanggal_lahir"]}>
                          <DatePicker className="w-full" format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item label="Keterangan" name={[field.name, "keterangan"]} className="lg:col-span-2">
                          <Input.TextArea rows={3} placeholder="Masukkan keterangan anak" />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()} block>
                    Tambah Anak
                  </Button>
                </div>
              )}
            </Form.List>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <TeamOutlined className="text-primary" />
              <h3 className="text-sm font-bold">Saudara Kandung</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Form.Item label="Anak Ke" name={["family", "anak_ke"]}>
                  <InputNumber min={1} className="w-full" placeholder="Masukkan anak ke" />
                </Form.Item>
                <Form.Item label="Jumlah Saudara Kandung" name={["family", "jumlah_saudara_kandung"]}>
                  <InputNumber min={0} className="w-full" placeholder="Masukkan jumlah saudara kandung" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="flex items-center gap-2">
                <IdcardOutlined className="text-primary" />
                <h3 className="text-sm font-bold">Identitas Saudara Kandung</h3>
              </div>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const currentSiblings = form.getFieldValue("siblings") as FamilySiblingFormValue[] | undefined;
                  const siblingCount = currentSiblings?.length ?? 0;

                  return <span className="text-sm font-medium text-slate-500">{siblingCount} dari 5 terdaftar</span>;
                }}
              </Form.Item>
            </div>
            <div className="p-5">
              <Form.List name="siblings">
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.key} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-slate-800">Saudara Kandung {index + 1}</h4>
                          <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                            Hapus
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <Form.Item
                            label="Nama Saudara Kandung"
                            name={[field.name, "nama_saudara_kandung"]}
                            rules={[{ required: true, message: "Nama saudara kandung wajib diisi" }]}
                          >
                            <Input placeholder="Masukkan nama saudara kandung" />
                          </Form.Item>
                          <Form.Item label="Jenis Kelamin" name={[field.name, "jenis_kelamin"]}>
                            <Select
                              placeholder="Pilih jenis kelamin"
                              options={GENDER_OPTIONS}
                              {...SEARCHABLE_SELECT_PROPS}
                            />
                          </Form.Item>
                          <Form.Item label="Tanggal Lahir" name={[field.name, "tanggal_lahir"]}>
                            <DatePicker className="w-full" format="DD/MM/YYYY" />
                          </Form.Item>
                          <Form.Item label="Pendidikan Terakhir" name={[field.name, "pendidikan_terakhir"]}>
                            <Input placeholder="Masukkan pendidikan terakhir" />
                          </Form.Item>
                          <Form.Item label="Pekerjaan" name={[field.name, "pekerjaan"]}>
                            <Input placeholder="Masukkan pekerjaan" />
                          </Form.Item>
                          <Form.Item label="Keterangan" name={[field.name, "keterangan"]} className="lg:col-span-2">
                            <Input.TextArea rows={3} placeholder="Masukkan keterangan saudara kandung" />
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const currentSiblings = form.getFieldValue("siblings") as FamilySiblingFormValue[] | undefined;
                        const siblingCount = currentSiblings?.length ?? 0;

                        return (
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()}
                            block
                            disabled={siblingCount >= 5}
                          >
                            Tambah Saudara Kandung
                          </Button>
                        );
                      }}
                    </Form.Item>
                  </div>
                )}
              </Form.List>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <HomeOutlined className="text-primary" />
            <h3 className="text-sm font-bold">Data Mertua</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 border-l-4 border-primary pl-3">
                  <h4 className="text-sm font-bold text-slate-800">Ayah Mertua</h4>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Form.Item label="Nama Ayah Mertua" name={["family", "nama_ayah_mertua"]}>
                    <Input placeholder="Masukkan nama ayah mertua" />
                  </Form.Item>
                  <Form.Item label="Tanggal Lahir Ayah Mertua" name={["family", "tanggal_lahir_ayah_mertua"]}>
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                  </Form.Item>
                  <Form.Item
                    label="Pendidikan Terakhir Ayah Mertua"
                    name={["family", "pendidikan_terakhir_ayah_mertua"]}
                  >
                    <Input placeholder="Masukkan pendidikan terakhir ayah mertua" />
                  </Form.Item>
                  <Form.Item
                    label="Keterangan Ayah Mertua"
                    name={["family", "keterangan_ayah_mertua"]}
                    className="lg:col-span-2"
                  >
                    <Input.TextArea rows={3} placeholder="Masukkan keterangan ayah mertua" />
                  </Form.Item>
                </div>
              </div>

              <div>
                <div className="mb-4 border-l-4 border-primary pl-3">
                  <h4 className="text-sm font-bold text-slate-800">Ibu Mertua</h4>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Form.Item label="Nama Ibu Mertua" name={["family", "nama_ibu_mertua"]}>
                    <Input placeholder="Masukkan nama ibu mertua" />
                  </Form.Item>
                  <Form.Item label="Tanggal Lahir Ibu Mertua" name={["family", "tanggal_lahir_ibu_mertua"]}>
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                  </Form.Item>
                  <Form.Item
                    label="Pendidikan Terakhir Ibu Mertua"
                    name={["family", "pendidikan_terakhir_ibu_mertua"]}
                  >
                    <Input placeholder="Masukkan pendidikan terakhir ibu mertua" />
                  </Form.Item>
                  <Form.Item
                    label="Keterangan Ibu Mertua"
                    name={["family", "keterangan_ibu_mertua"]}
                    className="lg:col-span-2"
                  >
                    <Input.TextArea rows={3} placeholder="Masukkan keterangan ibu mertua" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <button
          type="button"
          onClick={handleDiscard}
          className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          Discard
        </button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSaving}
          className="!rounded-lg !border !border-primary !bg-primary !px-8 !font-semibold !text-white !shadow-md hover:!brightness-95"
        >
          Simpan
        </Button>
      </div>
    </Form>
  );
}

export default FamilyInfoTab;
