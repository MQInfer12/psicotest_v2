import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { formatDate } from "@/modules/core/utils/formatDate";
import {
  toastConfirm,
  toastError,
  toastSuccess,
  toastWarning,
} from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FichaDTO } from "../../api/dtos";
import {
  Appointment,
  MetodoConsulta,
  MotivoConsulta,
} from "../../api/responses";
import { useUserResumeContext } from "../../context/UserResumeContext";
import { FichaDTOSchema } from "../../validations/FichaDTO.schema";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import MotivoConsultaForm from "./MotivoConsultaForm";
import InputFile from "@/modules/core/components/ui/InputFile";
import { getAIResponseImage } from "@/modules/features/answers/utils/AIResponseImage";
import { z } from "zod";

interface Props {
  cita: Appointment;
  onSuccess: (data: Appointment) => void;
  disabled: boolean;
  preview?: boolean;
}

const FichaAIResponseSchema = z.object({
  descripcion_del_motivo_de_la_consulta: z.string(),
  antecedentes_e_historia_familiar: z.string(),
  reporte_de_sesion: z.string(),
});

const FichaForm = ({ cita, onSuccess, disabled, preview }: Props) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(false);

  const { citas } = preview ? {} : useUserResumeContext();

  const { fetchData, postData } = useFetch();

  const { data: motivosConsulta, setData: setMotivosConsulta } = fetchData(
    "GET /motivo-consulta"
  );

  const { modal, setOpen } = useModal<MotivoConsulta>();

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
      id_motivo_consulta: cita.id_motivo_consulta ?? null,
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
    setValue("id_motivo_consulta", null);
  };

  const { metodo, id_motivo_consulta, motivo, antecedentes, observaciones } =
    watch();

  const somethingsFilled = [
    motivo,
    antecedentes,
    observaciones,
    id_motivo_consulta,
  ].some(Boolean);

  const somethingsFilledWithoutMotivo = [
    motivo,
    antecedentes,
    observaciones,
  ].some(Boolean);

  const onChangeFile = (file: File | null) => {
    if (!file) {
      return toastWarning("No se ha subido ningún archivo");
    }
    setLoadingAI(true);
    getAIResponseImage(
      file,
      FichaAIResponseSchema,
      (res) => {
        const parsed = JSON.parse(res);
        const data = FichaAIResponseSchema.safeParse(parsed).data;
        if (!data) {
          return toastWarning("Error al procesar la imagen");
        }
        setValue(
          "motivo",
          data.descripcion_del_motivo_de_la_consulta ===
            "Información no disponible"
            ? ""
            : data.descripcion_del_motivo_de_la_consulta
        );
        setValue(
          "antecedentes",
          data.antecedentes_e_historia_familiar === "Información no disponible"
            ? ""
            : data.antecedentes_e_historia_familiar
        );
        setValue(
          "observaciones",
          data.reporte_de_sesion === "Información no disponible"
            ? ""
            : data.reporte_de_sesion
        );
      },
      {
        addedPrompt:
          "Si no encuentras algun campo en la imagen, responde 'Información no disponible'.",
        onSuccess: () => {
          toastSuccess("Imagen procesada correctamente");
        },
        onError: () => {
          toastError("Error al procesar la imagen");
        },
        onFinally: () => {
          setLoadingAI(false);
        },
      }
    );
  };

  return (
    <>
      {modal("Formulario de motivo de consulta", (item) => (
        <MotivoConsultaForm
          motivoConsulta={item}
          onSuccess={(res) => {
            if (item) {
              setMotivosConsulta((prev) =>
                prev.map((m) => (m.id === res.id ? res : m))
              );
            } else {
              setMotivosConsulta((prev) => [...prev, res]);
              setValue("id_motivo_consulta", res.id);
            }
            setOpen(false);
          }}
          onSuccessDelete={(res) => {
            setValue("id_motivo_consulta", null);
            setMotivosConsulta((prev) => prev.filter((m) => m.id !== res.id));
            setOpen(false);
          }}
        />
      ))}
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
                label="Tipo de consulta"
                type="select"
                required
                disabled={disabled}
                name="metodo"
                value={metodo}
                ref={register("metodo").ref}
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
                <option value={cita.metodo_inicial}>
                  {cita.metodo_inicial}
                </option>
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

            {/* MOTIVO DE LA CONSULTA */}
            {metodo !== MetodoConsulta.Inasistencia &&
              metodo !== MetodoConsulta.Reconsulta && (
                <div className="flex items-end gap-4">
                  <Input
                    label={
                      metodo === MetodoConsulta.Reconsulta
                        ? "Motivo de la reconsulta (opcional)"
                        : "Motivo de la consulta"
                    }
                    required={metodo !== MetodoConsulta.Reconsulta}
                    type="select"
                    disabled={disabled}
                    {...register("id_motivo_consulta")}
                    error={errors.id_motivo_consulta?.message}
                    className={
                      !id_motivo_consulta
                        ? "!text-alto-400 dark:!text-alto-700"
                        : undefined
                    }
                    key={motivosConsulta?.length}
                  >
                    <option value="">
                      {cita.fecha_cierre_clinico
                        ? ""
                        : !motivosConsulta
                        ? "Cargando..."
                        : "Seleccionar..."}
                    </option>
                    {motivosConsulta
                      ?.filter(
                        (v) => !v.deleted_at || v.id === cita.id_motivo_consulta
                      )
                      .sort((a, b) =>
                        a.descripcion.localeCompare(b.descripcion)
                      )
                      .map((motivo) => (
                        <option key={motivo.id} value={motivo.id}>
                          {motivo.descripcion} {motivo.deleted_at && "(X)"}
                        </option>
                      ))}
                  </Input>
                  {!cita.fecha_cierre_clinico &&
                    (!id_motivo_consulta ? (
                      <Button
                        type="button"
                        disabled={loading}
                        icon={Icon.Types.ADD}
                        btnType="secondary"
                        title="Añadir nuevo motivo de consulta"
                        onClick={() => setOpen(true)}
                      />
                    ) : (
                      <Button
                        type="button"
                        disabled={loading}
                        icon={Icon.Types.PENCIL}
                        btnType="secondary"
                        title="Editar motivo de consulta"
                        onClick={() => {
                          const motivoConsulta = motivosConsulta?.find(
                            (motivo) =>
                              String(motivo.id) === String(id_motivo_consulta)
                          );
                          if (!motivoConsulta) return;
                          setOpen(motivoConsulta);
                        }}
                      />
                    ))}
                </div>
              )}

            {!disabled && (
              <div className="self-center">
                <InputFile
                  inputType="none"
                  accept=".jpeg, .png, .jpg"
                  state={null}
                  emptyOnChange
                  setstate={onChangeFile}
                  btnIcon={loadingAI ? Icon.Types.LOADER : Icon.Types.GPT}
                  maxsize={1024 * 5}
                  required
                  btnLabel="Subir nota física"
                  btnType={
                    !somethingsFilledWithoutMotivo ? "primary" : "secondary"
                  }
                  disabled={loadingAI || loading}
                  form="none"
                  beforeChange={(next) => {
                    if (somethingsFilledWithoutMotivo) {
                      toastConfirm("Se reseteará el formulario.", () => {
                        next();
                      });
                    } else {
                      next();
                    }
                  }}
                />
              </div>
            )}

            {metodo !== MetodoConsulta.Inasistencia && (
              <TextArea
                label={
                  metodo === MetodoConsulta.Reconsulta
                    ? "Descripción del motivo de la reconsulta (opcional)"
                    : "Descripción del motivo de la consulta"
                }
                required={metodo !== MetodoConsulta.Reconsulta}
                error={errors.motivo?.message}
                disabled={loadingAI || disabled}
                placeholder={
                  metodo === MetodoConsulta.Reconsulta &&
                  !cita.fecha_cierre_clinico
                    ? "AYUDA MEMORIA DEL CASO:\n\n" +
                      citas
                        ?.filter(
                          (c) => !!c.motivo && c.id_caso === cita.id_caso
                        )
                        .map((cita) => {
                          const motivoConsulta =
                            cita.descripcion_motivo_consulta;
                          const str = `${
                            motivoConsulta
                              ? `Motivo de consulta del caso: ${motivoConsulta}\n\n`
                              : ""
                          }${cita.motivo}\n\n`;
                          return str;
                        })
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
                disabled={loadingAI || disabled}
                placeholder={
                  metodo === MetodoConsulta.Reconsulta &&
                  !cita.fecha_cierre_clinico
                    ? "AYUDA MEMORIA DEL CASO:\n\n" +
                      citas
                        ?.filter(
                          (c) => !!c.antecedentes && c.id_caso === cita.id_caso
                        )
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
              disabled={loadingAI || disabled}
              {...register("observaciones")}
            />
          </div>
          {!disabled && (
            <div className="p-4 pt-0 bg-alto-50 dark:bg-alto-1000 flex gap-4 pr-[24px]">
              <Button
                disabled={loadingAI || loading}
                type="submit"
                className="w-full"
              >
                Guardar
              </Button>
              {cita.observaciones && (
                <Button
                  type="button"
                  disabled={loadingAI || loading}
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
    </>
  );
};

export default FichaForm;
