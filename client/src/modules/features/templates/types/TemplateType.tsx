export type TemplateType = (TemplateSectionBasic | TemplateSectionVignette)[];

type TemplateSectionBasic = {
  type: "title" | "paragraph" | "subtitle";
  content: string;
};

type TemplateSectionVignette = {
  type: "vignette";
  title: string;
  content: string;
};
