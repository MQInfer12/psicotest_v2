import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OpenAIModel } from "../../answers/utils/AIResponse";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import { App_ConfiguracionForm } from "../api/dtos";
import { App_Configuracion } from "../api/responses";
import { App_ConfiguracionFormSchema } from "../validations/App_ConfiguracionForm.schema";

interface Props {
  onSuccess: (data: App_Configuracion) => void;
}

const SettingsForm = (props: Props) => {
  const { fetchData } = useFetch();
  const { data, isFetching } = fetchData("GET /configuracion");
  return data && !isFetching ? (
    <Render data={data} {...props} />
  ) : (
    <div className="py-10">
      <Loader />
    </div>
  );
};

interface RenderProps extends Props {
  data: App_Configuracion;
}

const Render = ({ data, onSuccess }: RenderProps) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const mutation = postData("PATCH /configuracion");

  const canChangeModel = usePermiso([Permisos.CONFIGURAR]);
  const canChangeApiKey = usePermiso(
    [Permisos.VER_CITAS, Permisos.VER_RESULTADOS],
    "or"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<App_ConfiguracionForm>({
    defaultValues: {
      gpt_key: localStorage.getItem("neurall_gpt_huevo") || "",
      ...data,
    },
    resolver: yupResolver(App_ConfiguracionFormSchema),
  });

  const onSubmit = (form: App_ConfiguracionForm) => {
    if (form.gpt_key?.trim()) {
      localStorage.setItem("neurall_gpt_huevo", form.gpt_key.trim());
    }
    if (canChangeModel) {
      setLoading(true);
      mutation(
        {
          gpt_model: form.gpt_model,
        },
        {
          onSuccess: (res) => {
            toastSuccess(res.message);
            onSuccess(res.data);
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {canChangeApiKey && (
        <Input
          label="Llave para GPT"
          error={errors.gpt_key?.message}
          {...register("gpt_key")}
        />
      )}
      {canChangeModel && (
        <Input
          label="Modelo de GPT"
          error={errors.gpt_model?.message}
          type="select"
          required
          {...register("gpt_model")}
        >
          {Object.values(OpenAIModel).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </Input>
      )}
      <Button disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default SettingsForm;
