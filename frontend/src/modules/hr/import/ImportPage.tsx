import {
  CheckCircleOutlined,
  CloudDownloadOutlined,
  EyeOutlined,
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
  Empty,
  List,
  Popconfirm,
  Result,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
  Upload,
  type TableProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useImport,
  type ImportExecuteResult,
  type ImportPreviewResult,
  type ImportValidationResult,
} from "../hooks/useImport";

const { Dragger } = Upload;
const { Paragraph, Text, Title } = Typography;

type KeyValueRow = {
  key: string;
  value: unknown;
};

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

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return <Text type="secondary">-</Text>;
  }

  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak";
  }

  if (Array.isArray(value)) {
    return value.length ? JSON.stringify(value) : <Text type="secondary">-</Text>;
  }

  if (typeof value === "object") {
    return <Text className="break-all">{JSON.stringify(value)}</Text>;
  }

  return <Text className="break-all">{String(value)}</Text>;
}

function buildPreviewColumns(): TableProps<ImportPreviewResult["rows"][number]>["columns"] {
  return [
    {
      title: "Baris",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 96,
      fixed: "left",
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      title: "Jumlah Kolom Terisi",
      key: "filledColumns",
      width: 160,
      render: (_, record) => Object.values(record.data).filter((value) => value !== null && value !== undefined && value !== "").length,
    },
    {
      title: "Preview Data",
      key: "previewData",
      render: (_, record) => {
        const entries = Object.entries(record.data).filter(([, value]) => value !== null && value !== undefined && value !== "");

        if (!entries.length) {
          return <Text type="secondary">Tidak ada data</Text>;
        }

        return (
          <div className="flex flex-wrap gap-2">
            {entries.slice(0, 8).map(([field, value]) => (
              <Tag key={field} className="max-w-full !py-1">
                <span className="font-medium">{field}:</span> {String(value)}
              </Tag>
            ))}
            {entries.length > 8 && <Tag>+{entries.length - 8} kolom lain</Tag>}
          </div>
        );
      },
    },
  ];
}

function buildValidationColumns(): TableProps<ImportValidationResult["rows"][number]>["columns"] {
  return [
    {
      title: "Baris",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 88,
      fixed: "left",
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: ImportValidationResult["rows"][number]["status"]) => (
        <Tag color={value === "valid" ? "green" : "red"}>{value === "valid" ? "Valid" : "Error"}</Tag>
      ),
    },
    {
      title: "NIK",
      key: "nomor_induk_karyawan",
      width: 160,
      render: (_, record) => formatCellValue(record.rawData.nomor_induk_karyawan),
    },
    {
      title: "Nama Karyawan",
      key: "nama_lengkap",
      width: 220,
      render: (_, record) => formatCellValue(record.rawData.nama_lengkap),
    },
    {
      title: "Error per Row / Cell",
      key: "errors",
      render: (_, record) => {
        if (!record.errors.length) {
          return <Text type="success">Tidak ada error</Text>;
        }

        return (
          <List
            size="small"
            split={false}
            dataSource={record.errors}
            renderItem={(error, index) => (
              <List.Item className="!px-0 !py-1">
                <Space size={8} align="start" wrap>
                  <Tag color="red">{error.field || `error-${index + 1}`}</Tag>
                  <Text>{error.message}</Text>
                </Space>
              </List.Item>
            )}
          />
        );
      },
    },
  ];
}

function buildResultColumns(): TableProps<ImportExecuteResult["details"][number]>["columns"] {
  return [
    {
      title: "Baris",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 88,
      fixed: "left",
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: ImportExecuteResult["details"][number]["status"]) => (
        <Tag color={value === "success" ? "green" : "red"}>
          {value === "success" ? "Berhasil" : "Gagal"}
        </Tag>
      ),
    },
    {
      title: "NIK",
      key: "nomor_induk_karyawan",
      width: 160,
      render: (_, record) => formatCellValue(record.nomor_induk_karyawan ?? record.rawData.nomor_induk_karyawan),
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 180,
      render: (value?: string) => (value ? <Text code>{value}</Text> : <Text type="secondary">-</Text>),
    },
    {
      title: "Keterangan",
      key: "message",
      render: (_, record) => {
        if (record.status === "success") {
          return <Text>{record.message ?? "Baris berhasil diimport"}</Text>;
        }

        return (
          <Space direction="vertical" size={8} className="flex">
            <Text>{record.message ?? "Baris gagal diproses"}</Text>
            {record.errors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {record.errors.map((error, index) => (
                  <Tag key={`${record.rowNumber}-${error.field}-${index}`} color="red">
                    {error.field}: {error.message}
                  </Tag>
                ))}
              </div>
            )}
          </Space>
        );
      },
    },
  ];
}

