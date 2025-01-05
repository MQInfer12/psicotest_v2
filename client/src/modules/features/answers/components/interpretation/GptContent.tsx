import { useModal } from "@/modules/core/components/ui/modal/useModal";
import clsx from "clsx";
import { useEffect } from "react";
import ModifyTextForm from "./ModifyTextForm";

interface Props {
  content: string;
  edit: string | null;
  setEdit: React.Dispatch<React.SetStateAction<string | null>>;
}

const GptContent = ({ content, setEdit, edit }: Props) => {
  const { modal, setOpen } = useModal<string>();

  useEffect(() => {
    const p = document.getElementById("gpt-content-p");
    if (p) {
      let childNodes = Array.from(p.childNodes) as HTMLElement[];
      childNodes.forEach((node) => {
        if ((node as HTMLElement).className === "vignette") {
          node.childNodes.forEach((child) => {
            if (child.nodeType !== 3) return;
            const vignetteContent = child.textContent;
            if (vignetteContent?.trim() === "•") return;
            const span = document.createElement("span");
            span.className = "pure-text";
            span.textContent = vignetteContent;
            node.replaceChild(span, child);
          });
        }

        if (node.nodeType !== 3) return;
        let textContent = node.textContent;
        if (!textContent || textContent === "\n") return;

        while (textContent.startsWith("\n")) {
          textContent = textContent.slice(1);
          const br = document.createElement("br");
          p.insertBefore(br, node);
        }

        while (textContent.endsWith("\n")) {
          textContent = textContent.slice(0, -1);
          const br = document.createElement("br");
          p.insertBefore(br, node.nextSibling);
        }

        const span = document.createElement("span");
        span.className = "pure-text";
        span.textContent = textContent;
        p.replaceChild(span, node);
      });

      const handleNodeClick = (child: HTMLElement) => {
        child.onclick = () => {
          if (!edit) return;
          if (!child.textContent) return;
          setOpen(child.textContent.replace("•", "").trim());
        };
      };

      childNodes = Array.from(p.children) as HTMLElement[];
      childNodes.forEach((node) => {
        if ((node as HTMLElement).className === "vignette") {
          const vignetteChildren = Array.from(node.childNodes) as HTMLElement[];
          vignetteChildren.forEach((child) => {
            const vignetteContent = child.textContent;
            if (vignetteContent?.trim() === "•") return;
            handleNodeClick(child);
          });
        } else {
          handleNodeClick(node);
        }
      });
    }
  }, [content, edit]);

  return (
    <>
      {modal("Editar texto", (text) => (
        <ModifyTextForm
          text={text}
          setEdit={setEdit}
          closeModal={() => setOpen(false)}
        />
      ))}
      <p
        id="gpt-content-p"
        dangerouslySetInnerHTML={{ __html: edit ?? content }}
        className={clsx(
          "w-full min-h-full [&_*]:border [&_*]:border-transparent whitespace-pre-line text-sm leading-[30px] px-8 py-6 pb-20 max-md:text-xs max-md:leading-[30px] max-md:px-4 max-md:pt-4 text-alto-800 dark:text-alto-300",
          "[&>.title]:text-base [&>.title]:font-bold [&>.title]:text-alto-950 dark:[&>.title]:text-alto-50",
          "[&>.subtitle]:font-semibold [&>.subtitle]:text-alto-950 dark:[&>.subtitle]:text-alto-50",
          "[&>.vignette]:box-decoration-clone [&>.vignette]:pl-8 [&_.vignette-title]:font-semibold [&_.vignette-t]:font-semibold [&_.vignette-title]:text-alto-950 dark:[&_.vignette-title]:text-alto-50 [&_.vignette-t]:text-alto-950 dark:[&_.vignette-t]:text-alto-50",
          {
            "[&_*]:cursor-default [&_*]:transition-all [&_*]:duration-300":
              edit,
            "hover:[&_.title]:border-primary-700 hover:[&_.subtitle]:border-primary-700 hover:[&_.vignette-title]:border-primary-700 hover:[&_.vignette-t]:border-primary-700 hover:[&_.pure-text]:border-primary-700":
              edit,
            "dark:hover:[&_.title]:border-primary-400 dark:hover:[&_.subtitle]:border-primary-400 dark:hover:[&_.vignette-title]:border-primary-400 dark:hover:[&_.vignette-t]:border-primary-400 dark:hover:[&_.pure-text]:border-primary-400":
              edit,
          }
        )}
      />
    </>
  );
};

export default GptContent;
