import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FichaDTOSchema } from "../../validations/FichaDTO.schema";
import { useForm } from "react-hook-form";
import { Appointment } from "../../api/responses";
import { FichaDTO } from "../../api/dtos";

interface Props {
  cita: Appointment;
  onSuccess: (data: Appointment) => void;
}

const FichaForm = ({ cita, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const putMutation = postData("PUT /cita/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      metodo: cita.metodo ?? "",
      motivo: cita.motivo ?? "",
      antecedentes: cita.antecedentes ?? "",
      observaciones: cita.observaciones ?? "",
    },
    resolver: yupResolver(FichaDTOSchema),
  });

  const onSubmit = (form: FichaDTO) => {
    setLoading(true);
    putMutation(form, {
      params: {
        id: cita.id,
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
    <form
      className="overflow-y-scroll overflow-x-hidden min-h-full flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-4 flex flex-col gap-4">
        <Input
          label="Método de consulta"
          type="select"
          required
          error={errors.metodo?.message}
          {...register("metodo")}
        >
          <option value="">Selecciona un método</option>
          <option value="Derivación">Derivación</option>
          <option value="Búsqueda propia de apoyo">
            Búsqueda propia de apoyo
          </option>
        </Input>
        <TextArea
          label="Motivo de la consulta"
          required
          error={errors.motivo?.message}
          {...register("motivo")}
        />
        <TextArea
          label="Historia y antecedentes familiares breve"
          required
          error={errors.antecedentes?.message}
          {...register("antecedentes")}
        />
        <TextArea
          label="Observaciones"
          required
          error={errors.observaciones?.message}
          {...register("observaciones")}
        />
      </div>
      <div className="sticky bottom-0 left-0 right-0 p-4 pt-0 bg-alto-50 dark:bg-alto-1000">
        <Button disabled={loading} type="submit" className="w-full">
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default FichaForm;
