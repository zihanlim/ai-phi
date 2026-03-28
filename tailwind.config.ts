import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dim: "var(--primary-dim)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dim: "var(--secondary-dim)",
          fixed: "var(--secondary-fixed)",
          "fixed-dim": "var(--secondary-fixed-dim)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          dim: "var(--tertiary-dim)",
          fixed: "var(--tertiary-fixed)",
          "fixed-dim": "var(--tertiary-fixed-dim)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          variant: "var(--surface-variant)",
          "container-low": "var(--surface-container-low)",
          "container-highest": "var(--surface-container-highest)",
        },
        on: {
          surface: {
            DEFAULT: "var(--on-surface)",
            variant: "var(--on-surface-variant)",
          },
          primary: {
            DEFAULT: "var(--on-primary)",
            container: "var(--on-primary-container)",
            fixed: "var(--on-primary-fixed)",
            "fixed-variant": "var(--on-primary-fixed-variant)",
          },
          secondary: {
            DEFAULT: "var(--on-secondary)",
            "fixed-variant": "var(--on-secondary-fixed-variant)",
          },
          tertiary: {
            fixed: "var(--on-tertiary-fixed)",
          },
          error: {
            container: "var(--on-error-container)",
          },
          background: "var(--on-background)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        inverse: {
          surface: "var(--inverse-surface)",
          "on-surface": "var(--inverse-on-surface)",
          primary: "var(--inverse-primary)",
        },
        error: {
          DEFAULT: "var(--error)",
          dim: "var(--error-dim)",
          container: "var(--error-container)",
        },
        "primary-container": "var(--primary-container)",
        "secondary-container": "var(--secondary-container)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
