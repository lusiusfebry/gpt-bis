import {
  CheckCircleOutlined,
  CloudDownloadOutlined,
  InboxOutlined,
  ReloadOutlined,
  TeamOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Popconfirm,
  Result,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
  Upload,
  type GetProp,
  type TableProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useImport,
  type ImportExecuteResult,
  type ImportValidationIssue,
  type ImportValidationResult,
} from "../hooks/useImport";

const { Dragger } = Upload;
const { Paragraph, Text, Title } = Typography;

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildValidationColumns(): TableProps<ImportValidationIssue>["columns"] {
  return [
    {
      title: "Baris",
      dataIndex: "row",
      key: "row",
      width: 100,
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: 220,
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Pesan",
      dataIndex: "message",
      key: "message",
    },
  ];
}

function buildResultColumns(): TableProps<{ employeeId: string }>["columns"] {
  return [
    {
      title: "No",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "ID Karyawan",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (value: string) => <Text code>{value}</Text>,
    },
  ];
}

function ValidationSummary({ validationResult }: { validationResult: ImportValidationResult }) {
  return (
    <Descriptions bordered size="small" column={{ xs: 1, lg: 2 }}>
      <Descriptions.Item label="Nama File">{validationResult.filename}</Descriptions.Item>
      <Descriptions.Item label="Session ID">
        <Text code>{validationResult.sessionId}</Text>
      </Descriptions.Item>
      <Descriptions.Item label="Total Baris">
        {validationResult.totalRows}
      </Descriptions.Item>
      <Descriptions.Item label="Baris Valid">
        <Tag color="green">{validationResult.validRows}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Baris Invalid">
        <Tag color={validationResult.invalidRows > 0 ? "red" : "green"}>
          {validationResult.invalidRows}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Berlaku Sampai">
        {formatDateTime(validationResult.expiresAt)}
      </Descriptions.Item>
    </Descriptions>
  );
}

function ImportSummary({ importResult }: { importResult: ImportExecuteResult }) {
  return (
    <Descriptions bordered size="small" column={{ xs: 1, lg: 2 }}>
      <Descriptions.Item label="Session ID">
        <Text code>{importResult.sessionId}</Text>
      </Descriptions.Item>
      <Descriptions.Item label="Baris Berhasil Diimport">
        <Tag color="green">{importResult.importedRows}</Tag>
      </Descriptions.Item>
    </Descriptions>
  );
}

