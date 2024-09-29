import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { TestForm } from "@/modules/features/tests/api/dtos";
import { useState } from "react";

export const useTestSender = (
  idRespuesta: number | undefined,
  resultados: TestForm[] | null
) => {
  const [finished, setFinished] = useState(!!resultados);
  const [finishedPage, setFinishedPage] = useState(false);

  const { getDataSetter, postData } = useFetch();
  const mutation = postData("PUT /respuesta/:id");
  const testsSetter = getDataSetter("GET /respuesta/for/resolve");
  const testSetter = getDataSetter([
    "GET /test/by/respuesta/:id",
    {
      id: Number(idRespuesta),
    },
  ]);

  const handleSend = async (form: TestForm[]) => {
    if (!idRespuesta) return;
    mutation(
      {
        resultados: JSON.stringify(form),
      },
      {
        params: {
          id: idRespuesta,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setFinishedPage(true);
          setFinished(true);
          testsSetter((old) => {
            return old.map((v) => {
              if (v.id_respuesta === res.data.id_respuesta) return res.data;
              return v;
            });
          });
          testSetter((prev) => ({
            ...prev,
            resultados: JSON.stringify(form),
          }));
        },
      }
    );
  };

  return { handleSend, finished, finishedPage, setFinishedPage };
};
