import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  ColorPicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Typography,
  type FormInstance,
  type FormItemProps,
  type TableProps,
} from "antd";
import { useEffect } from "react";
import type { ReactNode } from "react";
import type {
  MasterDataBaseItem,
  MasterDataStatus,
  PaginationMeta,
} from "../hooks/useMasterData";

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

export type MasterDataFormFieldOption = {
  label: string;
  value: string;
};

export type MasterDataFormField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "color";
  placeholder?: string;
  rules?: FormItemProps["rules"];
  options?: MasterDataFormFieldOption[];
  extra?: ReactNode;
  colSpan?: number;
  readOnly?: boolean;
  disabled?: boolean;
  normalize?: (value: unknown) => unknown;
  selectProps?: {
    loading?: boolean;
    showSearch?: boolean;
    filterOption?: boolean;
    optionFilterProp?: string;
    disabled?: boolean;
  };
};

export type MasterDataPageProps<
  TItem extends MasterDataBaseItem,
  TFormValues extends Record<string, unknown>,
> = {
  title: string;
  description: string;
  entityName: string;
  searchPlaceholder: string;
  form: FormInstance<TFormValues>;
  fields: MasterDataFormField[];
  columns: TableProps<TItem>["columns"];
  items: TItem[];
  meta: PaginationMeta;
  isLoading: boolean;
  isSubmitting: boolean;
  isModalOpen: boolean;
  editingItem: TItem | null;
  initialValues: TFormValues;
  searchValue: string;
  statusValue?: MasterDataStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value?: MasterDataStatus) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onCreate: () => void;
  onEdit: (item: TItem) => void;
  onToggleStatus: (item: TItem) => void;
  onCloseModal: () => void;
  onSubmit: (values: TFormValues) => Promise<boolean>;
};

const STATUS_OPTIONS: Array<{ label: string; value: MasterDataStatus }> = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

type HexColorValue =
  | string
  | {
    toHexString: () => string;
  }
  | null
  | undefined;

function normalizeHexColor(value: HexColorValue) {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  return value.toHexString();
}

function renderField(field: MasterDataFormField) {
  switch (field.type) {
    case "textarea":
      return <TextArea rows={4} placeholder={field.placeholder} disabled={field.disabled} readOnly={field.readOnly} />;
    case "select":
      return (
        <Select
          placeholder={field.placeholder}
          options={field.options}
          allowClear
          showSearch={field.selectProps?.showSearch}
          filterOption={field.selectProps?.filterOption}
          optionFilterProp={field.selectProps?.optionFilterProp}
          loading={field.selectProps?.loading}
          disabled={field.selectProps?.disabled ?? field.disabled}
        />
      );
    case "color":
      return (
        <ColorPicker
          className="w-full"
          showText={(color) => normalizeHexColor(color) ?? field.placeholder ?? "Pilih warna"}
          format="hex"
          disabled={field.disabled}
        />
      );
    case "text":
    default:
      return <Input placeholder={field.placeholder} disabled={field.disabled} readOnly={field.readOnly} />;
  }
}

function MasterDataPage<
  TItem extends MasterDataBaseItem,
  TFormValues extends Record<string, unknown>,
