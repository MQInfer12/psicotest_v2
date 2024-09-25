import { useKonamiCode } from "@/modules/core/hooks/useKonamiCode";
import { TestForm } from "../Test";
import { TestType } from "@/modules/features/tests/types/TestType";

interface Props {
  prev: boolean;
  finished: boolean;
  test: TestType;
  form: TestForm[];
  setForm: React.Dispatch<React.SetStateAction<TestForm[]>>;
  setPreguntaIndex: (newPage: number, newDirection: number) => void;
}

const Autofill = ({
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

      test.secciones.map((section) => {
        const sectionOptions = section.opciones.length;
        section.items.map((item) => {
          const existsBody = form.find((v) => v.idPregunta === item.id);
          if (!existsBody) {
            const randomIndex = Math.floor(Math.random() * sectionOptions);
            return body.push({
              idPregunta: item.id,
              idOpcion: section.opciones[randomIndex].id,
            });
          }
          return body.push(existsBody);
        });
      });

      setForm(body);
      setPreguntaIndex(body.length - 1, 1);
    },
    [form, finished]
  );

  return null;
};

export default Autofill;
