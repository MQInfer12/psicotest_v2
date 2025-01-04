import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { App_Configuracion } from "../api/responses";
import { useForm } from "react-hook-form";
import { App_ConfiguracionDTO } from "../api/dtos";
import { yupResolver } from "@hookform/resolvers/yup";
import { App_ConfiguracionDTOSchema } from "../validations/App_ConfiguracionDTO.schema";
import { useState } from "react";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { OpenAIModel } from "../../answers/utils/AIResponse";
import Input from "@/modules/core/components/ui/Input";
import Button from "@/modules/core/components/ui/Button";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<App_ConfiguracionDTO>({
    defaultValues: { ...data },
    resolver: yupResolver(App_ConfiguracionDTOSchema),
  });

  const onSubmit = (form: App_ConfiguracionDTO) => {
    setLoading(true);
    mutation(form, {
      onSuccess: (res) => {
        toastSuccess(res.message);
        onSuccess(res.data);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Modelo de GPT"
        error={errors.gpt_model?.message}
        type="select"
        {...register("gpt_model")}
      >
        {Object.values(OpenAIModel).map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </Input>
      <Button disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default SettingsForm;
