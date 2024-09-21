export interface CanvasItem {
  type: "subtitle" | "paragraph";
  content: string;
}

export type CanvasType = CanvasItem[];
