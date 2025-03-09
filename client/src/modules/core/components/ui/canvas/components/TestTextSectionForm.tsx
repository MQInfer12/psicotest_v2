import { useEffect, useMemo } from "react";
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

const getRandomPhrase = () => {
  const moods = [
    "¡Excelente, sigue así!",
    "¡Sigue así!",
    "¡Bien hecho, continúa!",
    "¡Buen trabajo, continúa!",
    "¡Sigue adelante!",
  ];
  const randomIndex = Math.floor(Math.random() * moods.length);
  return moods[randomIndex];
};

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

  const exist = form.find((f) => f.idPregunta === pregunta.id);
  const existIdOpcion = (exist?.idOpcion ?? []) as TextSectionOption[];

  const handleWords = (body: TextSectionDTO) => {
    const value = body.word.trim();

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
      if (existIdOpcion.length === seccion.maxWords) {
        return toastError(
          `Llegaste al límite de palabras (max. ${seccion.maxWords})`
        );
      }
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

  const randomPhrase = useMemo(() => getRandomPhrase(), [existIdOpcion.length]);

  return (
    <form onSubmit={handleSubmit(handleWords)} className="flex items-end gap-4">
      <Input
        className="test-text-section-input"
        {...register("word")}
        error={errors.word?.message}
        required
        label={`Escribe aquí`}
        placeholder={
          existIdOpcion.length === 0
            ? "Ingresa una palabra"
            : existIdOpcion.length > 60
              ? "Ya casi terminas..."
              : existIdOpcion.length > 3
                ? undefined
                : existIdOpcion.length > 0
                  ? randomPhrase
                  : undefined
        }
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
