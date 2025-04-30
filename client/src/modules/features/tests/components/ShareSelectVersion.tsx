import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useEffect } from "react";

interface Props {
  idTest: number;
  nombre: string;
  value: number | undefined;
  onChange: (newValue: null | number) => void;
}

const ShareSelectVersion = ({ idTest, nombre, value, onChange }: Props) => {
  const { fetchData } = useFetch();
  const { data } = fetchData([
    "GET /version/test/:id",
    {
      id: idTest,
    },
  ]);

  const dataEmpty = data?.length === 0;

  useEffect(() => {
    if (data && !dataEmpty) {
      onChange(data[data.length - 1].id);
    }
  }, [data]);

  return (
    <Input
      type="select"
      label={nombre + " (Versión)"}
      value={value ?? ""}
      required
      onChange={(e) => {
        onChange(e.target.value ? Number(e.target.value) : null);
      }}
    >
      {data ? (
        <>
          {dataEmpty && <option value="">No exiten versiones</option>}
          {data.map((version) => (
            <option key={version.id} value={version.id}>
              {version.nombre}
            </option>
          ))}
        </>
      ) : (
        <option value="">Cargando...</option>
      )}
    </Input>
  );
};

export default ShareSelectVersion;
