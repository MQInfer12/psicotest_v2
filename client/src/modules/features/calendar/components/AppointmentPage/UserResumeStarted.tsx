import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { measureAge } from "@/modules/core/utils/measureAge";
import { toastError } from "@/modules/core/utils/toasts";
import { getAIResponse } from "@/modules/features/answers/utils/AIResponse";
import { User } from "@/modules/features/users/api/responses";
import { useEffect } from "react";
import { useUserResumeContext } from "../../context/UserResumeContext";

interface Props {
  user: User;
}

const UserResumeStarted = ({ user }: Props) => {
  const {
    generating,
    generatingRef,
    index,
    messages,
    question,
    setGenerating,
    setIndex,
    setMessages,
    setQuestion,
    citas,
    config,
  } = useUserResumeContext();

  useEffect(() => {
    if (!citas) return;
    if (!config) return;
    if (messages[index].answer) return;
    if (generatingRef.current) return;
    generatingRef.current = true;
    setGenerating(true);
    let fullContent = "";
    getAIResponse(
      `
        Con el historial clínico del paciente:\n\n

        Nombre: ${user.nombre}\n
        Edad: ${user.fecha_nacimiento ?? "-"} (${user.fecha_nacimiento ? `${measureAge(user.fecha_nacimiento, getTodayUtc())} años` : "-"})\n
        Género: ${user.genero || "-"}\n
        Teléfono: ${user.telefono ?? "-"}\n
        Correo: ${user.email}\n
        Contacto (tutor): ${user.nombre_tutor ?? "-"} (Teléfono: ${user.telefono_tutor ?? "-"})\n\n

        Historial clínico del paciente:\n
        ${user.contador_citas > 0 ? `El paciente ha asistido a ${user.contador_citas} citas anteriormente en el gabinete psicológico.` : "El paciente no ha asistido a ninguna cita en el gabinete psicológico previamente."}\n\n

        ${
          user.contador_citas > 0
            ? `
            Detalles de las citas del paciente:\n\n
            ${citas.map((cita, index) => {
              return `
                # cita: ${index + 1}\n
                Psicólogo que le atendió: ${cita.nombre_psicologo}\n
                Fecha: ${cita.fecha}\n
                Hora: ${cita.hora_inicio} hasta ${cita.hora_final}\n
                Método (se le derivó o vino por cuenta propia): ${cita.metodo}\n
                Motivo: ${cita.motivo}\n
                Antecedentes familiares: ${cita.antecedentes}\n
                Observaciones: ${cita.observaciones}\n
                Se le derivó a: ${cita.derivado_a ?? "No se le derivó a ninguna otra especialidad"}\n\n
              `;
            })}
          `
            : ""
        }

        Responde las siguiente pregunta con los datos proporcionados: ${messages[index].question}
      `,
      (content) => {
        fullContent += content;
        setMessages((prev) =>
          prev.with(index, {
            question: prev[index].question,
            answer: fullContent,
          })
        );
      },
      {
        systemRole: `
          Eres un psicólogo profesional encargado del gabinete psicológico de la universidad Franz Tamayo encargado de atender a estudiantes que requieran de un análisis mental y psicológico debido a motivos personales o académicos. 
          Necesitas hacer un resumen del historial clínico y psicológico del paciente para dar una mejor idea previa del contexto del paciente, el usuario podrá preguntarte cosas que tendrás que responder con las mismas condiciones planteadas. 
          Recuerda que debes ser lo más objetivo posible  puedes especificar los datos personales del pacientesi es que se te hace la pregunta explicitamente, solo resumir los datos de las citas anteriores.
          Por otra parte recuerda que no debes ayudar al usuario en otras tareas que no sean dar resumenes acerca del historial del paciente.
          Por favor no pongas título ni nada, escribe SOLO UN párrafo de máximo 100 palabras.\n
          Resalta las palabras destacadas poniendolas dentro de una etiqueta <span></span> sin estilos, por ejemplo resalta el estado actual del paciente o si nunca vino a ninguna cita.
        `,
        model: config.gpt_model,
        onError: () => {
          toastError("Ocurrió un error al generar la respuesta");
        },
        onSuccess: () => {},
        onFinally: () => {
          generatingRef.current = false;
          setGenerating(false);
        },
      }
    );
  }, [citas, config, index, messages]);

  return (
    <div className="flex flex-col w-full h-full text-alto-950 dark:text-alto-50">
      <header className="py-2 px-5 border-b border-alto-300/80 dark:border-alto-900 flex items-center justify-between gap-6">
        <small className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {messages[index].question}
        </small>
        <div className="flex items-center">
          <small className="mr-2 text-[10px] whitespace-nowrap">
            {index + 1} / {messages.length}
          </small>
          <Button
            btnSize="small"
            btnType="tertiary"
            icon={Icon.Types.CHEVRON_LEFT}
            onClick={() =>
              setIndex((prev) => (prev === 0 ? messages.length - 1 : prev - 1))
            }
          />
          <Button
            btnSize="small"
            btnType="tertiary"
            icon={Icon.Types.CHEVRON_RIGHT}
            onClick={() =>
              setIndex((prev) => (prev === messages.length - 1 ? 0 : prev + 1))
            }
          />
        </div>
      </header>
      <main
        className="flex-1 overflow-y-scroll overflow-x-auto relative"
        onClick={() => document.getElementById("questionInput")?.focus()}
      >
        <div className="absolute inset-0 px-5 py-2">
          <small
            className="[&_span]:text-primary-500 dark:[&_span]:text-primary-400"
            dangerouslySetInnerHTML={{
              __html: messages[index].answer ?? "",
            }}
          />
        </div>
      </main>
      <form className="flex px-4 py-2 gap-2">
        <Input
          id="questionInput"
          type="text"
          placeholder="Haz alguna pregunta acerca del paciente"
          inputSize="small"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={generating}
          autoFocus
        />
        <Button
          btnSize="small"
          disabled={generating}
          onClick={(e) => {
            e.preventDefault();
            setMessages((prev) => [...prev, { question, answer: null }]);
            setIndex(() => messages.length);
            setQuestion("");
          }}
        >
          Enviar
        </Button>
      </form>
    </div>
  );
};

export default UserResumeStarted;
