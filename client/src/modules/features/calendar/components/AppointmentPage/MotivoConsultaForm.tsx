import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MotivoConsulta } from "../../api/responses";
import { yupResolver } from "@hookform/resolvers/yup";
import { MotivoConsultaDTOSchema } from "../../validations/MotivoConsultaDTO.schema";
import { MotivoConsultaDTO } from "../../api/dtos";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";

interface Props {
  motivoConsulta: MotivoConsulta | null;
  onSuccess: (folder: MotivoConsulta) => void;
  onSuccessDelete: (item: MotivoConsulta) => void;
}

const MotivoConsultaForm = ({
  motivoConsulta,
  onSuccess,
  onSuccessDelete,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const postMutation = postData("POST /motivo-consulta");
  const putMutation = postData("PUT /motivo-consulta/:id");
  const deleteMutation = postData("DELETE /motivo-consulta/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      descripcion: motivoConsulta?.descripcion ?? "",
    },
    resolver: yupResolver(MotivoConsultaDTOSchema),
  });

  const onSubmit = (form: MotivoConsultaDTO) => {
    setLoading(true);
    if (!motivoConsulta) {
      postMutation(form, {
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    } else {
      putMutation(form, {
        params: {
          id: motivoConsulta.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!motivoConsulta) return;
    toastConfirm(
      "¿Quieres eliminar el motivo de consulta permanentemente?",
      () => {
        setLoading(true);
        deleteMutation(null, {
          params: {
            id: motivoConsulta.id,
          },
          onSuccess(res) {
            toastSuccess(res.message);
            onSuccessDelete(motivoConsulta);
          },
          onSettled() {
            setLoading(false);
          },
        });
      }
    );
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Descripción"
        error={errors.descripcion?.message}
        {...register("descripcion")}
        required
      />
      <div className="flex items-center w-full gap-2">
        <Button className="flex-1" disabled={loading} type="submit">
          Enviar
        </Button>
        {motivoConsulta && (
          <Button
            btnType="secondary"
            className="flex-1"
            disabled={loading}
            type="button"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        )}
      </div>
    </form>
  );
};

export default MotivoConsultaForm;
