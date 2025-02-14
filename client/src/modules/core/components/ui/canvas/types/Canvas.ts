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

type CanvasItemImage = {
  id: string;
  type: "image";
  src: string;
  title: string;
  description: string;
};

export type CanvasItem =
  | CanvasItemContent
  | CanvasItemVignette
  | CanvasItemImage;

export type CanvasType = CanvasItem[];
