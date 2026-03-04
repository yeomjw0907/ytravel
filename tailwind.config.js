/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wt: {
          "brand-900": "var(--wt-color-brand-900)",
          "brand-800": "var(--wt-color-brand-800)",
          "brand-700": "var(--wt-color-brand-700)",
          "brand-500": "var(--wt-color-brand-500)",
          "brand-300": "var(--wt-color-brand-300)",
          "brand-100": "var(--wt-color-brand-100)",
          bg: "var(--wt-color-bg)",
          surface: "var(--wt-color-surface)",
          panel: "var(--wt-color-panel)",
          border: "var(--wt-color-border)",
          "text-primary": "var(--wt-color-text-primary)",
          "text-secondary": "var(--wt-color-text-secondary)",
          success: { bg: "var(--wt-color-success-bg)", text: "var(--wt-color-success-text)" },
          warning: { bg: "var(--wt-color-warning-bg)", text: "var(--wt-color-warning-text)" },
          danger: { bg: "var(--wt-color-danger-bg)", text: "var(--wt-color-danger-text)" },
          info: { bg: "var(--wt-color-info-bg)", text: "var(--wt-color-info-text)" },
        },
      },
      fontFamily: {
        /* 헤드라인·디스플레이도 Pretendard로 통일 */
        display: ["var(--wt-font-body)", "sans-serif"],
        body: ["var(--wt-font-body)", "sans-serif"],
      },
      spacing: {
        "wt-1": "var(--wt-space-1)",
        "wt-2": "var(--wt-space-2)",
        "wt-3": "var(--wt-space-3)",
        "wt-4": "var(--wt-space-4)",
        "wt-5": "var(--wt-space-5)",
        "wt-6": "var(--wt-space-6)",
        "wt-8": "var(--wt-space-8)",
        "wt-10": "var(--wt-space-10)",
        "wt-12": "var(--wt-space-12)",
        "wt-16": "var(--wt-space-16)",
        "wt-20": "var(--wt-space-20)",
      },
      borderRadius: {
        "wt-sm": "var(--wt-radius-sm)",
        "wt-md": "var(--wt-radius-md)",
        "wt-lg": "var(--wt-radius-lg)",
        "wt-xl": "var(--wt-radius-xl)",
        "wt-pill": "var(--wt-radius-pill)",
      },
      boxShadow: {
        "wt-soft": "var(--wt-shadow-soft)",
        "wt-card": "var(--wt-shadow-card)",
        "wt-focus": "var(--wt-shadow-focus)",
      },
      maxWidth: {
        "container-sm": "720px",
        "container-md": "960px",
        "container-lg": "1200px",
        "container-xl": "1320px",
      },
      fontSize: {
        "wt-display-xl": ["64px", { lineHeight: "1.05", fontWeight: "600" }],
        "wt-display-lg": ["48px", { lineHeight: "1.1", fontWeight: "600" }],
        "wt-h1": ["36px", { lineHeight: "1.2", fontWeight: "600" }],
        "wt-h2": ["28px", { lineHeight: "1.25", fontWeight: "600" }],
        "wt-h3": ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        "wt-body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "wt-body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "wt-body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "wt-caption": ["12px", { lineHeight: "1.4", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
