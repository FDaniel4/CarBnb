/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        naranja: "#FF6D00",
        carbon: "#212121",
        grisClaro: "#F4F4F6",
        grisMedio: "#8A8A8E",
        azulConfianza: "#007AFF",
        verdeExito: "#34C759",
        rojoAlerta: "#FF3B30",
      },
    },
  },
  plugins: [],
}