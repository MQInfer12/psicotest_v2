import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CancelationDTO } from "../../api/dtos";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CancelationDTOSChema } from "../../validations/CancelationDTO.schema";
import { toastSuccess } from "@/modules/core/utils/toasts";
import Button from "@/modules/core/components/ui/Button";

interface Props {
  idCita: number;
}

const CancelationForm = ({ idCita }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const patchMutation = postData("PATCH /cita/cancelacion/:id");

  const navigate = useNavigate();

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
        navigate({
          to: "/calendar",
        });
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
