import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DerivacionDTO } from "../../api/dtos";
import { Appointment } from "../../api/responses";
import { DerivacionDTOSchema } from "../../validations/DerivacionDTO.schema";
import Icon from "@/modules/core/components/icons/Icon";
import { getAIResponse } from "@/modules/features/answers/utils/AIResponse";
import { User } from "@/modules/features/users/api/responses";

interface Props {
  user: User;
  cita: Appointment;
  onSuccess: (data: Appointment) => void;
  disabled: boolean;
}

const DerivacionForm = ({ user, cita, onSuccess, disabled }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const putMutation = postData("PUT /cita/:id");
  const configMutation = postData("GET /configuracion");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      derivado_a: cita.derivado_a ?? "",
      resumen: cita.resumen ?? "",
    },
    resolver: yupResolver(DerivacionDTOSchema),
  });

  const onSubmit = (form: DerivacionDTO) => {
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

  const handleResume = () => {
    let newInterpretation = "";
    configMutation(null, {
      onSuccess: ({ data: config }) => {
        getAIResponse(
          `Necesito que me hagas un resumen de la cita con el estudiante ${user.nombre}, el estudiante me dió a entender lo siguiente:\n El motivo de la consulta fué: ${cita.motivo}, la historia y antecedentes familiares del estudiante son los siguientes: ${cita.antecedentes} y además observé que: ${cita.observaciones}, por favor necesito que me hagas un resumen de la cita para poder derivarlo al especialista correspondiente (no muy largo).`,
          (content) => {
            newInterpretation += content;
            setValue("resumen", newInterpretation);
          },
          {
            systemRole: `
                Eres un psicólogo profesional encargado del gabinete psicológico de la universidad Franz Tamayo encargado de atender a estudiantes que requieran de un análisis mental y psicológico debido a motivos personales o académicos. Hoy tienes una cita con un estudiante que esta siento derivado a otro especialista en salud mental, necesitas hacer un resumen de la cita para enviarlo al especialista correspondiente, recuerda que debes ser lo más objetivo posible y no debes incluir información personal del paciente, solo lo que se habló en la cita, por favor no pongas título ni nada, escribe SOLO UN párrafo de máximo 100 palabras.\n
              `,
            model: config.gpt_model,
            onError: () => {
              console.log("Error");
            },
            onSuccess: () => {},
            onFinally: () => {},
          }
        );
      },
    });
  };

  return (
    <form
      className="overflow-y-scroll overflow-x-hidden min-h-full flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-1 p-4 flex flex-col gap-4">
        <Input
          label="Derivar a"
          type="select"
          error={errors.derivado_a?.message}
          disabled={disabled}
          {...register("derivado_a")}
        >
          <option value="">Selecciona a donde se derivará</option>
          <option value="Psiquiatría">Psiquiatría</option>
          <option value="Psicología">Psicología</option>
          <option value="Neurología">Neurología</option>
        </Input>
        {!disabled && (
          <div className="flex justify-end">
            <Button
              onClick={handleResume}
              type="button"
              btnType="secondary"
              icon={Icon.Types.GPT}
            >
              Resumir
            </Button>
          </div>
        )}
        <TextArea
          label="Resumen"
          error={errors.resumen?.message}
          disabled={disabled}
          {...register("resumen")}
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

export default DerivacionForm;
