import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { Case } from "@/modules/features/calendar/api/responses";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChangeCaseNameDTOSchema } from "../../../calendar/validations/ChangeCaseNameDTO.schema";
import { ChangeCaseNameDTO } from "@/modules/features/calendar/api/dtos";

interface Props {
  idCaso: number;
  nombre: string | null;
  onSuccess: (caso: Case) => void;
}

const ChangeCaseNameForm = ({ idCaso, nombre, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  
  const { postData } = useFetch();
  const patchMutation = postData("PATCH /caso/cambiar-nombre/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: nombre ?? "",
    },
    resolver: yupResolver(ChangeCaseNameDTOSchema),
  });

  const onSubmit = (form: ChangeCaseNameDTO) => {
    setLoading(true);
    patchMutation(form, {
      params: {
        id: idCaso,
      },
      onSuccess: (res) => {
        toastSuccess(res.message);
        onSuccess(res.data);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre"
        error={errors.nombre?.message}
        {...register("nombre")}
      />
      <div className="flex items-center w-full gap-2">
        <Button className="flex-1" disabled={loading} type="submit">
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default ChangeCaseNameForm;
