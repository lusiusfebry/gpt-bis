import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f7f6",
          100: "#d9e6e2",
          500: "#0f766e",
          700: "#115e59",
          900: "#0b2f2d",
        },
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
