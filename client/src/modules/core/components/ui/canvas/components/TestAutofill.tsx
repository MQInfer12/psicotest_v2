import { useKonamiCode } from "@/modules/core/hooks/useKonamiCode";
import { TestForm } from "@/modules/features/tests/api/dtos";
import { Item, TestType } from "@/modules/features/tests/types/TestType";

interface Props {
  prev: boolean;
  finished: boolean;
  test: TestType;
  form: TestForm[];
  preguntas: Item[];
  setForm: React.Dispatch<React.SetStateAction<TestForm[]>>;
  setPreguntaIndex: (newPage: number, newDirection: number) => void;
  setSectionViews: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        view: boolean;
      }[]
    >
  >;
  fn: () => void;
}

const TestAutofill = ({
  finished,
  form,
  prev,
  fn
}: Props) => {
  useKonamiCode(
    !prev && !finished,
    fn,
    [form, finished]
  );

  return null;
};

export default TestAutofill;
