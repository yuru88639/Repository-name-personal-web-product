import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4efe7",
        ink: "#151515",
        muted: "#83786e",
        line: "#e4d8ca",
        paper: "#fffaf2",
        clay: "#9a5735",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(77, 48, 30, 0.08)",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