function ImportPage() {
  const {
    currentStep,
    isValidating,
    isExecuting,
    validationResult,
    importResult,
    file,
    validateFile,
    executeImport,
    downloadTemplate,
    reset,
  } = useImport();

  const validationColumns = useMemo(() => buildValidationColumns(), []);
  const resultColumns = useMemo(() => buildResultColumns(), []);

  const uploadedFileList: UploadFile[] = file
    ? [
        {
          uid: file.name,
          name: file.name,
          status: validationResult ? "done" : "uploading",
        },
      ]
    : [];

  const uploadProps: UploadProps = {
    accept: ".xlsx",
    maxCount: 1,
    multiple: false,
    fileList: uploadedFileList,
    beforeUpload: (selectedFile) => {
      void validateFile(selectedFile as File);
      return false;
    },
    onRemove: () => {
      reset();
    },
  };

  const hasValidationIssues = (validationResult?.issues.length ?? 0) > 0;
  const canExecuteImport = Boolean(validationResult && validationResult.validRows > 0 && !hasValidationIssues);

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-2xl shadow-slate-950/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Space direction="vertical" size={14} className="w-full">
            <Text className="uppercase tracking-[0.3em] !text-teal-300">Human Resources</Text>
            <Title level={2} className="!mb-0 !text-white">
              Import Data Karyawan
            </Title>
            <Paragraph className="!mb-0 !text-slate-300">
              Unggah file Excel, tinjau hasil validasi, lalu jalankan proses import karyawan secara
              bertahap dan aman.
            </Paragraph>
          </Space>

          <Button
            size="large"
            icon={<CloudDownloadOutlined />}
            onClick={() => void downloadTemplate()}
            className="border-white/20 bg-white/10 !text-white hover:!border-white/40 hover:!bg-white/15"
          >
            Download Template
          </Button>
        </div>
      </Card>

      <Card className="rounded-3xl shadow-panel">
        <Steps
          current={currentStep}
          items={[
            {
              title: "Upload File",
              description: "Pilih file Excel karyawan",
              icon: <UploadOutlined />,
            },
            {
              title: "Validasi",
              description: "Tinjau hasil pengecekan data",
              icon: <CheckCircleOutlined />,
            },
            {
              title: "Hasil Import",
              description: "Lihat hasil eksekusi import",
              icon: <TeamOutlined />,
            },
          ]}
        />
      </Card>

      <Card className="rounded-3xl shadow-panel">
        {currentStep === 0 && (
          <Space direction="vertical" size={20} className="flex w-full">
            <div>
              <Title level={4} className="!mb-2">
                Upload File Import
              </Title>
              <Text type="secondary">
                Gunakan template resmi agar mapping kolom sesuai dengan format backend.
              </Text>
            </div>

            <Dragger {...uploadProps} disabled={isValidating} className="rounded-2xl !p-6">
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-4xl !text-teal-600" />
              </p>
              <p className="ant-upload-text">Klik atau tarik file Excel ke area ini</p>
              <p className="ant-upload-hint">
                Hanya file <Text code>.xlsx</Text> yang didukung. File akan divalidasi sebelum proses
                import dijalankan.
              </p>
            </Dragger>
          </Space>
        )}

        {currentStep === 1 && validationResult && (
          <Space direction="vertical" size={20} className="flex w-full">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Title level={4} className="!mb-2">
                  Hasil Validasi File
                </Title>
                <Text type="secondary">
                  Pastikan seluruh data valid sebelum menjalankan import ke daftar karyawan.
                </Text>
              </div>

              <Space wrap>
                <Button onClick={reset}>Ganti File</Button>
                <Popconfirm
                  title="Jalankan import karyawan?"
                  description="Data valid akan diproses ke sistem dan tidak dapat dibatalkan dari halaman ini."
                  okText="Ya, import"
                  cancelText="Batal"
                  onConfirm={() => void executeImport()}
                  disabled={!canExecuteImport}
                >
                  <Button type="primary" loading={isExecuting} disabled={!canExecuteImport}>
                    Import Karyawan
                  </Button>
                </Popconfirm>
              </Space>
            </div>

            <ValidationSummary validationResult={validationResult} />

            {hasValidationIssues ? (
              <Alert
                type="error"
                showIcon
                message="Masih ada error validasi"
                description="Perbaiki file Excel sesuai detail error berikut, lalu unggah ulang file untuk memvalidasi kembali."
              />
            ) : (
              <Alert
                type="success"
                showIcon
                message="File siap diimport"
                description="Seluruh baris valid. Anda dapat melanjutkan ke proses import."
              />
            )}

            <div>
              <Title level={5} className="!mb-3">
                Preview Validasi
              </Title>
              <Table<ImportValidationIssue>
                rowKey={(record, index) => `${record.row}-${record.field}-${index}`}
                columns={validationColumns}
                dataSource={validationResult.issues}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                locale={{ emptyText: "Tidak ada error validasi" }}
                scroll={{ x: 720 }}
              />
            </div>
          </Space>
        )}

        {currentStep === 2 && importResult && (
          <Space direction="vertical" size={20} className="flex w-full">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Title level={4} className="!mb-2">
                  Hasil Import Karyawan
                </Title>
                <Text type="secondary">
                  Proses import selesai dan data yang berhasil dibuat dirangkum di bawah ini.
                </Text>
              </div>

              <Space wrap>
                <Button icon={<ReloadOutlined />} onClick={reset}>
                  Import Ulang
                </Button>
                <Link to="/hr/karyawan">
                  <Button type="primary">Ke Daftar Karyawan</Button>
                </Link>
              </Space>
            </div>

            <Result
              status="success"
              title="Import karyawan berhasil dijalankan"
              subTitle={`${importResult.importedRows} baris data berhasil diproses ke sistem.`}
            />

            <ImportSummary importResult={importResult} />

            <div>
              <Title level={5} className="!mb-3">
                Detail Data Terbuat
              </Title>
              <Table<{ employeeId: string }>
                rowKey="employeeId"
                columns={resultColumns}
                dataSource={importResult.employeeIds.map((employeeId) => ({ employeeId }))}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                locale={{ emptyText: "Tidak ada detail hasil import" }}
                scroll={{ x: 520 }}
              />
            </div>
          </Space>
        )}
      </Card>
    </Space>
  );
}

export default ImportPage;
