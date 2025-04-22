import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OcuppationDTOSchema } from "../../validations/OcuppationDTO.schema";
import { OcuppationDTO } from "../../api/dtos";
import {
  toastConfirm,
  toastSuccess,
  toastWarning,
} from "@/modules/core/utils/toasts";
import { Ocuppation } from "../../api/responses";
import Button from "@/modules/core/components/ui/Button";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";

interface Props {
  ocupacion: Ocuppation | null;
  onSuccess: (ocupacion: Ocuppation) => void;
  onSuccessDelete: () => void;
}

const OcuppationForm = ({ ocupacion, onSuccess, onSuccessDelete }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();

  const postMutation = postData("POST /ocupacion");
  const putMutation = postData("PUT /ocupacion/:id");
  const deleteMutation = postData("DELETE /ocupacion/:id");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OcuppationDTO>({
    defaultValues: {
      descripcion: ocupacion?.descripcion,
      fecha: ocupacion?.fecha ?? getTodayUtc(),
      hora_inicio: ocupacion?.hora_inicio,
      hora_final: ocupacion?.hora_final,
    },
    resolver: yupResolver(OcuppationDTOSchema),
  });

  const onSubmit = (form: OcuppationDTO) => {
    setLoading(true);
    if (!ocupacion) {
      postMutation(form, {
        onSuccess: (res) => {
          toastSuccess(res.message);
          if (res.data.citas_colindantes_count > 0) {
            toastWarning(
              "La ocupación tiene citas colindantes, coordina con el paciente para reprogramarlas o cancelarlas."
            );
          }
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    } else {
      putMutation(form, {
        params: {
          id: ocupacion.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          console.log(res.data);
          if (res.data.citas_colindantes_count > 0) {
            toastWarning(
              "La ocupación tiene citas colindantes, coordina con el paciente para reprogramarlas o cancelarlas."
            );
          }
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!ocupacion) return;
    toastConfirm("Se eliminará la ocupación permanentemente", () => {
      setLoading(true);
      deleteMutation(null, {
        params: {
          id: ocupacion.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccessDelete();
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Descripción"
        type="text"
        error={errors.descripcion?.message}
        required
        {...register("descripcion")}
      />
      <Input
        label="Fecha"
        type="date"
        error={errors.fecha?.message}
        required
        {...register("fecha")}
      />
      <Input
        label="Hora de inicio"
        type="time"
        error={errors.hora_inicio?.message}
        required
        {...register("hora_inicio")}
      />
      <Input
        label="Hora final"
        type="time"
        required
        error={errors.hora_final?.message}
        {...register("hora_final")}
      />
      <div className="flex gap-2">
        <Button className="flex-1" disabled={loading} type="submit">
          Enviar
        </Button>
        <Button
          type="button"
          className="flex-1"
          btnType="secondary"
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </div>
    </form>
  );
};

export default OcuppationForm;
