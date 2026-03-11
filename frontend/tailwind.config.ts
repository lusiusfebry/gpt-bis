import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f2c40d",
        "background-light": "#f8f8f5",
        "background-dark": "#221e10",
      },
      boxShadow: {
        panel: "0 4px 12px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
