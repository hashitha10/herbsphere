export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
  keyframes: {
    lotusGlow: {
      "0%, 100%": { filter: "drop-shadow(0 0 4px #ff6ec7)" },
      "50%": { filter: "drop-shadow(0 0 12px #ff3cac)" },
    },
  },
  animation: {
    lotusGlow: "lotusGlow 1.6s ease-in-out infinite",
  },
}
