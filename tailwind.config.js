import daisyui from 'daisyui';
import { themes } from './daisy_themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["*.html", "*.js"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes
  },
}

