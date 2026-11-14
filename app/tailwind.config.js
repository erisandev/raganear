/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sega Design System Core Palette (from awesome-design-skills/skills/sega)
        segaBlue: "#4502FF",          // Primary Token (#4502FF)
        segaYellow: "#FFDA14",        // Secondary Token (#FFDA14)
        segaGreen: "#16A34A",         // Success Token (#16A34A)
        segaAmber: "#D97706",         // Warning Token (#D97706)
        segaRed: "#DC2626",           // Danger Token (#DC2626)
        segaSurface: "#FFFFFF",
        segaText: "#111827",

        // Arcade Cabinet Dark Chassis Palette
        ground: "#080718",            // Deep Arcade Cabinet Obsidian
        plate: "#100d2b",             // Arcade Console Housing Slate
        plateHover: "#181442",        // Highlighted Console Surface
        plateLight: "#181442",
        plateBorder: "#282069",       // Arcade Cabinet Chassis Border
        plateBorderActive: "#4502FF", // Sega Electric Indigo Accent Stroke
        plateBorderHover: "#3b308f",

        // Primary: Electric Sega Arcade Blue (#4502FF)
        cobalt: "#4502FF",
        cobaltDark: "#3400cc",
        cobaltDeep: "#4502FF",
        cobaltLight: "#7038ff",
        cobaltGlow: "#9973ff",

        // Secondary: Sega Arcade Sonic Gold/Yellow (#FFDA14)
        hazard: "#FFDA14",
        hazardDark: "#d9b800",
        hazardLight: "#ffe659",

        // Status Indicators
        neonGreen: "#16A34A",         // 1-UP / Standby / Verified
        warningAmber: "#D97706",      // Time-Lock Active
        alertCrimson: "#DC2626",      // Game Over / Revert Invariant
        crimsonAlert: "#DC2626",
        amberAlert: "#FFDA14",

        // Arcade Cold Steel & Crisp Cabinet White
        steel: "#a5a1d8",             // Arcade Lavender Steel
        steelDark: "#6a649d",
        steelLight: "#cfccf0",
        iceWhite: "#f8fafc",
        textMuted: "#a5a1d8",

        // Backwards-compatible aliases
        cyberCyan: "#4502FF",
        cyanAccent: "#4502FF",
        cyanGlow: "#7038ff",
      },
      fontFamily: {
        pixel: ['"VT323"', "monospace"],
        display: ['"VT323"', "monospace"],
        mono: ['"JetBrains Mono"', '"Azeret Mono"', "ui-monospace", "monospace"],
        sans: ['"Archivo"', '"Inter"', "sans-serif"],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      boxShadow: {
        none: 'none',
        // Solid 0-blur offset blocks (arcade chunky button shadows)
        'sega': '3px 3px 0px #000000',
        'sega-sm': '2px 2px 0px #000000',
        'sega-lg': '5px 5px 0px #000000',
        'sega-primary': '3px 3px 0px #4502FF',
        'sega-yellow': '3px 3px 0px #FFDA14',
        'sega-cabinet': '4px 4px 0px 0px #4502FF, 8px 8px 0px 0px #FFDA14',
      },
    },
  },
  plugins: [],
};
