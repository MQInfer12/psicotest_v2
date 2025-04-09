import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReprogrammingDTOSchema } from "../../validations/ReprogrammingDTO.schema";
import { ReprogrammingDTO } from "../../api/dtos";
import { toastSuccess } from "@/modules/core/utils/toasts";
import TextArea from "@/modules/core/components/ui/TextArea";
import Input from "@/modules/core/components/ui/Input";
import Button from "@/modules/core/components/ui/Button";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  idCita: number;
  fecha: string;
  idHorario: string;
}

const ReprogrammingForm = ({ fecha, idHorario, idCita }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData, fetchData } = useFetch();
  const patchMutation = postData("PATCH /cita/reprogramacion/:id");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReprogrammingDTO>({
    defaultValues: {
      descripcion: "",
      fecha,
      id_horario: idHorario ? Number(idHorario) : undefined,
    },
    resolver: yupResolver(ReprogrammingDTOSchema),
  });

  const onSubmit = (form: ReprogrammingDTO) => {
    setLoading(true);
    patchMutation(form, {
      params: {
        id: idCita,
      },
      onSuccess: (res) => {
        toastSuccess(res.message);
        navigate({
          to: "/calendar",
        });
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  const selectedDate = watch("fecha");
  const { data } = fetchData("GET /horario/for/reprogramming", {
    params: {
      fecha: selectedDate,
    },
  });

  useEffect(() => {
    //@ts-ignore
    if (data?.length === 0) setValue("id_horario", "");
  }, [fecha]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Fecha"
        type="date"
        {...register("fecha")}
        error={errors.fecha?.message}
        required
      />
      <Input
        label="Horario"
        required
        {...register("id_horario")}
        error={errors.id_horario?.message}
        type="select"
        danger={data?.length === 0}
      >
        {!data && <option value="">Cargando...</option>}
        {data?.length === 0 && (
          <option value="">No tienes horarios disponibles este día</option>
        )}
        {(data?.length ?? 0) > 0 && (
          <option value="">Selecciona un horario</option>
        )}
        {data?.map((horario) => (
          <option key={horario.id} value={horario.id}>
            {horario.hora_inicio.slice(0, 5)} - {horario.hora_final.slice(0, 5)}
          </option>
        ))}
      </Input>
      <TextArea
        label="Motivo de la reprogramación"
        error={errors.descripcion?.message}
        {...register("descripcion")}
        required
      />
      <Button className="flex-1" disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default ReprogrammingForm;
