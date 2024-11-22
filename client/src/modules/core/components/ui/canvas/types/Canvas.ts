type CanvasItemVignette = {
  type: "vignette";
  title: string;
  content: string;
};

type CanvasItemContent = {
  type: "subtitle" | "paragraph";
  content: string;
};

export type CanvasItem = CanvasItemContent | CanvasItemVignette;

export type CanvasType = CanvasItem[];