function buildDataEntries(data?: Record<string, unknown>): KeyValueRow[] {
  if (!data) {
    return [];
  }

  return Object.entries(data).map(([key, value]) => ({ key, value }));
}

function PreviewSummary({ previewResult }: { previewResult: ImportPreviewResult }) {
  return (
    <Descriptions bordered size="small" column={{ xs: 1, lg: 2 }}>
      <Descriptions.Item label="Nama File">{previewResult.filename}</Descriptions.Item>
      <Descriptions.Item label="Total Preview Row">{previewResult.totalRows}</Descriptions.Item>
    </Descriptions>
  );
}

function ValidationSummary({ validationResult }: { validationResult: ImportValidationResult }) {
  return (
    <Descriptions bordered size="small" column={{ xs: 1, lg: 2 }}>
      <Descriptions.Item label="Nama File">{validationResult.filename}</Descriptions.Item>
      <Descriptions.Item label="Session ID">
        <Text code>{validationResult.sessionId}</Text>
      </Descriptions.Item>
      <Descriptions.Item label="Total Baris">{validationResult.totalRows}</Descriptions.Item>
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
      <Descriptions.Item label="Total Diproses">{importResult.processed}</Descriptions.Item>
      <Descriptions.Item label="Berhasil">
        <Tag color="green">{importResult.success}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Gagal">
        <Tag color={importResult.failed > 0 ? "red" : "green"}>{importResult.failed}</Tag>
      </Descriptions.Item>
    </Descriptions>
  );
}

