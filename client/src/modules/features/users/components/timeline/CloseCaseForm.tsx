import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { getAIResponse } from "@/modules/features/answers/utils/AIResponse";
import { CloseCaseDTO } from "@/modules/features/calendar/api/dtos";
import { Case } from "@/modules/features/calendar/api/responses";
import { CloseCaseDTOSchema } from "@/modules/features/calendar/validations/CloseCaseDTO.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  caso: Case;
  onSuccess: (data: Case) => void;
}

const CloseCaseForm = ({ caso, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const patchMutation = postData("PATCH /caso/cerrar/:id");

  const configMutation = postData("GET /configuracion");
  const citasMutation = postData("GET /cita/paciente/:email/psicotest");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      motivo_cierre: "Finalizado",
      descripcion_cierre: "",
    },
    resolver: yupResolver(CloseCaseDTOSchema),
  });

  const onSubmit = (form: CloseCaseDTO) => {
    setLoading(true);
    patchMutation(form, {
      params: {
        id: caso.id,
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
  const especialista = watch("derivado_a");
  const resumen = watch("resumen");

  const handleResume = () => {
    let newInterpretation = "";
    citasMutation(null, {
      params: {
        email: caso.email_paciente,
      },
      onSuccess: ({ data: citas }) => {
        const citasDelCaso = citas.filter((c) => c.id_caso === caso.id);

        const motivoDelCaso = citasDelCaso
          .map((c) => c.descripcion_motivo_consulta)
          .filter(Boolean)
          .join(", ");

        const antecedentes =
          citasDelCaso
            .filter((c) => !!c.antecedentes)
            .map((cita) => cita.antecedentes)
            .join(", ") + ".";

        const descripcionDelMotivo =
          citasDelCaso
            .filter((c) => !!c.motivo)
            .map((cita) => cita.motivo)
            .join(". ") + ".";

        const observaciones =
          citasDelCaso.map((cita) => cita.observaciones).join(". ") + ".";

        configMutation(null, {
          onSuccess: ({ data: config }) => {
            setLoading(true);
            getAIResponse(
              `Necesito que me hagas un resumen del caso clínico psicológico, el estudiante me dió a entender lo siguiente:\n El motivo de la primera consulta del caso fué: ${motivoDelCaso}, la descripción del motivo es el siguiente: ${descripcionDelMotivo}, la historia y antecedentes familiares del estudiante son los siguientes: ${antecedentes} y además se observó que: ${observaciones}, por favor necesito que me hagas un resumen del caso para poder derivarlo al especialista correspondiente ${
                especialista ? `(${especialista})` : ""
              } (no muy largo pero siendo específico en los problemas que el especialista pueda solucionar acerca del paciente).`,
              (content) => {
                newInterpretation += content;
                setValue("resumen", newInterpretation);
              },
              {
                systemRole: `
                Eres el ayudante del psicólogo profesional encargado del gabinete psicológico de la universidad Franz Tamayo encargado de atender a estudiantes que requieran de un análisis mental y psicológico debido a motivos personales o académicos. Hoy el psicólogo decidió cerrar el caso del paciente para poder derivarlo a otra especialidad de convenio, necesitas hacer un resumen de la cita para enviarlo al especialista correspondiente, recuerda que debes ser lo más objetivo posible y no debes incluir mucha información personal del paciente, solo lo que se habló en el caso, el psicólogo te proporcionará los datos necesarios del caso, por favor no pongas título ni nada, escribe SOLO UN párrafo de máximo 200 palabras.\n
              `,
                model: config.gpt_model,
                onError: () => {
                  console.log("Error");
                },
                onFinally: () => {
                  setLoading(false);
                },
              }
            );
          },
        });
      },
    });
  };

  return (
    <form
      className="flex flex-col flex-1 overflow-hidden"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 flex-1 overflow-y-scroll overflow-x-hidden p-4">
        <Input
          label="Motivo de cierre"
          type="select"
          error={errors.motivo_cierre?.message}
          {...register("motivo_cierre")}
          required
        >
          <option value="Finalizado">Finalizado</option>
          <option value="Derivación">Derivación</option>
        </Input>
        <TextArea
          label="Descripción del motivo de cierre"
          error={errors.descripcion_cierre?.message}
          placeholder="Se indica si el paciente fue dado de alta, si el paciente dejó de asistir, etc."
          required
          {...register("descripcion_cierre")}
        />
        {motivo_cierre === "Derivación" && (
          <>
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
              <option value="Psicología y psiquiatría">
                Psicología y psiquiatría
              </option>
            </Input>
            <TextArea
              label="Resumen del caso para el especialista"
              error={errors.resumen?.message}
              required
              {...register("resumen")}
            />
            <div className="self-end">
              <Button
                icon={loading ? Icon.Types.LOADER : Icon.Types.GPT}
                btnType={resumen ? "secondary" : "primary"}
                onClick={handleResume}
                type="button"
                disabled={!especialista || loading}
              >
                Resumir
              </Button>
            </div>
          </>
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
