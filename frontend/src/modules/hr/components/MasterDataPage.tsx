import {
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
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

function getStatusTagColor(status: MasterDataStatus) {
  return status === "Aktif" ? "success" : "default";
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
    width: 180,
    render: (_, record) => {
      const isActive = record.status === "Aktif";

      return (
        <Space wrap>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button
            icon={isActive ? <StopOutlined /> : <CheckCircleOutlined />}
            danger={isActive}
            onClick={() => onToggleStatus(record)}
          >
            {isActive ? "Nonaktifkan" : "Aktifkan"}
          </Button>
        </Space>
      );
    },
  };

  const mergedColumns: TableProps<TItem>["columns"] = [
    ...(columns ?? []),
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: MasterDataStatus) => <Tag color={getStatusTagColor(value)}>{value}</Tag>,
    },
    actionColumn,
  ];

  const codeFieldPlaceholder = editingItem ? undefined : "Kode akan dibuat otomatis saat data disimpan";

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-3xl border-0 bg-slate-950 text-white shadow-2xl shadow-slate-950/10">
        <Space direction="vertical" size={12} className="w-full">
          <Text className="uppercase tracking-[0.28em] !text-teal-300">Human Resources</Text>
          <Title level={2} className="!mb-0 !text-white">
            {title}
          </Title>
          <Paragraph className="!mb-0 !text-slate-300">{description}</Paragraph>
        </Space>
      </Card>

      <Card className="rounded-3xl shadow-panel">
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
          <Col xs={24} xl={8}>
            <div className="flex justify-start xl:justify-end">
              <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                Tambah {entityName}
              </Button>
            </div>
          </Col>
        </Row>

        <Table<TItem>
          rowKey="id"
          loading={isLoading}
          columns={mergedColumns}
          dataSource={items}
          scroll={{ x: 960 }}
          className="mt-6"
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data`,
            onChange: onPageChange,
          }}
        />
      </Card>

      <Modal
        open={isModalOpen}
        title={editingItem ? `Edit ${entityName}` : `Tambah ${entityName}`}
        onCancel={onCloseModal}
        okText={editingItem ? "Simpan Perubahan" : "Simpan"}
        cancelText="Batal"
        confirmLoading={isSubmitting}
        destroyOnHidden
        width={760}
        onOk={() => {
          void form.submit();
        }}
      >
        <Form<TFormValues>
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
                >
                  {renderField(field)}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </Space>
  );
}

export default MasterDataPage;
