export const hexToHslString = (hex: string): string => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  let r: number = parseInt(hex.substring(0, 2), 16);
  let g: number = parseInt(hex.substring(2, 4), 16);
  let b: number = parseInt(hex.substring(4, 6), 16);

  // Convert to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number = 0;
  let s: number;
  const l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d: number = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * (360 / 6);
        break;
      case g:
        h = ((b - r) / d + 2) * (360 / 6);
        break;
      case b:
        h = ((r - g) / d + 4) * (360 / 6);
        break;
    }
    h /= 360;
  }

  return `${(h * 360).toFixed(2)} ${(s * 100).toFixed(2)}% ${(l * 100).toFixed(2)}%`;
};
