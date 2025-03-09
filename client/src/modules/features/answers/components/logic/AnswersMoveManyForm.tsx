import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { useTableContext } from "@/modules/core/components/ui/table/context/TableContext";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAnswersHeaderContext } from "../../context/AnswersHeaderContext";

const schema = yup.object({
  id_carpeta: yup.string(),
});

type Dto = yup.InferType<typeof schema>;

const AnswersMoveManyForm = () => {
  const { selectedRows, resetSelectedRows } = useTableContext();
  const { refetch } = useAnswersHeaderContext();
  const { fetchData, postData } = useFetch();
  const { data: carpetas } = fetchData("GET /carpeta");
  const mutation = postData("PUT /respuesta/move/many");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (form: Dto) => {
    const ids = selectedRows.map(Number);
    mutation(
      {
        ids,
        id_carpeta: form.id_carpeta,
      },
      {
        onSuccess(res) {
          toastSuccess(res.message);
          resetSelectedRows();
          refetch();
        },
      }
    );
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Carpeta de destino"
        type="select"
        {...register("id_carpeta")}
        error={errors.id_carpeta?.message}
        required
      >
        <option value="">Sin clasificación</option>
        {carpetas
          /* ?.filter((c) => c.tipo === "propia") */
          ?.map((c) => <option value={c.id}>{c.descripcion}</option>)}
      </Input>
      <Button type="submit">Enviar</Button>
    </form>
  );
};

export default AnswersMoveManyForm;
