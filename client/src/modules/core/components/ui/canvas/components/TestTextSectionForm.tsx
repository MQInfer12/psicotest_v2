import { useEffect } from "react";
import Input from "../../Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextSectionDTO,
  TextSectionDTOSchema,
} from "../validations/textSection.schema";
import { TestForm } from "@/modules/features/tests/api/dtos";
import { Item } from "@/modules/features/tests/types/TestType";
import Button from "../../Button";
import Icon from "../../../icons/Icon";

interface Props {
  form: TestForm[];
  setForm: React.Dispatch<React.SetStateAction<TestForm[]>>;
  pregunta: Item;
  finished: boolean;
}

const TestTextSectionForm = ({ form, pregunta, setForm, finished }: Props) => {
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
          idOpcion: [value],
        },
      ]);
    } else {
      setForm((prev) =>
        prev.map((p) => {
          if (p.idPregunta === pregunta.id) {
            const idOpcion = p.idOpcion as string[];
            return {
              ...p,
              idOpcion: [...idOpcion, value],
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

  return (
    <form onSubmit={handleSubmit(handleWords)} className="flex items-end gap-4">
      <Input
        className="test-text-section-input"
        {...register("word")}
        error={errors.word?.message}
        label="Escribe una palabra"
        disabled={finished}
      />
      <Button
        type="submit"
        icon={Icon.Types.CHEVRON_RIGHT}
        disabled={finished}
      />
    </form>
  );
};

export default TestTextSectionForm;
