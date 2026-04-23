export const BRAND = {
  g1: "#1a6b1a",
  g2: "#2e8b2e",
  g3: "#7bc142",
  g4: "#d4f0a8",
  red: "#c62828",
  blue: "#1565C0",
  orange: "#E65100",
  purple: "#6A1B9A",
  yellow: "#F9A825",
  teal: "#00695C",
} as const;

export const CO_COLORS: Record<string, string> = {
  "HKR":       BRAND.g1,
  "ABI IPS":   BRAND.blue,
  "Beer K":    BRAND.orange,
  "HITE IPS":  BRAND.red,
  "LOTTE IPS": BRAND.purple,
};

export const CH_COLORS: Record<string, string> = {
  "Total":  BRAND.g1,
  "Hyper":  BRAND.teal,
  "CVS":    BRAND.blue,
  "CLSM":   "#BF360C",
  "ALSM":   BRAND.purple,
  "Union":  "#F57F17",
  "SJJ":    "#37474F",
};

export const PF_COLORS: Record<string, string> = {
  "Heineken":      "#007a00",
  "Heineken 0.0":  "#5cb85c",
  "Edelweiss":     "#81C784",
  "Tiger":         BRAND.yellow,
  "Tiger Radler":  "#FFD54F",
  "Sulhwa":        "#AB47BC",
  "Birra Moretti": "#EF5350",
};

export const T10_COLORS = [
  BRAND.g1, BRAND.blue, BRAND.orange, BRAND.red, BRAND.purple,
  BRAND.teal, "#BF360C", "#37474F", "#F57F17", "#4E342E",
];

export const NAB_COLORS: Record<string, string> = {
  "Total NAB":    "#37474F",
  "IPS NAB":      BRAND.g1,
  "Heineken 0.0": "#5cb85c",
  "Grolsch 0.0":  BRAND.blue,
  "Kozel 0.0":    BRAND.orange,
};

export const RTD_COLORS: Record<string, string> = {
  "Somersby":    "#AB47BC",
  "Tiger Radler": "#FFD54F",
};

export const LOCAL_COLORS: Record<string, string> = {
  "CASS":   "#c62828",
  "TERRA":  "#1565C0",
  "HITE":   "#E65100",
  "KLOUD":  "#6A1B9A",
  "Others": "#90A4AE",
};

export function softenColor(hex: string, amount = 0.22): string {
  const normalized = hex.replace("#", "");
  const fullHex = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;

  if (fullHex.length !== 6) return hex;

  const channels = fullHex.match(/.{2}/g);
  if (!channels) return hex;

  const mixed = channels.map((channel) => {
    const value = parseInt(channel, 16);
    const next = Math.round(value + (255 - value) * amount);
    return next.toString(16).padStart(2, "0");
  });

  return `#${mixed.join("")}`;
}
