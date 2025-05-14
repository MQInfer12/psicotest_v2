import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { CloseCaseDTO } from "@/modules/features/calendar/api/dtos";
import { Case } from "@/modules/features/calendar/api/responses";
import { CloseCaseDTOSchema } from "@/modules/features/calendar/validations/CloseCaseDTO.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  idCaso: number;
  onSuccess: (data: Case) => void;
}

const CloseCaseForm = ({ idCaso, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const patchMutation = postData("PATCH /caso/cerrar/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      motivo_cierre: "Finalizado",
    },
    resolver: yupResolver(CloseCaseDTOSchema),
  });

  const onSubmit = (form: CloseCaseDTO) => {
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

  const motivo_cierre = watch("motivo_cierre");

  return (
    <form
      className="flex flex-col flex-1 overflow-hidden"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 flex-1 overflow-y-scroll overflow-x-hidden p-4">
        <Input
          label="Nombre"
          type="select"
          error={errors.motivo_cierre?.message}
          {...register("motivo_cierre")}
          required
        >
          <option value="Finalizado">Caso finalizado</option>
          <option value="Derivación">Derivación</option>
        </Input>
        {motivo_cierre === "Derivación" && (
          <Input
            label="Derivar a"
            type="select"
            error={errors.derivado_a?.message}
            {...register("derivado_a")}
            required
          >
            <option value="">Selecciona a donde se derivará</option>
            <option value="Psiquiatría">Psiquiatría</option>
            <option value="Psicología">Psicología</option>
            <option value="Neurología">Neurología</option>
          </Input>
        )}
        {motivo_cierre === "Derivación" && (
          <TextArea
            label="Resumen"
            error={errors.resumen?.message}
            required
            {...register("resumen")}
          />
        )}
      </div>
      <div className="flex items-center w-full gap-2 pl-4 pb-4 pt-0 pr-6">
        <Button className="flex-1" disabled={loading} type="submit">
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default CloseCaseForm;
