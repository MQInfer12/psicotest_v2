import colors from "../../../../colors.json";
import primaryClassic from "../../../../colors_primary_classic.json";
import primaryUnifranz from "../../../../colors_primary_unifranz.json";

import { hexToHslString } from "../utils/hexToHsl";

export const PRIMARY_COLORS_CLASSIC = Object.fromEntries(
  Object.entries(primaryClassic.primary).map(([key, value]) => [
    key,
    {
      rgb: value,
      hsl: hexToHslString(value),
    },
  ])
);

export const PRIMARY_COLORS_UNIFRANZ = Object.fromEntries(
  Object.entries(primaryUnifranz.primary).map(([key, value]) => [
    key,
    {
      rgb: value,
      hsl: hexToHslString(value),
    },
  ])
);

export const DEFAULT_COLORS = colors;
