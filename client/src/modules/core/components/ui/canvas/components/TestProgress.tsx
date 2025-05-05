import { useThemeContext } from "@/modules/core/context/ThemeContext";
import { Item, Seccion } from "@/modules/features/tests/types/TestType";
import { motion } from "framer-motion";

interface Props {
  finished: boolean;
  secciones: Seccion[];
  seccion: Seccion;
  pregunta: Item;
  paused: boolean;
}

const TestProgress = ({
  finished,
  secciones,
  seccion,
  pregunta,
  paused,
}: Props) => {
  const { dark, COLORS } = useThemeContext();
  const sectionProgress = secciones.findIndex((s) => s.id === seccion.id) + 1;
  const preguntaProgress =
    seccion.items.findIndex((p) => p.id === pregunta.id) + 1;
  return (
    <div className="flex flex-col gap-1 petizo:flex-row petizo:gap-2">
      {secciones.length > 1 && (
        <div className="w-full flex-1 flex items-center gap-4 petizo:gap-1">
          <div className="w-20 flex justify-center">
            <small className="text-alto-950 dark:text-alto-50">
              S: {sectionProgress} / {secciones.length}
            </small>
          </div>
          <div className="flex-1 h-2 bg-alto-100 dark:bg-alto-900 rounded-md overflow-hidden">
            <motion.span
              animate={{
                width: `${(sectionProgress / secciones.length) * 100}%`,
                backgroundColor: !finished
                  ? paused
                    ? dark
                      ? COLORS.alto[800]
                      : COLORS.alto[200]
                    : COLORS.primary[400]
                  : COLORS.success,
              }}
              className="block h-full"
            />
          </div>
        </div>
      )}
      <div className="w-full flex-[1_1_0] flex items-center gap-4 petizo:gap-1">
        <div className="w-20 flex justify-center">
          <small className="text-alto-950 dark:text-alto-50">
            P: {preguntaProgress} / {seccion.items.length}
          </small>
        </div>
        <div className="flex-1 h-2 bg-alto-100 dark:bg-alto-900 rounded-md overflow-hidden">
          <motion.span
            animate={{
              width: `${(preguntaProgress / seccion.items.length) * 100}%`,
              backgroundColor: !finished
                ? paused
                  ? dark
                    ? COLORS.alto[800]
                    : COLORS.alto[200]
                  : COLORS.primary[400]
                : COLORS.success,
            }}
            className="block h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TestProgress;
