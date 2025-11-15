// Maps prediction skin_type values to icon keys in `constants/icons`.
export const SKIN_TYPE_ICON_MAP: Record<string, string> = {
  dry: "dry",
  normal: "normal",
  oily: "oily",
  unknown: "unknown",
};

export function getIconKeyFromSkinType(input?: string) {
  const key = input?.toString().trim().toLowerCase();
  return (key && SKIN_TYPE_ICON_MAP[key]) ? SKIN_TYPE_ICON_MAP[key] : "unknown";
}
