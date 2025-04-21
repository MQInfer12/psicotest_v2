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
import { User } from "@/modules/features/users/api/responses";
import { useUserResumeContext } from "../../context/UserResumeContext";

export enum MetodoConsulta {
  BúsquedaPropiaApoyo = "Búsqueda propia de apoyo",
  Derivacion = "Derivación",
  Reconsulta = "Reconsulta",
}

interface Props {
  paciente: User;
  cita: Appointment;
  onSuccess: (data: Appointment) => void;
  disabled: boolean;
  preview?: boolean;
}

const FichaForm = ({ paciente, cita, onSuccess, disabled, preview }: Props) => {
  const [loading, setLoading] = useState(false);

  const { citas } = preview ? {} : useUserResumeContext();

  const { postData } = useFetch();
  const putMutation = postData("PUT /cita/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      metodo:
        cita.metodo ??
        (paciente.contador_citas > 0 && !disabled ? "Reconsulta" : ""),
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

  const metodo = watch("metodo");

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
          disabled={disabled}
          {...register("metodo")}
        >
          <option value="">Selecciona un método</option>
          <option value={MetodoConsulta.Derivacion}>
            {MetodoConsulta.Derivacion}
          </option>
          <option value={MetodoConsulta.BúsquedaPropiaApoyo}>
            {MetodoConsulta.BúsquedaPropiaApoyo}
          </option>
          {paciente.contador_citas > 0 && (
            <option value={MetodoConsulta.Reconsulta}>
              {MetodoConsulta.Reconsulta}
            </option>
          )}
        </Input>
        <TextArea
          label={
            metodo === MetodoConsulta.Reconsulta
              ? "Motivo de la reconsulta (opcional)"
              : "Motivo de la consulta"
          }
          required={metodo !== MetodoConsulta.Reconsulta}
          error={errors.motivo?.message}
          disabled={disabled}
          placeholder={
            metodo === MetodoConsulta.Reconsulta
              ? citas
                  ?.filter((cita) => !!cita.motivo)
                  .map((cita) => cita.motivo + "\n\n")
                  .join("")
              : undefined
          }
          {...register("motivo")}
        />
        <TextArea
          label={
            metodo === MetodoConsulta.Reconsulta
              ? "Antecedentes familiares adicionales (opcional)"
              : "Historia y antecedentes familiares breve"
          }
          required={metodo !== MetodoConsulta.Reconsulta}
          error={errors.antecedentes?.message}
          disabled={disabled}
          placeholder={
            metodo === MetodoConsulta.Reconsulta
              ? citas
                  ?.filter((cita) => !!cita.antecedentes)
                  .map((cita) => cita.antecedentes + "\n\n")
                  .join("")
              : undefined
          }
          {...register("antecedentes")}
        />
        <TextArea
          label="Reporte de sesión"
          required
          error={errors.observaciones?.message}
          disabled={disabled}
          {...register("observaciones")}
        />
      </div>
      {!disabled && (
        <div className="sticky bottom-0 left-0 right-0 p-4 pt-0 bg-alto-50 dark:bg-alto-1000">
          <Button disabled={loading} type="submit" className="w-full">
            Guardar
          </Button>
        </div>
      )}
    </form>
  );
};

export default FichaForm;
