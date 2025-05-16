import Button from "@/modules/core/components/ui/Button";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { User } from "@/modules/features/users/api/responses";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CancelationDTO } from "../../api/dtos";
import { CancelationDTOSChema } from "../../validations/CancelationDTO.schema";

interface Props {
  idCita: number;
  onSuccess: (user: User) => void;
}

const CancelationForm = ({ idCita, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const patchMutation = postData("PATCH /cita/cancelacion/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelationDTO>({
    defaultValues: {
      descripcion: "",
    },
    resolver: yupResolver(CancelationDTOSChema),
  });

  const onSubmit = (form: CancelationDTO) => {
    setLoading(true);
    patchMutation(form, {
      params: {
        id: idCita,
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
      <TextArea
        label="Motivo de la cancelación"
        error={errors.descripcion?.message}
        {...register("descripcion")}
        required
      />
      <Button className="flex-1" disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default CancelationForm;
