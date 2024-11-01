import GptCanvas from "./interpretation/GptCanvas";
import { useAnswersHeaderContext } from "../context/AnswersHeaderContext";
import { Fragment, useEffect, useState } from "react";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { TestType } from "../../tests/types/TestType";
import { TestForm, TextSectionOption } from "../../tests/api/dtos";
import {
  cleanOptionTags,
  getOptionText,
} from "@/modules/core/components/ui/canvas/utils/dynamicOptions";
import { getAIResponse } from "../utils/AIResponse";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { TemplateType } from "../../templates/types/TemplateType";
import { measureAge } from "@/modules/core/utils/measureAge";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import { getPunctuations } from "../utils/getPunctuations";

const AnswersInterpretation = () => {
  const {
    setData,
    selectedTests,
    startedSelection,
    setStartedSelection,
    setSelectedTests,
  } = useAnswersHeaderContext();

  const { postData } = useFetch();
  const configMutation = postData("GET /configuracion");
  const getMutation = postData("GET /test/for/respuesta", {
    params: {
      ids: JSON.stringify(
        selectedTests?.selecteds.map((s) => s.id_respuesta) || []
      ),
    },
  });
  const patchMutation = postData("PATCH /respuesta/patch/interpretations");
  const [interpretation, setInterpretation] = useState<string | null>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedTests || !startedSelection || !!interpretation) return;
    const rawName = selectedTests.user.nombre.split(" ")[0].toLocaleLowerCase();
    const [firstLetter, ...letters] = rawName;
    const name = firstLetter.toLocaleUpperCase() + letters.join("");

    configMutation(null, {
      onError: () => {
        setLoading(false);
      },
      onSuccess: ({ data: config }) => {
        getMutation(null, {
          onError: () => {
            setLoading(false);
            setStartedSelection(null);
            setSelectedTests(null);
          },
          onSuccess: ({ data }) => {
            let prompt =
              "Soy un psicólogo profesional que trabaja con pacientes en una clínica privada. Mi objetivo es evaluar y comprender la salud mental de mis pacientes mediante la aplicación de diversos tests psicológicos.\n";
            prompt += `Hoy necesito analizar los datos de mi paciente ${name} en distintos tests psicológicos y cruzar información de estos\n`;

            data.forEach((respuesta, i) => {
              //TODO: ARREGLAR SECCIONES DE IMAGEN Y SECCIONES DE TEXTO

              const test: TestType = JSON.parse(respuesta.test);
              const canvas: CanvasType = JSON.parse(respuesta.canvas);
              const resultados: TestForm[] = JSON.parse(respuesta.resultados);

              const puntuaciones = getPunctuations(respuesta, test, resultados);

              prompt += `Proporciono la descripción y las preguntas del test #${i + 1} llamado ${respuesta.nombre_test} junto con las respuestas de ${name} para que realices el análisis correspondiente:\n\n`;

              prompt += "El test tiene como descripción la siguiente:\n\n";
              canvas.forEach((seccion) => {
                switch (seccion.type) {
                  case "subtitle":
                    prompt += seccion.content + ".-\n";
                    break;
                  case "paragraph":
                    prompt += seccion.content + "\n";
                    break;
                }
              });
              prompt += "\n";

              test.secciones.forEach((seccion, j) => {
                if (seccion.description) {
                  prompt += `Instrucciones que se le dieron a ${name} para la sección ${j + 1} del test:\n`;
                  seccion.description.forEach((d) => {
                    prompt += `${d.type === "title" ? "\n" : ""}${d.content}\n`;
                  });
                  prompt += "\n";
                } else {
                  prompt += `Sección ${j + 1} del test, se le puso las preguntas a ${name} sin ningún tipo de instrucción:\n\n`;
                }

                const itemsRespondidos = seccion.items.reduce((sum, item) => {
                  const resultado = resultados.find(
                    (resultado) => resultado.idPregunta === item.id
                  );
                  return resultado ? sum + 1 : sum;
                }, 0);

                prompt += `${name} respondió ${itemsRespondidos} de ${seccion.items.length} preguntas en esta sección:\n`;
                seccion.items.forEach((item, k) => {
                  const resultado = resultados.find(
                    (resultado) => resultado.idPregunta === item.id
                  );
                  const opciones = seccion.opciones.filter((opcion) => {
                    if (!resultado) return false;
                    switch (seccion.type ?? "single") {
                      case "single":
                        return opcion.id === (resultado.idOpcion as number);
                      case "multi":
                        return (resultado.idOpcion as number[]).includes(
                          opcion.id
                        );
                      default:
                        return false;
                    }
                  });

                  prompt += `Pregunta ${k + 1}: ${item.type === "image" ? "{haz de cuenta que aquí hay una imagen relacionada a la sección}" : cleanOptionTags(item.descripcion)}\n`;

                  if (seccion.type !== "text") {
                    const opcionesMarcadas = opciones
                      .map((o) => {
                        const descripcionReal = getOptionText(
                          item.descripcion,
                          o.id
                        );
                        return descripcionReal ?? o.descripcion;
                      })
                      .join(", ");
                    prompt += `Respuesta de ${name}: ${resultado ? opcionesMarcadas : seccion.timer ? "{no terminó de responder}" : "{no respondió}"}\n`;
                  } else {
                    const correctas = resultado
                      ? (resultado.idOpcion as TextSectionOption[]).filter(
                          (c) => c.correct
                        ).length
                      : 0;
                    prompt += `Respuestas correctas de ${name}: ${correctas}\n`;
                  }
                });
                prompt += "\n";
              });

              prompt += `Las puntuaciones de ${name} obtenidas en las diferentes dimensiones del test son:\n\n`;
              puntuaciones.forEach((puntuacion) => {
                prompt += `En la dimensión ${puntuacion.dimension}, ${name} obtuvo ${puntuacion.natural} puntos en el puntaje natural.\n`;
              });
              prompt += "\n";
            });

            prompt +=
              "Necesito que generes una respuesta basada en el siguiente formato que te voy a proporcionar, siguiendo las siguientes instrucciones: \n";
            prompt +=
              "- Solo escribe tus respuestas donde el texto esté encerrado entre corchetes [], le quitas los corchetes para escribir tu respuesta.\n";
            prompt +=
              "- No escribas el texto cuando esté encerrado entre llaves {} ya que estas son instrucciones para que generes la respuesta de manera más personalizada.\n\n";

            prompt += "No realices las siguientes acciones: \n";
            prompt +=
              "- No dejes ningún corchete en tu texto generado ya sean párrafos o viñetas.\n";
            prompt +=
              "- Lo que no está entre corchetes no lo modifiques ni lo reemplaces por nada más.\n";
            prompt += "- No reemplaces las etiquetas HTML por nada más.\n";

            const plantilla: TemplateType = JSON.parse(
              startedSelection.plantilla
            );
            plantilla.forEach((section) => {
              switch (section.type) {
                case "title":
                  prompt += `\n<strong class="title">${section.content}</strong>\n`;
                  break;
                case "subtitle":
                  prompt += `<strong class="subtitle">${section.content}</strong>\n`;
                  break;
                case "vignette":
                  prompt += `<span class="vignette">- <strong class="vignette-title">${section.title}</strong> ${section.content}\n</span>`;
                  break;
                case "paragraph":
                  prompt += `${section.content}\n`;
                  break;
              }
            });

            /*  console.log(prompt); */

            let newInterpretation = "";
            setInterpretation(null);
            getAIResponse(
              prompt,
              (content) => {
                newInterpretation += content;
                setInterpretation(newInterpretation);
              },
              {
                model: config.gpt_model,
                onFinally: () => {
                  setLoading(false);
                  console.log(newInterpretation);
                  patchMutation(
                    {
                      interpretaciones: selectedTests.selecteds.map((s) => ({
                        id: s.id_respuesta,
                        interpretacion: newInterpretation,
                      })),
                    },
                    {
                      onSuccess: (res) => {
                        toastSuccess(res.message);
                        setData((prev) =>
                          prev.map((row) => {
                            const data = res.data.find(
                              (r) => r.id_respuesta === row.id_respuesta
                            );
                            return data ?? row;
                          })
                        );
                      },
                    }
                  );
                },
              }
            );
          },
        });
      },
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center h-10 bg-primary-100 border-b border-alto-200/80">
        <small className="text-[10px] font-semibold px-5 [&>span]:text-primary-700">
          Generando respuesta para <span>{selectedTests?.user.nombre}</span>{" "}
          según {selectedTests?.selecteds.length === 1 ? "el " : "los "}
          test{selectedTests?.selecteds.length === 1 ? ": " : "s: "}
          {selectedTests?.selecteds.map((s, i) => (
            <Fragment key={s.id_test}>
              <span>{s.nombre_test}</span>{" "}
              {i !== selectedTests?.selecteds.length - 1 ? " / " : ""}
            </Fragment>
          ))}
        </small>
      </div>
      <GptCanvas
        content={interpretation || ""}
        loaded={!loading}
        data={{
          name: selectedTests?.user.nombre || "",
          age: selectedTests?.user.fechaNacimiento
            ? String(
                measureAge(
                  selectedTests.user.fechaNacimiento,
                  selectedTests.user.fechaEnviado
                )
              )
            : "No especificado",
          group: selectedTests
            ? Object.keys(
                Object.groupBy(
                  selectedTests.selecteds,
                  (row) => row.nombre_carpeta
                )
              ).join(" | ")
            : "",
        }}
      />
    </div>
  );
};

export default AnswersInterpretation;
