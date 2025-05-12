import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { formatDate } from "@/modules/core/utils/formatDate";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FichaDTO } from "../../api/dtos";
import { Appointment, MetodoConsulta } from "../../api/responses";
import { useUserResumeContext } from "../../context/UserResumeContext";
import { FichaDTOSchema } from "../../validations/FichaDTO.schema";

interface Props {
  cita: Appointment;
  onSuccess: (data: Appointment) => void;
  disabled: boolean;
  preview?: boolean;
}

const FichaForm = ({ cita, onSuccess, disabled, preview }: Props) => {
  const [loading, setLoading] = useState(false);

  const { citas } = preview ? {} : useUserResumeContext();

  const { postData } = useFetch();
  const putMutation = postData("PUT /cita/:id");
  const closeClinicallyMutation = postData("PATCH /cita/cerrar/:id");
  const closeCaseMutation = postData("PATCH /caso/cerrar/cita/:idCita");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      metodo: cita.metodo,
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

  const handleCloseCase = () => {
    toastConfirm(
      "Se cerrará el caso anterior y se iniciará uno nuevo a partir de esta sesión (se reseteará el formulario).",
      () => {
        setLoading(true);
        closeCaseMutation(null, {
          params: {
            idCita: cita.id,
          },
          onSuccess: (res) => {
            toastSuccess(res.message);
            onSuccess(res.data);
          },
          onSettled: () => {
            setLoading(false);
          },
        });
      }
    );
  };

  const handleCloseClinically = () => {
    toastConfirm(
      "Se confirmará la sesión y no se podrá volver a modificar.",
      () => {
        setLoading(true);
        closeClinicallyMutation(null, {
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
      }
    );
  };

  const emptyForm = () => {
    setValue("motivo", "");
    setValue("antecedentes", "");
    setValue("observaciones", "");
  };

  const { metodo, motivo, antecedentes, observaciones } = watch();
  const somethingsFilled = [motivo, antecedentes, observaciones].some(Boolean);

  return (
    <div className="flex flex-col h-full relative">
      {cita.fecha_cierre_clinico && (
        <span className="absolute bottom-0 left-0 z-10 px-4 py-1 bg-success rounded-tr-lg text-sm font-semibold text-white">
          Sesión cerrada el día {formatDate(cita.fecha_cierre_clinico)}
        </span>
      )}
      <form
        className="flex-1 flex flex-col relative isolate overflow-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-scroll overflow-x-hidden">
          <div className="flex items-end gap-4">
            <Input
              label="Método de consulta"
              type="select"
              required
              disabled={disabled}
              name="metodo"
              value={metodo}
              onBlur={register("metodo").onBlur}
              onChange={(e) => {
                const value = e.target.value;
                if (somethingsFilled) {
                  toastConfirm("Se reseteará el formulario.", () => {
                    setValue("metodo", value);
                    emptyForm();
                  });
                } else {
                  setValue("metodo", value);
                  emptyForm();
                }
              }}
              error={errors.metodo?.message}
            >
              <option value={cita.metodo_inicial}>{cita.metodo_inicial}</option>
              <option value={MetodoConsulta.Inasistencia}>
                {MetodoConsulta.Inasistencia}
              </option>
            </Input>
            {cita.metodo === MetodoConsulta.Reconsulta &&
              !cita.observaciones && (
                <Button
                  type="button"
                  disabled={loading}
                  icon={Icon.Types.X}
                  subicon={Icon.Types.ARROW_RIGHT}
                  btnType="secondary"
                  danger
                  title="Cerrar el caso anterior e iniciar uno nuevo a partir de esta sesión"
                  onClick={handleCloseCase}
                />
              )}
          </div>
          {metodo !== MetodoConsulta.Inasistencia && (
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
          )}
          {metodo !== MetodoConsulta.Inasistencia && (
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
          )}
          <TextArea
            label="Reporte de sesión"
            required
            error={errors.observaciones?.message}
            disabled={disabled}
            {...register("observaciones")}
          />
        </div>
        {!disabled && (
          <div className="p-4 pt-0 bg-alto-50 dark:bg-alto-1000 flex gap-4 pr-[24px]">
            <Button disabled={loading} type="submit" className="w-full">
              Guardar
            </Button>
            {cita.observaciones && (
              <Button
                type="button"
                disabled={loading}
                btnType="secondary"
                danger
                icon={Icon.Types.CANCEL}
                onClick={handleCloseClinically}
              >
                Cerrar clínicamente
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default FichaForm;