>({
  title,
  description,
  entityName,
  searchPlaceholder,
  form,
  fields,
  columns,
  items,
  meta,
  isLoading,
  isSubmitting,
  isModalOpen,
  editingItem,
  initialValues,
  searchValue,
  statusValue,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onCreate,
  onEdit,
  onToggleStatus,
  onCloseModal,
  onSubmit,
}: MasterDataPageProps<TItem, TFormValues>) {
  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue(initialValues as Parameters<typeof form.setFieldsValue>[0]);
      return;
    }

    form.resetFields();
  }, [form, initialValues, isModalOpen]);

  const actionColumn: NonNullable<TableProps<TItem>["columns"]>[number] = {
    title: "Aksi",
    key: "actions",
    width: 260,
    render: (_, record) => (
      <div className="flex justify-end items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(record)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(record)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-slate-900 border border-primary/20 hover:bg-primary transition-all font-bold text-xs"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Edit
        </button>
      </div>
    ),
  };

  const mergedColumns: TableProps<TItem>["columns"] = [
    ...(columns ?? []),
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 220,
      render: (value: MasterDataStatus) => {
        const isActive = value === "Aktif";

        return (
          <span
            className={[
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase",
              isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-green-500" : "bg-slate-400",
              ].join(" ")}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    actionColumn,
  ];

  const codeFieldPlaceholder = editingItem ? undefined : "Kode akan dibuat otomatis saat data disimpan";

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
              <span>Human Resources</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Master Data</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">{entityName}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
            <p className="text-slate-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Tambah {entityName}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} xl={16}>
              <Space wrap size={12} className="w-full">
                <Input.Search
                  allowClear
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  className="w-full min-w-[280px] sm:w-[320px]"
                />
                <Select
                  allowClear
                  placeholder="Filter status"
                  value={statusValue}
                  options={STATUS_OPTIONS}
                  onChange={(value) => onStatusChange(value)}
                  className="w-full sm:w-[180px]"
                />
              </Space>
            </Col>
          </Row>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table<TItem>
            rowKey="id"
            loading={isLoading}
            columns={mergedColumns}
            dataSource={items}
            scroll={{ x: 960 }}
            className="master-data-table [&_.ant-table]:!rounded-none [&_.ant-table-container]:!border-0 [&_.ant-table-thead>tr>th]:!bg-slate-50 [&_.ant-table-thead>tr>th]:!border-b [&_.ant-table-thead>tr>th]:!border-slate-200 [&_.ant-table-thead>tr>th]:!px-6 [&_.ant-table-thead>tr>th]:!py-4 [&_.ant-table-thead>tr>th]:!text-xs [&_.ant-table-thead>tr>th]:!font-bold [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!tracking-wider [&_.ant-table-thead>tr>th]:!text-slate-500 [&_.ant-table-tbody>tr>td]:!px-6 [&_.ant-table-tbody>tr>td]:!py-6 [&_.ant-table-tbody>tr>td]:!font-semibold [&_.ant-table-tbody>tr>td]:!text-slate-900 [&_.ant-table-tbody>tr>td]:!border-b [&_.ant-table-tbody>tr>td]:!border-slate-100 [&_.ant-table-tbody>tr:hover>td]:!bg-slate-50 transition-colors"
            pagination={{
              current: meta.page,
              pageSize: meta.limit,
              total: meta.total,
              showSizeChanger: true,
              className: "!px-6 !py-4",
              showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data`,
              onChange: onPageChange,
            }}
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title={editingItem ? `Edit ${entityName}` : `Tambah ${entityName}`}
        onCancel={onCloseModal}
        okText={editingItem ? "Simpan Perubahan" : "Simpan"}
        cancelText="Batal"
        confirmLoading={isSubmitting}
        forceRender
        okButtonProps={{
          className:
            "!inline-flex !h-11 !items-center !justify-center !rounded-xl !border !border-[#d4a63a] !bg-[#f2c94c] !px-5 !font-bold !text-slate-900 !shadow-none hover:!border-[#c79824] hover:!bg-[#e6bc38] focus:!border-[#c79824] focus:!bg-[#e6bc38]",
        }}
        cancelButtonProps={{
          className:
            "!inline-flex !h-11 !items-center !justify-center !rounded-xl !border !border-slate-200 !bg-white !px-5 !font-semibold !text-slate-600 !shadow-none hover:!border-slate-300 hover:!bg-slate-50 hover:!text-slate-800 focus:!border-slate-300 focus:!bg-slate-50",
        }}
        destroyOnHidden
        width={760}
        classNames={{
          content: "!rounded-2xl",
          header: "!border-b !border-slate-200 !px-6 !py-5",
          body: "!px-6 !pb-6 !pt-2",
          footer: "!border-t !border-slate-200 !px-6 !py-4",
        }}
        onOk={() => {
          void form.submit();
        }}
      >
        <Form<TFormValues>
          className="mt-4"
          layout="vertical"
          form={form}
          initialValues={initialValues}
          onFinish={(values) => {
            const normalizedValues = Object.fromEntries(
              Object.entries(values).map(([key, value]) => [
                key,
                key === "warna_tag" ? normalizeHexColor(value as HexColorValue) ?? "" : value,
              ]),
            ) as TFormValues;

            void onSubmit(normalizedValues);
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Kode">
                <Input
                  value={editingItem?.code ?? ""}
                  readOnly
                  disabled
                  placeholder={codeFieldPlaceholder}
                />
              </Form.Item>
            </Col>
            {fields.map((field) => (
              <Col key={field.name} xs={24} md={field.colSpan === 12 ? 12 : 24}>
                <Form.Item<TFormValues>
                  name={field.name as never}
                  label={field.label}
                  rules={field.rules}
                  extra={field.extra}
                  normalize={field.normalize}
                >
                  {renderField(field)}
                </Form.Item>
              </Col>
            ))}
            {editingItem ? (
              <Col xs={24}>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <Text className="!text-xs !font-bold !uppercase !tracking-[0.18em] !text-slate-500">
                        Manajemen Status
                      </Text>
                      <div className="flex flex-wrap items-center gap-2">
                        <Text className="!mb-0 !text-sm !font-medium !text-slate-600">Status saat ini</Text>
                        <span
                          className={[
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-tight",
                            editingItem.status === "Aktif"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "h-2 w-2 rounded-full",
                              editingItem.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400",
                            ].join(" ")}
                          />
                          {editingItem.status === "Aktif" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <Text className="!text-sm !text-slate-500">
                        Ubah status data dari panel edit ini tanpa menambahkan kontrol langsung pada baris tabel.
                      </Text>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(editingItem)}
                      className={[
                        "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border bg-white px-4 text-sm font-semibold transition-colors",
                        editingItem.status === "Aktif"
                          ? "border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                          : "border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50",
                      ].join(" ")}
                    >
                      {editingItem.status === "Aktif" ? (
                        <StopOutlined className="text-[12px]" />
                      ) : (
                        <CheckCircleOutlined className="text-[12px]" />
                      )}
                      {editingItem.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </div>
                </div>
              </Col>
            ) : null}
          </Row>
        </Form>
      </Modal>
    </Space>
  );
}

export default MasterDataPage;
