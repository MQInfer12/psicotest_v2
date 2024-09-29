import { useKonamiCode } from "@/modules/core/hooks/useKonamiCode";
import { TestForm } from "@/modules/features/tests/api/dtos";
import { TestType } from "@/modules/features/tests/types/TestType";

interface Props {
  prev: boolean;
  finished: boolean;
  test: TestType;
  form: TestForm[];
  setForm: React.Dispatch<React.SetStateAction<TestForm[]>>;
  setPreguntaIndex: (newPage: number, newDirection: number) => void;
}

const TestAutofill = ({
  finished,
  form,
  prev,
  setForm,
  setPreguntaIndex,
  test,
}: Props) => {
  useKonamiCode(
    !prev && !finished,
    () => {
      const body: TestForm[] = [];
      test.secciones.forEach((section) => {
        const sectionOptions = section.opciones.length;
        if (section.type === "multi") {
          section.items.forEach((item) => {
            const existsBody = form.find((v) => v.idPregunta === item.id);
            if (!existsBody) {
              const options: number[] = [];
              section.opciones.forEach((option) => {
                const checked = Math.random() >= 0.5;
                if (checked) {
                  options.push(option.id);
                }
              });
              body.push({
                idPregunta: item.id,
                idOpcion: options,
              });
            } else {
              body.push(existsBody);
            }
          });
        } else {
          section.items.forEach((item) => {
            const existsBody = form.find((v) => v.idPregunta === item.id);
            if (!existsBody) {
              const randomIndex = Math.floor(Math.random() * sectionOptions);
              body.push({
                idPregunta: item.id,
                idOpcion: section.opciones[randomIndex].id,
              });
            } else {
              body.push(existsBody);
            }
          });
        }
      });

      setForm(body);
      setPreguntaIndex(body.length - 1, 1);
    },
    [form, finished]
  );

  return null;
};

export default TestAutofill;
