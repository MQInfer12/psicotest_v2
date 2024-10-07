import { useEffect } from "react";
import Input from "../../Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextSectionDTO,
  TextSectionDTOSchema,
} from "../validations/textSection.schema";
import { TestForm, TextSectionOption } from "@/modules/features/tests/api/dtos";
import { Item, Seccion } from "@/modules/features/tests/types/TestType";
import Button from "../../Button";
import Icon from "../../../icons/Icon";
import { toastError } from "@/modules/core/utils/toasts";
import { v4 } from "uuid";

interface Props {
  form: TestForm[];
  setForm: React.Dispatch<React.SetStateAction<TestForm[]>>;
  pregunta: Item;
  finished: boolean;
  seccion: Seccion;
}

const TestTextSectionForm = ({
  form,
  pregunta,
  setForm,
  finished,
  seccion,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TextSectionDTO>({
    resolver: yupResolver(TextSectionDTOSchema),
  });

  const handleWords = (body: TextSectionDTO) => {
    const value = body.word;
    const exist = form.find((f) => f.idPregunta === pregunta.id);

    if (!exist) {
      setForm((prev) => [
        ...prev,
        {
          idPregunta: pregunta.id,
          idOpcion: [
            {
              id: v4(),
              correct: false,
              word: value,
            },
          ],
        },
      ]);
    } else {
      const existIdOpcion = exist.idOpcion as TextSectionOption[];
      if (existIdOpcion.length === seccion.maxWords)
        return toastError(
          `El límite máximo de palabras es ${seccion.maxWords}`
        );
      setForm((prev) =>
        prev.map((p) => {
          if (p.idPregunta === pregunta.id) {
            const idOpcion = p.idOpcion as TextSectionOption[];
            return {
              ...p,
              idOpcion: [
                ...idOpcion,
                {
                  word: value,
                  correct: false,
                  id: v4(),
                },
              ],
            };
          }
          return p;
        })
      );
    }
    reset();
  };

  useEffect(() => {
    const element = document.querySelector(
      ".test-text-section-input"
    ) as HTMLElement | null;
    element?.blur();
    const timer = setTimeout(() => {
      element?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, [pregunta]);

  const wordCount = (
    (form.find((f) => f.idPregunta === pregunta.id)?.idOpcion as
      | TextSectionOption[]
      | undefined) || []
  ).length;
  return (
    <form onSubmit={handleSubmit(handleWords)} className="flex items-end gap-4">
      <Input
        className="test-text-section-input"
        {...register("word")}
        error={errors.word?.message}
        label={`Escribe aquí ${seccion.maxWords ? `(${wordCount} de ${seccion.maxWords})` : ""}`}
        disabled={finished || wordCount === seccion.maxWords}
      />
      <Button
        type="submit"
        icon={Icon.Types.CHEVRON_RIGHT}
        disabled={finished || wordCount === seccion.maxWords}
      />
    </form>
  );
};

export default TestTextSectionForm;
