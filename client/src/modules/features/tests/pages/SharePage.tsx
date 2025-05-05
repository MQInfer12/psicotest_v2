import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

const SharePage = () => {
  const { test, allocator, folder } = useSearch({
    from: "/_private/tests/share",
  });

  const { postData } = useFetch();
  const mutation = postData("POST /respuesta");
  const navigate = useNavigate();

  console.log(test, allocator, folder);

  useEffect(() => {
    mutation(
      {
        id_test: test ?? [],
        email_asignador: allocator ?? "",
        id_carpeta: folder,
      },
      {
        onSuccess(res) {
          if (res.data.length === 0) {
            toastSuccess(
              "¡Felicidades! Ya resolviste todos los tests asignados por tu psicólogo correctamente."
            );
            navigate({
              to: "/tests",
            });
            return;
          }

          navigate({
            to: "/resolve/$idRespuesta",
            params: {
              idRespuesta: String(res.data[0]),
            },
          });
        },
        onError() {
          navigate({
            to: "/tests",
          });
        },
      }
    );
  }, []);

  return <Loader text="Cargando test..." />;
};

export default SharePage;
