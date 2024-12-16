import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { Navigate, useParams } from "@tanstack/react-router";

const FolderSharePage = () => {
  const { id } = useParams({
    from: "/_private/folder/$id",
  });

  const { fetchData } = useFetch();
  const { data, isLoading } = fetchData([
    "POST /carpeta_compartir/:idCarpeta",
    {
      idCarpeta: Number(id),
    },
  ]);

  if (!isLoading) {
    return (
      <Navigate
        to="/answers"
        search={{ folders: data ? [data.id_carpeta] : [] }}
      />
    );
  }
  return <Loader />;
};

export default FolderSharePage;
