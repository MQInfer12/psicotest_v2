import { TestForm, TextSectionOption } from "@/modules/features/tests/api/dtos";
import { Item } from "@/modules/features/tests/types/TestType";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  form: TestForm[];
  pregunta: Item;
}

const TestTextSection = ({ form, pregunta }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [form]);

  const palabras = form.find((f) => f.idPregunta === pregunta.id)?.idOpcion as
    | TextSectionOption[]
    | undefined;
  return (
    <div
      ref={scrollRef}
      className="scroll-smooth h-full overflow-auto mb-3 bg-alto-50 dark:bg-alto-950 rounded-md"
    >
      <AnimatePresence initial={false}>
        {palabras ? (
          <div className="flex flex-wrap gap-2 p-2">
            {palabras?.map((opcion) => (
              <motion.p
                key={opcion.id}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2 py-1 bg-primary-200 dark:bg-primary-950/40 w-fit h-fit rounded-md text-primary-950 dark:text-primary-100"
              >
                {opcion.word}
              </motion.p>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-alto-500">
            <small className="text-xs text-center text-balance px-2 leading-normal">
              Aquí aparecerán las palabras que escribas
            </small>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestTextSection;
