import { App as AntdApp, ConfigProvider, theme } from "antd";
import idID from "antd/locale/id_ID";
import { ModulesProvider } from "./modules/app/useModules";
import { AuthProvider } from "./modules/auth/AuthContext";
import { AppRoutes } from "./routes";

const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#f2c40d",
    colorInfo: "#f2c40d",
    colorSuccess: "#15803d",
    colorWarning: "#c2410c",
    colorError: "#b91c1c",
    colorBgLayout: "#f8f8f5",
    colorBgContainer: "#ffffff",
    colorTextHeading: "#0f172a",
    borderRadius: 4,
    fontFamily: "'Inter', sans-serif",
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: "#f8f8f5",
      siderBg: "#ffffff",
      headerBg: "#ffffff",
    },
    Menu: {
      itemSelectedBg: "#f2c40d",
      itemSelectedColor: "#0f172a",
      itemBorderRadius: 8,
      itemHoverBg: "#f1f5f9",
      darkItemBg: "#ffffff",
      darkSubMenuItemBg: "#ffffff",
      darkItemColor: "#475569",
      darkItemHoverColor: "#0f172a",
      darkItemSelectedBg: "#f2c40d",
      darkItemSelectedColor: "#0f172a",
      darkItemHoverBg: "#f8fafc",
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
} as const;

function App() {
  return (
    <ConfigProvider locale={idID} theme={appTheme}>
      <AntdApp>
        <AuthProvider>
          <ModulesProvider>
            <AppRoutes />
          </ModulesProvider>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
