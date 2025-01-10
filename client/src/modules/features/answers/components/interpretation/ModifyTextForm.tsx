import Button from "@/modules/core/components/ui/Button";
import TextArea from "@/modules/core/components/ui/TextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  text: yup.string().required("El texto es requerido"),
});

type Dto = yup.InferType<typeof schema>;

interface Props {
  text: string | null;
  setEdit: React.Dispatch<React.SetStateAction<string | null>>;
  closeModal: () => void;
}

const ModifyTextForm = ({ text, setEdit, closeModal }: Props) => {
  const initialText = text ?? "No deberías poder ver esto";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: initialText,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (form: Dto) => {
    setEdit((prev) => {
      return prev?.replaceAll(initialText, form.text) ?? null;
    });
    closeModal();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        label="Texto"
        error={errors.text?.message}
        {...register("text")}
        required
      />
      <Button type="submit">Enviar</Button>
    </form>
  );
};

export default ModifyTextForm;
