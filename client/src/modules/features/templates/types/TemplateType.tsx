export type TemplateItem = TemplateSectionBasic | TemplateSectionVignette;

export type TemplateType = TemplateItem[];

type TemplateSectionBasic = {
  id?: string;
  type: "title" | "paragraph" | "subtitle";
  content: string;
};

type TemplateSectionVignette = {
  id?: string;
  type: "vignette";
  title: string;
  content: string;
};
