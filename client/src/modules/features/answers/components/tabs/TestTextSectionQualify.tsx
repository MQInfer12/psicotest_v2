import { TextSectionOption } from "@/modules/features/tests/api/dtos";
import { Item, Seccion } from "@/modules/features/tests/types/TestType";
import clsx from "clsx";
import { useAnswerContext } from "../../context/AnswerContext";
import { useDebounce } from "@/modules/core/hooks/useDebounce";
import { Fragment, useEffect, useState } from "react";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Icon from "@/modules/core/components/icons/Icon";

interface Props {
  seccion: Seccion;
}

const TestTextSectionQualify = ({ seccion }: Props) => {
  const { data, resultados, setResultados } = useAnswerContext();
  const { debouncedValue, isDebouncing, isFirstRender } = useDebounce(
    JSON.stringify(resultados),
    {
      delay: 2000,
      returnFirstRender: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { getDataSetter, postData } = useFetch();
  const mutation = postData("PUT /respuesta/:id");
  const testSetter = getDataSetter([
    "GET /test/for/respuesta/:id",
    {
      id: data.id_respuesta,
    },
  ]);

  const handleSend = (body: string) => {
    mutation(
      {
        resultados: body,
      },
      {
        params: {
          id: data.id_respuesta,
        },
        onSuccess: () => {
          setSuccess(true);
          testSetter((prev) => {
            return {
              ...prev,
              resultados: body,
            };
          });
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  useEffect(() => {
    if (debouncedValue) {
      setLoading(true);
      handleSend(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (success) {
      timeout = setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [success]);

  const handleCorrect = (item: Item, opcion: TextSectionOption) => {
    setResultados((prev) =>
      prev.map((resultado) => {
        if (resultado.idPregunta === item.id) {
          const opciones = resultado.idOpcion as TextSectionOption[];
          return {
            ...resultado,
            idOpcion: opciones.map((op) => {
              if (op.id === opcion.id) {
                return {
                  ...op,
                  correct: !op.correct,
                };
              }
              return op;
            }),
          };
        }
        return resultado;
      })
    );
  };

  const getRepeatedWords = (options: TextSectionOption[]) => {
    const wordCounts: Record<string, number> = {};
    options.forEach((option) => {
      if (option.correct) {
        const word = option.word.toLowerCase();
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    return new Set(
      Object.keys(wordCounts).filter((word) => wordCounts[word] > 1)
    );
  };

  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <div className="bg-primary-100 dark:bg-primary-1000 flex justify-center h-5 text-alto-700 dark:text-alto-400">
        {(isDebouncing || loading) && !isFirstRender ? (
          <small className="flex items-center gap-2">
            Procesando cambios...
            <div className="w-4 aspect-square">
              <Icon type={Icon.Types.LOADER} />
            </div>
          </small>
        ) : success && !isDebouncing ? (
          <small className="flex items-center gap-2">
            Cambios guardados correctamente
            <div className="w-4 aspect-square text-success">
              <Icon type={Icon.Types.CHECK} />
            </div>
          </small>
        ) : (
          <small className="">Realiza las correcciones correspondientes</small>
        )}
      </div>
      {seccion.items.map((item) => {
        const respuesta = resultados.find((r) => r.idPregunta === item.id);
        if (!respuesta) return;
        const opciones = respuesta.idOpcion as TextSectionOption[];
        const repeatedWords = getRepeatedWords(opciones);
        return (
          <Fragment key={item.id}>
            <div className="bg-primary-100 dark:bg-primary-1000 px-4 py-1">
              <strong className="text-sm text-alto-950 dark:text-alto-50">{item.descripcion}</strong>
            </div>
            <div className="flex flex-wrap gap-2 px-4 py-2">
              {opciones.map((opcion) => (
                <button
                  key={opcion.id}
                  className={clsx(
                    "px-2 py-1 w-fit h-fit rounded-md transition-all duration-300",
                    {
                      "bg-success/10 text-success": opcion.correct,
                      "bg-danger/10 text-danger": !opcion.correct,
                      "bg-warning/10 text-warning":
                        opcion.correct &&
                        repeatedWords.has(opcion.word.toLowerCase()),
                    }
                  )}
                  onClick={() => handleCorrect(item, opcion)}
                >
                  {opcion.word}
                </button>
              ))}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default TestTextSectionQualify;
