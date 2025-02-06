type CanvasItemVignette = {
  id?: string;
  type: "vignette";
  title?: string;
  content: string;
};

type CanvasItemContent = {
  id?: string;
  type: "subtitle" | "paragraph";
  content: string;
};

export type CanvasItem = CanvasItemContent | CanvasItemVignette;

export type CanvasType = CanvasItem[];
