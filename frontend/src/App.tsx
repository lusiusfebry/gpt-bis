import { App as AntdApp, ConfigProvider, theme } from "antd";
import idID from "antd/locale/id_ID";
import { AuthProvider } from "./modules/auth/AuthContext";
import { AppRoutes } from "./routes";

const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#0f766e",
    colorInfo: "#0f766e",
    colorSuccess: "#15803d",
    colorWarning: "#c2410c",
    colorError: "#b91c1c",
    colorBgLayout: "#f3f6f8",
    colorBgContainer: "#ffffff",
    colorTextHeading: "#0f172a",
    borderRadius: 12,
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: "#f3f6f8",
      siderBg: "#0f172a",
      triggerBg: "#111827",
      headerBg: "rgba(255,255,255,0.9)",
    },
    Menu: {
      darkItemBg: "#0f172a",
      darkItemSelectedBg: "#0f766e",
      darkSubMenuItemBg: "#111827",
      itemBorderRadius: 10,
    },
    Card: {
      borderRadiusLG: 20,
    },
  },
} as const;

function App() {
  return (
    <ConfigProvider locale={idID} theme={appTheme}>
      <AntdApp>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
