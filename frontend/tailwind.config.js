/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5efe4",
        canvas: "#fbf7f0",
        ink: "#162336",
        mist: "#dae3ef",
        coral: "#ef6c57",
        sun: "#f6b93b",
        sea: "#0f766e",
        lavender: "#bcc8ff",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        lift: "0 24px 60px rgba(22, 35, 54, 0.12)",
        soft: "0 14px 34px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(239,108,87,0.16), transparent 28%), radial-gradient(circle at 80% 10%, rgba(188,200,255,0.28), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.96))",
      },
    },
  },
  plugins: [],
};
