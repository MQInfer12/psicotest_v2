type CanvasItemVignette = {
  id?: string;
  type: "vignette";
  title?: string;
  content: string;
};

export type CanvasItemContent = {
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

type CanvasItemPDF = {
  id: string;
  type: "pdf";
  src: string;
};

export type CanvasItem =
  | CanvasItemContent
  | CanvasItemVignette
  | CanvasItemImage
  | CanvasItemPDF;

export type CanvasType = CanvasItem[];