function ImportPage() {
  const {
    currentStep,
    isUploadingPreview,
    isValidating,
    isExecuting,
    previewResult,
    validationResult,
    importResult,
    file,
    selectFile,
    uploadPreview,
    validateImport,
    executeImport,
    downloadTemplate,
    reset,
  } = useImport();

  const previewColumns = useMemo(() => buildPreviewColumns(), []);
  const validationColumns = useMemo(() => buildValidationColumns(), []);
  const resultColumns = useMemo(() => buildResultColumns(), []);

  const previewRawEntries = useMemo(
    () => buildDataEntries(previewResult?.rows[0]?.data),
    [previewResult],
  );
  const validationRawEntries = useMemo(
    () => buildDataEntries(validationResult?.rows[0]?.rawData),
    [validationResult],
  );
  const validationNormalizedEntries = useMemo(
    () => buildDataEntries(validationResult?.rows[0]?.normalizedData),
    [validationResult],
  );
  const successfulResults = useMemo(
    () => importResult?.details.filter((detail) => detail.status === "success") ?? [],
    [importResult],
  );
  const failedResults = useMemo(
    () => importResult?.details.filter((detail) => detail.status === "failed") ?? [],
    [importResult],
  );

  const uploadedFileList: UploadFile[] = file
    ? [
        {
          uid: file.name,
          name: file.name,
          status: "done",
        },
      ]
    : [];

  const uploadProps: UploadProps = {
    accept: ".xlsx",
    maxCount: 1,
    multiple: false,
    fileList: uploadedFileList,
    beforeUpload: (selectedFile) => {
      selectFile(selectedFile as File);
      return false;
    },
    onRemove: () => {
      reset();
    },
  };

  const hasPreview = Boolean(previewResult);
  const hasValidationIssues = (validationResult?.issues.length ?? 0) > 0;
  const canPreview = Boolean(file) && !isUploadingPreview && !isValidating;
  const canValidate = Boolean(file) && hasPreview && !isUploadingPreview && !isValidating;
  const canExecuteImport = Boolean(
    validationResult && validationResult.validRows > 0 && !hasValidationIssues,
  );

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Space direction="vertical" size={14} className="w-full">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">Human Resources</Text>
            <Title level={2} className="!mb-0">
              Import Data Karyawan
            </Title>
            <Paragraph className="!mb-0 !text-slate-500">
              Pilih file Excel, tampilkan preview upload, lanjutkan validasi, lalu jalankan execute import
              secara terpisah agar setiap tahap dapat ditinjau dengan aman.
            </Paragraph>
          </Space>

          <Button
            size="large"
            icon={<CloudDownloadOutlined />}
            onClick={() => void downloadTemplate()}
            className="!border-primary !bg-primary !font-bold !text-slate-900 hover:!brightness-95"
          >
            Download Template
          </Button>
        </div>
      </Card>

      <Card className="rounded-xl border border-slate-200 bg-white">
        <Steps
          current={currentStep}
          items={[
            {
              title: "Upload & Preview",
              description: "Pilih file lalu tampilkan preview data",
              icon: <UploadOutlined />,
            },
            {
              title: "Validasi",
              description: "Tinjau status row dan detail error",
              icon: <CheckCircleOutlined />,
            },
            {
              title: "Hasil Execute",
              description: "Lihat breakdown berhasil dan gagal",
              icon: <TeamOutlined />,
            },
          ]}
        />
      </Card>

      <Card className="rounded-xl border border-slate-200 bg-white">
        {currentStep === 0 && (
          <Space direction="vertical" size={20} className="flex w-full">
            <div>
              <Title level={4} className="!mb-2">
                Upload File Import
              </Title>
              <Text type="secondary">
                Pemilihan file terpisah dari preview dan validasi. Setelah file dipilih, jalankan preview
                upload terlebih dahulu untuk melihat data mentah yang terbaca.
              </Text>
            </div>

            <Dragger
              {...uploadProps}
              disabled={isUploadingPreview || isValidating || isExecuting}
              className="!rounded-xl !p-6"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-4xl !text-primary" />
              </p>
              <p className="ant-upload-text">Klik atau tarik file Excel ke area ini</p>
              <p className="ant-upload-hint">
                Hanya file <Text code>.xlsx</Text> yang didukung. File tidak akan langsung divalidasi saat
                dipilih.
              </p>
            </Dragger>

            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
              <Space direction="vertical" size={4}>
                <Text strong>File terpilih</Text>
                <Text type="secondary">{file ? file.name : "Belum ada file dipilih"}</Text>
              </Space>

              <Space wrap>
                <Button onClick={reset} disabled={!file && !previewResult}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => void uploadPreview()}
                  loading={isUploadingPreview}
                  disabled={!canPreview}
                >
                  Upload & Preview
                </Button>
                <Button onClick={() => void validateImport()} loading={isValidating} disabled={!canValidate}>
                  Lanjut ke Validasi
                </Button>
              </Space>
            </div>

            {previewResult ? (
              <>
                <Alert
                  type="info"
                  showIcon
                  message="Preview upload berhasil dimuat"
                  description="Tahap ini hanya menampilkan data hasil upload. Validasi final belum dijalankan sampai Anda menekan tombol validasi."
                />

                <PreviewSummary previewResult={previewResult} />

                <Card size="small" className="rounded-xl border border-slate-200 bg-slate-50">
                  <Space direction="vertical" size={12} className="flex">
                    <Text strong>Contoh isi row pertama</Text>
                    {previewRawEntries.length ? (
                      <Descriptions bordered size="small" column={1}>
                        {previewRawEntries.slice(0, 10).map((entry) => (
                          <Descriptions.Item key={entry.key} label={entry.key}>
                            {formatCellValue(entry.value)}
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Preview row pertama kosong" />
                    )}
                  </Space>
                </Card>

                <div>
                  <Title level={5} className="!mb-3">
                    Preview Rows
                  </Title>
                  <Table<ImportPreviewResult["rows"][number]>
                    rowKey={(record) => `${record.rowNumber}`}
                    columns={previewColumns}
                    dataSource={previewResult.rows}
                    pagination={{ pageSize: 10, hideOnSinglePage: true }}
                    locale={{ emptyText: "Tidak ada row pada preview upload" }}
                    scroll={{ x: 900 }}
                  />
                </div>
              </>
            ) : (
              <Alert
                type="warning"
                showIcon
                message="Preview belum tersedia"
                description="Pilih file, lalu klik Upload & Preview untuk menampilkan stage pertama wizard sebagai preview data hasil upload."
              />
            )}
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
                  Tahap ini menampilkan status setiap row, detail error per-row/per-cell, dan data yang
                  sudah dinormalisasi saat memungkinkan.
                </Text>
              </div>

              <Space wrap>
                <Button onClick={reset}>Ganti File</Button>
                <Button onClick={() => setTimeout(() => void uploadPreview(), 0)} disabled={isUploadingPreview || isValidating}>
                  Kembali ke Preview
                </Button>
                <Popconfirm
                  title="Jalankan import karyawan?"
                  description="Data valid akan diproses ke sistem dan tidak dapat dibatalkan dari halaman ini."
                  okText="Ya, import"
                  cancelText="Batal"
                  onConfirm={() => void executeImport()}
                  disabled={!canExecuteImport}
                >
                  <Button type="primary" loading={isExecuting} disabled={!canExecuteImport}>
                    Execute Import
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
                description="Row merah menandakan error. Periksa detail per-cell pada tabel di bawah, lalu perbaiki file dan unggah ulang bila diperlukan."
              />
            ) : (
              <Alert
                type="success"
                showIcon
                message="Semua row valid"
                description="Seluruh row lolos validasi. Anda dapat melanjutkan ke tahap execute import."
              />
            )}

            <div className="grid gap-4 xl:grid-cols-2">
              <Card size="small" title="Contoh Raw Data Row Pertama" className="rounded-xl border border-slate-200 bg-slate-50">
                {validationRawEntries.length ? (
                  <Descriptions bordered size="small" column={1}>
                    {validationRawEntries.slice(0, 10).map((entry) => (
                      <Descriptions.Item key={entry.key} label={entry.key}>
                        {formatCellValue(entry.value)}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Tidak ada raw data" />
                )}
              </Card>

              <Card size="small" title="Contoh Normalized Data Row Pertama" className="rounded-xl border border-slate-200 bg-slate-50">
                {validationNormalizedEntries.length ? (
                  <Descriptions bordered size="small" column={1}>
                    {validationNormalizedEntries.slice(0, 10).map((entry) => (
                      <Descriptions.Item key={entry.key} label={entry.key}>
                        {formatCellValue(entry.value)}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Normalized data belum tersedia" />
                )}
              </Card>
            </div>

            <div>
              <Title level={5} className="!mb-3">
                Detail Validasi per Row
              </Title>
              <Table<ImportValidationResult["rows"][number]>
                rowKey={(record) => `${record.rowNumber}`}
                columns={validationColumns}
                dataSource={validationResult.rows}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                locale={{ emptyText: "Tidak ada data validasi" }}
                scroll={{ x: 1100 }}
                rowClassName={(record) =>
                  record.status === "valid" ? "bg-emerald-50/60" : "bg-rose-50/60"
                }
              />
            </div>
          </Space>
        )}

        {currentStep === 2 && importResult && (
          <Space direction="vertical" size={20} className="flex w-full">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Title level={4} className="!mb-2">
                  Hasil Execute Import
                </Title>
                <Text type="secondary">
                  Tahap akhir menampilkan breakdown hasil eksekusi per row, termasuk baris berhasil dan
                  gagal diproses.
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
              status={importResult.failed > 0 ? "warning" : "success"}
              title={
                importResult.failed > 0
                  ? "Execute import selesai dengan sebagian kegagalan"
                  : "Execute import selesai tanpa kegagalan"
              }
              subTitle={`${importResult.success} baris berhasil dan ${importResult.failed} baris gagal dari total ${importResult.processed} baris.`}
            />

            <ImportSummary importResult={importResult} />

            <div className="grid gap-4 md:grid-cols-2">
              <Card size="small" className="rounded-xl border border-emerald-200 bg-emerald-50">
                <Space direction="vertical" size={4}>
                  <Text strong className="!text-emerald-800">
                    Ringkasan Berhasil
                  </Text>
                  <Title level={3} className="!mb-0 !text-emerald-700">
                    {successfulResults.length}
                  </Title>
                  <Text className="!text-emerald-700">row berhasil dibuat di sistem</Text>
                </Space>
              </Card>

              <Card size="small" className="rounded-xl border border-rose-200 bg-rose-50">
                <Space direction="vertical" size={4}>
                  <Text strong className="!text-rose-800">
                    Ringkasan Gagal
                  </Text>
                  <Title level={3} className="!mb-0 !text-rose-700">
                    {failedResults.length}
                  </Title>
                  <Text className="!text-rose-700">row memerlukan tindak lanjut</Text>
                </Space>
              </Card>
            </div>

            <div>
              <Title level={5} className="!mb-3">
                Detail Execute per Row
              </Title>
              <Table<ImportExecuteResult["details"][number]>
                rowKey={(record) => `${record.rowNumber}-${record.status}`}
                columns={resultColumns}
                dataSource={importResult.details}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                locale={{ emptyText: "Tidak ada detail hasil execute" }}
                scroll={{ x: 1100 }}
                rowClassName={(record) =>
                  record.status === "success" ? "bg-emerald-50/60" : "bg-rose-50/60"
                }
              />
            </div>
          </Space>
        )}
      </Card>
    </Space>
  );
}

export default ImportPage;
