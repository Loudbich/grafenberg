import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      fontFamily: {
        // Les noms sont ceux que @fontsource enregistre : le paquet variable
        // d'Inter déclare « Inter Variable », pas « Inter ». Écrire « Inter »
        // ici retomberait silencieusement sur la police système.
        //
        // `display` et `inter` désignent la même famille : la distinction entre
        // titre et texte se fait par la graisse et l'approche, pas par une
        // seconde police. `display` existe pour que le balisage puisse le dire.
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /**
         * DEUX ACCENTS, ET DES ALIAS VERS EUX.
         *
         * `accent` (fuchsia) et `accent-alt` (violet) sont relevés sur le
         * lettrage de la marque. Tout le reste ci-dessous n'existe que pour
         * y rediriger l'existant.
         *
         * Les familles `neon`, `gold` et `amber` sont employées à plus de
         * cent endroits. Les renommer d'un bloc aurait mélangé une refonte
         * visuelle avec un renommage massif — deux changements qu'on ne veut
         * pas relire ensemble, et dont l'un masquerait les erreurs de
         * l'autre. Elles pointent donc vers la nouvelle palette : le site
         * change de couleur sans qu'une seule classe soit touchée, et le
         * renommage peut suivre à froid.
         */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          alt: "hsl(var(--accent-alt))",
        },

        // Alias — voir la note ci-dessus.
        neon: {
          orange: "hsl(var(--accent))",
          cyan: "hsl(var(--accent-alt))",
          magenta: "hsl(var(--accent))",
          violet: "hsl(var(--accent-alt))",
        },
        gold: {
          DEFAULT: "hsl(var(--accent))",
          dark: "hsl(var(--accent-alt))",
          light: "hsl(var(--accent))",
        },
        // L'échelle ambre servait au bloc vinyle, seule zone dorée du site.
        // Elle devenait la troisième famille de couleurs d'un thème qui n'en
        // veut que deux ; ses degrés suivent maintenant l'accent.
        amber: {
          50: "hsl(var(--accent) / 0.06)",
          100: "hsl(var(--accent) / 0.12)",
          200: "hsl(var(--accent) / 0.2)",
          300: "hsl(var(--accent) / 0.45)",
          400: "hsl(var(--accent))",
          500: "hsl(var(--accent))",
          600: "hsl(var(--accent) / 0.85)",
          700: "hsl(var(--accent-alt))",
          800: "hsl(var(--accent-alt) / 0.6)",
          900: "hsl(var(--accent-alt) / 0.35)",
          950: "hsl(var(--accent-alt) / 0.18)",
          DEFAULT: "hsl(var(--accent))",
        },
        // Gray palette (for compatibility)
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        bronze: "hsl(var(--bronze))",
        sand: "hsl(var(--sand))",
        deep: "hsl(var(--deep))",
        surface: "hsl(var(--surface))",
        
        // Base tokens
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
