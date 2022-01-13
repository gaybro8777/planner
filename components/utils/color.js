export const BLACK = "#000000";
export const BLACK_TRANSPARENT = "rgba(0,0,0,.25)";
export const DARK_GRAY = "#333333";
export const LIGHT_GRAY = "#f6f6f6";
export const SLATE_GRAY = "#c2d0df";
export const WHITE = "#ffffff";

export function hexToRgb(hex) {
  if (hex.length === 4) {
    hex = `#${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(
      2
    )}${hex.charAt(3)}${hex.charAt(3)}`;
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
      ]
    : null;
}

export function hexToRgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function rgbToHex(rgb) {
  const [r, g, b] = rgb;
  const number = (r << 16) | (g << 8) | b;
  return `#${number.toString(16).padStart(6, 0)}`;
}

const HIGHLIGHT_OFFSET = 30;

export function highlight(hex) {
  const rgb = hexToRgb(hex);
  if (getContrastRatio(hex, WHITE) > getContrastRatio(hex, BLACK)) {
    // Lighten
    return rgbToHex(
      rgb.map((value) => Math.min(255, value + HIGHLIGHT_OFFSET))
    );
  } else {
    // Darken
    return rgbToHex(rgb.map((value) => Math.max(0, value - HIGHLIGHT_OFFSET)));
  }
}

export function getLuminance(color) {
  const rgb = Array.isArray(color) ? color : hexToRgb(color);

  const values = rgb.map((value) => {
    const n = value / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return Number(
    (0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]).toFixed(3)
  );
}

export function getContrastRatio(colorA, colorB) {
  const luminanceA = getLuminance(hexToRgb(colorA));
  const luminanceB = getLuminance(hexToRgb(colorB));

  return (
    (Math.max(luminanceA, luminanceB) + 0.05) /
    (Math.min(luminanceA, luminanceB) + 0.05)
  );
}

const colors = [
  "#2D2327",
  "#392D39",
  "#45364B",
  "#543E5B",
  "#62466B",
  "#22223B",
  "#363852",
  "#4A4E69",
  "#726D81",
  "#9A8C98",
  "#B29DA0",
  "#C9ADA7",
  "#DECBC6",
];
const stringToColorMap = new Map();

export function getColorForString(string) {
  if (!string) {
    return "#000000";
  }

  string = string.toLowerCase();

  if (!stringToColorMap.has(string)) {
    let hash = 0;
    for (var charIndex = 0; charIndex < string.length; charIndex++) {
      hash = string.charCodeAt(charIndex) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const colorIndex = Math.abs(hash % colors.length);
    const color = colors[colorIndex];

    stringToColorMap.set(string, color);
  }

  return stringToColorMap.get(string);
}
