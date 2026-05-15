/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Golos Text", "sans-serif"],
        geist: ["Geist", "sans-serif"],
      },
      colors: {
        sidebar: "#23316b",
        "sidebar-active": "#151d40",
        "sidebar-border": "#3a4688",
        "sidebar-foreground": "#ffffff",
        foreground: "#080c10",
        background: "#ffffff",
        border: "#d8d8d7",
        input: "#d0d0cf",
        secondary: "#f6f6f5",
        "secondary-foreground": "#535353",
        "muted-foreground": "#3a4452",
        navy: "#3a4688",
        "blue-50": "#eff6ff",
        "blue-950": "#172554",
        "card-foreground": "#0a0a0a",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        container: "16px",
      },
      boxShadow: {
        md: "0px 2px 4px 0px rgba(8,12,16,0.14)",
        container: "0px 0px 1px 0px #5d5a53, 0px 2px 11px 0px rgba(0,0,0,0.08)",
        card: "0px 1px 1px 0px rgba(0,0,0,0.38), 0px 4px 4px 0px rgba(70,67,62,0.16)",
        "card-sm": "0px 1px 1px rgba(0,0,0,0.05)",
        btn: "0px 1px 1.5px rgba(8,13,22,0.1)",
        "btn-inset": "inset 0px -1px 1px 0px rgba(146,146,145,0.2)",
        "floating": "0px 1px 1px 0px rgba(0,0,0,0.2), 0px 4px 8px -2px rgba(27,42,74,0.4)",
        "icon-btn": "0px 1px 3px 0px rgba(8,13,22,0.2)",
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "3": "12px",
        "5": "20px",
        "6": "24px",
      },
    },
  },
  plugins: [],
};
